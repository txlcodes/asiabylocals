# 🔧 Fix Build Command - Missing Frontend Build

## Issue
The `dist` folder doesn't exist because the Build Command isn't building the frontend.

## Current Build Command (WRONG):
```
npm install && npm run prisma:generate
```

This is missing the frontend build step!

## Correct Build Command:

Go to Render → Settings → Build Command and change to:

```bash
npm install && npm run build && cd server && npm install && npm run prisma:generate
```

## What This Does:

1. `npm install` - Installs frontend dependencies (React, Vite, etc.)
2. `npm run build` - **Builds frontend** → Creates `dist/` folder ✅
3. `cd server` - Goes to server directory
4. `npm install` - Installs backend dependencies
5. `npm run prisma:generate` - Generates Prisma Client

## Steps:

1. Go to Render Dashboard → Your Service → Settings
2. Find "Build Command"
3. Click "Edit"
4. Replace with: `npm install && npm run build && cd server && npm install && npm run prisma:generate`
5. Save Changes
6. Render will automatically redeploy

## After Fix:

The build will create the `dist/` folder, and your frontend will be served correctly!

---

**Update the Build Command and redeploy!** 🚀

