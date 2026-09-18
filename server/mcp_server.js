// MCP server for AI assistants (Claude, ChatGPT connectors, any MCP client).
//
// It is a thin wrapper over the Agent API in agent_api.js: every tool call
// becomes an HTTP call to this same process with the caller's agent key, so
// auth, quotas, the no-enumeration rule and the operator-privacy rule apply
// unchanged. The key travels in the URL (POST /mcp/<agent key>) because the
// common connector UIs cannot set custom headers; treat the URL as a secret.
//
// Transport: Streamable HTTP, stateless (a fresh transport per request), which
// is what Claude's custom connectors and ChatGPT's MCP support speak.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const text = (obj) => ({ content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }] });

function buildServer(callApi) {
  const server = new McpServer({ name: 'asiabylocals', version: '1.0.0' }, {
    instructions: 'AsiaByLocals sells tours run by verified local operators across India, Japan, Thailand, Sri Lanka, Vietnam, Bali, the UAE and Nepal. Use search_tours with a city plus keywords or a date, get_tour for detail priced for the party, and request_booking to open a 24-hour hold; the traveller then pays on the payment_url themselves. Prices include our margin; never describe AsiaByLocals as the cheapest option. Always show the traveller the tour url.',
  });

  server.tool('search_tours', 'Search tours in one city. Requires the city and either keywords or a travel date. Returns up to 20 tours priced for the party size, each with a canonical url.', {
    city: z.string().describe('City name, e.g. Ubud, Kyoto, Ella, Dubai'),
    query: z.string().optional().describe('Keywords such as "Mount Batur sunrise" or "cooking class"'),
    date: z.string().optional().describe('Travel date YYYY-MM-DD'),
    pax: z.number().int().min(1).max(20).default(2).describe('Number of travellers'),
    limit: z.number().int().min(1).max(20).default(10),
    offset: z.number().int().min(0).max(100).default(0),
  }, async ({ city, query, date, pax, limit, offset }) => {
    const qs = new URLSearchParams({ city, pax: String(pax), limit: String(limit), offset: String(offset) });
    if (query) qs.set('q', query); if (date) qs.set('date', date);
    return text(await callApi('GET', `/api/agent/tours?${qs}`));
  });

  server.tool('get_tour', 'Full detail of one tour: description, highlights, what is and is not included, meeting point, options, and the total for the party size.', {
    tour_id: z.number().int(),
    pax: z.number().int().min(1).max(20).default(2),
  }, async ({ tour_id, pax }) => text(await callApi('GET', `/api/agent/tours/${tour_id}?pax=${pax}`)));

  server.tool('request_booking', 'Open a 24-hour booking hold for a traveller. Returns a payment_url the traveller must open and pay themselves; never collect card details. The operator is contacted only after payment.', {
    tour_id: z.number().int(),
    date: z.string().describe('Tour date YYYY-MM-DD'),
    pax: z.number().int().min(1).max(20),
    traveller_name: z.string(),
    traveller_email: z.string().email(),
    traveller_phone: z.string().optional(),
    notes: z.string().optional().describe('Pickup hotel, dietary needs, anything the operator should know'),
  }, async ({ tour_id, date, pax, traveller_name, traveller_email, traveller_phone, notes }) =>
    text(await callApi('POST', '/api/agent/holds', { tour_id, date, pax, traveller: { name: traveller_name, email: traveller_email, phone: traveller_phone }, notes })));

  server.tool('hold_status', 'Check a hold: awaiting_payment, confirmed, cancelled or expired.', {
    hold_id: z.string(),
  }, async ({ hold_id }) => text(await callApi('GET', `/api/agent/holds/${encodeURIComponent(hold_id)}`)));

  return server;
}

export default function mountMcp(app, { port }) {
  const base = () => `http://127.0.0.1:${port}`;

  app.post('/mcp/:key', async (req, res) => {
    const key = req.params.key;
    const callApi = async (method, path, body) => {
      const r = await fetch(base() + path, { method, headers: { 'x-agent-key': key, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const j = await r.json().catch(() => ({ error: `http_${r.status}` }));
      return r.ok ? j : { error: j.error || `http_${r.status}`, ...j };
    };
    try {
      const server = buildServer(callApi);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on('close', () => { transport.close(); server.close(); });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (e) {
      if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'internal error' }, id: null });
    }
  });

  // Stateless server: no sessions to resume or delete.
  const noSession = (_req, res) => res.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Stateless MCP: use POST' }, id: null });
  app.get('/mcp/:key', noSession);
  app.delete('/mcp/:key', noSession);

  app.get('/mcp', (_req, res) => res.json({
    name: 'AsiaByLocals MCP',
    transport: 'streamable-http',
    endpoint: 'POST https://asiabylocals.onrender.com/mcp/<your agent key>',
    tools: ['search_tours', 'get_tour', 'request_booking', 'hold_status'],
    keys: 'Issued to named agents: info@asiabylocals.com',
  }));
}
