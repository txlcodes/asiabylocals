# Email Setup Instructions for asiabylocals@gmail.com

## ✅ Quick Setup Steps

### Step 1: Enable 2-Step Verification on Gmail

1. Go to: https://myaccount.google.com/security
2. Sign in with: `asiabylocals@gmail.com`
3. Find "2-Step Verification" and click it
4. Follow the setup process (you'll need a phone number)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: "AsiaByLocals Server"
3. Click **Generate**
4. **IMPORTANT:** Copy the 16-character password immediately (it looks like: `abcd efgh ijkl mnop`)
   - You won't be able to see it again!
   - Remove all spaces when using it

### Step 3: Create .env File

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create the .env file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add:
   ```env
   EMAIL_USER=asiabylocals@gmail.com
   EMAIL_APP_PASSWORD=your_16_character_app_password_here
   FRONTEND_URL=http://localhost:3000
   ```

   **Replace `your_16_character_app_password_here` with the actual App Password (no spaces)**

### Step 4: Test Email

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Look for this message in the console:
   ```
   ✅ Email server is ready to send messages
   ```

3. Register a test supplier through the frontend

4. Check the `asiabylocals@gmail.com` inbox for the verification email

## 🔍 Verification Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] `.env` file created in `server/` directory
- [ ] `EMAIL_USER=asiabylocals@gmail.com` in .env
- [ ] `EMAIL_APP_PASSWORD=...` (16 characters, no spaces) in .env
- [ ] Server shows "✅ Email server is ready to send messages"
- [ ] Test registration sends verification email

## ❌ Troubleshooting

### "Invalid login" or "Authentication failed"
- ✅ Make sure you're using the **App Password**, not your regular Gmail password
- ✅ Verify 2-Step Verification is enabled
- ✅ Check that there are no spaces in the App Password
- ✅ Regenerate App Password if needed

### "Connection timeout"
- ✅ Check your internet connection
- ✅ Verify firewall isn't blocking port 587/465
- ✅ Try again after a few minutes

### Email not received
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Check server logs for errors
- ✅ Make sure App Password is correct in .env

### Server shows error on startup
- ✅ Make sure `.env` file exists in `server/` directory
- ✅ Check that all environment variables are set
- ✅ Restart the server after updating .env

## 📧 Email Templates

The system sends two types of emails:

1. **Verification Email** - Sent when a supplier registers
   - Subject: "Verify Your AsiaByLocals Account"
   - Contains verification link (expires in 24 hours)

2. **Welcome Email** - Sent after email verification
   - Subject: "Welcome to AsiaByLocals - Your Account is Verified!"
   - Confirms account activation

Both emails are sent from: `asiabylocals@gmail.com`

## 🔒 Security Notes

- ⚠️ **Never commit the .env file to git** (it's already in .gitignore)
- ⚠️ **Never share your App Password**
- ✅ App Passwords are safer than regular passwords
- ✅ You can revoke App Passwords anytime from Google Account settings
- ✅ Each App Password is unique and can be deleted independently

---

**Need help?** Check the server logs for detailed error messages.




