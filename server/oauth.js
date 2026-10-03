// Minimal OAuth 2.1 (authorization code + PKCE) server, built only so ChatGPT's
// Apps Directory has something to call — it does not accept a static API key.
//
// There is no traveller account system behind this: consent is a single
// branded "Allow" click (no login), and approving it just mints an ordinary
// AgentKey row (the same table and the same Bearer-token check agent_api.js
// already does) and hands its key back as the access_token. Nothing else in
// the agent/MCP stack needs to change.
//
// client_id / redirect_uri are whatever OpenAI issues during Apps Directory
// submission; they're read from env vars so this can be wired up without a
// code change once Talha has the real values from platform.openai.com.
import { randomBytes, createHash } from 'crypto';

const CODE_TTL_MS = 5 * 60 * 1000;

const b64url = (buf) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const newToken = (bytes = 32) => b64url(randomBytes(bytes));

function pkceMatches(verifier, challenge, method) {
  if (!verifier || !challenge) return false;
  if (method && method !== 'S256') return false; // OAuth 2.1 requires S256 when PKCE is used
  return b64url(createHash('sha256').update(verifier).digest()) === challenge;
}

function consentPage({ clientName, formAction, hidden }) {
  const fields = Object.entries(hidden)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, '&quot;')}">`)
    .join('\n      ');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connect AsiaByLocals</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f7f5f2;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,.08);padding:32px;max-width:420px;width:90%}
  h1{font-size:18px;margin:0 0 8px}
  p{color:#555;font-size:14px;line-height:1.5}
  ul{color:#555;font-size:14px;padding-left:20px}
  .row{display:flex;gap:12px;margin-top:24px}
  button{flex:1;padding:12px;border-radius:8px;border:none;font-size:15px;cursor:pointer}
  .allow{background:#1a7a4c;color:#fff}
  .deny{background:#eee;color:#333}
</style></head>
<body>
  <div class="card">
    <h1>${clientName} wants to connect to AsiaByLocals</h1>
    <p>This lets it, on your behalf:</p>
    <ul>
      <li>Search AsiaByLocals tours and prices</li>
      <li>Open a 24-hour booking hold for you</li>
    </ul>
    <p>It will <strong>never</strong> see your card details or pay on your behalf — you always pay yourself on AsiaByLocals.</p>
    <form method="POST" action="${formAction}">
      ${fields}
      <div class="row">
        <button class="deny" name="decision" value="deny">Deny</button>
        <button class="allow" name="decision" value="allow">Allow</button>
      </div>
    </form>
  </div>
</body></html>`;
}

export default function mountOAuth(app, prisma) {
  const CLIENT_ID = process.env.OPENAI_OAUTH_CLIENT_ID || null;
  const REDIRECT_URI = process.env.OPENAI_OAUTH_REDIRECT_URI || null;

  // authorization_code -> { clientId, redirectUri, codeChallenge, codeChallengeMethod, expiresAt }
  const codes = new Map();
  const sweep = () => { const now = Date.now(); for (const [k, v] of codes) if (v.expiresAt < now) codes.delete(k); };

  function validClient(clientId, redirectUri) {
    if (!CLIENT_ID || !REDIRECT_URI) return false; // not configured yet — nothing to approve against
    return clientId === CLIENT_ID && redirectUri === REDIRECT_URI;
  }

  app.get('/oauth/authorize', (req, res) => {
    const { client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.query;
    if (!validClient(client_id, redirect_uri)) return res.status(400).send('Unknown client or redirect_uri.');
    if (!code_challenge || (code_challenge_method && code_challenge_method !== 'S256')) {
      return res.status(400).send('PKCE (S256) is required.');
    }
    res.send(consentPage({
      clientName: 'ChatGPT',
      formAction: '/oauth/authorize',
      hidden: { client_id, redirect_uri, state: state || '', code_challenge, code_challenge_method: code_challenge_method || 'S256' },
    }));
  });

  app.post('/oauth/authorize', (req, res) => {
    const { decision, client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.body || {};
    if (!validClient(client_id, redirect_uri)) return res.status(400).send('Unknown client or redirect_uri.');
    const back = new URL(redirect_uri);
    if (decision !== 'allow') {
      back.searchParams.set('error', 'access_denied');
      if (state) back.searchParams.set('state', state);
      return res.redirect(back.toString());
    }
    sweep();
    const code = newToken(24);
    codes.set(code, {
      clientId: client_id, redirectUri: redirect_uri,
      codeChallenge: code_challenge, codeChallengeMethod: code_challenge_method || 'S256',
      expiresAt: Date.now() + CODE_TTL_MS,
    });
    back.searchParams.set('code', code);
    if (state) back.searchParams.set('state', state);
    res.redirect(back.toString());
  });

  async function issueAgentKey(name) {
    return prisma.agentKey.create({ data: { key: 'abl_' + newToken(24), name, contact: 'chatgpt-apps-directory' } });
  }

  app.post('/oauth/token', async (req, res) => {
    const { grant_type } = req.body || {};
    try {
      if (grant_type === 'authorization_code') {
        const { code, code_verifier, redirect_uri, client_id } = req.body;
        const entry = codes.get(code);
        if (!entry || entry.expiresAt < Date.now()) return res.status(400).json({ error: 'invalid_grant' });
        codes.delete(code); // single use
        if (entry.clientId !== client_id || entry.redirectUri !== redirect_uri) return res.status(400).json({ error: 'invalid_grant' });
        if (!pkceMatches(code_verifier, entry.codeChallenge, entry.codeChallengeMethod)) return res.status(400).json({ error: 'invalid_grant' });
        const key = await issueAgentKey('chatgpt-oauth');
        return res.json({ access_token: key.key, token_type: 'bearer', expires_in: 31536000, refresh_token: key.key, scope: 'tours.search tours.hold' });
      }
      if (grant_type === 'refresh_token') {
        const { refresh_token } = req.body;
        const old = await prisma.agentKey.findUnique({ where: { key: refresh_token } });
        if (!old || !old.active) return res.status(400).json({ error: 'invalid_grant' });
        await prisma.agentKey.update({ where: { id: old.id }, data: { active: false } });
        const key = await issueAgentKey('chatgpt-oauth');
        return res.json({ access_token: key.key, token_type: 'bearer', expires_in: 31536000, refresh_token: key.key, scope: 'tours.search tours.hold' });
      }
      return res.status(400).json({ error: 'unsupported_grant_type' });
    } catch (e) {
      return res.status(500).json({ error: 'server_error' });
    }
  });

  // OAuth 2.0 Authorization Server Metadata (RFC 8414) — lets clients discover the two endpoints above.
  app.get('/.well-known/oauth-authorization-server', (_req, res) => res.json({
    issuer: 'https://asiabylocals.onrender.com',
    authorization_endpoint: 'https://asiabylocals.onrender.com/oauth/authorize',
    token_endpoint: 'https://asiabylocals.onrender.com/oauth/token',
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
  }));
}
