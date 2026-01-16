# 🚀 Setup Email Now - Quick Guide

## You need to do these 3 steps:

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Sign in with: **asiabylocals@gmail.com**
3. Click "2-Step Verification" and enable it

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **AsiaByLocals Server**
3. Click **Generate**
4. **Copy the 16-character password** (like: `abcd efgh ijkl mnop`)
   - ⚠️ You won't see it again!

### Step 3: Add to .env File
1. Open: `server/.env`
2. Find this line:
   ```
   EMAIL_APP_PASSWORD=your_gmail_app_password_here
   ```
3. Replace `your_gmail_app_password_here` with your App Password (remove spaces)
4. Save the file

### Step 4: Test It!
1. Start the server:
   ```bash
   cd server
   npm run dev
   ```
2. Look for: `✅ Email server is ready to send messages`
3. Register a test account
4. Check `asiabylocals@gmail.com` inbox!

---

**That's it!** Once you add the App Password, emails will work automatically.


