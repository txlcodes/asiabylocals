import cron from 'node-cron';
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
 * Start all booking-related cron jobs.
 * Call this once from server.js after app.listen().
 */
export function startBookingCrons(prisma) {
  console.log('🕐 Starting booking cron jobs...');
  schedulePreTourReminders(prisma);
}
