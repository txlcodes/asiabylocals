# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Current Status
- [x] Frontend build working (`npm run build`)
- [x] Backend server running (`npm start`)
- [x] Database schema migrated
- [x] Email notifications configured
- [x] Admin authentication working
- [x] Booking system functional
- [x] Payment integration ready

## Step 1: Choose Your Hosting Platform

### Option A: Vercel (Frontend) + Railway/Render (Backend) - **Recommended**
- **Frontend**: Vercel (free tier available, automatic deployments)
- **Backend**: Railway or Render (PostgreSQL included)
- **Database**: Included with Railway/Render

### Option B: DigitalOcean App Platform
- Full-stack deployment in one place
- Managed PostgreSQL database
- Auto-scaling

### Option C: AWS/GCP/Azure
- More control, more setup required
- Better for enterprise scale

## Step 2: Database Migration (SQLite → PostgreSQL)

**⚠️ IMPORTANT**: Production requires PostgreSQL, not SQLite.

### 2.1 Update Prisma Schema

Edit `server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2.2 Create Production Database

**On Railway/Render:**
- Database is automatically created when you add PostgreSQL service
- Copy the `DATABASE_URL` connection string

**On DigitalOcean:**
- Create a Managed PostgreSQL database
- Copy the connection string

**Manual PostgreSQL:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE asiabylocals_prod;

# Exit
\q
```

### 2.3 Run Migrations

```bash
cd server

# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/asiabylocals_prod"

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npm run prisma:seed
```

## Step 3: Environment Variables

### 3.1 Backend Environment Variables (`server/.env`)

Create `server/.env` with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/asiabylocals_prod"

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Email (Gmail)
EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!

# Razorpay (if using real payments)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3.2 Frontend Environment Variables

Create `.env.production` in root:

```env
VITE_API_URL=https://your-backend-url.com
VITE_FRONTEND_URL=https://yourdomain.com
```

## Step 4: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be in `dist/` folder
```

## Step 5: Deploy Backend

### Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project:**
   ```bash
   cd server
   railway init
   ```

3. **Add PostgreSQL:**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL` automatically

4. **Set Environment Variables:**
   - In Railway dashboard, go to "Variables"
   - Add all variables from Step 3.1

5. **Deploy:**
   ```bash
   railway up
   ```

### Render Deployment

1. **Create New Web Service:**
   - Connect your GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install && npm run prisma:generate`
   - Start Command: `npm start`

2. **Add PostgreSQL Database:**
   - Create new PostgreSQL database
   - Copy `DATABASE_URL` to environment variables

3. **Set Environment Variables:**
   - Add all variables from Step 3.1

4. **Deploy:**
   - Render will auto-deploy on git push

### Manual Deployment (VPS)

```bash
# On your server
cd /var/www/asiabylocals/server

# Install dependencies
npm install --production

# Set environment variables
nano .env  # Add all variables

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate deploy

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name asiabylocals-api
pm2 save
pm2 startup
```

## Step 6: Deploy Frontend

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   # In project root
   vercel --prod
   ```

3. **Set Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add `VITE_API_URL` and `VITE_FRONTEND_URL`

4. **Update API URLs:**
   - Update `server/server.js` CORS to allow your Vercel domain
   - Update `FRONTEND_URL` in backend `.env`

### Netlify Deployment

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables:**
   - Add `VITE_API_URL` and `VITE_FRONTEND_URL`

3. **Deploy:**
   - Connect GitHub repo
   - Netlify will auto-deploy

## Step 7: Update CORS & URLs

### Update Backend CORS

In `server/server.js`, update CORS to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000' // Keep for local testing
  ],
  credentials: true
}));
```

### Update Email Links

Ensure `FRONTEND_URL` in backend `.env` matches your production frontend URL.

## Step 8: Security Checklist

- [ ] **Change Admin Password**: Update `ADMIN_PASSWORD` in production
- [ ] **Use HTTPS**: All production URLs should use HTTPS
- [ ] **Environment Variables**: Never commit `.env` files
- [ ] **Database**: Use strong database passwords
- [ ] **Rate Limiting**: Already implemented for admin login
- [ ] **CORS**: Only allow your frontend domain
- [ ] **SQL Injection**: Using Prisma (parameterized queries) ✅
- [ ] **Password Hashing**: Using bcrypt ✅

## Step 9: Post-Deployment Testing

### Test Checklist

1. **Frontend:**
   - [ ] Homepage loads
   - [ ] City pages work
   - [ ] Tour detail pages load
   - [ ] Booking flow works
   - [ ] Supplier registration works
   - [ ] Supplier login works

2. **Backend:**
   - [ ] API endpoints respond
   - [ ] Database connections work
   - [ ] Email sending works
   - [ ] Admin login works
   - [ ] File uploads work

3. **Integration:**
   - [ ] Booking creation sends emails
   - [ ] Payment verification works
   - [ ] Admin notifications work

## Step 10: Monitoring & Maintenance

### Set Up Monitoring

1. **Error Tracking:**
   - Consider Sentry or similar
   - Monitor server logs

2. **Uptime Monitoring:**
   - Use UptimeRobot or Pingdom
   - Monitor API endpoints

3. **Database Backups:**
   - Railway/Render: Automatic backups
   - Manual: Set up cron jobs for pg_dump

### Maintenance Tasks

- **Regular Updates:**
  ```bash
  npm update
  npm audit fix
  ```

- **Database Migrations:**
  ```bash
  npx prisma migrate deploy
  ```

- **Log Monitoring:**
  - Check server logs regularly
  - Monitor error rates

## Quick Deploy Commands Summary

```bash
# 1. Build frontend
npm run build

# 2. Update Prisma schema for PostgreSQL
# Edit server/prisma/schema.prisma: provider = "postgresql"

# 3. Set environment variables
# Create server/.env with all required variables

# 4. Generate Prisma Client
cd server
npm run prisma:generate

# 5. Run migrations
npx prisma migrate deploy

# 6. Deploy backend (Railway example)
railway up

# 7. Deploy frontend (Vercel example)
cd ..
vercel --prod
```

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format
- Verify database is accessible from your hosting IP
- Check firewall rules

### Email Not Sending
- Verify Gmail App Password is correct
- Check spam folder
- Verify `EMAIL_USER` and `EMAIL_APP_PASSWORD` are set

### CORS Errors
- Update CORS origin in `server/server.js`
- Verify `FRONTEND_URL` matches actual frontend URL

### Build Failures
- Check Node.js version (requires v18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

## Need Help?

Common issues:
1. **"Cannot connect to database"**: Check DATABASE_URL and network access
2. **"Email not sending"**: Verify Gmail App Password setup
3. **"CORS errors"**: Update CORS configuration in server.js
4. **"Build fails"**: Check Node.js version and dependencies

---

**Ready to deploy?** Start with Step 1 and work through each step systematically!



