// Agent API: lets AI agents (ChatGPT, Claude, Perplexity and their MCP tools)
// search our tours and open a booking hold on a traveller's behalf.
//
// Rules, decided 2026-09-18:
//   - Keys are issued by hand and stored in agent_keys; every call is counted
//     in agent_requests so quotas survive a Render restart.
//   - Nothing enumerates the catalogue: a search needs a city plus a query or
//     a date, returns at most 20 rows, and pages no further than 100.
//   - The operator's name and contact never leave this API. Agents see
//     "verified local operator" and a stable operator_ref.
//   - Prices are "from" plus a total for the party size; no tier tables.
//   - A hold is an ordinary Booking in pending_payment. The traveller pays on
//     /booking/<id>; only then does the operator hear about it. Card details
//     never pass through an agent.
//   - Every URL carries ?ref=<key ref> and the field order rotates per key, so
//     a leaked dump can be traced to the key that pulled it.
import { randomBytes, createHash } from 'crypto';

const SITE = 'https://www.asiabylocals.com';
const MAX_LIMIT = 20;
const MAX_OFFSET = 100;
const BURST_PER_MIN = 10;
const HOLD_HOURS = 24;

const slugify = (s) => String(s || '').trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const todayUtc = () => new Date().toISOString().slice(0, 10);
const opRef = (name) => 'op_' + createHash('sha256').update(String(name || '')).digest('hex').slice(0, 10);
const keyRef = (key) => createHash('sha256').update(key.key).digest('hex').slice(0, 8);

function parseJson(v, fallback) {
  if (v == null) return fallback;
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return fallback; }
}

/** Total for `pax` guests using the tour's own group tiers when it has them. */
function priceFor(tour, pax) {
  const tiers = parseJson(tour.groupPricingTiers, null) || parseJson(tour.options?.[0]?.groupPricingTiers, null);
  const per = Number(tour.pricePerPerson) || 0;
  if (Array.isArray(tiers) && tiers.length) {
    const row = tiers.find((t) => pax >= Number(t.minPeople) && pax <= Number(t.maxPeople));
    if (row && Number(row.price) > 0) return { total: Math.round(Number(row.price) * 100) / 100, basis: 'group_tier' };
    const last = tiers[tiers.length - 1];
    if (pax > Number(last?.maxPeople) && Number(last?.price) > 0) {
      const perHead = Number(last.price) / Number(last.maxPeople || 1);
      return { total: Math.round(perHead * pax * 100) / 100, basis: 'group_tier_extrapolated' };
    }
  }
  return { total: Math.round(per * pax * 100) / 100, basis: 'per_person' };
}

/** Rotate object key order by the key id: a cheap fingerprint per API key. */
function rotate(obj, n) {
  const keys = Object.keys(obj);
  const k = n % keys.length;
  const out = {};
  for (const key of [...keys.slice(k), ...keys.slice(0, k)]) out[key] = obj[key];
  return out;
}

const CANCELLATION = 'Free cancellation up to 24 hours before the start for most tours; the tour page states any exception. We confirm every booking with the local operator before treating it as final and refund in full if the operator cannot take the date.';

function tourCard(tour, pax, key) {
  const country = slugify(tour.country);
  const city = slugify(tour.city);
  const price = priceFor(tour, pax);
  const included = parseJson(tour.included, []);
  const card = {
    tour_id: tour.id,
    title: tour.title,
    url: `${SITE}/${country}/${city}/${tour.slug}?ref=${keyRef(key)}`,
    city: tour.city,
    country: tour.country,
    category: tour.category,
    duration: tour.duration || null,
    currency: tour.currency || 'USD',
    price_from: Number(tour.pricePerPerson) || null,
    price_for_party: { pax, total: price.total, basis: price.basis },
    pickup_included: Boolean(tour.pickupIncluded),
    included: Array.isArray(included) ? included.slice(0, 8) : [],
    operator: 'verified local operator, booked directly',
    operator_ref: opRef(tour.activityProvider),
    summary: tour.shortDescription || null,
    cancellation: CANCELLATION,
    booking: 'POST /api/agent/holds with tour_id, date, pax and traveller details; the traveller then pays on the returned payment_url.',
  };
  return rotate(card, key.id);
}

export default function mountAgentApi(app, prisma, deps = {}) {
  const alert = deps.sendBookingAlert || (() => {});

  // ---- auth + quota -------------------------------------------------------
  async function auth(req, res, kind) {
    const raw = req.get('x-agent-key') || (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!raw) { res.status(401).json({ error: 'missing_key', how_to_get_one: `${SITE}/api/agent` }); return null; }
    const key = await prisma.agentKey.findUnique({ where: { key: raw } });
    if (!key || !key.active) { res.status(401).json({ error: 'invalid_key' }); return null; }
    const day = todayUtc();
    const [dayCount, burst] = await Promise.all([
      prisma.agentRequest.count({ where: { keyId: key.id, day, kind: { in: kind === 'hold' ? ['hold'] : ['search', 'tour'] } } }),
      prisma.agentRequest.count({ where: { keyId: key.id, createdAt: { gte: new Date(Date.now() - 60_000) } } }),
    ]);
    const limit = kind === 'hold' ? key.holdQuota : key.dailyQuota;
    if (dayCount >= limit) { res.status(429).json({ error: 'daily_quota_exceeded', limit, resets_at: `${day}T24:00:00Z` }); return null; }
    if (burst >= BURST_PER_MIN) { res.status(429).json({ error: 'rate_limited', retry_after_seconds: 60 }); return null; }
    await prisma.agentRequest.create({ data: { keyId: key.id, kind, day } });
    prisma.agentKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } }).catch(() => {});
    return key;
  }

  const TOUR_SELECT = {
    id: true, title: true, slug: true, city: true, country: true, category: true, duration: true,
    currency: true, pricePerPerson: true, groupPricingTiers: true, shortDescription: true, included: true,
    pickupIncluded: true, activityProvider: true,
    options: { select: { optionTitle: true, price: true, groupPricingTiers: true, durationHours: true }, orderBy: { sortOrder: 'asc' }, take: 6 },
  };

  // ---- discovery ----------------------------------------------------------
  app.get('/api/agent', (_req, res) => {
    res.json({
      name: 'AsiaByLocals Agent API',
      description: 'Search tours run by verified local operators across India, Japan, Thailand, Sri Lanka, Vietnam, Indonesia (Bali), the UAE and Nepal, and open a booking hold that a traveller completes by paying.',
      openapi: `${SITE}/api/agent/openapi.json`,
      auth: 'Send your key in the X-Agent-Key header. Keys are issued to named agents: email info@asiabylocals.com with the agent or product name.',
      limits: { searches_per_day: 300, holds_per_day: 20, burst_per_minute: BURST_PER_MIN, max_results: MAX_LIMIT },
      honesty: 'Prices include our margin; we are not the cheapest listing. What you get is a local operator we message directly, a WhatsApp-confirmed booking, and a full refund if the operator cannot take the date.',
    });
  });

  app.get('/api/agent/openapi.json', (_req, res) => {
    res.json({
      openapi: '3.0.3',
      info: { title: 'AsiaByLocals Agent API', version: '1.0.0', description: 'Search local-operator tours in Asia and open booking holds for a traveller.' },
      servers: [{ url: 'https://asiabylocals.onrender.com' }],
      components: { securitySchemes: { agentKey: { type: 'apiKey', in: 'header', name: 'X-Agent-Key' } } },
      security: [{ agentKey: [] }],
      paths: {
        '/api/agent/tours': { get: { summary: 'Search tours in a city', parameters: [
          { name: 'city', in: 'query', required: true, schema: { type: 'string' }, description: 'City name, e.g. Ubud, Kyoto, Ella' },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Keywords, e.g. "Mount Batur sunrise". Required unless date is given.' },
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Travel date YYYY-MM-DD. Required unless q is given.' },
          { name: 'pax', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 20, default: 2 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', maximum: MAX_LIMIT, default: 10 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', maximum: MAX_OFFSET, default: 0 } },
        ], responses: { 200: { description: 'Tours with a price for the party size and a canonical URL' } } } },
        '/api/agent/tours/{tour_id}': { get: { summary: 'Tour detail with options priced for the party', parameters: [
          { name: 'tour_id', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'pax', in: 'query', schema: { type: 'integer', default: 2 } },
        ], responses: { 200: { description: 'Tour detail' }, 404: { description: 'Unknown tour' } } } },
        '/api/agent/holds': { post: { summary: 'Open a 24-hour booking hold; the traveller pays on payment_url', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['tour_id', 'date', 'pax', 'traveller'], properties: {
          tour_id: { type: 'integer' }, date: { type: 'string', format: 'date' }, pax: { type: 'integer' },
          traveller: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' } } },
          notes: { type: 'string' } } } } } }, responses: { 201: { description: 'Hold created' }, 400: { description: 'Validation error, including too-soon dates' } } } },
        '/api/agent/holds/{hold_id}': { get: { summary: 'Hold status', parameters: [{ name: 'hold_id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'awaiting_payment | confirmed | cancelled | expired' } } } },
      },
    });
  });

  // ---- search -------------------------------------------------------------
  app.get('/api/agent/tours', async (req, res) => {
    const key = await auth(req, res, 'search'); if (!key) return;
    const city = String(req.query.city || '').trim();
    const q = String(req.query.q || '').trim();
    const date = String(req.query.date || '').trim();
    if (!city || (!q && !date)) return res.status(400).json({ error: 'city plus q or date is required' });
    const pax = Math.min(20, Math.max(1, parseInt(req.query.pax) || 2));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = Math.min(MAX_OFFSET, Math.max(0, parseInt(req.query.offset) || 0));
    const where = { status: 'approved', city: { equals: city, mode: 'insensitive' } };
    if (q) {
      const words = q.split(/\s+/).filter((w) => w.length > 2).slice(0, 5);
      where.AND = words.map((w) => ({ OR: [
        { title: { contains: w, mode: 'insensitive' } },
        { shortDescription: { contains: w, mode: 'insensitive' } },
        { highlights: { contains: w, mode: 'insensitive' } },
      ] }));
    }
    const [rows, total] = await Promise.all([
      prisma.tour.findMany({ where, select: TOUR_SELECT, orderBy: [{ id: 'asc' }], skip: offset, take: limit }),
      prisma.tour.count({ where }),
    ]);
    res.json({
      city, query: q || null, date: date || null, pax,
      count: rows.length, total_matches: total,
      next_offset: offset + limit < Math.min(total, MAX_OFFSET + MAX_LIMIT) ? offset + limit : null,
      tours: rows.map((t) => tourCard(t, pax, key)),
      note: date ? 'Availability is confirmed with the operator when a hold is paid; most tours run daily.' : undefined,
    });
  });

  // ---- detail -------------------------------------------------------------
  app.get('/api/agent/tours/:id', async (req, res) => {
    const key = await auth(req, res, 'tour'); if (!key) return;
    const id = parseInt(req.params.id); if (!id) return res.status(400).json({ error: 'bad tour_id' });
    const pax = Math.min(20, Math.max(1, parseInt(req.query.pax) || 2));
    const t = await prisma.tour.findFirst({ where: { id, status: 'approved' }, select: { ...TOUR_SELECT, fullDescription: true, highlights: true, notIncluded: true, meetingPoint: true, itineraryItems: true, languages: true } });
    if (!t) return res.status(404).json({ error: 'not_found' });
    const card = tourCard(t, pax, key);
    res.json({
      ...card,
      description: String(t.fullDescription || '').slice(0, 1500),
      highlights: parseJson(t.highlights, []),
      not_included: parseJson(t.notIncluded, []),
      itinerary: (parseJson(t.itineraryItems, []) || []).slice(0, 10),
      meeting: t.meetingPoint || null,
      languages: parseJson(t.languages, ['English']),
      options: (t.options || []).map((o) => ({ title: o.optionTitle || null, duration_hours: o.durationHours || null, price_for_party: priceFor({ ...t, groupPricingTiers: o.groupPricingTiers, pricePerPerson: o.price }, pax).total })),
      lead_time: slugify(t.country) === 'india' ? 'Same-day bookings accepted.' : 'At least 1 day before the tour, so the operator can confirm.',
    });
  });

  // ---- holds --------------------------------------------------------------
  app.post('/api/agent/holds', async (req, res) => {
    const key = await auth(req, res, 'hold'); if (!key) return;
    const { tour_id, date, pax, traveller, notes } = req.body || {};
    const id = parseInt(tour_id); const n = parseInt(pax);
    if (!id || !date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || !n || n < 1 || n > 20) return res.status(400).json({ error: 'tour_id, date (YYYY-MM-DD) and pax (1-20) are required' });
    if (!traveller || !traveller.name || !traveller.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(traveller.email)) return res.status(400).json({ error: 'traveller.name and a valid traveller.email are required' });
    const t = await prisma.tour.findFirst({ where: { id, status: 'approved' }, select: { ...TOUR_SELECT, supplierId: true } });
    if (!t) return res.status(404).json({ error: 'not_found' });
    // Same lead-time rule as the public checkout: same day in India, one day elsewhere.
    const lead = slugify(t.country) === 'india' ? 0 : 1;
    const earliest = new Date(); earliest.setUTCHours(0, 0, 0, 0); earliest.setUTCDate(earliest.getUTCDate() + lead);
    if (new Date(`${date}T00:00:00Z`) < earliest) return res.status(400).json({ error: 'too_soon', earliest_date: earliest.toISOString().slice(0, 10), message: `This tour needs ${lead} day's notice so the local operator can confirm.` });
    const price = priceFor(t, n);
    const booking = await prisma.booking.create({ data: {
      tourId: t.id, supplierId: t.supplierId,
      customerName: String(traveller.name).slice(0, 120), customerEmail: String(traveller.email).slice(0, 200), customerPhone: traveller.phone ? String(traveller.phone).slice(0, 40) : null,
      bookingDate: String(date), numberOfGuests: n, totalAmount: price.total, currency: t.currency || 'USD',
      specialRequests: `[via AI agent: ${key.name}]${notes ? ' ' + String(notes).slice(0, 500) : ''}`,
      status: 'pending_payment', paymentStatus: 'pending',
    } });
    const holdId = 'hold_' + randomBytes(9).toString('base64url');
    const expiresAt = new Date(Date.now() + HOLD_HOURS * 3600 * 1000);
    await prisma.agentHold.create({ data: { holdId, keyId: key.id, bookingId: booking.id, tourId: t.id, pax: n, date: String(date), amountUsd: price.total, expiresAt } });
    try { alert({ reference: `ABL-${String(booking.id).padStart(6, '0')}-${new Date().getFullYear()} (agent hold)`, tourTitle: t.title, customerName: traveller.name, customerPhone: traveller.phone, customerEmail: traveller.email, guests: n, amount: price.total, currency: t.currency || 'USD', specialRequests: `AI agent ${key.name}` }); } catch {}
    res.status(201).json({
      hold_id: holdId, status: 'awaiting_payment',
      tour_id: t.id, title: t.title, date: String(date), pax: n,
      amount: price.total, currency: t.currency || 'USD', price_basis: price.basis,
      payment_url: `${SITE}/booking/${booking.id}?ref=${keyRef(key)}`,
      expires_at: expiresAt.toISOString(),
      next_step: 'Send the traveller to payment_url. Payment is made by the traveller, never by the agent. Once paid, we confirm the date with the local operator and email the traveller the meeting details.',
    });
  });

  app.get('/api/agent/holds/:holdId', async (req, res) => {
    const key = await auth(req, res, 'tour'); if (!key) return;
    const h = await prisma.agentHold.findUnique({ where: { holdId: String(req.params.holdId) } });
    if (!h || h.keyId !== key.id) return res.status(404).json({ error: 'not_found' });
    const b = await prisma.booking.findUnique({ where: { id: h.bookingId }, select: { status: true, paymentStatus: true, confirmedAt: true } });
    let status = 'awaiting_payment';
    if (b?.status === 'confirmed' || b?.paymentStatus === 'paid') status = 'confirmed';
    else if (b?.status === 'cancelled') status = 'cancelled';
    else if (new Date() > h.expiresAt) status = 'expired';
    res.json({ hold_id: h.holdId, status, tour_id: h.tourId, date: h.date, pax: h.pax, amount: h.amountUsd, expires_at: h.expiresAt.toISOString(), payment_url: status === 'awaiting_payment' ? `${SITE}/booking/${h.bookingId}?ref=${keyRef(key)}` : null });
  });
}
