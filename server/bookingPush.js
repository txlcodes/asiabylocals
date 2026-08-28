// Instant push notification when a booking is created (pending payment).
// Uses ntfy.sh (free, no account): install the "ntfy" app on your iPhone and
// subscribe to the topic below, then you get a push the moment someone tries
// to book — with a tap-to-WhatsApp-the-customer button.
//
// Setup: set NTFY_TOPIC in server/.env to a private, hard-to-guess value and
// subscribe to that exact topic in the ntfy iOS app.
const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'abl-bookings-405fc07d8bff'; // change me + subscribe in app

export async function sendBookingAlert(b) {
  if (!NTFY_TOPIC) return;
  try {
    const wa = (b.customerPhone || '').replace(/[^\d+]/g, '');
    const lines = [
      `${b.customerName} · ${b.guests} guest(s) · ${b.currency || 'USD'} ${b.amount}`,
      `📞 ${b.customerPhone || 'no phone'}${b.customerEmail ? ` · ${b.customerEmail}` : ''}`,
    ];
    if (b.specialRequests) lines.push(`📝 ${b.specialRequests}`);
    lines.push(`Ref ${b.reference}`);

    const payload = {
      topic: NTFY_TOPIC,
      title: `🆕 New booking (pending) — ${b.tourTitle || 'Tour'}`,
      message: lines.join('\n'),
      priority: 5, // max — makes it pop on iPhone
      tags: ['bell', 'moneybag'],
    };
    if (wa) {
      payload.click = `https://wa.me/${wa}`; // tap the notification = WhatsApp the customer
      payload.actions = [
        { action: 'view', label: `💬 WhatsApp ${b.customerName?.split(' ')[0] || 'customer'}`, url: `https://wa.me/${wa}` },
      ];
    }
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`🔔 Booking push sent (topic: ${NTFY_TOPIC})`);
  } catch (e) {
    console.error('Booking push failed (non-fatal):', e.message);
  }
}

// ✅ Payment received — money actually landed for a booking.
export async function sendPaymentAlert(b) {
  if (!NTFY_TOPIC) return;
  try {
    const wa = (b.customerPhone || '').replace(/[^\d+]/g, '');
    const lines = [
      `${b.customerName} · ${b.guests} guest(s) · ${b.currency || 'USD'} ${b.amount}`,
      `📞 ${b.customerPhone || 'no phone'}${b.customerEmail ? ` · ${b.customerEmail}` : ''}`,
      `Ref ${b.reference}`,
    ];

    const payload = {
      topic: NTFY_TOPIC,
      title: `✅ PAYMENT RECEIVED — ${b.tourTitle || 'Tour'}`,
      message: lines.join('\n'),
      priority: 5, // max — makes it pop on the phone
      tags: ['white_check_mark', 'moneybag'],
    };
    if (wa) {
      payload.click = `https://wa.me/${wa}`;
      payload.actions = [
        { action: 'view', label: `💬 Message ${b.customerName?.split(' ')[0] || 'customer'}`, url: `https://wa.me/${wa}` },
      ];
    }
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`🔔 Payment push sent (topic: ${NTFY_TOPIC})`);
  } catch (e) {
    console.error('Payment push failed (non-fatal):', e.message);
  }
}

// ❌ Payment failed — customer tried to pay and it didn't go through.
// Fires so a stuck customer can be rescued in minutes instead of discovered
// days later in the Razorpay dashboard (2026-08-28: a US customer failed 8
// times over 2 days with nobody notified).
export async function sendPaymentFailedAlert(b) {
  if (!NTFY_TOPIC) return;
  try {
    const wa = (b.customerPhone || '').replace(/[^\d+]/g, '');
    const lines = [
      `${b.customerName || 'Unknown'} · ${b.currency || 'USD'} ${b.amount ?? '?'}`,
      `📞 ${b.customerPhone || 'no phone'}${b.customerEmail ? ` · ${b.customerEmail}` : ''}`,
      b.reason ? `⚠️ ${b.reason}` : null,
      b.reference ? `Ref ${b.reference}` : null,
    ].filter(Boolean);

    const payload = {
      topic: NTFY_TOPIC,
      title: `❌ PAYMENT FAILED — ${b.tourTitle || 'Tour'}`,
      message: lines.join('\n'),
      priority: 5,
      tags: ['x', 'credit_card'],
    };
    if (wa) {
      payload.click = `https://wa.me/${wa}`;
      payload.actions = [
        { action: 'view', label: `💬 Rescue ${b.customerName?.split(' ')[0] || 'customer'}`, url: `https://wa.me/${wa}` },
      ];
    }
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`🔔 Payment-failed push sent (topic: ${NTFY_TOPIC})`);
  } catch (e) {
    console.error('Payment-failed push failed (non-fatal):', e.message);
  }
}
