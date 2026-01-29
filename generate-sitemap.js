// Sitemap Generator for AsiaByLocals
// Generates city-level URLs in /country/city format

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert name to URL slug
function toSlug(name) {
  return name
    .toLowerCase()
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

// Cities from constants.tsx (high priority)
const featuredCities = [
  { name: 'Tokyo', country: 'Japan', id: 'tokyo' },
  { name: 'Kyoto', country: 'Japan', id: 'kyoto' },
  { name: 'Ubud', country: 'Indonesia', id: 'bali' },
  { name: 'Agra', country: 'India', id: 'agra' },
  { name: 'Bangkok', country: 'Thailand', id: 'bangkok' },
  { name: 'Dubai', country: 'United Arab Emirates', id: 'dubai' },
  { name: 'Singapore', country: 'Singapore', id: 'singapore' },
  { name: 'Seoul', country: 'South Korea', id: 'seoul' },
  { name: 'Hong Kong', country: 'Hong Kong', id: 'hongkong' },
  { name: 'Kuala Lumpur', country: 'Malaysia', id: 'kuala-lumpur' },
  { name: 'Taipei', country: 'Taiwan', id: 'taipei' },
  { name: 'Mumbai', country: 'India', id: 'mumbai' },
  { name: 'Delhi', country: 'India', id: 'delhi' },
  { name: 'Osaka', country: 'Japan', id: 'osaka' }
];

// All cities from citiesDatabase.tsx
const allCities = [
  // Japan
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Kyoto', country: 'Japan' },
  { name: 'Osaka', country: 'Japan' },
  { name: 'Yokohama', country: 'Japan' },
  { name: 'Sapporo', country: 'Japan' },
  { name: 'Fukuoka', country: 'Japan' },
  { name: 'Hiroshima', country: 'Japan' },
  { name: 'Nagoya', country: 'Japan' },
  { name: 'Nara', country: 'Japan' },
  { name: 'Okinawa', country: 'Japan' },
  { name: 'Nikko', country: 'Japan' },
  { name: 'Takayama', country: 'Japan' },
  { name: 'Kanazawa', country: 'Japan' },
  
  // Thailand
  { name: 'Bangkok', country: 'Thailand' },
  { name: 'Chiang Mai', country: 'Thailand' },
  { name: 'Phuket', country: 'Thailand' },
  { name: 'Krabi', country: 'Thailand' },
  { name: 'Ko Samui', country: 'Thailand' },
  { name: 'Ko Phangan', country: 'Thailand' },
  { name: 'Ko Lanta', country: 'Thailand' },
  { name: 'Phi Phi Islands', country: 'Thailand' },
  { name: 'Pattaya', country: 'Thailand' },
  { name: 'Ayutthaya', country: 'Thailand' },
  { name: 'Sukhothai', country: 'Thailand' },
  { name: 'Hua Hin', country: 'Thailand' },
  { name: 'Pai', country: 'Thailand' },
  
  // China
  { name: 'Beijing', country: 'China' },
  { name: 'Shanghai', country: 'China' },
  { name: 'Hong Kong', country: 'Hong Kong' },
  { name: 'Guangzhou', country: 'China' },
  { name: 'Shenzhen', country: 'China' },
  { name: 'Chengdu', country: 'China' },
  { name: 'Xi\'an', country: 'China' },
  { name: 'Hangzhou', country: 'China' },
  { name: 'Suzhou', country: 'China' },
  { name: 'Nanjing', country: 'China' },
  { name: 'Macau', country: 'Macau' },
  
  // South Korea
  { name: 'Seoul', country: 'South Korea' },
  { name: 'Busan', country: 'South Korea' },
  { name: 'Jeju Island', country: 'South Korea' },
  { name: 'Incheon', country: 'South Korea' },
  { name: 'Gyeongju', country: 'South Korea' },
  { name: 'Jeonju', country: 'South Korea' },
  
  // India
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Agra', country: 'India' },
  { name: 'Goa', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Jaipur', country: 'India' },
  { name: 'Varanasi', country: 'India' },
  { name: 'Kolkata', country: 'India' },
  { name: 'Chennai', country: 'India' },
  { name: 'Hyderabad', country: 'India' },
  { name: 'Pune', country: 'India' },
  { name: 'Udaipur', country: 'India' },
  { name: 'Jodhpur', country: 'India' },
  { name: 'Kochi', country: 'India' },
  { name: 'Mysore', country: 'India' },
  { name: 'Amritsar', country: 'India' },
  { name: 'Rishikesh', country: 'India' },
  { name: 'Darjeeling', country: 'India' },
  
  // Indonesia
  { name: 'Bali', country: 'Indonesia' },
  { name: 'Ubud', country: 'Indonesia' },
  { name: 'Jakarta', country: 'Indonesia' },
  { name: 'Yogyakarta', country: 'Indonesia' },
  { name: 'Bandung', country: 'Indonesia' },
  { name: 'Surabaya', country: 'Indonesia' },
  { name: 'Lombok', country: 'Indonesia' },
  { name: 'Medan', country: 'Indonesia' },
  { name: 'Semarang', country: 'Indonesia' },
  { name: 'Makassar', country: 'Indonesia' },
  
  // Vietnam
  { name: 'Ho Chi Minh City', country: 'Vietnam' },
  { name: 'Hanoi', country: 'Vietnam' },
  { name: 'Da Nang', country: 'Vietnam' },
  { name: 'Hoi An', country: 'Vietnam' },
  { name: 'Hue', country: 'Vietnam' },
  { name: 'Nha Trang', country: 'Vietnam' },
  { name: 'Sapa', country: 'Vietnam' },
  { name: 'Ha Long Bay', country: 'Vietnam' },
  { name: 'Phu Quoc', country: 'Vietnam' },
  { name: 'Mui Ne', country: 'Vietnam' },
  
  // Malaysia
  { name: 'Kuala Lumpur', country: 'Malaysia' },
  { name: 'Penang', country: 'Malaysia' },
  { name: 'Langkawi', country: 'Malaysia' },
  { name: 'Malacca', country: 'Malaysia' },
  { name: 'Kota Kinabalu', country: 'Malaysia' },
  { name: 'Kuching', country: 'Malaysia' },
  { name: 'Ipoh', country: 'Malaysia' },
  { name: 'Johor Bahru', country: 'Malaysia' },
  
  // Philippines
  { name: 'Manila', country: 'Philippines' },
  { name: 'Cebu', country: 'Philippines' },
  { name: 'Boracay', country: 'Philippines' },
  { name: 'Palawan', country: 'Philippines' },
  { name: 'Davao', country: 'Philippines' },
  { name: 'Baguio', country: 'Philippines' },
  { name: 'Iloilo', country: 'Philippines' },
  { name: 'Bacolod', country: 'Philippines' },
  
  // Singapore
  { name: 'Singapore', country: 'Singapore' },
  
  // Taiwan
  { name: 'Taipei', country: 'Taiwan' },
  { name: 'Kaohsiung', country: 'Taiwan' },
  { name: 'Taichung', country: 'Taiwan' },
  { name: 'Tainan', country: 'Taiwan' },
  
  // UAE & Middle East
  { name: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates' },
  { name: 'Doha', country: 'Qatar' },
  { name: 'Muscat', country: 'Oman' },
  
  // Sri Lanka
  { name: 'Colombo', country: 'Sri Lanka' },
  { name: 'Kandy', country: 'Sri Lanka' },
  { name: 'Galle', country: 'Sri Lanka' },
  { name: 'Sigiriya', country: 'Sri Lanka' },
  
  // Nepal
  { name: 'Kathmandu', country: 'Nepal' },
  { name: 'Pokhara', country: 'Nepal' },
  
  // Bangladesh
  { name: 'Dhaka', country: 'Bangladesh' },
  
  // Myanmar
  { name: 'Yangon', country: 'Myanmar' },
  { name: 'Bagan', country: 'Myanmar' },
  { name: 'Mandalay', country: 'Myanmar' },
  
  // Cambodia
  { name: 'Siem Reap', country: 'Cambodia' },
  { name: 'Phnom Penh', country: 'Cambodia' },
  
  // Laos
  { name: 'Luang Prabang', country: 'Laos' },
  { name: 'Vientiane', country: 'Laos' },
  
  // Mongolia
  { name: 'Ulaanbaatar', country: 'Mongolia' },
  
  // Pakistan
  { name: 'Lahore', country: 'Pakistan' },
  { name: 'Karachi', country: 'Pakistan' }
];

// Get country slug
function getCountrySlug(country) {
  return countrySlugs[country] || toSlug(country);
}

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
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

  // Get unique countries
  const countries = [...new Set(allCities.map(c => c.country))];
  
  // Layer 2: Countries (optional but fine)
  countries.forEach(country => {
    const countrySlug = getCountrySlug(country);
    xml += `  <!-- Layer 2: ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

`;
  });

  // Create a map of featured city IDs for priority
  const featuredCityIds = new Set(featuredCities.map(c => c.id));

  // Layer 3: Cities (MOST IMPORTANT - This is what Google ranks!)
  // Group cities by country to organize output
  const citiesByCountry = {};
  allCities.forEach(city => {
    const country = city.country;
    if (!citiesByCountry[country]) {
      citiesByCountry[country] = [];
    }
    citiesByCountry[country].push(city);
  });

  // Sort countries alphabetically
  const sortedCountries = Object.keys(citiesByCountry).sort();
  
  sortedCountries.forEach(country => {
    const countrySlug = getCountrySlug(country);
    const cities = citiesByCountry[country];
    
    cities.forEach(city => {
      const citySlug = toSlug(city.name);
      const cityId = citySlug;
      
      // Check if this is a featured city (higher priority)
      const isFeatured = featuredCities.some(fc => 
        fc.name === city.name && fc.country === city.country
      );
      
      const priority = isFeatured ? '0.9' : '0.8';
      const changefreq = isFeatured ? 'weekly' : 'monthly';
      
      xml += `  <!-- Layer 3: ${city.name}, ${country} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>

`;
    });
  });

  xml += `</urlset>`;

  return xml;
}

// Write sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, 'public', 'sitemap.xml');

// Get unique countries for stats
const uniqueCountries = [...new Set(allCities.map(c => c.country))];

fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`✅ Sitemap generated successfully!`);
console.log(`📄 Location: ${outputPath}`);
console.log(`📊 Total URLs: ${1 + 1 + uniqueCountries.length + allCities.length} URLs`);
console.log(`   - Homepage: 1`);
console.log(`   - Supplier page: 1`);
console.log(`   - Countries: ${uniqueCountries.length}`);
console.log(`   - Cities: ${allCities.length} (${featuredCities.length} featured with priority 0.9)`);
console.log(`\n🎯 City URLs follow the structure: /country/city`);
console.log(`   Example: /india/agra, /thailand/bangkok, /japan/kyoto`);

