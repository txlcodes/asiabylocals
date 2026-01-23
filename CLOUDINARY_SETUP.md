# ☁️ Cloudinary Setup Guide

## Why Cloudinary?

Cloudinary provides:
- ✅ **Fast CDN delivery** - Images load quickly worldwide
- ✅ **Automatic optimization** - Images are optimized for web automatically
- ✅ **Free tier** - 25GB storage, 25GB bandwidth/month (perfect for Day 1)
- ✅ **Image transformations** - Resize, crop, format conversion on-the-fly
- ✅ **No database bloat** - Store URLs only, not base64 data

## Architecture

```
Frontend (upload image)
        ↓
Backend (Render)
        ↓
Cloudinary (image storage)
        ↓
Image URL (stored in PostgreSQL)
```

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register
2. Sign up with your email (free account)
3. Verify your email

## Step 2: Get Your Cloudinary Credentials

1. After login, you'll see your **Dashboard**
2. Copy these values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **Keep API Secret safe** - Never commit it to GitHub!

## Step 3: Add Environment Variables to Render

### In Render Dashboard:

1. Go to your **Web Service** → **Environment** tab
2. Add these environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

3. Click **"Save Changes"**
4. Render will automatically redeploy with new environment variables

## Step 4: Install Cloudinary Package

The package is already added to `server/package.json`. After deploying to Render:

1. Render will automatically run `npm install` during build
2. Cloudinary SDK will be installed automatically

## Step 5: Test Image Upload

1. **Create a test tour** with images
2. **Check Render logs** - You should see:
   ```
   ☁️  Uploading images to Cloudinary...
   ✅ Uploaded 4 images to Cloudinary
   ```
3. **Check Cloudinary Dashboard** - Images should appear in:
   - `tours/{city-name}/` folder

## How It Works

### Image Upload Flow:

1. **Frontend**: User selects images → Converts to base64
2. **Backend**: Receives base64 images → Uploads to Cloudinary
3. **Cloudinary**: Stores images → Returns HTTPS URLs
4. **Database**: Stores URLs (not base64) → Much smaller database

### Image Storage Structure:

```
Cloudinary:
└── tours/
    ├── agra/
    │   ├── tours_1234567890_0.jpg
    │   ├── tours_1234567890_1.jpg
    │   └── ...
    ├── delhi/
    │   └── ...
    └── jaipur/
        └── ...
```

### Image URLs Stored in Database:

```json
[
  "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/tours/agra/tours_1234567890_0.jpg",
  "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/tours/agra/tours_1234567890_1.jpg"
]
```

## Cloudinary Free Tier Limits

- ✅ **25GB storage** - Enough for ~10,000 images (2.5MB each)
- ✅ **25GB bandwidth/month** - ~10,000 image views/month
- ✅ **Unlimited transformations** - Resize, crop, optimize
- ✅ **Auto WebP conversion** - Faster loading
- ✅ **CDN delivery** - Fast worldwide

**Upgrade when needed:**
- Paid plans start at $99/month (unlimited storage/bandwidth)

## Troubleshooting

### Images Not Uploading

**Check Render logs:**
```bash
# In Render Dashboard → Logs
# Look for Cloudinary errors
```

**Common issues:**

1. **Missing Environment Variables**
   - Error: `Cloudinary upload error: Missing cloud_name`
   - Fix: Add `CLOUDINARY_CLOUD_NAME` to Render environment variables

2. **Invalid API Key**
   - Error: `Cloudinary upload error: Invalid API key`
   - Fix: Double-check `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`

3. **Base64 Format Error**
   - Error: `Failed to upload image: Invalid image format`
   - Fix: Frontend should send `data:image/jpeg;base64,...` format

### Fallback Behavior

- **Development** (no Cloudinary): Uses base64 images (stored in database)
- **Production** (Cloudinary configured): Uploads to Cloudinary, stores URLs

### Check Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Click **"Media Library"**
3. Browse `tours/` folder
4. Verify images are uploaded correctly

## Image Optimization

Cloudinary automatically:
- ✅ Converts to WebP (when browser supports)
- ✅ Resizes to max 1920x1080px
- ✅ Optimizes quality (auto)
- ✅ Serves via CDN

## Security Best Practices

1. ✅ **Never commit** `.env` files with Cloudinary secrets
2. ✅ **Use environment variables** in Render
3. ✅ **Restrict API access** in Cloudinary dashboard (optional)
4. ✅ **Enable signed URLs** for private images (future enhancement)

## Next Steps

After Cloudinary is set up:

1. ✅ Test tour creation with images
2. ✅ Verify images load on tour detail pages
3. ✅ Check Cloudinary dashboard for uploaded images
4. ✅ Monitor bandwidth usage in Cloudinary dashboard

---

**Need help?** Check Cloudinary docs: https://cloudinary.com/documentation



