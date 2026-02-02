# Fix "Discovered - Currently Not Indexed" Issue

## 🔍 Problem
11 tour pages are discovered by Google but not indexed. Reason: "Discovered - currently not indexed"

## ✅ Solutions to Get Pages Indexed

### 1. **Add Open Graph & Twitter Card Meta Tags** ⭐⭐⭐ CRITICAL

Tour pages are missing Open Graph tags. Add these to `TourDetailPage.tsx`:

```typescript
// Add after canonical URL setup
useEffect(() => {
  if (tour) {
    // Open Graph tags
    const ogTags = [
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}` },
      { property: 'og:title', content: tour.title },
      { property: 'og:description', content: tour.shortDescription || tour.fullDescription?.substring(0, 155) },
      { property: 'og:image', content: tour.images?.[0] || 'https://www.asiabylocals.com/logo.png' },
      { property: 'og:site_name', content: 'AsiaByLocals' },
      { property: 'og:locale', content: 'en_US' },
    ];
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: tour.title },
      { name: 'twitter:description', content: tour.shortDescription || tour.fullDescription?.substring(0, 155) },
      { name: 'twitter:image', content: tour.images?.[0] || 'https://www.asiabylocals.com/logo.png' },
    ];
    
    // Create/update meta tags
    [...ogTags, ...twitterTags].forEach(tag => {
      let meta = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (tag.property) meta.setAttribute('property', tag.property);
        if (tag.name) meta.setAttribute('name', tag.name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', tag.content);
    });
  }
}, [tour, city, country]);
```

### 2. **Add Structured Data (JSON-LD)** ⭐⭐⭐ CRITICAL

Add Tour/Product schema to help Google understand the content:

```typescript
useEffect(() => {
  if (tour) {
    // Remove existing tour schema if any
    const existingSchema = document.querySelector('script[type="application/ld+json"][data-tour-schema]');
    if (existingSchema) existingSchema.remove();
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.title,
      "description": tour.fullDescription || tour.shortDescription,
      "image": tour.images || [],
      "url": `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}`,
      "tourBookingPage": `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}`,
      "touristType": "Tourist",
      "itinerary": {
        "@type": "ItemList",
        "itemListElement": tour.locations?.map((loc, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": loc
        })) || []
      },
      "offers": {
        "@type": "Offer",
        "price": tour.pricePerPerson || 0,
        "priceCurrency": tour.currency || "INR",
        "availability": tour.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}`
      },
      "duration": tour.duration,
      "location": {
        "@type": "Place",
        "name": city,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressCountry": country
        }
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-tour-schema', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}, [tour, city, country]);
```

### 3. **Ensure Content Quality** ⭐⭐ IMPORTANT

- ✅ Each tour page should have at least 300+ words of unique content
- ✅ Include H1 with tour title
- ✅ Include H2/H3 headings for sections
- ✅ Add unique descriptions (not duplicate content)
- ✅ Include location-specific keywords naturally

### 4. **Add Internal Links** ⭐⭐ IMPORTANT

- ✅ Link from city pages to tour pages (already done)
- ✅ Add "Related Tours" section on tour pages
- ✅ Add breadcrumb navigation
- ✅ Link back to city page

### 5. **Request Indexing Manually** ⭐ CRITICAL

1. Go to Google Search Console → **URL Inspection**
2. Enter each tour URL
3. Click **Request Indexing**
4. Wait 24-48 hours

### 6. **Check Page Speed** ⭐ IMPORTANT

- Ensure pages load in < 3 seconds
- Optimize images (use WebP format)
- Minimize JavaScript/CSS
- Enable compression

### 7. **Verify Mobile Usability** ⭐ IMPORTANT

- Test on mobile devices
- Ensure responsive design works
- Check mobile page speed

## 🚀 Immediate Actions

1. **Add Open Graph tags** (highest priority)
2. **Add structured data** (JSON-LD)
3. **Request indexing** for each URL manually
4. **Check content quality** - ensure each page has unique, substantial content
5. **Add internal links** - link between related tours

## 📊 Expected Timeline

- **Manual indexing request**: 24-48 hours
- **Sitemap re-crawl**: 1-7 days
- **Natural indexing**: 1-4 weeks

## 🔍 Monitoring

Check Search Console daily:
- **Coverage** report → See indexing status
- **URL Inspection** → Check individual pages
- **Performance** → Monitor impressions/clicks

## ⚠️ Common Mistakes to Avoid

- ❌ Don't create duplicate content
- ❌ Don't use thin content (< 200 words)
- ❌ Don't forget mobile optimization
- ❌ Don't ignore page speed
- ❌ Don't skip structured data
