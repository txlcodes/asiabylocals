import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Focus cities for MVP
const FOCUS_CITIES = [
  { country: 'India', city: 'Agra' },
  { country: 'India', city: 'Delhi' },
  { country: 'India', city: 'Jaipur' }
];

async function generateSitemap() {
  try {
    // Get all approved tours
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

    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Layer 1: Homepage -->
  <url>
    <loc>https://asiabylocals.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Supplier Registration -->
  <url>
    <loc>https://asiabylocals.com/supplier</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`;

    // Helper function to create slug
    const createSlug = (text) => {
      return text.toLowerCase().replace(/\s+/g, '-');
    };

    // Layer 3: City Pages (Focus Cities)
    FOCUS_CITIES.forEach(({ country, city }) => {
      const countrySlug = createSlug(country);
      const citySlug = createSlug(city);
      const lastmod = today;
      
      xml += `  <!-- Layer 3: ${city}, ${country} -->
  <url>
    <loc>https://asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;
    });

    // Layer 4: Tour Pages (Only approved tours)
    tours.forEach(tour => {
      const countrySlug = createSlug(tour.country);
      const citySlug = createSlug(tour.city);
      const tourSlug = tour.slug;
      const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString().split('T')[0] : today;
      
      xml += `  <!-- Layer 4: ${tour.title || tour.slug} -->
  <url>
    <loc>https://asiabylocals.com/${countrySlug}/${citySlug}/${tourSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`;
    });

    xml += `</urlset>`;

    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf8');

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${1 + 1 + FOCUS_CITIES.length + tours.length}`);
    console.log(`   - Homepage: 1`);
    console.log(`   - Supplier page: 1`);
    console.log(`   - City pages: ${FOCUS_CITIES.length}`);
    console.log(`   - Tour pages: ${tours.length}`);
    console.log(`   Output: ${outputPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateSitemap();


