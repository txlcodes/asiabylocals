import prisma from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkImageStorage() {
  try {
    console.log('🔍 Checking Image Storage Configuration...\n');
    
    // Check Cloudinary Configuration
    console.log('☁️  Cloudinary Configuration:');
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    const isConfigured = !!(cloudName && apiKey && apiSecret);
    console.log(`   Cloud Name: ${cloudName ? '✅ Set' : '❌ Missing'}`);
    console.log(`   API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   API Secret: ${apiSecret ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Status: ${isConfigured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}\n`);
    
    if (!isConfigured) {
      console.log('⚠️  WARNING: Cloudinary is not configured!');
      console.log('⚠️  Images will be stored as base64 in the database!\n');
    }
    
    // Get sample tours
    const tours = await prisma.tour.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        city: true,
        images: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📦 Analyzing ${tours.length} recent tours...\n`);
    
    let cloudinaryCount = 0;
    let base64Count = 0;
    let otherUrlCount = 0;
    let emptyCount = 0;
    
    tours.forEach((tour, index) => {
      try {
        const images = JSON.parse(tour.images || '[]');
        
        if (images.length === 0) {
          emptyCount++;
          console.log(`${index + 1}. Tour #${tour.id}: "${tour.title}"`);
          console.log(`   ⚠️  No images`);
          return;
        }
        
        const firstImage = images[0];
        let storageType = 'unknown';
        
        if (typeof firstImage === 'string') {
          if (firstImage.startsWith('data:image')) {
            storageType = 'base64';
            base64Count++;
          } else if (firstImage.includes('cloudinary.com') || firstImage.includes('res.cloudinary.com')) {
            storageType = 'cloudinary';
            cloudinaryCount++;
          } else if (firstImage.startsWith('http')) {
            storageType = 'external-url';
            otherUrlCount++;
          }
        }
        
        console.log(`${index + 1}. Tour #${tour.id}: "${tour.title}" (${tour.city})`);
        console.log(`   Images: ${images.length}`);
        console.log(`   Storage: ${storageType === 'base64' ? '❌ BASE64 (in database)' : storageType === 'cloudinary' ? '✅ CLOUDINARY (external)' : storageType === 'external-url' ? '✅ External URL' : '❓ Unknown'}`);
        
        if (storageType === 'base64') {
          const sizeKB = (firstImage.length / 1024).toFixed(2);
          console.log(`   First image size: ~${sizeKB} KB (base64)`);
        } else if (storageType === 'cloudinary') {
          console.log(`   First image URL: ${firstImage.substring(0, 80)}...`);
        } else if (storageType === 'external-url') {
          console.log(`   First image URL: ${firstImage.substring(0, 80)}...`);
        }
        console.log('');
        
      } catch (e) {
        console.error(`   ❌ Error parsing images: ${e.message}`);
      }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Cloudinary URLs: ${cloudinaryCount} tours`);
    console.log(`   ❌ Base64 (in database): ${base64Count} tours`);
    console.log(`   ✅ External URLs: ${otherUrlCount} tours`);
    console.log(`   ⚠️  Empty: ${emptyCount} tours`);
    
    if (base64Count > 0) {
      console.log('\n⚠️  WARNING: Some tours have base64 images stored in database!');
      console.log('⚠️  This will fill up your database quickly.');
      if (isConfigured) {
        console.log('⚠️  Cloudinary is configured, but these tours were created before configuration.');
        console.log('💡 Solution: Recreate these tours to upload images to Cloudinary.');
      } else {
        console.log('⚠️  Cloudinary is NOT configured!');
        console.log('💡 Solution: Add Cloudinary credentials to Render environment variables.');
      }
    }
    
    if (isConfigured && cloudinaryCount > 0) {
      console.log('\n✅ SUCCESS: Cloudinary is configured and working!');
      console.log('✅ New tours will store images in Cloudinary (fast CDN delivery).');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImageStorage();

