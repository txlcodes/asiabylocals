# 🚀 Render Deployment Guide

## Yes, the Database Will Be Live! ✅

When you deploy to Render, you'll get:
- **Backend API**: Live web service
- **PostgreSQL Database**: Fully managed, production-ready database
- **Frontend**: Can deploy separately or serve from backend

## Step-by-Step Render Deployment

### Part 1: Deploy PostgreSQL Database (FREE tier available)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"PostgreSQL"**
3. **Configure Database:**
   - **Name**: `asiabylocals-db`
   - **Database**: `asiabylocals` (auto-created)
   - **User**: Auto-generated
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: Free tier (or paid for production)

4. **Copy Database URL:**
   - After creation, Render will show `DATABASE_URL`
   - Format: `postgresql://user:password@host:5432/asiabylocals`
   - **SAVE THIS** - you'll need it!

### Part 2: Deploy Backend API

1. **Create New Web Service:**
   - Click "New +" → **"Web Service"**
   - Connect your GitHub repository: `txlcodes/asiabylocals`

2. **Configure Service:**
   - **Name**: `asiabylocals`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `.` (root of repo) ⚠️ **IMPORTANT - Changed from `server`**
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && cd server && npm install && npm run prisma:generate
     ```
   - **Start Command**: 
     ```bash
     cd server && npm start
     ```

3. **Environment Variables** (Add these in Render dashboard):
   ```env
   # Database (from PostgreSQL service)
   # Use INTERNAL URL for Render services (faster, no internet routing)
   DATABASE_URL=postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a/asiabylocals
   
   # OR use EXTERNAL URL if connecting from outside Render:
   # DATABASE_URL=postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals
   
   # Server
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.onrender.com
   
   # Email (Gmail)
   EMAIL_USER=asiabylocals@gmail.com
   EMAIL_APP_PASSWORD=your_gmail_app_password_here
   
   # Admin Credentials (CHANGE THESE!)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourSecurePassword123!
   
   # Cloudinary (Image Storage) - REQUIRED for production
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Razorpay (if using real payments)
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
   
   **📸 Cloudinary Setup:**
   - Sign up at https://cloudinary.com (free tier: 25GB storage)
   - Get credentials from Cloudinary Dashboard
   - See `CLOUDINARY_SETUP.md` for detailed instructions

4. **Link Database:**
   - In the Web Service settings, click **"Link Database"**
   - Select your PostgreSQL database
   - This automatically adds `DATABASE_URL` to environment variables

5. **Deploy:**
   - Click **"Create Web Service"**
   - Render will automatically deploy
   - Wait for build to complete (~2-3 minutes)

6. **Run Database Migrations:**
   - After first deployment, go to **"Shell"** tab in Render dashboard
   - Run:
     ```bash
     cd server
     npx prisma migrate deploy
     ```
   - This creates all tables in your production database

### Part 3: Deploy Frontend

**Option A: Deploy Frontend on Render (Recommended)**

1. **Create New Static Site:**
   - Click "New +" → **"Static Site"**
   - Connect GitHub: `txlcodes/asiabylocals`

2. **Configure:**
   - **Name**: `asiabylocals-frontend`
   - **Root Directory**: `.` (root of repo)
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`
   - **Redirects/Rewrites**: Add redirect rule in Render settings:
     - Pattern: `/*`
     - Destination: `/index.html`
     - Status: `200`
     - This handles client-side routing (React Router)

3. **Environment Variables:**
   ```env
   VITE_API_URL=https://asiabylocals-api.onrender.com
   VITE_FRONTEND_URL=https://asiabylocals-frontend.onrender.com
   ```

4. **Deploy:**
   - Click **"Create Static Site"**
   - Render will build and deploy automatically

**Option B: Deploy Frontend on Vercel (Alternative - Free & Fast)**

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```env
   VITE_API_URL=https://asiabylocals-api.onrender.com
   VITE_FRONTEND_URL=https://your-domain.vercel.app
   ```
5. Deploy!

### Part 4: Update CORS Configuration

After deploying, update `server/server.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://asiabylocals-frontend.onrender.com',
    'https://your-domain.vercel.app', // If using Vercel
    'http://localhost:3000' // Keep for local development
  ],
  credentials: true
}));
```

Then push changes and Render will auto-deploy.

## Post-Deployment Checklist

### ✅ Database Setup
- [ ] Database created on Render
- [ ] Migrations run (`npx prisma migrate deploy`)
- [ ] Database URL added to environment variables
- [ ] Test connection (check `/api/health` endpoint)

### ✅ Backend Setup
- [ ] Backend deployed and running
- [ ] All environment variables set
- [ ] CORS updated for frontend domain
- [ ] Email sending works (test supplier registration)
- [ ] Admin login works

### ✅ Frontend Setup
- [ ] Frontend deployed
- [ ] API URL environment variable set
- [ ] Homepage loads correctly
- [ ] Can navigate to city pages
- [ ] Can view tour details

### ✅ Testing
- [ ] Supplier registration works
- [ ] Supplier login works
- [ ] Tour creation works
- [ ] Booking flow works
- [ ] Admin panel accessible
- [ ] Email notifications sent

## Render Free Tier Limits

**PostgreSQL Database:**
- ✅ 90 days free trial
- ✅ 1GB storage
- ✅ Automatic backups
- ⚠️ After trial: $7/month

**Web Service:**
- ✅ Free tier available
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes ~30 seconds
- 💡 **Solution**: Use Render's "Always On" ($7/month) for production

**Static Site:**
- ✅ Free tier available
- ✅ Unlimited bandwidth
- ✅ Auto-deploy from GitHub

## Cost Estimate

**Free Option:**
- PostgreSQL: Free for 90 days, then $7/month
- Web Service: Free (with spin-down)
- Static Site: Free
- **Total**: $0 for 90 days, then $7/month

**Production Option (Recommended):**
- PostgreSQL: $7/month
- Web Service (Always On): $7/month
- Static Site: Free
- **Total**: $14/month

## Troubleshooting

### Database Connection Issues
```bash
# Check if DATABASE_URL is set correctly
# In Render Shell, run:
echo $DATABASE_URL

# Test connection:
cd server
npx prisma studio
```

### Build Failures
- Check Node.js version (Render uses v18+)
- Check build logs in Render dashboard
- Ensure `package.json` has correct scripts

### CORS Errors
- Update CORS in `server/server.js`
- Add your frontend URL to allowed origins
- Redeploy backend

### Email Not Sending
- Verify Gmail App Password is correct
- Check `EMAIL_USER` and `EMAIL_APP_PASSWORD` are set
- Check Render logs for email errors

## Quick Commands

```bash
# Run migrations in production
cd server
npx prisma migrate deploy

# Generate Prisma Client
npm run prisma:generate

# View database (Prisma Studio)
npx prisma studio
```

## Next Steps After Deployment

1. **Set up custom domain** (optional):
   - Add domain in Render dashboard
   - Update DNS records
   - Update CORS and environment variables

2. **Enable HTTPS** (automatic on Render):
   - ✅ Already enabled by default

3. **Set up monitoring**:
   - Use Render's built-in logs
   - Consider Sentry for error tracking

4. **Backup strategy**:
   - Render PostgreSQL has automatic backups
   - Consider manual backups for critical data

---

**Ready to deploy?** Start with Part 1 (PostgreSQL Database) and work through each step!

