# 📧 SendGrid Setup Guide (Recommended for Render)

Gmail SMTP is timing out on Render. **SendGrid is the recommended solution** for reliable email delivery from cloud providers.

## ✅ Why SendGrid?

- ✅ **Free tier**: 100 emails/day forever
- ✅ **Designed for cloud providers**: Works perfectly with Render
- ✅ **No connection timeouts**: Reliable SMTP service
- ✅ **Better deliverability**: Emails less likely to go to spam
- ✅ **Easy setup**: Just need an API key

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up with your email (use `asiabylocals@gmail.com`)
3. Verify your email address

### Step 2: Create API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. Name it: `AsiaByLocals Production`
4. Select **"Full Access"** (or "Restricted Access" → "Mail Send")
5. Click **"Create & View"**
6. **Copy the API key immediately** (you won't see it again!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Email (Required)

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders/new
2. Click **"Verify a Single Sender"**
3. Fill in:
   - **From Email Address**: `noreply@asiabylocals.com` (or your domain email)
   - **From Name**: `AsiaByLocals`
   - **Reply To**: `asiabylocals@gmail.com`
   - **Company Address**: Your business address
4. Click **"Create"**
5. **Check your email** and click the verification link

**Note**: If you don't have a custom domain email, you can use `asiabylocals@gmail.com` but you'll need to verify it.

### Step 4: Add to Render

1. Go to **Render Dashboard** → Your Web Service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: Your SendGrid API key (starts with `SG.`)
4. Click **"Save Changes"**
5. Render will automatically redeploy

### Step 5: Test

After deployment, test the email endpoint:

```bash
curl -X POST https://www.asiabylocals.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

## ✅ Expected Result

**Server Logs:**
```
📧 Using SendGrid for email delivery
   SENDGRID_API_KEY: ✅ Set
✅ Email server is ready to send messages
```

**Test Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully!",
  "email": "your-email@gmail.com",
  "messageId": "..."
}
```

## 🔄 Migration from Gmail

The code automatically detects SendGrid if `SENDGRID_API_KEY` is set. You can:

1. **Keep Gmail variables** (as backup) - SendGrid will be used first
2. **Remove Gmail variables** - Only SendGrid will be used
3. **Use both** - SendGrid takes priority

## 📊 SendGrid Free Tier Limits

- ✅ **100 emails/day** - Perfect for starting out
- ✅ **Unlimited contacts**
- ✅ **Email API access**
- ✅ **Email analytics**

**Upgrade when needed:**
- 50,000 emails/month = $19.95/month
- 100,000 emails/month = $89.95/month

## ❌ Troubleshooting

### "Invalid API Key"
- Check that you copied the full API key (starts with `SG.`)
- Make sure there are no extra spaces
- Regenerate if needed

### "Sender not verified"
- Verify your sender email in SendGrid dashboard
- Check spam folder for verification email
- Use a verified email address

### "Rate limit exceeded"
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan

## 🎯 Next Steps

1. ✅ Create SendGrid account
2. ✅ Generate API key
3. ✅ Verify sender email
4. ✅ Add `SENDGRID_API_KEY` to Render
5. ✅ Test email sending
6. ✅ Remove Gmail variables (optional)

**That's it!** Your emails will now work reliably from Render. 🚀

