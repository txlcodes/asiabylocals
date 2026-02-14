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
  { country: 'India', city: 'Jaipur' },
  { country: 'India', city: 'Udaipur' },
  { country: 'India', city: 'Jaisalmer' }
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

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
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;
    });

    // Layer 4: Tour Pages (Only approved tours)
    // Sort tours by updatedAt (newest first) for better indexing priority
    const sortedTours = tours.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA; // Newest first
    });

    sortedTours.forEach(tour => {
      if (!tour.slug) {
        console.warn(`⚠️  Skipping tour ${tour.id} - missing slug`);
        return;
      }

      const countrySlug = createSlug(tour.country);
      const citySlug = createSlug(tour.city);
      const tourSlug = tour.slug;
      const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString().split('T')[0] : today;

      xml += `  <!-- Layer 4: Tour ${tour.id} - ${tourSlug} -->
  <url>
    <loc>https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tourSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`;
    });


    xml += `</urlset>`;

    // Write to both public and dist directories
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');

    fs.writeFileSync(publicPath, xml, 'utf8');
    console.log(`✅ Written to: ${publicPath}`);

    // Also write to dist if it exists
    try {
      const distDir = path.join(__dirname, '..', 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(distPath, xml, 'utf8');
        console.log(`✅ Written to: ${distPath}`);
      }
    } catch (distError) {
      console.warn('⚠️  Could not write to dist folder (non-critical):', distError.message);
    }

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${1 + 1 + FOCUS_CITIES.length + tours.length}`);
    console.log(`   - Homepage: 1`);
    console.log(`   - Supplier page: 1`);
    console.log(`   - City pages: ${FOCUS_CITIES.length}`);
    console.log(`   - Tour pages: ${tours.length}`);
    console.log(`   Output: ${publicPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in server.js
export { generateSitemap };

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}




