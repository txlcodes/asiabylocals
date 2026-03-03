import cron from 'node-cron';
import {
  sendGuideReminderEmail,
  sendAdminEscalationEmail,
  sendPreTourReminderEmail,
} from '../utils/email.js';

// Reminder intervals in hours
const REMINDER_INTERVALS = [4, 12, 24];
const MAX_REMINDERS = 3;

/**
 * Job 1: Guide Reminder Check — runs every 30 minutes
 * Finds paid bookings where the guide hasn't confirmed yet,
 * sends reminders at 4h, 12h, 24h. Escalates to admin after 3 reminders.
 */
function scheduleGuideReminders(prisma) {
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('⏰ [Cron] Checking for unconfirmed bookings...');

      const unconfirmedBookings = await prisma.booking.findMany({
        where: {
          status: 'confirmed',
          paymentStatus: 'paid',
          guideConfirmedAt: null,
          guideReminderCount: { lt: MAX_REMINDERS },
        },
        include: {
          tour: true,
          tourOption: true,
          supplier: true,
        },
      });

      if (unconfirmedBookings.length === 0) {
        console.log('   ✅ No unconfirmed bookings needing reminders.');
        return;
      }

      console.log(`   Found ${unconfirmedBookings.length} unconfirmed booking(s)`);

      for (const booking of unconfirmedBookings) {
        const now = new Date();
        const confirmedAt = booking.confirmedAt || booking.createdAt;
        const hoursSinceBooking = (now - confirmedAt) / (1000 * 60 * 60);
        const nextReminderHour = REMINDER_INTERVALS[booking.guideReminderCount];

        // Check if enough time has passed for the next reminder
        if (hoursSinceBooking < nextReminderHour) continue;

        // Also check we haven't sent a reminder too recently (minimum 2h gap)
        if (booking.guideLastRemindedAt) {
          const hoursSinceLastReminder = (now - booking.guideLastRemindedAt) / (1000 * 60 * 60);
          if (hoursSinceLastReminder < 2) continue;
        }

        const reminderNumber = booking.guideReminderCount + 1;
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
        };

        try {
          await sendGuideReminderEmail(
            guide.email,
            guide.fullName,
            bookingDetails,
            booking.guideConfirmationToken,
            reminderNumber
          );

          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              guideReminderCount: reminderNumber,
              guideLastRemindedAt: now,
            },
          });

          console.log(`   📧 Sent reminder #${reminderNumber} for booking #${booking.id} to ${guide.email}`);

          // After 3rd reminder, escalate to admin
          if (reminderNumber >= MAX_REMINDERS) {
            await sendAdminEscalationEmail(bookingDetails, guide.email, reminderNumber);
            await prisma.booking.update({
              where: { id: booking.id },
              data: { adminEscalatedAt: now },
            });
            console.log(`   🚨 Escalated booking #${booking.id} to admin`);
          }
        } catch (emailErr) {
          console.error(`   ❌ Failed to send reminder for booking #${booking.id}:`, emailErr.message);
        }
      }
    } catch (err) {
      console.error('❌ [Cron] Guide reminder job failed:', err.message);
    }
  });

  console.log('✅ [Cron] Guide reminder job scheduled (every 30 min)');
}

/**
 * Job 2: Pre-Tour Reminder — runs every hour
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
 * Start all booking-related cron jobs.
 * Call this once from server.js after app.listen().
 */
export function startBookingCrons(prisma) {
  console.log('🕐 Starting booking cron jobs...');
  scheduleGuideReminders(prisma);
  schedulePreTourReminders(prisma);
}
