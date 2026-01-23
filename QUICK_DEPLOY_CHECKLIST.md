# ⚡ Quick Deployment Checklist

## Before You Deploy - Critical Steps

### 1. Database Migration (REQUIRED)
**Current**: Using SQLite (`dev.db`)  
**Production**: Must use PostgreSQL

**Action Required:**
```bash
# Edit server/prisma/schema.prisma
# Change line 6 from:
provider = "sqlite"
# To:
provider = "postgresql"
```

### 2. Environment Variables Setup

**Backend (`server/.env`):**
```env
DATABASE_URL="postgresql://user:pass@host:5432/asiabylocals"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeThisToSecurePassword!
```

**Frontend (`.env.production`):**
```env
VITE_API_URL=https://your-backend-url.com
VITE_FRONTEND_URL=https://yourdomain.com
```

### 3. Update Frontend API URLs

**Option A: Use Environment Variables (Recommended)**
- All frontend files already check `import.meta.env.VITE_API_URL`
- Just set `VITE_API_URL` in your hosting platform's environment variables

**Option B: Find & Replace Before Deploy**
- Search for `http://localhost:3001` in all `.tsx` files
- Replace with your production API URL

### 4. Update CORS in Backend

In `server/server.js`, find the CORS configuration and add your frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true
}));
```

### 5. Build & Deploy

**Frontend:**
```bash
npm run build
# Deploy the `dist/` folder
```

**Backend:**
```bash
cd server
npm install --production
npm run prisma:generate
npx prisma migrate deploy
npm start
```

## Recommended Hosting Stack

### Easiest Option:
- **Frontend**: Vercel (free, auto-deploy from GitHub)
- **Backend**: Railway (free tier, PostgreSQL included)
- **Total Cost**: $0/month

### Steps:
1. Push code to GitHub
2. Connect Railway → GitHub → Deploy backend
3. Connect Vercel → GitHub → Deploy frontend
4. Set environment variables in both platforms
5. Done! 🎉

## Critical Security Items

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Use HTTPS (automatic on Vercel/Railway)
- [ ] Never commit `.env` files
- [ ] Use strong database passwords
- [ ] Enable 2FA on admin account (if possible)

## Testing After Deployment

1. Visit homepage → Should load
2. Try supplier registration → Should work
3. Check email → Verification email should arrive
4. Login as supplier → Should work
5. Create a tour → Should work
6. Admin login → Should work
7. Test booking flow → End-to-end test

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.



