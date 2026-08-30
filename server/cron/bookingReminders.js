import cron from 'node-cron';
import { createHmac } from 'crypto';
import {
  sendPreTourReminderEmail,
} from '../utils/email.js';

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
      // Only look back a week. Older stragglers are a manual decision, not
      // something a background job should silently start charging people for.
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const candidates = await prisma.booking.findMany({
        where: {
          createdAt: { gte: since },
          razorpayOrderId: { not: null },
          razorpayPaymentId: null,
          paymentStatus: { not: 'paid' },
        },
        select: { id: true, razorpayOrderId: true },
      });

      if (candidates.length === 0) return;
      console.log(`⏰ [Cron] Reconciling ${candidates.length} unpaid booking(s) against Razorpay...`);

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

          const captured = (await resp.json())?.items?.find(p => p.status === 'captured');
          if (!captured) continue; // genuinely unpaid — customer abandoned checkout

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
export function startBookingCrons(prisma) {
  console.log('🕐 Starting booking cron jobs...');
  schedulePreTourReminders(prisma);
  schedulePaymentReconciler(prisma);
}
