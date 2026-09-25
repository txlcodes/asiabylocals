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
const tours = await p.$queryRawUnsafe(`SELECT id,slug,country,city,title,price_per_person h,gyg_activity_id gid FROM tours WHERE price_per_person>0`);
const opts  = await p.$queryRawUnsafe(`SELECT tour_id,option_title,price,group_pricing_tiers g FROM tour_options`);
const by=new Map(); for(const o of opts){ if(!by.has(o.tour_id))by.set(o.tour_id,[]); by.get(o.tour_id).push(o); }
const bad=[]; let ok=0, noopt=0;
for (const t of tours) {
  const os=by.get(t.id); if(!os){ noopt++; continue; }
  const totals=[];
  for (const o of os) {
    let ti=null; try{ ti = o.g ? JSON.parse(o.g) : null }catch{}
    if (Array.isArray(ti)&&ti.length) {
      const x = ti.find(z=>1>=(+z.minPeople||1)&&1<=(+z.maxPeople||9999)) || ti[0];
      const v=parseFloat(x?.price); if(isFinite(v)&&v>0) totals.push(v);
    } else if (o.price>0) totals.push(o.price);
  }
  if(!totals.length){ noopt++; continue; }
  const floor1=Math.min(...totals);
  if (t.h < floor1*0.95) bad.push({id:String(t.id),slug:t.slug,country:t.country,city:t.city,title:t.title,headline:t.h,floor1,gid:t.gid,
    opts:os.map(o=>({t:o.option_title,p:o.price,grp:!!o.g}))});
  else ok++;
}
fs.writeFileSync('/tmp/audit1.json', JSON.stringify(bad,null,1));
console.log(`with options ${ok+bad.length} | from-price honest ${ok} | MISLEADING ${bad.length} | no options ${noopt}`);
for (const b of bad.slice(0, 40)) {
  console.log(`  ${b.country.slice(0,9).padEnd(9)} ${b.slug.slice(0,46).padEnd(48)} page $${b.headline}  cheapest real $${Math.round(b.floor1)}`);
}
if (noopt) console.log(`\n${noopt} tours have no options at all: the page sells a from-price with nothing to pick, which is how a guest books a cheaper product than the title describes.`);
const c={}; bad.forEach(b=>c[b.country]=(c[b.country]||0)+1); console.log(c);
await p.$disconnect();
if (FAIL_ON_FINDINGS && bad.length) process.exit(1);
