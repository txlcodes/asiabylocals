import prisma from './db.js';

async function checkTours() {
  try {
    console.log('🔍 Checking all tours...');
    
    const tours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true,
        supplierId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📊 Found ${tours.length} tours:\n`);
    
    if (tours.length === 0) {
      console.log('⚠️  No tours found in database');
    } else {
      tours.forEach(tour => {
        console.log(`   ID: ${tour.id}`);
        console.log(`   Title: ${tour.title}`);
        console.log(`   City: ${tour.city || 'N/A'}`);
        console.log(`   Country: ${tour.country || 'N/A'}`);
        console.log(`   Status: ${tour.status}`);
        console.log(`   Supplier ID: ${tour.supplierId}`);
        console.log('');
      });
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking tours:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTours();
