// Auto-send post-tour review request emails.
// Two-email cadence:
//   Email 1 — sent on the day of the tour (first sweep at/after the tour date).
//   Email 2 — reminder sent the next day if the guest still hasn't written a review.
// Runs on a timer; stamps reviewRequestSentAt / reviewReminderSentAt so it never double-sends.
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendReviewRequestEmail } from './utils/email.js';

const prisma = new PrismaClient();
const MAX_AGE_DAYS = 60; // don't email tours older than this

async function ensureToken(b, now) {
  let token = b.reviewToken;
  if (!token) {
    token = randomBytes(32).toString('hex');
    await prisma.booking.update({
      where: { id: b.id },
      data: { reviewToken: token, reviewTokenExpiresAt: new Date(now + 90 * 864e5) },
    });
  }
  return token;
}

export async function sendDueReviewRequests() {
  const now = Date.now();
  const minCutoff = now - MAX_AGE_DAYS * 864e5;

  const candidates = await prisma.booking.findMany({
    where: {
      status: { in: ['confirmed', 'completed'] },
      review: { is: null },
      OR: [{ reviewRequestSentAt: null }, { reviewReminderSentAt: null }],
    },
    include: { tour: { select: { title: true, city: true, country: true } } },
  });

  let sent = 0, reminders = 0, skipped = 0, failed = 0;
  for (const b of candidates) {
    const td = new Date(b.bookingDate).getTime();
    if (isNaN(td) || td < minCutoff) { skipped++; continue; }

    // Email 1: on the day of the tour (or first sweep after it)
    const dueFirst = !b.reviewRequestSentAt && td <= now;
    // Email 2: the day after the tour, only if still no review
    const dueReminder = !dueFirst && !b.reviewReminderSentAt && !!b.reviewRequestSentAt && now >= td + 864e5;

    if (!dueFirst && !dueReminder) { skipped++; continue; }

    try {
      const token = await ensureToken(b, now);
      const reviewUrl = `${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/review/${token}`;
      await sendReviewRequestEmail(b.customerEmail, b.customerName, {
        tourTitle: b.tour.title, tourCity: b.tour.city, tourCountry: b.tour.country,
        bookingDate: b.bookingDate, reviewUrl,
        isReminder: dueReminder,
      });
      if (dueFirst) {
        await prisma.booking.update({ where: { id: b.id }, data: { reviewRequestSentAt: new Date() } });
        sent++;
        console.log(`✅ Review request (day-of) sent: booking ${b.id} -> ${b.customerEmail}`);
      } else {
        await prisma.booking.update({ where: { id: b.id }, data: { reviewReminderSentAt: new Date() } });
        reminders++;
        console.log(`✅ Review reminder sent: booking ${b.id} -> ${b.customerEmail}`);
      }
    } catch (e) {
      failed++;
      console.error(`❌ Review email failed for booking ${b.id}:`, e.message);
    }
  }
  const summary = { candidates: candidates.length, sent, reminders, skipped, failed };
  console.log('📨 Review request sweep:', JSON.stringify(summary));
  return summary;
}

let started = false;
export function startReviewScheduler() {
  if (started) return;
  started = true;
  const THREE_H = 3 * 60 * 60 * 1000;
  setTimeout(() => sendDueReviewRequests().catch((e) => console.error('review sweep error:', e.message)), 30000);
  setInterval(() => sendDueReviewRequests().catch((e) => console.error('review sweep error:', e.message)), THREE_H);
  console.log('🗓️  Review scheduler started (sweep every 3h; email on tour day + reminder next day)');
}
