// Apply densified fullDescription (and optionally highlights) from a JSON file.
// Content-only: never touches options, prices or status.
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
const p = new PrismaClient();
const file = process.argv[2];
const dry = process.argv.includes('--dry');
const recs = JSON.parse(fs.readFileSync(file, 'utf8'));
let ok = 0, skip = 0;
for (const r of recs) {
  const cur = await p.$queryRawUnsafe(
    `SELECT id, length(full_description)::int AS len FROM tours WHERE slug=$1 AND status='approved'`, r.slug);
  if (!cur.length) { console.log(`MISS ${r.slug}`); skip++; continue; }
  if (r.fullDescription.length < 1200) { console.log(`SHORT ${r.slug} (${r.fullDescription.length})`); skip++; continue; }
  if (dry) { console.log(`dry ${r.slug}: ${cur[0].len} -> ${r.fullDescription.length}`); ok++; continue; }
  await p.$executeRawUnsafe(
    `UPDATE tours SET full_description=$1, updated_at=now() WHERE id=$2`, r.fullDescription, cur[0].id);
  if (r.highlights?.length) {
    await p.$executeRawUnsafe(`UPDATE tours SET highlights=$1::jsonb WHERE id=$2`, JSON.stringify(r.highlights), cur[0].id);
  }
  console.log(`ok ${r.slug}: ${cur[0].len} -> ${r.fullDescription.length}`);
  ok++;
}
console.log(`\napplied ${ok}, skipped ${skip}`);
await p.$disconnect();
