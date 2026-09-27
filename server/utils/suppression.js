// Do-not-contact list.
//
// On 2026-09-27 a guest cancelled his own checkout, told us so on WhatsApp,
// and then received nudge 2 from this system five and a half hours later
// because nothing connects a WhatsApp reply to the email ladder. He wrote back
// "Please delete me. No further interest." The ladder had no off switch.
//
// This is that switch. It reuses the email_subscriptions table with a
// subscriptionType of 'do_not_contact', so no migration is needed. Every
// automated guest email must check it first.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TYPE = 'do_not_contact';

const norm = (email) => String(email || '').trim().toLowerCase();

/** True when this address has asked us to stop contacting them. */
export async function isSuppressed(email) {
  const e = norm(email);
  if (!e) return false;
  try {
    const hit = await prisma.$queryRawUnsafe(
      `SELECT 1 FROM email_subscriptions WHERE lower(email)=$1 AND "subscriptionType"=$2 LIMIT 1`, e, TYPE);
    return hit.length > 0;
  } catch (err) {
    // A lookup failure must not turn into an unwanted email, so fail closed.
    console.error('suppression lookup failed, treating as suppressed:', err.message);
    return true;
  }
}

/** Filter a list of addresses down to the ones we may still write to. */
export async function removeSuppressed(emails) {
  const list = [...new Set(emails.map(norm).filter(Boolean))];
  if (!list.length) return new Set();
  const rows = await prisma.$queryRawUnsafe(
    `SELECT lower(email) e FROM email_subscriptions
      WHERE "subscriptionType"=$1 AND lower(email) = ANY($2::text[])`, TYPE, list);
  return new Set(rows.map(r => r.e));
}

/** Record a request to stop. Idempotent. `reason` is kept for the audit trail. */
export async function suppress(email, reason = '') {
  const e = norm(email);
  if (!e) return false;
  if (await isSuppressed(e)) return false;
  await prisma.$queryRawUnsafe(
    `INSERT INTO email_subscriptions (email, city, country, "subscriptionType", verified, created_at, updated_at)
     VALUES ($1, $2, '', $3, true, now(), now())`, e, reason.slice(0, 200), TYPE);
  console.log(`🔕 suppressed ${e}${reason ? ` (${reason})` : ''}`);
  return true;
}
