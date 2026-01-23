# Quick Email Setup for asiabylocals@gmail.com

## Step-by-Step Setup

### 1. Access Gmail Account
- Go to https://mail.google.com
- Sign in with: `asiabylocals@gmail.com`

### 2. Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the setup process (you'll need a phone number)

### 3. Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: "AsiaByLocals Server"
3. Click **Generate**
4. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - Remove spaces when adding to .env file

### 4. Update .env File
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/asiabylocals?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:3000

EMAIL_USER=asiabylocals@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

NODE_ENV=development
```

**Important:** 
- Use the 16-character App Password (no spaces)
- Do NOT use your regular Gmail password
- Keep this file secure and never commit it to git

### 5. Test Email Configuration
1. Start the server:
   ```bash
   npm run dev
   ```
2. Register a test supplier
3. Check the inbox of `asiabylocals@gmail.com`
4. You should receive a verification email

### 6. Verify It Works
- Check server logs for: `✅ Email server is ready to send messages`
- After registration, check for: `✅ Verification email sent to [email]`
- Check spam folder if email doesn't arrive

## Troubleshooting

**"Invalid login" error:**
- Make sure you're using App Password, not regular password
- Verify 2-Step Verification is enabled
- Regenerate App Password if needed

**"Connection timeout":**
- Check firewall settings
- Verify internet connection
- Try again after a few minutes

**Not receiving emails:**
- Check spam/junk folder
- Verify email address is correct
- Check server logs for errors
- Make sure App Password is correct

## Security Notes

- Never share your App Password
- App Passwords are safer than regular passwords
- You can revoke App Passwords anytime from Google Account settings
- Each App Password is unique and can be deleted independently




