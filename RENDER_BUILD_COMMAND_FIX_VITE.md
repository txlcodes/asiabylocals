# 🔧 Fix: vite: not found

## Problem
`vite` is in `devDependencies`, but Render might be skipping dev dependencies during `npm install`.

## Solution: Use `npm ci` or explicitly install dev dependencies

### Option 1: Use `npm ci` (Recommended - uses package-lock.json)

**Build Command:**
```bash
npm ci && npm run build && cd server && npm install && npm run prisma:generate
```

### Option 2: Explicitly include dev dependencies

**Build Command:**
```bash
npm install --include=dev && npm run build && cd server && npm install && npm run prisma:generate
```

### Option 3: Set NODE_ENV before install

**Build Command:**
```bash
NODE_ENV=development npm install && npm run build && cd server && npm install && npm run prisma:generate
```

---

## Recommended: Use Option 1 (`npm ci`)

`npm ci` is faster, more reliable, and respects `package-lock.json` exactly.

**Copy this exact Build Command:**
```bash
npm ci && npm run build && cd server && npm install && npm run prisma:generate
```

---

**Update the Build Command in Render and redeploy!** 🚀

