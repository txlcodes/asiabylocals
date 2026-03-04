// Sitemap Generator for AsiaByLocals
// INTELLIGENT MODE: Only generates URLs for countries and cities that have approved tours.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert name to URL slug
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Country name to slug mapping (special cases)
const countrySlugs = {
  'United Arab Emirates': 'uae',
  'South Korea': 'south-korea',
  'Hong Kong': 'hong-kong',
  'Macau': 'macau',
  'Sri Lanka': 'sri-lanka',
  'United States': 'usa'
};

// Get country slug
function getCountrySlug(country) {
  return countrySlugs[country] || toSlug(country);
}

// Special information pages for specific cities
const cityInfoPages = {
  'agra': [
    'things-to-do-in-agra',
    'places-to-visit-in-agra',
    '1-day-agra-itinerary',
    'taj-mahal-ticket-price-2026',
    'taj-mahal-opening-time',
    'is-taj-mahal-closed-on-friday',
    'agra-travel-guide-2026'
  ],
  'phuket': [
    'things-to-do-in-phuket',
    'phuket-travel-guide-2026',
    'phi-phi-islands',
    'phang-nga-bay',
    'big-buddha-phuket',
    'wat-chalong',
    'phuket-old-town',
    'phuket-1-day-itinerary',
    'james-bond-island-phuket',
    'phuket-island-hopping'
  ]
};

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  // Load live tour data
  let liveTours = [];
  const toursPath = path.join(__dirname, 'tours.json');
  if (fs.existsSync(toursPath)) {
    try {
      liveTours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
    } catch (e) {
      console.error('Error reading tours.json:', e);
    }
  }

  // Get unique countries and cities that have approved tours
  const countriesWithTours = [...new Set(liveTours.map(t => t.country))];
  const citiesWithTours = [...new Set(liveTours.map(t => t.city))];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Layer 1: Homepage -->
  <url>
    <loc>https://www.asiabylocals.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.asiabylocals.com/logo.svg</image:loc>
      <image:title>AsiaByLocals Logo</image:title>
    </image:image>
  </url>
  
  <!-- Supplier Registration -->
  <url>
    <loc>https://www.asiabylocals.com/supplier</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`;

  // Layer 2: Countries (Only those with tours - e.g. India)
  countriesWithTours.forEach(country => {
    const countrySlug = getCountrySlug(country);
    xml += `  <!-- Layer 2: ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n\n`;
  });

  // Layer 3: Cities (Only those with tours)
  citiesWithTours.forEach(cityName => {
    // Only include cities that are explicitly indexed
    const isIndexed = ['Agra', 'Delhi', 'Jaipur', 'Phuket'].includes(cityName);
    if (!isIndexed) return;

    // Find the country for this city
    const tourForCity = liveTours.find(t => t.city === cityName);
    if (!tourForCity) return;

    const countrySlug = getCountrySlug(tourForCity.country);
    const citySlug = toSlug(cityName);

    // Core cities get high priority
    const priority = '0.9';
    const changefreq = 'daily';

    xml += `  <!-- Layer 3: ${cityName}, ${tourForCity.country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n\n`;

    // Add city authority/info sub-pages
    if (cityInfoPages[citySlug]) {
      cityInfoPages[citySlug].forEach(infoSlug => {
        xml += `  <!-- ${cityName} Authority: ${infoSlug} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}/${infoSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n\n`;
      });
    }
  });

  // Layer 4: Individual Tours
  xml += `  <!-- Layer 4: Specific Tours -->\n`;
  liveTours.forEach(tour => {
    // Only include tours from indexed cities
    const isIndexed = ['Agra', 'Delhi', 'Jaipur', 'Phuket'].includes(tour.city);
    if (!isIndexed) return;

    const countrySlug = getCountrySlug(tour.country);
    const citySlug = toSlug(tour.city);

    const isAgra = tour.city.toLowerCase() === 'agra';
    const priority = isAgra ? '0.9' : '0.8';
    const lastmod = tour.updatedAt ? tour.updatedAt.split('T')[0] : today;

    xml += `  <!-- Layer 4: Tour ${tour.id || ''} - ${tour.slug} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n\n`;
  });

  xml += `</urlset>`;
  return xml;
}

// Write sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`🚀 Intelligent Sitemap Generated!`);
console.log(`✅ Focus: Only countries/cities with APPROVED tours.`);
console.log(`📄 Saved to: ${outputPath}`);
console.log(`📊 Total URLs: ${sitemap.split('<url>').length - 1}`);
