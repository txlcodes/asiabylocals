import cron from 'node-cron';
import { createHmac } from 'crypto';
import {
  sendPreTourReminderEmail,
} from '../utils/email.js';
import {
  sendLeadRescueAlert,
  sendAbandonedCheckoutAlert,
  sendHeartbeat,
} from '../bookingPush.js';

/**
 * Pre-Tour Reminder — runs every hour
 * Finds bookings where the tour is tomorrow, sends reminder to both
 * guide and customer (only once per booking).
 */
function schedulePreTourReminders(prisma) {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('⏰ [Cron] Checking for pre-tour reminders...');

      // Get tomorrow's date in YYYY-MM-DD format
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const upcomingBookings = await prisma.booking.findMany({
        where: {
          bookingDate: tomorrowStr,
          status: 'confirmed',
          paymentStatus: 'paid',
          preTourReminderSentAt: null,
        },
        include: {
          tour: true,
          tourOption: true,
          supplier: true,
        },
      });

      if (upcomingBookings.length === 0) {
        console.log('   ✅ No pre-tour reminders needed.');
        return;
      }

      console.log(`   Found ${upcomingBookings.length} booking(s) for tomorrow`);

      for (const booking of upcomingBookings) {
        const guide = booking.supplier;
        const tour = booking.tour;
        const option = booking.tourOption;

        const bookingDetails = {
          bookingId: booking.id,
          tourTitle: tour.title,
          optionTitle: option?.optionTitle || tour.title,
          bookingDate: booking.bookingDate,
          numberOfGuests: booking.numberOfGuests,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone || 'Not provided',
          guideName: guide.fullName,
          guideEmail: guide.email,
          guidePhone: guide.phone || 'Not provided',
          guideWhatsapp: guide.whatsapp || guide.phone || null,
          meetingPoint: tour.meetingPoint || 'To be confirmed with your guide',
        };

        try {
          // Send to guide
          await sendPreTourReminderEmail(
            guide.email,
            guide.fullName,
            bookingDetails,
            'guide'
          );

          // Send to customer
          await sendPreTourReminderEmail(
            booking.customerEmail,
            booking.customerName,
            bookingDetails,
            'customer'
          );

          await prisma.booking.update({
            where: { id: booking.id },
            data: { preTourReminderSentAt: new Date() },
          });

          console.log(`   📧 Sent pre-tour reminders for booking #${booking.id}`);
        } catch (emailErr) {
          console.error(`   ❌ Failed to send pre-tour reminder for booking #${booking.id}:`, emailErr.message);
        }
      }
    } catch (err) {
      console.error('❌ [Cron] Pre-tour reminder job failed:', err.message);
    }
  });

  console.log('✅ [Cron] Pre-tour reminder job scheduled (every hour)');
}

/**
 * Payment reconciler — runs every 5 minutes.
 *
 * A booking is only marked paid when the customer's browser calls
 * /api/verify-payment after checkout. If that never happens — tab closed,
 * network dropped, redirect failed — Razorpay has the money and the booking
 * sits on pending_payment with no invoice and no emails. Booking 124 was
 * exactly that: $32 captured, never recorded, found only because someone
 * noticed it by hand.
 *
 * The webhook covers this too, but only once its secret is configured on both
 * sides. This job needs no configuration at all: it asks Razorpay directly
 * whether any recent unpaid booking actually has a captured payment, and hands
 * the ones that do to verify-payment — the same path the browser would have
 * used, so the invoice, the customer/guide/admin emails and the push alert all
 * still happen. Whichever gets there first wins; verify-payment refuses to
 * confirm the same booking twice.
 */
// Bookings we have already nudged about an abandoned checkout, so a customer
// who walks away does not generate a push every five minutes. Failed-payment
// alerts dedupe on the booking's own paymentStatus instead, which survives a
// restart; this only guards the softer "no attempt yet" nudge.

/**
 * An unpaid booking that Razorpay has no captured payment for. Decide whether
 * a human needs to hear about it right now, and say so if they do.
 *
 * Two very different situations hide behind "unpaid":
 *   - cards were tried and declined → the customer wants to buy and is stuck.
 *     Highest-value alert there is; they are still at their laptop.
 *   - no attempt at all → they filled the form and left. Worth a nudge, but
 *     only once, and only after giving them a few minutes to come back.
 */
async function alertOnStuckCustomer(prisma, booking, attempts) {
  const base = {
    reference: `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`,
    tourTitle: booking.tour?.title,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    guests: booking.numberOfGuests,
    amount: booking.totalAmount,
    currency: booking.currency,
    specialRequests: booking.specialRequests,
  };

  const failed = attempts.filter(p => p.status === 'failed');

  if (failed.length > 0) {
    // paymentStatus is the dedupe flag: once it reads 'failed' we have already
    // raised this customer, and marking it is also just true.
    if (booking.paymentStatus === 'failed') return;

    const latest = failed[failed.length - 1];
    console.log(`   🚨 Booking #${booking.id}: ${failed.length} failed payment attempt(s) — alerting`);

    await sendLeadRescueAlert({
      ...base,
      attempts: failed.length,
      reason: latest.error_description || latest.error_reason || 'Card declined',
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'payment_failed', paymentStatus: 'failed', updatedAt: new Date() },
    });
    return;
  }

  // No attempt at all. Give them 15 minutes to finish before calling it
  // abandoned, and alert about it exactly once, ever.
  //
  // The dedupe used to be a process-local Set, which Render empties on every
  // deploy — so on 2026-09-07 the same abandoned checkout alerted again after
  // each of the day's restarts and buried the alerts that mattered. The flag
  // now lives in the database, where a restart cannot forget it.
  //
  // It is also skipped once checkoutRecovery has emailed the guest: the lead is
  // being worked automatically, and an alert asking a human to do it again is
  // noise, not information.
  const ageMinutes = (Date.now() - new Date(booking.createdAt).getTime()) / 60000;
  if (ageMinutes < 15) return;

  const flags = await prisma.booking.findUnique({
    where: { id: booking.id },
    select: { abandonedAlertedAt: true, recoveryNudge1SentAt: true, recoveredAt: true },
  });
  if (!flags || flags.abandonedAlertedAt || flags.recoveryNudge1SentAt || flags.recoveredAt) return;

  await prisma.booking.update({
    where: { id: booking.id },
    data: { abandonedAlertedAt: new Date() },
  });
  console.log(`   🛒 Booking #${booking.id}: form filled, no payment attempted — alerting`);
  await sendAbandonedCheckoutAlert(base);
}

function schedulePaymentReconciler(prisma) {
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  [Cron] Payment reconciler NOT scheduled — Razorpay keys missing');
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const PORT = process.env.PORT || 3001;

  cron.schedule('*/5 * * * *', async () => {
    try {
      // Only look back 24 hours. This exists to catch a payment whose browser
      // callback failed minutes ago, which it does on the next 5-minute pass.
      // A longer window would mean firing a confirmation email at someone who
      // booked days ago and has long since moved on — that reads as a mistake,
      // not a fix. Anything older is a deliberate, manual decision.
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const candidates = await prisma.booking.findMany({
        where: {
          createdAt: { gte: since },
          razorpayOrderId: { not: null },
          razorpayPaymentId: null,
          paymentStatus: { not: 'paid' },
        },
        select: {
          id: true,
          razorpayOrderId: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          totalAmount: true,
          currency: true,
          numberOfGuests: true,
          specialRequests: true,
          paymentStatus: true,
          createdAt: true,
          tour: { select: { title: true } },
        },
      });

      if (candidates.length === 0) return;
      console.log(`⏰ [Cron] Reconciling ${candidates.length} recent unpaid booking(s) against Razorpay...`);

      for (const booking of candidates) {
        try {
          const resp = await fetch(
            `https://api.razorpay.com/v1/orders/${booking.razorpayOrderId}/payments`,
            { headers: { Authorization: authHeader } }
          );
          if (!resp.ok) {
            console.error(`   ❌ Razorpay lookup failed for booking #${booking.id}: ${resp.status}`);
            continue;
          }

          const attempts = (await resp.json())?.items || [];
          const captured = attempts.find(p => p.status === 'captured');

          // Nothing captured. This is where a real customer used to disappear:
          // the sweep saw failed attempts and moved on without a word, so a
          // $340 booking that failed three times went unnoticed for 20 hours.
          // An unpaid booking is not a dead end — it is a lead who is actively
          // trying to give us money and needs a human within minutes.
          if (!captured) {
            await alertOnStuckCustomer(prisma, booking, attempts);
            continue;
          }

          console.log(`   💰 Booking #${booking.id} was paid (${captured.id}) but never recorded — confirming`);

          // Same signature Razorpay hands the browser: HMAC(order|payment).
          const signature = createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(`${booking.razorpayOrderId}|${captured.id}`)
            .digest('hex');

          const verify = await fetch(`http://127.0.0.1:${PORT}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: booking.razorpayOrderId,
              razorpay_payment_id: captured.id,
              razorpay_signature: signature,
              bookingId: booking.id,
            }),
          });

          if (verify.ok) {
            console.log(`   ✅ Recovered booking #${booking.id}`);
          } else {
            console.error(`   ❌ Could not confirm booking #${booking.id}: ${verify.status}`);
          }
        } catch (err) {
          // One bad booking must not stop the rest of the sweep.
          console.error(`   ❌ Reconcile failed for booking #${booking.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('❌ [Cron] Payment reconciler failed:', err.message);
    }
  });

  console.log('✅ [Cron] Payment reconciler scheduled (every 5 minutes)');
}

/**
 * Start all booking-related cron jobs.
 * Call this once from server.js after app.listen().
 */
/**
 * Daily proof that alerting still works.
 *
 * The 2026-08-31 failure was silent: the phone simply stopped receiving, and
 * nothing about a quiet phone looks different from a quiet day of no bookings.
 * One deliberate ping a day makes the difference visible — if it stops
 * arriving, alerting is broken and there is something to go fix.
 */
function scheduleAlertHeartbeat(prisma) {
  // 09:00 UTC ≈ 2:30 PM IST — a time he is awake to notice its absence.
  cron.schedule('0 9 * * *', async () => {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [created, paid] = await Promise.all([
        prisma.booking.count({ where: { createdAt: { gte: since } } }),
        prisma.booking.count({ where: { createdAt: { gte: since }, paymentStatus: 'paid' } }),
      ]);
      await sendHeartbeat(
        `Last 24h: ${created} booking form(s) filled, ${paid} paid.\n` +
        `If this message ever stops arriving, alerts are broken — check the server.`
      );
    } catch (err) {
      console.error('❌ [Cron] Alert heartbeat failed:', err.message);
    }
  });

  console.log('✅ [Cron] Alert heartbeat scheduled (daily 09:00 UTC)');
}

/**
 * Start all booking-related cron jobs.
 * Call this once from server.js after app.listen().
 */
export function startBookingCrons(prisma) {
  console.log('🕐 Starting booking cron jobs...');
  schedulePreTourReminders(prisma);
  schedulePaymentReconciler(prisma);
  scheduleAlertHeartbeat(prisma);
}
