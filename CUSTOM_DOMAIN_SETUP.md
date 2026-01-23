# 🌐 Custom Domain Setup Guide

## Step 1: Purchase Domain (if you haven't already)

Purchase your domain from:
- **Namecheap** (recommended)
- **GoDaddy**
- **Google Domains**
- **Cloudflare**

Example: `asiabylocals.com`

## Step 2: Add Custom Domain in Render

### In Render Dashboard:

1. Go to your Web Service (`asiabylocals`)
2. Click **"Settings"** tab
3. Scroll to **"Custom Domains"** section
4. Click **"Add Custom Domain"**
5. Enter your domain: `asiabylocals.com`
6. Render will provide DNS records to add

## Step 3: Configure DNS Records

### Option A: Root Domain (asiabylocals.com)

**In your domain registrar's DNS settings, add:**

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | `asiabylocals.onrender.com` |
| CNAME | www | `asiabylocals.onrender.com` |

**OR if CNAME not supported for root:**

| Type | Name | Value |
|------|------|-------|
| A | @ | `[IP Address from Render]` |
| CNAME | www | `asiabylocals.onrender.com` |

### Option B: Subdomain (api.asiabylocals.com) - Optional

If you want separate API subdomain:

| Type | Name | Value |
|------|------|-------|
| CNAME | api | `asiabylocals.onrender.com` |

## Step 4: Update Environment Variables in Render

### Backend Environment Variables:

Go to Render → Your Service → Environment → Update:

```env
FRONTEND_URL=https://asiabylocals.com
NODE_ENV=production
```

**Keep all other variables the same:**
- `DATABASE_URL`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CLOUDINARY_*`

### Frontend Environment Variables (if using separate frontend):

Since you're using unified deployment, you don't need frontend env vars. But if you add them later:

```env
VITE_API_URL=https://asiabylocals.com
VITE_FRONTEND_URL=https://asiabylocals.com
```

## Step 5: Update CORS Configuration

The CORS is already configured to use `FRONTEND_URL` environment variable, so it will automatically allow your custom domain once you update `FRONTEND_URL`.

## Step 6: SSL Certificate

Render automatically provisions SSL certificates via Let's Encrypt once DNS is configured correctly. This usually takes 5-10 minutes.

## Step 7: Verify Domain

1. Wait for DNS propagation (can take up to 48 hours, usually 5-30 minutes)
2. Check DNS propagation: https://www.whatsmydns.net
3. Render will show "Verified" status in Custom Domains section
4. SSL certificate will be issued automatically

## Step 8: Test Your Domain

After DNS propagates and SSL is active:

1. Visit: `https://asiabylocals.com`
2. Test admin panel: `https://asiabylocals.com/secure-panel-abl`
3. Test API: `https://asiabylocals.com/api/health`

## Important Notes

### DNS Propagation
- Can take 5 minutes to 48 hours
- Usually completes within 30 minutes
- Use `dig` or `nslookup` to check: `dig asiabylocals.com`

### SSL Certificate
- Automatically issued by Render
- Takes 5-10 minutes after DNS verification
- Free via Let's Encrypt
- Auto-renewes

### Environment Variables
- Update `FRONTEND_URL` to your custom domain
- All email links will use the new domain
- CORS will automatically allow the new domain

### Testing Checklist
- [ ] Domain resolves: `https://asiabylocals.com`
- [ ] SSL certificate active (green lock icon)
- [ ] Homepage loads correctly
- [ ] API endpoints work: `/api/health`
- [ ] Admin panel accessible: `/secure-panel-abl`
- [ ] Email links use new domain

## Troubleshooting

### Domain not resolving?
- Check DNS records are correct
- Wait for DNS propagation
- Verify records with: `dig asiabylocals.com`

### SSL certificate not issued?
- Ensure DNS is correctly configured
- Wait 10-15 minutes after DNS verification
- Check Render logs for SSL errors

### CORS errors?
- Ensure `FRONTEND_URL` is set correctly
- Include both `https://asiabylocals.com` and `https://www.asiabylocals.com` if using www

---

**After setup, your site will be live at: `https://asiabylocals.com`** 🎉



