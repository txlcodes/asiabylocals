// Instant push notification when something happens to a booking.
// Uses ntfy.sh (free, no account): install the "ntfy" app on your iPhone and
// subscribe to the topic below, then you get a push the moment someone tries
// to book — with a tap-to-WhatsApp-the-customer button.
//
// Setup: set NTFY_TOPIC in server/.env to a private, hard-to-guess value and
// subscribe to that exact topic in the ntfy iOS app.
//
// 2026-09-01: a $340 Phuket booking failed payment three times and nobody was
// told for 20 hours — the topic had no server-sent message in it at all. A
// single un-awaited fetch with a swallowed error is not a notification system,
// so every alert now goes through deliver(): it retries, it verifies ntfy
// actually accepted the message, and it falls back to email when ntfy is
// unreachable. Losing a lead because one HTTP call failed is not acceptable.
import { Resend } from 'resend';
import { wakeCall, isWakeCallConfigured } from './utils/wakeCall.js';

const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'abl-bookings-405fc07d8bff'; // change me + subscribe in app
// Deliberately not ADMIN_EMAIL: that is info@asiabylocals.com, the shared
// company inbox this very alert is sent *from*. An alert nobody opens is the
// same as no alert, so it goes to a personal inbox that gets read.
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'mb9400900@gmail.com';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * POST to ntfy, retrying on failure. Returns the ntfy message id on success,
 * or null if every attempt failed.
 *
 * ntfy answers with the stored message as JSON, so a returned id is proof the
 * message is really on the topic — not just that a socket opened.
 */
async function postToNtfy(payload, attempts = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      // Without a timeout a hung connection silently eats the whole alert.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(NTFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const body = await res.json().catch(() => null);
        return body?.id || 'sent';
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err.name === 'AbortError' ? 'timed out after 8s' : err.message;
    }

    if (attempt < attempts) await sleep(500 * 2 ** (attempt - 1)); // 0.5s, 1s
  }

  console.error(`❌ ntfy failed after ${attempts} attempts: ${lastError}`);
  return null;
}

/**
 * Email the alert instead. Only used when ntfy is unreachable — the whole
 * point is that a dead push provider must not mean a silent lost booking.
 */
async function emailFallback(payload, reason) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !ADMIN_ALERT_EMAIL) {
    console.error('❌ ntfy failed and no email fallback is configured — ALERT LOST');
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const body = String(payload.message || '').replace(/\n/g, '<br>');
    await resend.emails.send({
      from: 'AsiaByLocals Alerts <info@asiabylocals.com>',
      to: ADMIN_ALERT_EMAIL,
      subject: payload.title,
      html:
        `<p><strong>${payload.title}</strong></p><p>${body}</p>` +
        (payload.click ? `<p><a href="${payload.click}">Contact the customer</a></p>` : '') +
        `<p style="color:#888;font-size:12px">${reason}</p>`,
    });
    console.log(`📧 Alert emailed to ${ADMIN_ALERT_EMAIL} — ${reason}`);
    return true;
  } catch (err) {
    console.error('❌ Email fallback also failed — ALERT LOST:', err.message);
    return false;
  }
}

/**
 * Send an alert through every channel needed to actually reach a human.
 * Never throws: an alert failing must not take down the request that caused it.
 *
 * `critical` alerts go out over ntfy *and* email at the same time rather than
 * treating email as a fallback. A missed booking costs real money, and the one
 * failure mode we cannot detect is a push that is accepted and never shown —
 * so the money-carrying alerts always travel two independent paths.
 */
async function deliver(payload, { critical = false, wake = null } = {}) {
  if (!NTFY_TOPIC) return false;
  try {
    const [id, emailed] = await Promise.all([
      postToNtfy(payload),
      critical ? emailFallback(payload, 'Second delivery channel for a booking alert.') : Promise.resolve(false),
    ]);

    // A push obeys silent mode and Focus; a ringing phone does not. On
    // 2026-09-07 a payment failed at 02:55 and was seen hours later, which is
    // why money-critical alerts also ring the owner's phone. No-op unless a
    // call provider is configured.
    if (wake && isWakeCallConfigured()) {
      wakeCall(wake).catch((e) => console.error('wake call failed:', e.message));
    }

    if (id) {
      console.log(`🔔 Alert delivered (topic: ${NTFY_TOPIC}, id: ${id}): ${payload.title}`);
      return true;
    }
    if (emailed) return true; // ntfy died but the email already went out

    return await emailFallback(payload, 'Sent by email because the phone push could not be delivered.');
  } catch (err) {
    console.error('Alert delivery failed:', err.message);
    return false;
  }
}

/** Build the shared "who is this and how do I reach them" alert body. */
function contactPayload({ title, tags, b, extraLines = [], actionLabel }) {
  const wa = toWhatsAppNumber(b.customerPhone);
  const lines = [
    `${b.customerName} · ${b.guests ?? '?'} guest(s) · ${b.currency || 'USD'} ${b.amount}`,
    `📞 ${b.customerPhone || 'no phone'}${b.customerEmail ? ` · ${b.customerEmail}` : ''}`,
    ...extraLines,
  ];
  if (b.specialRequests) lines.push(`📝 ${b.specialRequests}`);
  if (b.reference) lines.push(`Ref ${b.reference}`);

  const payload = {
    topic: NTFY_TOPIC,
    title: `${title} — ${b.tourTitle || 'Tour'}`,
    message: lines.join('\n'),
    priority: 5, // max — makes it pop on iPhone
    tags,
  };

  if (wa) {
    payload.click = `https://wa.me/${wa}`; // tap the notification = WhatsApp the customer
    payload.actions = [
      {
        action: 'view',
        label: `${actionLabel} ${b.customerName?.split(' ')[0] || 'customer'}`,
        url: `https://wa.me/${wa}`,
      },
    ];
  }
  return payload;
}

/**
 * Turn a stored phone number into something wa.me will actually open.
 *
 * A US customer's number arrives as a bare 10-digit "2029060642"; wa.me needs
 * the country code or it resolves to nothing, which is how a $340 lead ended up
 * with a WhatsApp button that opened an empty chat.
 */
export function toWhatsAppNumber(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d]/g, '');
  if (!digits) return null;
  // A bare 10-digit number with no country code is a US/Canada number.
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

// 🆕 New booking created — customer has reached checkout but not paid yet.
export async function sendBookingAlert(b) {
  return deliver(contactPayload({
    title: '🆕 New booking (pending)',
    tags: ['bell', 'moneybag'],
    b,
    actionLabel: '💬 WhatsApp',
  }), { critical: true });
}

// ✅ Payment received — money actually landed for a booking.
export async function sendPaymentAlert(b) {
  return deliver(contactPayload({
    title: '✅ PAYMENT RECEIVED',
    tags: ['white_check_mark', 'moneybag'],
    b,
    actionLabel: '💬 Message',
  }), { critical: true });
}

// ❌ Payment failed — customer tried to pay and it didn't go through.
// Fires so a stuck customer can be rescued in minutes instead of discovered
// days later in the Razorpay dashboard (2026-08-28: a US customer failed 8
// times over 2 days with nobody notified).
export async function sendPaymentFailedAlert(b) {
  return deliver(contactPayload({
    title: '❌ PAYMENT FAILED',
    tags: ['x', 'credit_card'],
    b,
    extraLines: b.reason ? [`⚠️ ${b.reason}`] : [],
    actionLabel: '💬 Rescue',
  }), {
    critical: true,
    wake: { bookingId: b.reference || b.id || '?', reason: 'A payment just failed',
            amount: b.amount, currency: b.currency, tourTitle: b.tourTitle },
  });
}

/**
 * 🚨 A customer is trying to pay and their card keeps being declined.
 *
 * Raised by the cron sweep from Razorpay's own record of attempts, so it fires
 * whether or not the customer's browser ever told us anything. This is the
 * alert that would have caught the 2026-08-31 Phuket booking in five minutes
 * instead of twenty hours.
 */
export async function sendLeadRescueAlert(b) {
  return deliver(contactPayload({
    title: `🚨 CUSTOMER STUCK (${b.attempts} failed ${b.attempts === 1 ? 'attempt' : 'attempts'})`,
    tags: ['rotating_light', 'credit_card'],
    b,
    extraLines: [b.reason ? `⚠️ ${b.reason}` : null, '👉 Contact them NOW — they want to buy'].filter(Boolean),
    actionLabel: '💬 Rescue',
  }), {
    critical: true,
    wake: { bookingId: b.reference || b.id || '?', reason: 'A customer is stuck trying to pay',
            amount: b.amount, currency: b.currency, tourTitle: b.tourTitle },
  });
}

/**
 * 🛒 Checkout abandoned before any card was entered — still a warm lead.
 */
export async function sendAbandonedCheckoutAlert(b) {
  return deliver(contactPayload({
    title: '🛒 Checkout abandoned',
    tags: ['shopping_cart'],
    b,
    extraLines: ['No payment attempt was made — worth a friendly nudge'],
    actionLabel: '💬 Follow up with',
  }));
}

/**
 * 📝 Someone is filling in the booking form — before any payment exists.
 *
 * The earliest signal we get that a real person wants a real tour. Fires even
 * if they never submit, never pay, or fail at the card step, because by then
 * we already have their number and can just talk to them.
 */
export async function sendInquiryAlert(b) {
  return deliver(contactPayload({
    title: '📝 Booking form being filled',
    tags: ['pencil', 'eyes'],
    b,
    extraLines: [b.bookingDate ? `📅 ${b.bookingDate}` : null, 'Not paid yet — reach out while they are still on the site'].filter(Boolean),
    actionLabel: '💬 WhatsApp',
  }));
}

/**
 * Daily proof-of-life. If this stops arriving, alerting is broken — which is
 * the failure mode that let a lead sit unnoticed for a day.
 */
export async function sendHeartbeat(summary) {
  return deliver({
    topic: NTFY_TOPIC,
    title: '💚 AsiaByLocals alerts are healthy',
    message: summary || 'Daily check: booking alerts are working.',
    priority: 1, // quiet — informational only
    tags: ['green_heart'],
  });
}

/** Log the alerting config at boot so a misconfigured topic is obvious. */
export function logAlertConfig() {
  console.log(`🔔 Booking alerts → ntfy topic "${NTFY_TOPIC}" at ${NTFY_URL}`);
  console.log(`   Email fallback: ${process.env.RESEND_API_KEY ? ADMIN_ALERT_EMAIL : '❌ NOT CONFIGURED'}`);
}
