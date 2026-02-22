// Sitemap Generator for AsiaByLocals
// INTELLIGENT MODE: Only generates URLs for countries and cities that have approved tours.
// Currently focused on India (Golden Triangle) as requested.

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

// Special information pages for specific cities (Agra Authority Pages)
const cityInfoPages = {
  'agra': [
    'things-to-do-in-agra',
    'places-to-visit-in-agra',
    '1-day-agra-itinerary',
    'taj-mahal-ticket-price-2026',
    'taj-mahal-opening-time',
    'is-taj-mahal-closed-on-friday',
    'agra-travel-guide-2026'
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
    // Find the country for this city
    const tourForCity = liveTours.find(t => t.city === cityName);
    if (!tourForCity) return;

    const countrySlug = getCountrySlug(tourForCity.country);
    const citySlug = toSlug(cityName);

    // Check if it's one of our high-priority hubs
    const isFeatured = ['Agra', 'Delhi', 'Jaipur', 'Udaipur', 'Varanasi'].includes(cityName);
    const priority = isFeatured ? '0.9' : '0.8';
    const changefreq = isFeatured ? 'daily' : 'weekly';

    xml += `  <!-- Layer 3: ${cityName}, ${tourForCity.country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n\n`;

    // Add Agra Sub-pages
    if (citySlug === 'agra') {
      cityInfoPages['agra'].forEach(infoSlug => {
        xml += `  <!-- Agra Authority: ${infoSlug} -->
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
