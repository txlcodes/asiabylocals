// WhatsApp sending via Meta's WhatsApp Cloud API.
//
// Why the official API and not whatsapp-web.js / Baileys: those drive a real
// WhatsApp Web session, which is against WhatsApp's terms, and the number that
// does it gets banned. Losing the business number would cost far more than any
// single recovered checkout.
//
// This module is deliberately a no-op until the credentials exist, so the
// recovery sweeper can ship and run on email today and start sending WhatsApp
// the moment the Cloud API is configured — no code change, no redeploy logic.
//
// To turn it on:
//   1. Meta Business account -> WhatsApp -> add a phone number that is NOT
//      already signed in to the normal WhatsApp app.
//   2. Create a message template (category: UTILITY) and wait for approval.
//      Business-initiated messages outside the 24h service window MUST use an
//      approved template — free-form text is rejected.
//   3. Set in .env:
//        WHATSAPP_PHONE_NUMBER_ID=...
//        WHATSAPP_ACCESS_TOKEN=...
//        WHATSAPP_TEMPLATE_CHECKOUT=abandoned_checkout_v1
//        WHATSAPP_TEMPLATE_LANG=en
const GRAPH = 'https://graph.facebook.com/v21.0';

export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);
}

/**
 * Normalise a phone number to E.164 digits, or return null when we cannot be
 * sure. Guessing a country code is worse than not sending: a wrong guess
 * messages a stranger. Booking #129 arrived as "8188418719" with no country
 * code at all, which is exactly the case this refuses to handle.
 */
export function toE164(raw, hintCountryCode) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;

  if (hasPlus) return digits.length >= 8 && digits.length <= 15 ? digits : null;
  // A bare number starting with a known country code is safe enough to accept.
  if (digits.length >= 11 && /^(1|7|20|27|30|31|33|34|36|39|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9]|2[0-9]{2}|3[0-9]{2})/.test(digits)) {
    return digits;
  }
  if (hintCountryCode) {
    const cc = String(hintCountryCode).replace(/\D/g, '');
    if (cc && digits.length >= 7) return cc + digits.replace(/^0+/, '');
  }
  return null;
}

/**
 * Send an approved template message. Returns { ok, id } or { ok:false, reason }.
 * Never throws — a failed WhatsApp must not stop the email in the same sweep.
 */
export async function sendWhatsAppTemplate(toE164Digits, templateName, bodyParams = []) {
  if (!isWhatsAppConfigured()) return { ok: false, reason: 'not_configured' };
  if (!toE164Digits) return { ok: false, reason: 'no_valid_number' };

  const url = `${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: toE164Digits,
    type: 'template',
    template: {
      name: templateName,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
      components: bodyParams.length
        ? [{ type: 'body', parameters: bodyParams.map((t) => ({ type: 'text', text: String(t) })) }]
        : undefined,
    },
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, reason: `http_${res.status}`, detail: data?.error?.message };
    }
    return { ok: true, id: data?.messages?.[0]?.id || null };
  } catch (e) {
    return { ok: false, reason: 'network', detail: e.message };
  }
}
