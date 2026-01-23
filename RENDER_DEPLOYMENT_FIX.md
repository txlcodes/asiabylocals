# 🔧 Render Deployment Fix - Missing Dependencies

## Issue
Render can't find `express` and other dependencies because they're not installed in the `server` directory.

## Root Cause
When Root Directory is set to `.` (root), the build command installs root dependencies, but the server needs its own dependencies.

## Solution: Update Render Settings

### Option 1: Set Root Directory to `server` (BEST)

1. Go to **Render Dashboard**
2. Click on your **Web Service**
3. Go to **Settings** tab
4. Find **"Root Directory"**
5. Change from `.` to: `server`
6. Update **Build Command** to:
   ```bash
   npm install && npm run prisma:generate
   ```
7. Update **Start Command** to:
   ```bash
   npm start
   ```
8. Click **"Save Changes"**
9. Render will automatically redeploy

### Option 2: Keep Root Directory as `.` (Alternative)

If you want to keep root directory as `.`, update:

**Build Command:**
```bash
cd server && npm install && npm run prisma:generate
```

**Start Command:**
```bash
cd server && node server.js
```

## Recommended Configuration

**Root Directory:** `server`

**Build Command:**
```bash
npm install && npm run prisma:generate
```

**Start Command:**
```bash
npm start
```

## Why This Works

- When Root Directory is `server`, Render runs all commands from `server/` directory
- `npm install` installs dependencies to `server/node_modules`
- `npm start` runs `node server.js` which can find all dependencies

## After Fixing

1. Render will automatically redeploy
2. Check logs - should see dependencies installing
3. Should see: `🚀 Server running on http://localhost:3001`
4. Test: `https://your-api.onrender.com/api/health`

---

**The fix is in the code (updated start script), but you MUST set Root Directory to `server` in Render settings!**



