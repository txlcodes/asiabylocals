# Email Testing Guide

## ✅ Email Configuration Status

- **Email User:** `asiabylocals@gmail.com` ✅
- **App Password:** Configured ✅
- **From Address:** `"AsiaByLocals" <asiabylocals@gmail.com>` ✅

## 📧 How to Test Email Sending

### Step 1: Start the Server
```bash
cd server
npm run dev
```

Look for this message:
```
✅ Email server is ready to send messages
```

### Step 2: Register a Test Account

1. Go to: http://localhost:3000
2. Click "Become a supplier"
3. Complete the registration form
4. Use a real email address (Gmail, Yahoo, etc.)
5. Submit the form

### Step 3: Check Email

1. **Check the email inbox** you used for registration
2. **Look for email from:** `asiabylocals@gmail.com`
3. **Subject:** "Verify Your AsiaByLocals Account"
4. **Check spam folder** if not in inbox

### Step 4: Verify Server Logs

After registration, check the server console for:
```
✅ Verification email sent to [your-email]
```

## 🔍 Troubleshooting "Can't Continue" Issue

The Continue button is disabled if:

1. **First Name** is empty
2. **Last Name** is empty  
3. **Email** is empty or invalid
4. **Password** doesn't meet ALL requirements:
   - ✅ Between 8-30 characters
   - ✅ Has a number (0-9)
   - ✅ Has a special character (!@#$%^&*)
   - ✅ Has uppercase letter (A-Z)
   - ✅ Has lowercase letter (a-z)
   - ✅ No blank spaces
   - ✅ Doesn't contain part of email address
5. **Terms checkbox** is not checked

## 📝 Example Valid Password

```
MyPass123!
```
- ✅ 10 characters
- ✅ Has number: 123
- ✅ Has special: !
- ✅ Has uppercase: M, P
- ✅ Has lowercase: y, a, s, s
- ✅ No spaces
- ✅ Doesn't match email

## 🎯 Quick Test

Try this password: `Test123!@#`

This should meet all requirements and enable the Continue button.

---

**Email is configured correctly!** When you register, emails will be sent from `asiabylocals@gmail.com`.


