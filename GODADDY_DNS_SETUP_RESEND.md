# GoDaddy DNS Setup for Resend Email

## 📋 DNS Records to Add

You need to add these DNS records in GoDaddy to verify your domain and enable email sending:

### 1. Domain Verification (DKIM) - Required
- **Type**: TXT
- **Name**: `resend._domainkey`
- **Value**: `p=MIGfMA0GCSqGSIb3DQEB...` (copy the full value from Resend dashboard)
- **TTL**: Auto (or 3600)

### 2. Enable Sending (SPF) - Required
- **Type**: TXT
- **Name**: `send`
- **Value**: `v=spf1 include:amazons...` (copy the full value from Resend dashboard)
- **TTL**: Auto (or 3600)

### 3. Enable Sending (MX) - Required
- **Type**: MX
- **Name**: `send`
- **Value**: `feedback-smtp.ap-north...` (copy the full value from Resend dashboard)
- **Priority**: `10`
- **TTL**: Auto (or 3600)

---

## 🚀 Step-by-Step: Add DNS Records in GoDaddy

### Step 1: Log in to GoDaddy
1. Go to: https://www.godaddy.com/
2. Sign in to your account
3. Go to **My Products** → **Domains**

### Step 2: Access DNS Management
1. Find `asiabylocals.com` in your domain list
2. Click on the domain name
3. Click **"DNS"** tab (or **"Manage DNS"**)

### Step 3: Add DKIM Record (Domain Verification)
1. Scroll down to **"Records"** section
2. Click **"Add"** button
3. Select **"TXT"** from the Type dropdown
4. Fill in:
   - **Name**: `resend._domainkey`
   - **Value**: Copy the full value from Resend dashboard (starts with `p=MIGfMA0GCSqGSIb3DQEB...`)
   - **TTL**: `600` (or leave default)
5. Click **"Save"**

### Step 4: Add SPF Record (Enable Sending)
1. Click **"Add"** button again
2. Select **"TXT"** from the Type dropdown
3. Fill in:
   - **Name**: `send`
   - **Value**: Copy the full value from Resend dashboard (starts with `v=spf1 include:amazons...`)
   - **TTL**: `600` (or leave default)
4. Click **"Save"**

### Step 5: Add MX Record (Enable Sending)
1. Click **"Add"** button again
2. Select **"MX"** from the Type dropdown
3. Fill in:
   - **Name**: `send`
   - **Value**: Copy the value from Resend dashboard (e.g., `feedback-smtp.ap-north...`)
   - **Priority**: `10`
   - **TTL**: `600` (or leave default)
4. Click **"Save"**

### Step 6: Wait for DNS Propagation
- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- Resend will automatically verify once DNS records are detected

### Step 7: Verify in Resend
1. Go back to Resend dashboard: https://resend.com/domains
2. Click on `asiabylocals.com`
3. Wait for verification status to change to **"Verified"** ✅

---

## ✅ After Verification

Once your domain is verified in Resend:
1. Update the code to use `support@asiabylocals.com` instead of `onboarding@resend.dev`
2. All emails will come from your custom domain
3. Better deliverability and professional appearance

---

## 📝 Important Notes

### DNS Record Format in GoDaddy:
- **Name**: Don't include the domain name, just the subdomain part
  - ✅ Correct: `resend._domainkey`
  - ❌ Wrong: `resend._domainkey.asiabylocals.com`
- **Value**: Copy the **entire value** from Resend (it's long!)
- **TTL**: Can use `600` (10 minutes) or leave default

### Common Issues:
- **"Record already exists"**: You might have an existing SPF record. You may need to merge it or remove the old one first.
- **"Verification pending"**: Wait 15-30 minutes for DNS propagation
- **"Verification failed"**: Double-check that you copied the full value correctly

---

## 🔍 How to Check DNS Records

After adding records, verify they're correct:

### Using Command Line:
```bash
# Check DKIM record
dig TXT resend._domainkey.asiabylocals.com

# Check SPF record
dig TXT send.asiabylocals.com

# Check MX record
dig MX send.asiabylocals.com
```

### Using Online Tools:
- https://mxtoolbox.com/
- https://www.whatsmydns.net/

---

## 🎯 Quick Checklist

- [ ] Logged into GoDaddy
- [ ] Opened DNS management for `asiabylocals.com`
- [ ] Added DKIM TXT record (`resend._domainkey`)
- [ ] Added SPF TXT record (`send`)
- [ ] Added MX record (`send` with priority 10)
- [ ] Waited 15-30 minutes for DNS propagation
- [ ] Verified domain in Resend dashboard
- [ ] Updated code to use `support@asiabylocals.com`

---

**Need help?** If you get stuck, share a screenshot of your GoDaddy DNS page and I can help!

