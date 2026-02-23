import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Country name to slug mapping (special cases)
const countrySlugs = {
  'United Arab Emirates': 'uae',
  'South Korea': 'south-korea',
  'Hong Kong': 'hong-kong',
  'Macau': 'macau',
  'Sri Lanka': 'sri-lanka',
  'United States': 'usa',
  'Saudi Arabia': 'saudi-arabia',
  'Czech Republic': 'czech-republic'
};

// Comprehensive city database for Layer 3 landing pages
const CITY_DATABASE = [
  // Japan
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Kyoto', country: 'Japan' },
  { name: 'Osaka', country: 'Japan' },
  { name: 'Yokohama', country: 'Japan' },
  { name: 'Sapporo', country: 'Japan' },
  { name: 'Nara', country: 'Japan' },
  { name: 'Hiroshima', country: 'Japan' },

  // Thailand
  { name: 'Bangkok', country: 'Thailand' },
  { name: 'Chiang Mai', country: 'Thailand' },
  { name: 'Phuket', country: 'Thailand' },
  { name: 'Krabi', country: 'Thailand' },
  { name: 'Ko Samui', country: 'Thailand' },
  { name: 'Pattaya', country: 'Thailand' },
  { name: 'Ayutthaya', country: 'Thailand' },
  { name: 'Phi Phi Islands', country: 'Thailand' },
  { name: 'Ko Lanta', country: 'Thailand' },
  { name: 'Hua Hin', country: 'Thailand' },

  // India
  { name: 'Delhi', country: 'India' },
  { name: 'Agra', country: 'India' },
  { name: 'Jaipur', country: 'India' },
  { name: 'Udaipur', country: 'India' },
  { name: 'Varanasi', country: 'India' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Goa', country: 'India' },
  { name: 'Jaisalmer', country: 'India' },
  { name: 'Jodhpur', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Amritsar', country: 'India' },
  { name: 'Rishikesh', country: 'India' },
  { name: 'Kochi', country: 'India' },

  // China
  { name: 'Beijing', country: 'China' },
  { name: 'Shanghai', country: 'China' },
  { name: 'Hong Kong', country: 'Hong Kong' },
  { name: 'Macau', country: 'Macau' },
  { name: 'Xi\'an', country: 'China' },

  // Vietnam
  { name: 'Hanoi', country: 'Vietnam' },
  { name: 'Ho Chi Minh City', country: 'Vietnam' },
  { name: 'Hoi An', country: 'Vietnam' },
  { name: 'Da Nang', country: 'Vietnam' },

  // Others
  { name: 'Seoul', country: 'South Korea' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Kuala Lumpur', country: 'Malaysia' },
  { name: 'Taipei', country: 'Taiwan' },
  { name: 'Siem Reap', country: 'Cambodia' },
  { name: 'Kathmandu', country: 'Nepal' },
  { name: 'Bali', country: 'Indonesia' },
  { name: 'Ubud', country: 'Indonesia' }
];

// Helper to convert name to URL slug
function toSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getCountrySlug(country) {
  return countrySlugs[country] || toSlug(country);
}

async function generateSitemap() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Get all approved tours
    const tours = await prisma.tour.findMany({
      where: { status: 'approved' },
      select: {
        id: true,
        slug: true,
        country: true,
        city: true,
        updatedAt: true
      }
    });

    // 2. Discover cities from approved tours to ensure Layer 3 coverage
    const discoveredCities = tours.map(t => ({
      name: t.city,
      country: t.country
    }));

    // 3. Merge databases and discovered cities
    const cityMap = new Map();
    [...CITY_DATABASE, ...discoveredCities].forEach(c => {
      if (!c.name || !c.country) return;
      const key = `${c.country.toLowerCase()}|${c.name.toLowerCase()}`;
      if (!cityMap.has(key)) {
        cityMap.set(key, { name: c.name, country: c.country });
      }
    });
    const uniqueCities = Array.from(cityMap.values());

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
  </url>
  
  <!-- Supplier Registration -->
  <url>
    <loc>https://www.asiabylocals.com/supplier</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`;

    // 4. Layer 3: City Pages
    uniqueCities.forEach(({ country, name: city }) => {
      const countrySlug = getCountrySlug(country);
      const citySlug = toSlug(city);

      // Check if this city has approved tours (higher priority if it does)
      const hasTours = tours.some(t =>
        t.city && city && t.city.toLowerCase() === city.toLowerCase() &&
        t.country && country && t.country.toLowerCase() === country.toLowerCase()
      );

      xml += `  <!-- Layer 3: ${city}, ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${hasTours ? 'daily' : 'weekly'}</changefreq>
    <priority>${hasTours ? '0.9' : '0.7'}</priority>
  </url>

`;
    });

    // 5. Layer 4: Tour Pages (Approved only)
    tours.forEach(tour => {
      if (!tour.slug) return;

      const countrySlug = getCountrySlug(tour.country);
      const citySlug = toSlug(tour.city);
      const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString().split('T')[0] : today;

      xml += `  <!-- Layer 4: Tour ${tour.id} - ${tour.slug} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`;
    });

    // 6. Layer 5: Authority Pages (e.g. Agra Info Pages)
    const agraAuthorityPages = [
      'things-to-do-in-agra',
      'places-to-visit-in-agra',
      '1-day-agra-itinerary',
      'taj-mahal-ticket-price-2026',
      'taj-mahal-opening-time',
      'is-taj-mahal-closed-on-friday',
      'agra-travel-guide-2026'
    ];

    agraAuthorityPages.forEach(infoSlug => {
      xml += `  <!-- Agra Authority: ${infoSlug} -->
  <url>
    <loc>https://www.asiabylocals.com/india/agra/${infoSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

`;
    });

    xml += `</urlset>`;

    // Write output
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');

    fs.writeFileSync(publicPath, xml, 'utf8');
    console.log(`✅ Written to: ${publicPath}`);

    if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
      fs.writeFileSync(distPath, xml, 'utf8');
      console.log(`✅ Written to: ${distPath}`);
    }

    console.log(`✅ Sitemap generation complete! Total URLs: ${1 + 1 + uniqueCities.length + tours.length}`);
    return xml;

  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { generateSitemap };

// Run if direct
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap().catch(console.error);
}





