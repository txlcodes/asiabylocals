// Repair non-monotonic group-price ladders.
//
// Usage: node scripts/clamp_ladders.mjs <ids.json> [--apply]
//
// <ids.json> is a JSON array of tour ids. There is deliberately no "all" mode.
// On 2026-09-27 an unscoped version of this clamp rewrote 97 ladders, 93 of
// them on tours with no source, which means Talha's own hand-set prices. His
// ladders are often PER PERSON and descending (250, 240, 230 ... for a growing
// group); clamping those to a running maximum destroys them. See the
// never-bulk-write-unscoped memory.
//
// Three guards, all of them refusals rather than warnings:
//   1. a tour with no gyg_activity_id is skipped: the number is not ours
//   2. a mostly-descending ladder is skipped: it is per-person, not a total
//   3. nothing is written without --apply, and every row is snapshotted first
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const [idsPath, flag] = process.argv.slice(2);
if (!idsPath) { console.error('need a JSON file holding an array of tour ids'); process.exit(1); }
const APPLY = flag === '--apply';
const ids = JSON.parse(fs.readFileSync(idsPath, 'utf8')).map(Number).filter(Boolean);
if (!ids.length) { console.error('id list is empty'); process.exit(1); }

const p = new PrismaClient();
const rows = await p.$queryRawUnsafe(`
  SELECT o.id oid, o.option_title, o.group_pricing_tiers g,
         t.id tid, t.slug, t.country, t.gyg_activity_id gyg
  FROM tour_options o JOIN tours t ON t.id = o.tour_id
  WHERE t.id IN (${ids.join(',')}) AND o.group_pricing_tiers IS NOT NULL`);

const snapshot = [], planned = [], skipped = [];
for (const r of rows) {
  let tiers;
  try { tiers = Array.isArray(r.g) ? r.g : JSON.parse(r.g); } catch { continue; }
  if (!Array.isArray(tiers) || tiers.length < 2) continue;

  if (!r.gyg) { skipped.push([r.slug, r.option_title, 'no source, price is Talha\'s own']); continue; }

  const prices = tiers.map(z => Number(z.price));
  let up = 0, down = 0;
  for (let i = 1; i < prices.length; i++) prices[i] > prices[i-1] ? up++ : prices[i] < prices[i-1] ? down++ : 0;
  if (down > up) { skipped.push([r.slug, r.option_title, 'descending, this is a per-person ladder']); continue; }

  let max = -Infinity, changed = false;
  const out = tiers.map(z => {
    const v = Number(z.price);
    if (v < max) { changed = true; return { ...z, price: max }; }
    max = Math.max(max, v); return z;
  });
  if (!changed) continue;
  snapshot.push({ oid: Number(r.oid), slug: r.slug, before: prices });
  planned.push({ oid: Number(r.oid), slug: r.slug, option: r.option_title,
                 before: prices, after: out.map(z => Number(z.price)), out });
}

for (const [slug, opt, why] of skipped) console.log(`skip  ${slug} | ${String(opt).slice(0,34)} | ${why}`);
for (const c of planned) console.log(`clamp ${c.slug} | ${String(c.option).slice(0,34)}\n   before ${c.before.join(' ')}\n   after  ${c.after.join(' ')}`);
console.log(`\n${rows.length} ladders read, ${skipped.length} skipped, ${planned.length} to clamp`);

if (!APPLY) { console.log('dry run. pass --apply to write.'); await p.$disconnect(); process.exit(0); }

const backup = `/tmp/clamp_backup_${Date.now()}.json`;
fs.writeFileSync(backup, JSON.stringify(snapshot, null, 1));
console.log(`originals written to ${backup}`);
for (const c of planned)
  await p.$executeRawUnsafe(`UPDATE tour_options SET group_pricing_tiers=$1::jsonb WHERE id=$2::int`,
                            JSON.stringify(c.out), c.oid);
console.log(`clamped ${planned.length}`);
await p.$disconnect();
