# 📧 Resend Setup Guide (Easiest Email Service)

**Resend is the easiest email service to set up** - perfect if SendGrid signup is blocked!

## ✅ Why Resend?

- ✅ **Free tier**: 3,000 emails/month (100/day)
- ✅ **Super easy setup**: Just sign up and get API key
- ✅ **No verification needed**: Works immediately
- ✅ **Great for developers**: Modern API, excellent docs
- ✅ **Works perfectly with Render**: No connection issues

## 🚀 Quick Setup (2 minutes!)

### Step 1: Sign Up for Resend

1. Go to: https://resend.com/signup
2. Sign up with your email (`asiabylocals@gmail.com` or `support@asiabylocals.com`)
3. **No credit card required!**
4. Verify your email (check inbox)

### Step 2: Get API Key

1. After login, you'll see your dashboard
2. Click **"API Keys"** in the sidebar (or go to: https://resend.com/api-keys)
3. Click **"Create API Key"**
4. Name it: `AsiaByLocals Production`
5. Click **"Create"**
6. **Copy the API key immediately** (starts with `re_`)
   - It looks like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Add Domain (Optional but Recommended)

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `asiabylocals.com`
4. Follow DNS setup instructions (add TXT records)
5. **OR** skip this step - Resend works without domain verification!

**Note**: You can use Resend immediately without domain verification. Emails will come from `onboarding@resend.dev` initially, then from your domain once verified.

### Step 4: Add to Render

1. Go to **Render Dashboard** → Your Web Service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_`)
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
📧 Using Resend for email delivery
   RESEND_API_KEY: ✅ Set
   From Email: support@asiabylocals.com
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

## 📊 Resend Free Tier

- ✅ **3,000 emails/month** (100/day)
- ✅ **Unlimited API access**
- ✅ **No credit card required**
- ✅ **Works immediately**

**Upgrade when needed:**
- 50,000 emails/month = $20/month
- 100,000 emails/month = $80/month

## 🎯 Advantages Over SendGrid

- ✅ **Easier signup**: No Twilio account needed
- ✅ **Faster setup**: Works in 2 minutes
- ✅ **Better free tier**: 3,000 vs 100 emails/month
- ✅ **Modern API**: Built for developers
- ✅ **No verification delays**: Works immediately

## ❌ Troubleshooting

### "Invalid API Key"
- Check that you copied the full API key (starts with `re_`)
- Make sure there are no extra spaces
- Regenerate if needed

### "Domain not verified"
- You can still send emails without domain verification
- Emails will come from `onboarding@resend.dev` initially
- Verify domain later for `support@asiabylocals.com`

### "Rate limit exceeded"
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan

## 🎯 Next Steps

1. ✅ Sign up at https://resend.com/signup
2. ✅ Get API key from dashboard
3. ✅ Add `RESEND_API_KEY` to Render
4. ✅ Test email sending
5. ✅ (Optional) Verify domain for custom email

**That's it!** Resend is much easier than SendGrid. 🚀

