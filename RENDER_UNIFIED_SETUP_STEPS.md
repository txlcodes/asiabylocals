# 🚀 Render Unified Setup - Final Steps

## Update Your Web Service Settings

Go to Render Dashboard → Your Web Service (`asiabylocals`) → **Settings** tab

### Step 1: Update Root Directory

1. Find **"Root Directory"** field
2. Change from `server` to: `.` (just a dot - means root of repo)
3. This tells Render to run commands from the root directory

### Step 2: Update Build Command

1. Find **"Build Command"** field
2. Replace with:
   ```bash
   npm install && npm run build && cd server && npm install && npm run prisma:generate
   ```
3. This will:
   - Install frontend dependencies
   - Build frontend (creates `dist/` folder)
   - Install backend dependencies
   - Generate Prisma Client

### Step 3: Update Start Command

1. Find **"Start Command"** field
2. Replace with:
   ```bash
   cd server && npm start
   ```
3. This runs the server from `server/` directory

### Step 4: Update Environment Variables

Make sure `FRONTEND_URL` is set to your main service URL:
```
FRONTEND_URL=https://asiabylocals.onrender.com
```

### Step 5: Save and Deploy

1. Click **"Save Changes"** at the bottom
2. Render will automatically redeploy
3. Wait for build to complete (~5-7 minutes)

## After Deployment

Your site will be live at:
- **Homepage**: `https://asiabylocals.onrender.com`
- **City Pages**: `https://asiabylocals.onrender.com/india/agra`
- **API**: `https://asiabylocals.onrender.com/api/health`
- **Admin**: `https://asiabylocals.onrender.com/secure-panel-abl`

## Test Checklist

After deployment:
- [ ] Homepage loads
- [ ] City pages work (`/india/agra`)
- [ ] Tours display
- [ ] API works (`/api/health`)
- [ ] Admin panel accessible
- [ ] Supplier registration works

---

**Update these 3 settings and you're live!** 🎉

