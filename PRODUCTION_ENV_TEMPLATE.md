# 🌐 Production Environment Variables

## Frontend Environment Variables

**For Vercel/Render Static Site/Netlify:**

```env
VITE_API_URL=https://asiabylocals-api.onrender.com
VITE_FRONTEND_URL=https://asiabylocals.com
```

**Or if using custom domain:**

```env
VITE_API_URL=https://api.asiabylocals.com
VITE_FRONTEND_URL=https://asiabylocals.com
```

## Backend Environment Variables (Render)

**In Render Dashboard → Your Web Service → Environment:**

```env
# Database (INTERNAL URL for Render services)
DATABASE_URL=postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a/asiabylocals

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://asiabylocals.com

# Email Configuration (Gmail)
EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (Payment Gateway - Optional)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Important Notes

### 1. Frontend URL Format
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash
- ✅ Use your actual domain name

### 2. API URL Format
- ✅ Use `https://` (not `http://`)
- ✅ Include full domain: `https://asiabylocals-api.onrender.com`
- ✅ No trailing slash

### 3. Database URL
- ✅ Use **INTERNAL URL** for Render services (faster)
- ✅ Use **EXTERNAL URL** only for local development

### 4. Security
- ⚠️ **Never commit** `.env` files to GitHub
- ⚠️ **Change admin password** before going live
- ⚠️ **Use strong passwords** for all credentials

## Setting Up in Render

### Step 1: Add Environment Variables

1. Go to Render Dashboard
2. Select your Web Service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add each variable one by one

### Step 2: Link Database (Alternative)

Instead of manually adding `DATABASE_URL`:
1. Click **"Link Database"** button
2. Select your PostgreSQL database
3. Render automatically adds `DATABASE_URL`

### Step 3: Redeploy

After adding environment variables:
- Render will automatically redeploy
- Or click **"Manual Deploy"** → **"Deploy latest commit"**

## Setting Up in Vercel

### Step 1: Add Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_API_URL`
   - `VITE_FRONTEND_URL`
5. Select **Production** environment
6. Click **"Save"**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger auto-deploy

## Testing Production URLs

### Test Frontend:
```bash
# Should load homepage
curl https://asiabylocals.com

# Should return JSON
curl https://asiabylocals-api.onrender.com/api/health
```

### Test API Connection:
```bash
# Health check
curl https://asiabylocals-api.onrender.com/api/health

# Should return:
# {"status":"ok","message":"AsiaByLocals API is running","database":"connected"}
```

## Common Issues

### CORS Errors
- **Problem**: Frontend can't connect to API
- **Solution**: Add frontend URL to `FRONTEND_URL` in backend environment variables
- **Check**: Backend CORS configuration in `server/server.js`

### Database Connection Failed
- **Problem**: `Cannot connect to database`
- **Solution**: Check `DATABASE_URL` is correct (use INTERNAL URL for Render)
- **Check**: Database is running in Render dashboard

### Images Not Loading
- **Problem**: Images return 404 or don't load
- **Solution**: Check Cloudinary credentials are set
- **Check**: Cloudinary dashboard for uploaded images

### Email Not Sending
- **Problem**: Verification emails not received
- **Solution**: Check `EMAIL_USER` and `EMAIL_APP_PASSWORD` are correct
- **Check**: Gmail App Password is enabled (not regular password)

---

**Ready to go live?** Set these environment variables and deploy! 🚀

