# 📧 Render Email Environment Variables Checklist

## ✅ Required Environment Variables for Email

**Go to:** Render Dashboard → Your Web Service → **Environment** tab

### 1. Email Configuration (REQUIRED)

```env
EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

**Important:**
- ✅ `EMAIL_USER` = Your Gmail address (e.g., `asiabylocals@gmail.com`)
- ✅ `EMAIL_APP_PASSWORD` = Gmail App Password (16 characters, no spaces)
- ❌ **NOT** your regular Gmail password!
- ❌ **NOT** your Gmail account password!

### 2. Frontend URL (REQUIRED for email links)

```env
FRONTEND_URL=https://www.asiabylocals.com
```

**Or if using Render subdomain:**
```env
FRONTEND_URL=https://asiabylocals.onrender.com
```

**Important:**
- ✅ Must start with `https://`
- ✅ No trailing slash
- ✅ This is used in verification email links

---

## 🔍 How to Verify in Render

### Step 1: Check Environment Variables

1. Go to **Render Dashboard**
2. Click on your **Web Service** (asiabylocals)
3. Click **"Environment"** tab
4. Look for these variables:

| Variable | Status | Value |
|----------|--------|-------|
| `EMAIL_USER` | ✅/❌ | Should show: `asiabylocals@gmail.com` |
| `EMAIL_APP_PASSWORD` | ✅/❌ | Should show: `****` (hidden, 16 chars) |
| `FRONTEND_URL` | ✅/❌ | Should show: `https://www.asiabylocals.com` |

### Step 2: Check Server Logs

After deployment, check the **Logs** tab. You should see:

**✅ If configured correctly:**
```
📧 Email configuration found:
   EMAIL_USER: asiabylocals@gmail.com
   EMAIL_APP_PASSWORD: ✅ Set (16 chars)
✅ Email server is ready to send messages
```

**❌ If NOT configured:**
```
⚠️ Email credentials not configured!
   EMAIL_USER: ❌ Missing
   EMAIL_APP_PASSWORD: ❌ Missing
❌ Email transporter verification failed:
   ⚠️ Authentication failed! Check EMAIL_USER and EMAIL_APP_PASSWORD
```

---

## 🔑 How to Get Gmail App Password

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Sign in with: `asiabylocals@gmail.com`
3. Find **"2-Step Verification"**
4. Click and follow setup (need phone number)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: "AsiaByLocals Server"
3. Click **Generate**
4. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - ⚠️ **Remove all spaces** when adding to Render
   - ⚠️ You won't see it again!

### Step 3: Add to Render

1. In Render → Environment tab
2. Click **"Add Environment Variable"**
3. Key: `EMAIL_APP_PASSWORD`
4. Value: `abcdefghijklmnop` (16 chars, no spaces)
5. Click **"Save Changes"**

---

## 🧪 Test Email Configuration

### After Adding Variables:

1. **Redeploy** (Render will auto-redeploy after saving env vars)
2. **Check Logs** for email configuration status
3. **Register a test supplier** through the website
4. **Check email inbox** (and spam folder) for verification email

### Expected Log Output:

```
📧 Email configuration found:
   EMAIL_USER: asiabylocals@gmail.com
   EMAIL_APP_PASSWORD: ✅ Set (16 chars)
✅ Email server is ready to send messages
📧 Attempting to send verification email to: test@example.com
✅ Verification email sent successfully to test@example.com
📬 Message ID: <message-id>
```

---

## ❌ Common Issues

### Issue 1: "Connection timeout"
- **Cause**: Gmail SMTP blocked by Render's network
- **Solution**: Already fixed with port 465 (SSL)
- **Check**: Logs should show connection success

### Issue 2: "Authentication failed"
- **Cause**: Wrong password or not using App Password
- **Solution**: 
  - Make sure you're using **App Password**, not regular password
  - Verify 2-Step Verification is enabled
  - Regenerate App Password if needed

### Issue 3: "Email credentials not configured"
- **Cause**: Environment variables not set in Render
- **Solution**: Add `EMAIL_USER` and `EMAIL_APP_PASSWORD` in Render

### Issue 4: "Invalid email address"
- **Cause**: `EMAIL_USER` format is wrong
- **Solution**: Should be: `asiabylocals@gmail.com` (no spaces, correct format)

---

## 📋 Complete Environment Variables List

Here's the **complete list** of all environment variables you should have in Render:

```env
# Database
DATABASE_URL=postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a/asiabylocals

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://www.asiabylocals.com

# Email (REQUIRED FOR EMAILS TO WORK)
EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=dx2fxyaft
CLOUDINARY_API_KEY=661233678661536
CLOUDINARY_API_SECRET=PEePosrZMLygFivk04VKF7BcaeA

# Razorpay (Optional - for payments)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## ✅ Quick Checklist

Before going live, verify:

- [ ] `EMAIL_USER` is set to `asiabylocals@gmail.com`
- [ ] `EMAIL_APP_PASSWORD` is set (16 characters, no spaces)
- [ ] `FRONTEND_URL` is set to your production URL
- [ ] 2-Step Verification is enabled on Gmail
- [ ] App Password was generated correctly
- [ ] Server logs show "✅ Email server is ready to send messages"
- [ ] Test registration sends verification email successfully

---

**Need help?** Check the server logs after deployment to see the exact error message!

