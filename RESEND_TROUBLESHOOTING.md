# 🔍 Resend Email Troubleshooting Guide

## Current Setup

✅ **Using Resend SDK** for all email sending
✅ **From Email**: `info@asiabylocals.com`
✅ **Configured in Production**: Yes

## Common Issues & Solutions

### Issue 1: Emails Not Being Received

**Check These:**

1. **Spam Folder** 📧
   - Check spam/junk folder
   - Check Gmail "Promotions" tab
   - Wait 5-10 minutes (delivery can be delayed)

2. **Resend Dashboard** 🔍
   - Go to: https://resend.com/logs
   - Check if emails are being sent
   - Look for delivery status:
     - ✅ Delivered
     - ⏳ Pending
     - ❌ Failed (with error message)

3. **Render Logs** 📋
   - Go to Render Dashboard → Your Service → Logs
   - Look for:
     - `✅ Verification email sent successfully`
     - `❌ Error sending verification email`
     - `📬 Message ID:` (if present, email was sent)

### Issue 2: Invalid API Key

**Symptoms:**
- Logs show: `❌ Resend API Error: Invalid API key`
- Test endpoint fails

**Solution:**
1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `re_`)
4. Update in Render:
   - Render Dashboard → Environment
   - Update `RESEND_API_KEY` value
   - Save (auto-redeploys)

### Issue 3: Domain Not Verified

**Symptoms:**
- Logs show: `❌ Resend API Error: Domain not verified`
- Emails might be blocked or go to spam

**Solution:**
1. Go to [Resend Domains](https://resend.com/domains)
2. Check `asiabylocals.com` status
3. If not verified:
   - Click "Verify Domain"
   - Follow DNS setup instructions
   - Add TXT records in GoDaddy
   - See: `GODADDY_DNS_SETUP_RESEND.md`

**Note:** Resend works without domain verification, but emails might go to spam.

### Issue 4: Rate Limit Exceeded

**Symptoms:**
- Logs show: `❌ Resend API Error: Rate limit exceeded`
- Emails stop sending

**Solution:**
- **Free Tier Limits:**
  - 100 emails/day
  - 3,000 emails/month
- **Fix:**
  - Wait 24 hours for daily limit reset
  - Wait until next month for monthly limit
  - Upgrade Resend plan for higher limits

### Issue 5: Email Address Issues

**Check:**
- ✅ Email format is correct (`user@domain.com`)
- ✅ Email address is not blocked
- ✅ Email can receive emails (test with another service)
- ✅ Check spam folder

## Debugging Steps

### Step 1: Check Resend Dashboard

1. Go to: https://resend.com/logs
2. Look for recent email attempts
3. Check delivery status
4. Look for error messages

### Step 2: Check Render Logs

1. Go to Render Dashboard → Your Service → Logs
2. Search for: `verification email`
3. Look for:
   - `✅ Verification email sent successfully` → Email was sent
   - `❌ Error sending verification email` → Check error details
   - `📬 Message ID:` → Copy this ID and check in Resend dashboard

### Step 3: Test Email Endpoint

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

**If Error:**
- Check error message in response
- Check Render logs for full error details

### Step 4: Verify API Key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Check if API key exists
3. Check if it's active (not revoked)
4. Verify it matches the one in Render

### Step 5: Check Domain Status

1. Go to [Resend Domains](https://resend.com/domains)
2. Check `asiabylocals.com` status:
   - ✅ Verified → Good
   - ⚠️ Pending → Wait for DNS propagation
   - ❌ Not Verified → Follow DNS setup guide

## Quick Checklist

Before reporting an issue, check:

- [ ] Checked spam folder
- [ ] Checked Resend dashboard logs
- [ ] Checked Render logs for errors
- [ ] Verified API key is correct
- [ ] Verified domain status
- [ ] Tested with different email address
- [ ] Waited 5-10 minutes for delivery

## Still Not Working?

1. **Check Resend Dashboard** → Logs
   - See exact error message
   - Check delivery status
   - Look for API errors

2. **Check Render Logs** → Full error details
   - Copy complete error message
   - Check error code
   - Look for Resend-specific errors

3. **Contact Support**
   - Resend Support: support@resend.com
   - Include Message ID from logs
   - Include error message from logs

## Expected Log Output

**When Working:**
```
📧 Using Resend SDK for email delivery
   RESEND_API_KEY: ✅ Set
   From Email: info@asiabylocals.com
✅ Resend SDK initialized - ready to send messages
📧 Sending via Resend SDK to: user@example.com
   From: info@asiabylocals.com
✅ Verification email sent successfully to user@example.com
📬 Message ID: abc123-def456-ghi789
```

**When Error:**
```
❌ Error sending verification email to user@example.com:
   Error message: Invalid API key
   ⚠️ Resend API Error!
   → RESEND_API_KEY is invalid or expired
   → Go to https://resend.com/api-keys and create a new API key
```

