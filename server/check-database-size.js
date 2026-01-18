import prisma from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabaseSize() {
  try {
    console.log('📊 Analyzing database storage...\n');
    
    // Get all tours
    const tours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        images: true,
        fullDescription: true,
        createdAt: true
      }
    });

    console.log(`📦 Total tours: ${tours.length}\n`);

    let totalBase64Size = 0;
    let totalCloudinaryUrls = 0;
    let toursWithBase64 = [];
    let toursWithCloudinary = [];

    tours.forEach(tour => {
      try {
        const images = JSON.parse(tour.images || '[]');
        let tourBase64Size = 0;
        let hasBase64 = false;
        let hasCloudinary = false;

        images.forEach(img => {
          if (typeof img === 'string') {
            if (img.startsWith('data:image')) {
              // Base64 image
              hasBase64 = true;
              tourBase64Size += img.length;
              totalBase64Size += img.length;
            } else if (img.includes('cloudinary.com') || img.includes('res.cloudinary.com')) {
              // Cloudinary URL
              hasCloudinary = true;
              totalCloudinaryUrls++;
            } else if (img.startsWith('http')) {
              // Other URL
              totalCloudinaryUrls++;
            }
          }
        });

        if (hasBase64) {
          toursWithBase64.push({
            id: tour.id,
            title: tour.title,
            size: tourBase64Size,
            sizeKB: (tourBase64Size / 1024).toFixed(2),
            sizeMB: (tourBase64Size / (1024 * 1024)).toFixed(2),
            imageCount: images.length
          });
        }

        if (hasCloudinary) {
          toursWithCloudinary.push({
            id: tour.id,
            title: tour.title
          });
        }
      } catch (e) {
        console.error(`Error parsing images for tour ${tour.id}:`, e.message);
      }
    });

    console.log('📈 Storage Analysis:\n');
    console.log(`   Total Base64 Images: ${toursWithBase64.length} tours`);
    console.log(`   Total Cloudinary URLs: ${toursWithCloudinary.length} tours`);
    console.log(`\n💾 Base64 Storage:`);
    console.log(`   Total Size: ${(totalBase64Size / 1024).toFixed(2)} KB`);
    console.log(`   Total Size: ${(totalBase64Size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`   Average per tour: ${toursWithBase64.length > 0 ? (totalBase64Size / toursWithBase64.length / 1024).toFixed(2) : 0} KB`);

    if (toursWithBase64.length > 0) {
      console.log(`\n⚠️  Tours with Base64 Images (stored in database):`);
      toursWithBase64.slice(0, 10).forEach(tour => {
        console.log(`   - Tour #${tour.id}: "${tour.title}" (${tour.sizeKB} KB, ${tour.imageCount} images)`);
      });
      if (toursWithBase64.length > 10) {
        console.log(`   ... and ${toursWithBase64.length - 10} more`);
      }
    }

    // Check Cloudinary config
    console.log(`\n☁️  Cloudinary Configuration:`);
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    console.log(`   Configured: ${hasCloudinary ? '✅ YES' : '❌ NO'}`);
    if (!hasCloudinary) {
      console.log(`   ⚠️  WARNING: Cloudinary not configured!`);
      console.log(`   ⚠️  All new tours will store base64 images in database!`);
      console.log(`   ⚠️  This will quickly fill up your 1GB database!`);
    }

    // Estimate future growth
    if (toursWithBase64.length > 0) {
      const avgSizePerTour = totalBase64Size / toursWithBase64.length;
      const toursUntilFull = (1024 * 1024 * 1024 * 0.8) / avgSizePerTour; // 80% of 1GB
      console.log(`\n📊 Growth Estimate:`);
      console.log(`   Average size per tour: ${(avgSizePerTour / 1024).toFixed(2)} KB`);
      console.log(`   Estimated tours until 80% full: ${Math.floor(toursUntilFull)} tours`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseSize();

