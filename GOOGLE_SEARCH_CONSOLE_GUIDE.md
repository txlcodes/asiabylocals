# Google Search Console - Indexing Tour Pages Guide

## ✅ Steps to Get Tour Pages Indexed in Google Search Console

### 1. **Add URLs to Sitemap** ✅
The tour URLs have been added to `public/sitemap.xml`:
- `https://www.asiabylocals.com/india/agra/taj-mahal-full-day-tour`
- `https://www.asiabylocals.com/india/agra/taj-mahal-entry-ticket`
- `https://www.asiabylocals.com/india/agra/taj-mahal-official-guided-tour`

### 2. **Submit Sitemap to Google Search Console**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `https://www.asiabylocals.com`
3. Navigate to **Sitemaps** in the left sidebar
4. Enter: `https://www.asiabylocals.com/sitemap.xml`
5. Click **Submit**
6. Wait for Google to process (usually 1-24 hours)

### 3. **Request Indexing for Individual URLs**

For faster indexing, you can request indexing for each tour page:

1. Go to **URL Inspection** tool in Google Search Console
2. Enter each URL:
   - `https://www.asiabylocals.com/india/agra/taj-mahal-full-day-tour`
   - `https://www.asiabylocals.com/india/agra/taj-mahal-entry-ticket`
   - `https://www.asiabylocals.com/india/agra/taj-mahal-official-guided-tour`
3. Click **Request Indexing** for each URL
4. Google will crawl and index within 24-48 hours

### 4. **Verify Pages Are Live**

Before submitting, verify:
- ✅ Pages are accessible (no 404 errors)
- ✅ Pages have proper meta tags (title, description)
- ✅ Pages have canonical URLs set
- ✅ Pages load correctly on mobile
- ✅ Pages have structured data (if applicable)

### 5. **Check Indexing Status**

After submitting:
1. Go to **Coverage** report in Search Console
2. Check **Valid** section to see indexed pages
3. Check **Excluded** section for any issues
4. Use **URL Inspection** tool to check individual page status

### 6. **Monitor Indexing**

- Check Search Console daily for indexing status
- Fix any crawl errors immediately
- Ensure pages return 200 status codes
- Verify robots.txt allows crawling: `https://www.asiabylocals.com/robots.txt`

## 📋 Quick Checklist

- [x] URLs added to sitemap.xml
- [ ] Sitemap submitted to Google Search Console
- [ ] Individual URLs requested for indexing
- [ ] Pages verified as live and accessible
- [ ] Indexing status monitored in Search Console

## 🔗 Important URLs

- **Sitemap**: `https://www.asiabylocals.com/sitemap.xml`
- **Robots.txt**: `https://www.asiabylocals.com/robots.txt`
- **Search Console**: https://search.google.com/search-console

## ⚠️ Notes

- **Localhost URLs** (`http://localhost:3000/...`) cannot be indexed by Google
- Only **production URLs** (`https://www.asiabylocals.com/...`) can be indexed
- Make sure all tours are **approved** and have **status='approved'** in database
- Ensure tour slugs match exactly in sitemap and database

## 🚀 For Future Tours

To automatically add new tours to sitemap:
1. Update `generate-sitemap.js` to fetch tours from database
2. Or manually add approved tours to `sitemap.xml`
3. Resubmit sitemap to Google Search Console after updates
