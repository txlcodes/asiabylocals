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
  { name: 'Fukuoka', country: 'Japan' },
  { name: 'Nagoya', country: 'Japan' },
  { name: 'Okinawa', country: 'Japan' },

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
  { name: 'Sukhothai', country: 'Thailand' },
  { name: 'Pai', country: 'Thailand' },

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
  { name: 'Mathura', country: 'India' },
  { name: 'Khajuraho', country: 'India' },
  { name: 'Gwalior', country: 'India' },
  { name: 'Aurangabad', country: 'India' },
  { name: 'Mysore', country: 'India' },
  { name: 'Leh Ladakh', country: 'India' },
  { name: 'Bikaner', country: 'India' },

  // China & East Asia
  { name: 'Beijing', country: 'China' },
  { name: 'Shanghai', country: 'China' },
  { name: 'Hong Kong', country: 'Hong Kong' },
  { name: 'Macau', country: 'Macau' },
  { name: 'Taipei', country: 'Taiwan' },
  { name: 'Seoul', country: 'South Korea' },
  { name: 'Busan', country: 'South Korea' },

  // Southeast Asia
  { name: 'Hanoi', country: 'Vietnam' },
  { name: 'Ho Chi Minh City', country: 'Vietnam' },
  { name: 'Hoi An', country: 'Vietnam' },
  { name: 'Da Nang', country: 'Vietnam' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Kuala Lumpur', country: 'Malaysia' },
  { name: 'Penang', country: 'Malaysia' },
  { name: 'Siem Reap', country: 'Cambodia' },
  { name: 'Bali', country: 'Indonesia' },
  { name: 'Ubud', country: 'Indonesia' },
  { name: 'Yogyakarta', country: 'Indonesia' },

  // Others
  { name: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Kathmandu', country: 'Nepal' },
  { name: 'Colombo', country: 'Sri Lanka' }
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

    // 2. Discover countries and cities (Only from approved tours = "Live")
    const liveCountries = [...new Set(tours.map(t => t.country))];
    const liveCities = new Map(); // key: country|city, value: { name, country }

    tours.forEach(t => {
      if (!t.city || !t.country) return;
      const key = `${t.country.toLowerCase()}|${t.city.toLowerCase()}`;
      if (!liveCities.has(key)) {
        liveCities.set(key, { name: t.city, country: t.country });
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Layer 1: Homepage & Main Static Pages -->
  <url>
    <loc>https://www.asiabylocals.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>https://www.asiabylocals.com/supplier</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.asiabylocals.com/about-us</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://www.asiabylocals.com/support</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://www.asiabylocals.com/safety-guidelines</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://www.asiabylocals.com/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://www.asiabylocals.com/terms-and-conditions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

`;

    // 4. Layer 2: Live Countries
    liveCountries.forEach(country => {
      const countrySlug = getCountrySlug(country);
      xml += `  <!-- Layer 2: ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n\n`;
    });

    // 5. Layer 3: Live Cities
    liveCities.forEach(({ name: city, country }) => {
      const countrySlug = getCountrySlug(country);
      const citySlug = toSlug(city);

      // Featured cities get higher priority
      const isFeatured = ['Agra', 'Delhi', 'Jaipur', 'Udaipur', 'Varanasi'].includes(city);
      const priority = isFeatured ? '0.9' : '0.8';

      xml += `  <!-- Layer 3: ${city}, ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>\n\n`;
    });

    // 6. Layer 4: Live Tours
    tours.forEach(tour => {
      if (!tour.slug) return;

      const countrySlug = getCountrySlug(tour.country);
      const citySlug = toSlug(tour.city);
      const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString().split('T')[0] : today;

      xml += `  <!-- Layer 4: Tour ${tour.id} - ${tour.slug} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n\n`;
    });

    // 7. Layer 5: Authority Pages (e.g. Agra Info Pages)
    // Only add if the city is live
    const agraIsLive = tours.some(t => t.city && t.city.toLowerCase() === 'agra');
    if (agraIsLive) {
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
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n\n`;
      });
    }

    xml += `</urlset>`;

    // Write output
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

    fs.writeFileSync(publicPath, xml, 'utf8');
    console.log(`✅ Written to: ${publicPath}`);

    const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
    if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
      fs.writeFileSync(distPath, xml, 'utf8');
      console.log(`✅ Written to: ${distPath}`);
    }

    console.log(`✅ Sitemap generation complete! Total URLs: ${1 + 1 + 5 + liveCountries.length + liveCities.size + tours.length + (agraIsLive ? 7 : 0)}`);
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
