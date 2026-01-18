# ☁️ Cloudinary Setup for Render

## Your Cloudinary Credentials

Based on your Cloudinary dashboard:

```
CLOUDINARY_CLOUD_NAME=dx2fxyaft
CLOUDINARY_API_KEY=661233678661536
CLOUDINARY_API_SECRET=PEePosrZMLygFivk04VKF7BcaeA
```

## Steps to Add to Render

1. **Go to Render Dashboard**
   - Navigate to your backend service (`asiabylocals`)

2. **Open Environment Tab**
   - Click on "Environment" in the left sidebar

3. **Add These 3 Variables**

   Click "Add Environment Variable" for each:

   **Variable 1:**
   - Key: `CLOUDINARY_CLOUD_NAME`
   - Value: `dx2fxyaft`

   **Variable 2:**
   - Key: `CLOUDINARY_API_KEY`
   - Value: `661233678661536`

   **Variable 3:**
   - Key: `CLOUDINARY_API_SECRET`
   - Value: `PEePosrZMLygFivk04VKF7BcaeA`

4. **Save Changes**
   - Render will automatically redeploy your service

5. **Verify It Works**

   After redeploy, check the logs. You should see:
   ```
   ☁️  Uploading images to Cloudinary...
   ✅ Uploaded X images to Cloudinary
   ```

   Instead of:
   ```
   ℹ️  Cloudinary not configured, using base64 images
   ```

## What This Fixes

✅ **Before**: Images stored as base64 in database (4-6MB per tour)
✅ **After**: Images stored in Cloudinary (only URLs in database ~100 bytes)

✅ **Before**: Database fills up quickly (150-250 tours max)
✅ **After**: Database stores only text (thousands of tours possible)

## Test It

1. Create a new tour with images
2. Check the database - images should be Cloudinary URLs like:
   ```
   https://res.cloudinary.com/dx2fxyaft/image/upload/v1234567890/tours/agra/image.jpg
   ```
3. Not base64 strings like:
   ```
   data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
   ```

---

**Important**: Keep your API Secret secure! Never commit it to GitHub.

