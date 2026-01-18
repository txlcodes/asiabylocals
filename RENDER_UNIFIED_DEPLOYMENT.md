# 🚀 Render Unified Deployment (Frontend + Backend Together)

## Single Service Setup

Deploy both frontend and backend from **one Render Web Service** - simpler and easier!

## Step 1: Update Render Settings

Go to your existing Web Service (`asiabylocals`) → **Settings**:

### Update Configuration:

**Root Directory:** Change from `server` to `.` (root of repo)

**Build Command:**
```bash
npm install && npm run build && cd server && npm install && npm run prisma:generate
```

**Start Command:**
```bash
cd server && npm start
```

## Step 2: How It Works

1. **Build Command:**
   - Installs root dependencies (React, Vite, etc.)
   - Builds frontend → creates `dist/` folder
   - Installs server dependencies
   - Generates Prisma Client

2. **Start Command:**
   - Runs from `server/` directory
   - Server serves API at `/api/*`
   - Server serves frontend from `dist/` folder
   - All routes (except `/api/*`) serve `index.html` for React Router

## Step 3: Environment Variables

Keep all the same environment variables you already have:
- `DATABASE_URL`
- `PORT`
- `NODE_ENV=production`
- `FRONTEND_URL=https://asiabylocals.onrender.com`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Cloudinary variables (optional)

## Step 4: Deploy

1. Save settings in Render
2. Render will automatically redeploy
3. Your site will be at: `https://asiabylocals.onrender.com`
4. API at: `https://asiabylocals.onrender.com/api/*`
5. Frontend at: `https://asiabylocals.onrender.com/*` (all routes)

## Benefits

✅ **One service** - easier to manage  
✅ **No CORS issues** - same origin  
✅ **No routing problems** - server handles SPA routing  
✅ **Simpler** - one URL for everything  
✅ **Free tier** - still works on free plan  

## After Deployment

- Homepage: `https://asiabylocals.onrender.com`
- City pages: `https://asiabylocals.onrender.com/india/agra`
- API: `https://asiabylocals.onrender.com/api/health`
- Admin: `https://asiabylocals.onrender.com/secure-panel-abl`

---

**Update your Render settings and redeploy!** 🚀

