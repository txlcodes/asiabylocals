// Abandoned / failed checkout recovery.
//
// Until now an abandoned checkout produced an ntfy alert to the admin and
// nothing at all to the guest, so recovery depended on someone being awake and
// tapping a WhatsApp button. On 2026-09-07 a guest tried to pay $108 three
// minutes apart at 02:55, failed, and was never contacted. That is the gap
// this closes.
//
// The ladder, per booking, each step stamped so it can never fire twice:
//   T+25m  unpaid -> nudge 1  (email, plus WhatsApp when the Cloud API is on)
//   T+6h   unpaid -> nudge 2  (last automated attempt)
//   T+24h  unpaid -> escalate to the admin for a personal message
// Any booking that becomes paid drops out of the ladder immediately.
import { PrismaClient } from '@prisma/client';
import { sendCheckoutRecoveryEmail } from './utils/email.js';
import { isWhatsAppConfigured, toE164, sendWhatsAppTemplate } from './utils/whatsapp.js';
import { sendLeadRescueAlert } from './bookingPush.js';

const prisma = new PrismaClient();

// A broken payment and a closed tab are not the same lead.
//
// paymentStatus 'failed' means the guest tried to pay and something went wrong
// on our side of the counter — highest possible intent, and our fault to fix,
// so we reach them almost immediately.
//
// 'pending' means they closed the checkout without attempting payment. A few
// of those are people switching cards who are about to finish, so a nudge at
// five minutes would land while they are still typing. Half an hour is enough
// to be sure they left, and short enough to arrive before they shop elsewhere:
// on 2026-09-07 a guest abandoned at 23:39, was contacted ten hours later, and
// replied that she had already booked direct with the operator.
const NUDGE_1_FAILED_MS = 10 * 60 * 1000;
const NUDGE_1_PENDING_MS = 30 * 60 * 1000;
// A first nudge only makes sense while the intent is still warm. A guest who
// abandoned six days ago has moved on, and an email then reads as a mistake
// rather than a save — the same reasoning the payment reconciler uses for its
// 24-hour window. Anything past this is left for a deliberate human decision.
const NUDGE_1_BEFORE_MS = 48 * 60 * 60 * 1000;
const NUDGE_2_AFTER_MS = 6 * 60 * 60 * 1000;
const ESCALATE_AFTER_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // never chase a week-old checkout

function siteBase() {
  // FRONTEND_URL on Render points at this backend's own onrender.com host,
  // which serves the legacy SPA — guest-facing links must go to the Next site.
  const v = process.env.FRONTEND_URL || '';
  return !v || v.includes('onrender.com') ? 'https://www.asiabylocals.com' : v.replace(/\/$/, '');
}

function resumeUrl(b) {
  const country = (b.tour?.country || 'japan').toLowerCase().replace(/\s+/g, '-');
  const city = (b.tour?.city || '').toLowerCase().replace(/\s+/g, '-');
  return `${siteBase()}/${country}/${city}/${b.tour?.slug}`;
}

const ref = (id) => `ABL-${String(id).padStart(6, '0')}-${new Date().getFullYear()}`;

export async function runCheckoutRecovery() {
  const now = Date.now();
  const since = new Date(now - MAX_AGE_MS);

  const candidates = await prisma.booking.findMany({
    where: {
      createdAt: { gte: since },
      paymentStatus: { notIn: ['paid', 'refunded'] },
      status: { notIn: ['confirmed', 'completed', 'cancelled'] },
      recoveredAt: null,
    },
    include: { tour: { select: { title: true, slug: true, city: true, country: true } } },
  });

  // One guest retrying a card produces a row per attempt: Justin Mehdizadeh had
  // four rows for the same Phuket tour within half an hour. Nudging each row
  // would send four identical emails, so only the newest attempt per
  // (email + tour) is ever contacted.
  const newestPerGuest = new Map();
  for (const b of candidates) {
    const key = `${(b.customerEmail || '').toLowerCase()}|${b.tourId}`;
    const prev = newestPerGuest.get(key);
    if (!prev || new Date(b.createdAt) > new Date(prev.createdAt)) newestPerGuest.set(key, b);
  }
  const duplicates = candidates.length - newestPerGuest.size;

  let nudge1 = 0, nudge2 = 0, escalated = 0, whatsapp = 0, failed = 0, skipped = 0, tooOld = 0;

  for (const b of newestPerGuest.values()) {
    const age = now - new Date(b.createdAt).getTime();
    const nudge1After = b.paymentStatus === 'failed' ? NUDGE_1_FAILED_MS : NUDGE_1_PENDING_MS;
    const details = {
      tourTitle: b.tour?.title || 'your tour',
      tourCity: b.tour?.city || '',
      bookingDate: b.bookingDate,
      numberOfGuests: b.numberOfGuests,
      bookingRef: ref(b.id),
      resumeUrl: resumeUrl(b),
    };

    try {
      // Never open the ladder on a checkout that has already gone cold.
      if (!b.recoveryNudge1SentAt && age > NUDGE_1_BEFORE_MS) {
        await prisma.booking.update({ where: { id: b.id }, data: { recoveredAt: new Date() } });
        tooOld++;
        continue;
      }

      // Step 1 — first nudge
      if (!b.recoveryNudge1SentAt && age >= nudge1After) {
        await sendCheckoutRecoveryEmail(b.customerEmail, b.customerName, { ...details, isSecondNudge: false });
        await prisma.booking.update({ where: { id: b.id }, data: { recoveryNudge1SentAt: new Date() } });
        nudge1++;
        console.log(`✅ Recovery nudge 1 -> booking ${b.id} (${b.customerEmail})`);

        if (isWhatsAppConfigured() && process.env.WHATSAPP_TEMPLATE_CHECKOUT) {
          const num = toE164(b.customerPhone);
          const r = await sendWhatsAppTemplate(num, process.env.WHATSAPP_TEMPLATE_CHECKOUT, [
            (b.customerName || '').split(' ')[0] || 'there',
            details.tourTitle,
            details.bookingDate,
            details.resumeUrl,
          ]);
          if (r.ok) {
            await prisma.booking.update({ where: { id: b.id }, data: { recoveryWhatsappSentAt: new Date() } });
            whatsapp++;
            console.log(`   📲 WhatsApp sent for booking ${b.id}`);
          } else {
            console.log(`   ⚠️  WhatsApp skipped for booking ${b.id}: ${r.reason}${r.detail ? ' — ' + r.detail : ''}`);
          }
        }
        continue;
      }

      // Step 2 — second and final automated nudge
      if (b.recoveryNudge1SentAt && !b.recoveryNudge2SentAt && age >= NUDGE_2_AFTER_MS) {
        await sendCheckoutRecoveryEmail(b.customerEmail, b.customerName, { ...details, isSecondNudge: true });
        await prisma.booking.update({ where: { id: b.id }, data: { recoveryNudge2SentAt: new Date() } });
        nudge2++;
        console.log(`✅ Recovery nudge 2 -> booking ${b.id} (${b.customerEmail})`);
        continue;
      }

      // Step 3 — hand it to a human
      if (b.recoveryNudge2SentAt && !b.recoveryEscalatedAt && age >= ESCALATE_AFTER_MS) {
        await sendLeadRescueAlert({
          id: b.id,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          totalAmount: b.totalAmount,
          currency: b.currency,
          numberOfGuests: b.numberOfGuests,
          tour: { title: b.tour?.title },
        });
        await prisma.booking.update({ where: { id: b.id }, data: { recoveryEscalatedAt: new Date() } });
        escalated++;
        console.log(`🔔 Recovery escalated to admin -> booking ${b.id}`);
        continue;
      }

      skipped++;
    } catch (e) {
      failed++;
      console.error(`❌ Recovery step failed for booking ${b.id}: ${e.message}`);
    }
  }

  const summary = { candidates: candidates.length, duplicates, nudge1, nudge2, whatsapp, escalated, tooOld, skipped, failed };
  console.log('💸 Checkout recovery sweep:', JSON.stringify(summary));
  return summary;
}

/**
 * Contact a guest the moment their checkout fails, without waiting for a sweep.
 *
 * The sweeper is the safety net; this is the save. On 2026-09-07 a guest
 * abandoned at 23:39 and was contacted ten hours later — she replied that she
 * had already booked direct with the operator. A lead that cold is gone.
 *
 * The short delay is deliberate: a guest who closes the modal to switch cards
 * and pays thirty seconds later must not receive an email telling them their
 * payment did not complete. Payment status is re-read after the wait, so a
 * booking that succeeded in the meantime is silently dropped.
 */
const INSTANT_DELAY_MS = 90 * 1000;

export function sendInstantRecovery(bookingId, { delayMs = INSTANT_DELAY_MS } = {}) {
  setTimeout(async () => {
    try {
      const b = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: { tour: { select: { title: true, slug: true, city: true, country: true } } },
      });
      if (!b) return;
      if (b.recoveryNudge1SentAt) return;                       // sweeper got there first
      if (b.recoveredAt) return;                                 // already paid
      if (['paid', 'refunded'].includes(b.paymentStatus)) return;
      if (['confirmed', 'completed', 'cancelled'].includes(b.status)) return;

      const details = {
        tourTitle: b.tour?.title || 'your tour',
        tourCity: b.tour?.city || '',
        bookingDate: b.bookingDate,
        numberOfGuests: b.numberOfGuests,
        bookingRef: ref(b.id),
        resumeUrl: resumeUrl(b),
        isSecondNudge: false,
      };

      await sendCheckoutRecoveryEmail(b.customerEmail, b.customerName, details);
      await prisma.booking.update({ where: { id: b.id }, data: { recoveryNudge1SentAt: new Date() } });
      console.log(`⚡ Instant recovery email -> booking ${b.id} (${b.customerEmail})`);

      if (isWhatsAppConfigured() && process.env.WHATSAPP_TEMPLATE_CHECKOUT) {
        const num = toE164(b.customerPhone);
        const r = await sendWhatsAppTemplate(num, process.env.WHATSAPP_TEMPLATE_CHECKOUT, [
          (b.customerName || '').split(' ')[0] || 'there',
          details.tourTitle, details.bookingDate, details.resumeUrl,
        ]);
        if (r.ok) {
          await prisma.booking.update({ where: { id: b.id }, data: { recoveryWhatsappSentAt: new Date() } });
          console.log(`   📲 Instant WhatsApp sent for booking ${b.id}`);
        } else {
          console.log(`   ⚠️  Instant WhatsApp skipped for booking ${b.id}: ${r.reason}`);
        }
      }
    } catch (e) {
      // The sweeper will retry this booking in five minutes.
      console.error(`❌ Instant recovery failed for booking ${bookingId}: ${e.message}`);
    }
  }, delayMs).unref?.();
}

/** Mark a booking as recovered so the ladder stops. Call this when payment succeeds. */
export async function markRecovered(bookingId) {
  try {
    await prisma.booking.update({ where: { id: bookingId }, data: { recoveredAt: new Date() } });
  } catch { /* a booking that vanished is not worth failing a payment over */ }
}

let started = false;
export function startCheckoutRecovery() {
  if (started) return;
  started = true;
  // Every five minutes, so a failed payment is contacted inside a quarter of
  // an hour rather than waiting out a longer sweep interval.
  const EVERY = 5 * 60 * 1000;
  const run = () => runCheckoutRecovery().catch((e) => console.error('recovery sweep error:', e.message));
  setTimeout(run, 60 * 1000);
  setInterval(run, EVERY);
  console.log(
    `💸 Checkout recovery started (sweep every 5m; nudge at 10m if payment failed / 30m if abandoned, again at 6h, escalate at 24h; WhatsApp ${isWhatsAppConfigured() ? 'ON' : 'off — email only'})`
  );
}
