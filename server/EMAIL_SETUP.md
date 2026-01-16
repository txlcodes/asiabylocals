# Email Setup Guide

## Gmail App Password Setup

To send verification emails via Gmail, you need to set up an App Password (not your regular Gmail password).

### Steps:

1. **Enable 2-Step Verification** (if not already enabled)
   - Go to your Google Account: https://myaccount.google.com
   - Navigate to Security → 2-Step Verification
   - Follow the setup process

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "AsiaByLocals Server" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Update .env file**
   ```env
   EMAIL_USER=asiabylocals@gmail.com
   EMAIL_APP_PASSWORD=your_16_character_app_password
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Note:** Use the business email `asiabylocals@gmail.com` and generate an App Password for this account.

4. **Restart the server**
   ```bash
   npm run dev
   ```

## Alternative Email Services

If you prefer not to use Gmail, you can configure other SMTP services:

### SendGrid
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Mailgun
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
});
```

### AWS SES
```javascript
const transporter = nodemailer.createTransport({
  SES: {
    ses: new AWS.SES(),
    aws: AWS
  }
});
```

## Testing Email

After setup, test the email configuration:

1. Register a new supplier
2. Check the email inbox (and spam folder)
3. Click the verification link
4. Verify the account is activated

## Troubleshooting

- **"Invalid login"**: Make sure you're using App Password, not regular password
- **"Connection timeout"**: Check firewall/network settings
- **Emails in spam**: Add your sending email to contacts
- **Not receiving emails**: Check spam folder, verify email address is correct

