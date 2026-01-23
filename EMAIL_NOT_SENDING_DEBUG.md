# 🔍 Email Not Sending - Debug Guide

## Current Status

✅ **Email Service Configured**: Resend is configured in production
✅ **From Email**: `info@asiabylocals.com`
✅ **Test Endpoint**: Returns success (`/api/test-email`)

❌ **Problem**: No emails are being received

## Possible Causes

### 1. Emails Going to Spam 📧

**Check:**
- Check spam/junk folder
- Check "Promotions" tab in Gmail
- Check "All Mail" folder

**Solution:**
- Mark as "Not Spam" if found
- Add `info@asiabylocals.com` to contacts
- Wait 5-10 minutes (email delivery can be delayed)

### 2. Resend API Key Issue 🔑

**Check:**
1. Go to Render Dashboard → Your Service → Environment
2. Verify `RESEND_API_KEY` is set
3. Check if it starts with `re_` (should be ~40 characters)

**Test:**
```bash
curl -X POST https://www.asiabylocals.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

**Check Render Logs:**
- Go to Render Dashboard → Logs
- Look for email sending errors
- Look for: `❌ Error sending verification email`

### 3. Domain Verification Issue 🌐

**Check:**
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Check if `asiabylocals.com` is verified
3. Look for verification status

**If Not Verified:**
- Emails might be blocked or go to spam
- Follow DNS setup guide: `GODADDY_DNS_SETUP_RESEND.md`

### 4. Registration Flow Error 🔄

**Check:**
1. Try registering a new supplier
2. Check Render logs during registration
3. Look for errors in `/api/suppliers/register` endpoint

**Common Errors:**
- `Email sending failed` - Check Resend API key
- `Invalid email address` - Check email format
- `Domain not verified` - Verify domain in Resend

## Debug Steps

### Step 1: Check Render Logs

1. Go to Render Dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for:
   - `📧 Using Resend SDK for email delivery`
   - `✅ Verification email sent successfully`
   - `❌ Error sending verification email`

### Step 2: Test Email Endpoint

```bash
curl -X POST https://www.asiabylocals.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully!",
  "email": "your-email@gmail.com",
  "messageId": "..."
}
```

### Step 3: Check Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com)
2. Click "Logs" or "Activity"
3. Check if emails are being sent
4. Look for delivery status:
   - ✅ Delivered
   - ⏳ Pending
   - ❌ Failed

### Step 4: Verify Domain

1. Go to [Resend Domains](https://resend.com/domains)
2. Check `asiabylocals.com` status
3. If not verified:
   - Click "Verify Domain"
   - Follow DNS setup instructions
   - Add TXT records in GoDaddy

## Quick Fixes

### Fix 1: Regenerate Resend API Key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the new key
4. Update in Render:
   - Go to Environment tab
   - Update `RESEND_API_KEY` value
   - Save (auto-redeploys)

### Fix 2: Verify Domain

1. Follow `GODADDY_DNS_SETUP_RESEND.md`
2. Add DNS records in GoDaddy
3. Wait 24-48 hours for DNS propagation
4. Check verification status in Resend

### Fix 3: Check Email Address

Make sure the email address:
- ✅ Is valid format (`user@domain.com`)
- ✅ Is not blocked
- ✅ Can receive emails
- ✅ Check spam folder

## Check Registration Flow

When a supplier registers:

1. **Backend receives request** → `/api/suppliers/register`
2. **Creates supplier** → Database entry created
3. **Sends verification email** → `sendVerificationEmail()`
4. **Email should arrive** → Check inbox/spam

**Check logs for each step:**
- Step 1: `📥 Received supplier registration request`
- Step 2: `✅ Supplier created: ...`
- Step 3: `📧 Attempting to send verification email`
- Step 4: `✅ Verification email sent successfully` OR `❌ Error sending...`

## Next Steps

1. ✅ Check spam folder
2. ✅ Check Render logs for errors
3. ✅ Verify Resend API key is correct
4. ✅ Check Resend dashboard for delivery status
5. ✅ Verify domain is verified in Resend

## Still Not Working?

If emails still aren't sending:

1. **Check Resend Dashboard** → Logs/Activity
   - See if emails are being sent
   - Check delivery status
   - Look for error messages

2. **Check Render Logs** → Full error details
   - Copy error message
   - Check error code
   - Look for API key errors

3. **Test with Different Email**
   - Try different email provider
   - Try different email address
   - Check if issue is email-specific

4. **Contact Support**
   - Resend support: support@resend.com
   - Render support: support@render.com

