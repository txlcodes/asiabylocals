// Ring the owner's phone when money is on the line.
//
// The ntfy alerts already go out at priority 5 with an email fallback, and on
// 2026-09-07 that still was not enough: a payment failed at 02:55 and a guest
// abandoned at 23:39, and both were seen hours later. A push notification obeys
// silent mode and Focus. A ringing phone does not.
//
// Two providers, whichever is configured:
//
//   voice  — a normal phone call (Twilio). Works today, everywhere, ~1 rupee a
//            call. Save the caller number as a contact on the iPhone with
//            Emergency Bypass switched on and it rings through silent and Focus.
//
//   whatsapp_call — Meta's WhatsApp Business Calling API. Newer, region-limited,
//            and tied to the same WhatsApp Business account as the templates.
//            Left here ready, but it must be proven with one real call before
//            anyone relies on it; do not assume it is available.
//
//   callmebot — free, no account. Note what this actually does: it sends a
//            WhatsApp *message* to your own number, not a call. That is barely
//            louder than the ntfy push already being sent, so it does not solve
//            the asleep-at-03:00 problem on its own — only a real ring does.
//            It also reaches WhatsApp through a route Meta does not sanction and
//            can stop working without warning, so its response body is checked
//            for explicit success rather than trusting a 200.
//
// Neither is required for the system to run. With nothing configured this is a
// no-op and the existing ntfy + email alerts are unchanged.

const CALL_LOG = new Map(); // bookingId -> last call timestamp

function provider() {
  if (process.env.WAKE_CALL_PROVIDER) return process.env.WAKE_CALL_PROVIDER;
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) return 'voice';
  if (process.env.WHATSAPP_CALLING_ENABLED === 'true') return 'whatsapp_call';
  if (process.env.CALLMEBOT_APIKEY) return 'callmebot';
  return null;
}

/** Say out loud at boot whether the phone will actually ring. */
export function describeWakeCall() {
  const p = provider();
  const to = (process.env.OWNER_PHONE || '').trim();
  if (!p) return 'no provider configured — the phone will NOT ring';
  if (!to) return `provider ${p} set but OWNER_PHONE is missing — the phone will NOT ring`;
  const min = Number(process.env.WAKE_CALL_MIN_AMOUNT || 0);
  return `${p} -> ${to.slice(0, 4)}…${to.slice(-3)}${min ? ` (only above ${min})` : ' (every booking)'}`;
}

export function isWakeCallConfigured() {
  return Boolean(provider() && (process.env.OWNER_PHONE || '').trim());
}

/** Twilio Programmable Voice: read a short message aloud, twice. */
async function placeVoiceCall(to, spoken) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return { ok: false, reason: 'twilio_not_configured' };

  const twiml = `<Response><Pause length="1"/><Say voice="alice">${spoken}</Say><Pause length="1"/><Say voice="alice">${spoken}</Say></Response>`;
  const body = new URLSearchParams({ To: to, From: from, Twiml: twiml });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, reason: `twilio_http_${res.status}`, detail: data?.message };
  return { ok: true, id: data.sid };
}

/** WhatsApp Business Calling API — unverified on this account until tested. */
async function placeWhatsAppCall(to) {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!id || !token) return { ok: false, reason: 'whatsapp_not_configured' };

  const res = await fetch(`https://graph.facebook.com/v21.0/${id}/calls`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: to.replace(/\D/g, ''), action: 'connect' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, reason: `whatsapp_http_${res.status}`, detail: data?.error?.message };
  return { ok: true, id: data?.calls?.[0]?.id || null };
}

/**
 * CallMeBot: free WhatsApp *message* to your own number — not a voice call.
 *
 * Their endpoint answers 200 with an HTML page even for some failures, so a
 * 200 alone proves nothing. The body is checked for their success wording and
 * anything else is reported as a failure — an alert channel that cannot tell
 * you it failed is the same as no alert channel.
 */
async function placeCallMeBot(to, spoken) {
  const key = process.env.CALLMEBOT_APIKEY;
  if (!key) return { ok: false, reason: 'callmebot_not_configured' };

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(to)}` +
    `&text=${encodeURIComponent(spoken)}&apikey=${encodeURIComponent(key)}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const body = (await res.text().catch(() => '')).toLowerCase();
    if (!res.ok) return { ok: false, reason: `callmebot_http_${res.status}` };
    if (!/message queued|message sent|success/.test(body)) {
      return { ok: false, reason: 'callmebot_unconfirmed', detail: body.slice(0, 120) };
    }
    return { ok: true, id: 'callmebot' };
  } catch (e) {
    return { ok: false, reason: 'callmebot_network', detail: e.message };
  }
}

/**
 * Call the owner about one booking. Never throws, never calls twice for the
 * same booking within the cooldown, and does nothing at all when unconfigured.
 */
export async function wakeCall({ bookingId, reason, amount, currency = 'USD', tourTitle }) {
  const p = provider();
  const to = (process.env.OWNER_PHONE || '').trim();
  if (!p || !to) return { ok: false, reason: 'not_configured' };

  const cooldownMs = Number(process.env.WAKE_CALL_COOLDOWN_MS || 30 * 60 * 1000);
  const last = CALL_LOG.get(String(bookingId));
  if (last && Date.now() - last < cooldownMs) return { ok: false, reason: 'cooldown' };
  CALL_LOG.set(String(bookingId), Date.now());

  const spoken =
    `Asia by Locals alert. ${reason}. ${currency} ${amount} for ${tourTitle || 'a tour'}. ` +
    `Booking reference ${String(bookingId).split('').join(' ')}. Check your phone.`;

  try {
    const r =
      p === 'whatsapp_call' ? await placeWhatsAppCall(to)
      : p === 'callmebot' ? await placeCallMeBot(to, spoken)
      : await placeVoiceCall(to, spoken);
    console.log(
      r.ok
        ? `📞 Wake call placed (${p}) for booking ${bookingId} — ${r.id}`
        : `⚠️  Wake call not placed (${p}) for booking ${bookingId}: ${r.reason}${r.detail ? ' — ' + r.detail : ''}`
    );
    return r;
  } catch (e) {
    console.error(`❌ Wake call error for booking ${bookingId}: ${e.message}`);
    return { ok: false, reason: 'error', detail: e.message };
  }
}
