# ✅ Final Build Command - Include Dev Dependencies

## Problem
Render sets `NODE_ENV=production`, so `npm ci` skips devDependencies (including `vite`).

## Solution: Explicitly include dev dependencies

### Build Command (Copy this EXACTLY):

```bash
npm ci --include=dev && npm run build && cd server && npm install && npm run prisma:generate
```

**OR** (alternative):

```bash
NODE_ENV=development npm ci && npm run build && cd server && npm install && npm run prisma:generate
```

---

## Recommended: Use `--include=dev` flag

**Copy this exact Build Command:**
```bash
npm ci --include=dev && npm run build && cd server && npm install && npm run prisma:generate
```

This explicitly tells npm to install devDependencies even if NODE_ENV=production.

---

**Update the Build Command in Render and redeploy!** 🚀

