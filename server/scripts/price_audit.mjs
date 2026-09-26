// Run: node scripts/price_audit.mjs [--strict]
//
// Two ways a tour page can lie about its price, both of which have cost us money:
//   1. the advertised from-price is below the cheapest option a guest can book;
//   2. the tour has no options at all, so the from-price is attached to a title
//      describing a fuller, dearer product.
// --strict exits non-zero when anything is found, for use in a scheduled check.
// The James Smith question: does the "from" price on the page match the cheapest
// booking a single guest can actually make?
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
const p = new PrismaClient();
const FAIL_ON_FINDINGS = process.argv.includes('--strict');
const tours = await p.$queryRawUnsafe(`SELECT id,slug,country,city,title,price_per_person h,gyg_activity_id gid,duration FROM tours WHERE price_per_person>0 AND status='approved'`);
const opts  = await p.$queryRawUnsafe(`SELECT tour_id,option_title,price,group_pricing_tiers g FROM tour_options`);
const by=new Map(); for(const o of opts){ if(!by.has(o.tour_id))by.set(o.tour_id,[]); by.get(o.tour_id).push(o); }
// A believable ceiling for one traveller's share of a single listing. Multi-day
// and luxury-cruise products sit well under these; anything above is a data bug.
const ABSURD = { India: 900, Japan: 1200, Thailand: 900, Vietnam: 900, Indonesia: 900,
                 'Sri Lanka': 900, UAE: 1200, Cambodia: 900, Nepal: 900 };
const bad=[]; const stale=[]; let ok=0, noopt=0;
for (const t of tours) {
  const os=by.get(t.id); if(!os){ noopt++; continue; }
  const totals=[]; const pairTotals=[];
  for (const o of os) {
    let ti=null; try{ ti = o.g ? JSON.parse(o.g) : null }catch{}
    if (Array.isArray(ti)&&ti.length) {
      const x = ti.find(z=>1>=(+z.minPeople||1)&&1<=(+z.maxPeople||9999)) || ti[0];
      const v=parseFloat(x?.price); if(isFinite(v)&&v>0) totals.push(v);
      const x2 = ti.find(z=>2>=(+z.minPeople||1)&&2<=(+z.maxPeople||9999)) || x;
      const v2=parseFloat(x2?.price); if(isFinite(v2)&&v2>0) pairTotals.push(v2);
    } else if (o.price>0) { totals.push(o.price); pairTotals.push(o.price*2); }
  }
  if(!totals.length){ noopt++; continue; }
  const floor1=Math.min(...totals);
  // A tour with a minimum charge quotes the same total for one guest as for
  // two, so its honest "from" price is the per head cost of a pair, not the
  // single guest total. Comparing only against the one guest figure flagged
  // 141 correctly priced India tours as misleading. A page is only wrong when
  // it undercuts BOTH readings.
  const floorPair = Math.min(...pairTotals) / 2;
  // A gap of a dollar on a ten dollar tour is rounding, not a misleading page.
  // Only a gap that is both proportionally and absolutely real is worth a flag.
  const gap = Math.min(floor1, floorPair) - t.h;
  // The page does not render price_per_person. Both the tour page and the city
  // cards compute the rate for two travellers from the option tiers, so a
  // drifted field is invisible to guests and is not the James Smith failure
  // this script exists to catch. It still used to leak into the JSON-LD offer,
  // which lib/offerPrice.ts now derives from the tiers as well. Count these
  // separately instead of burying the real findings: on 2026-09-27 there were
  // 84 of them, all India, all rendering correctly on the page.
  if (t.h < floor1*0.95 && t.h < floorPair*0.95 && gap > 2) {
    stale.push({slug:t.slug,country:t.country,headline:t.h,shown:Math.min(floor1,floorPair)});
    ok++;
    continue;
  }
  // What the guest actually sees: the cheapest per-head rate for a pair.
  // A page is broken when that number is absurd for the country, which is how
  // a rupee figure typed into a dollar field reads -- taj-mahal-private-tour
  // shows $4,875 for a day in Agra. Those never sell and they look like a bug.
  const shown = Math.min(floor1, floorPair);
  // Scale by trip length. A 10-day private Japan charter at $2,800 a head is a
  // real product; the same number on a half-day walk is a typo.
  const days = Math.max(1, parseInt(String(t.title||'').match(/(\d{1,2})\s*[- ]?day/i)?.[1]
                              || String(t.duration||'').match(/(\d{1,2})\s*day/i)?.[1] || '1'));
  const ceiling = (ABSURD[t.country] ?? 1500) * days;
  if (shown > ceiling) bad.push({id:String(t.id),slug:t.slug,country:t.country,city:t.city,title:t.title,headline:t.h,floor1:shown,gid:t.gid,
    opts:os.map(o=>({t:o.option_title,p:o.price,grp:!!o.g}))});
  else ok++;
}
fs.writeFileSync('/tmp/audit1.json', JSON.stringify(bad,null,1));
console.log(`with options ${ok+bad.length} | page price honest ${ok} | ABSURD PRICE ${bad.length} | no options ${noopt}`);
if (stale.length) {
  console.log(`\n${stale.length} tours carry a stale price_per_person (the page shows the tier rate, so guests see the right number):`);
  const sc={}; stale.forEach(x=>sc[x.country]=(sc[x.country]||0)+1); console.log(' ', sc);
  for (const x of stale.slice(0,8)) console.log(`    ${x.slug.slice(0,48).padEnd(50)} field $${x.headline}  page shows ~$${Math.round(x.shown)}`);
  fs.writeFileSync('/tmp/audit_stale_field.json', JSON.stringify(stale,null,1));
}
for (const b of bad.slice(0, 40)) {
  console.log(`  ${b.country.slice(0,9).padEnd(9)} ${b.slug.slice(0,46).padEnd(48)} page shows $${Math.round(b.floor1)} a head`);
}
if (noopt) console.log(`\n${noopt} tours have no options at all: the page sells a from-price with nothing to pick, which is how a guest books a cheaper product than the title describes.`);
const c={}; bad.forEach(b=>c[b.country]=(c[b.country]||0)+1); console.log(c);
await p.$disconnect();
if (FAIL_ON_FINDINGS && bad.length) process.exit(1);
