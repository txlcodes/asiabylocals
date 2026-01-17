import prisma from './db.js';

async function approveDelhiTours() {
  try {
    console.log('🔄 Approving all Delhi tours...');
    
    // Find all tours
    const allTours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true
      }
    });
    
    // Filter for Delhi tours (case-insensitive check)
    const delhiTours = allTours.filter(tour => {
      if (!tour.city) return false;
      return tour.city.toLowerCase().includes('delhi');
    });
    
    console.log(`📋 Found ${delhiTours.length} Delhi tours`);
    
    if (delhiTours.length === 0) {
      console.log('⚠️  No Delhi tours found');
      console.log('\n📊 All tours in database:');
      allTours.forEach(tour => {
        console.log(`   ${tour.title} - ${tour.city}, ${tour.country} (${tour.status})`);
      });
      await prisma.$disconnect();
      process.exit(0);
    }
    
    // Approve all Delhi tours individually
    let approvedCount = 0;
    for (const tour of delhiTours) {
      if (tour.status === 'draft' || tour.status === 'pending') {
        await prisma.tour.update({
          where: { id: tour.id },
          data: {
            status: 'approved',
            approvedAt: new Date()
          }
        });
        approvedCount++;
        console.log(`   ✅ Approved: ${tour.title}`);
      } else {
        console.log(`   ℹ️  Already ${tour.status}: ${tour.title}`);
      }
    }
    
    console.log(`\n✅ Approved ${approvedCount} Delhi tours`);
    
    // Show all Delhi tours and their statuses
    console.log(`\n📊 Delhi tours status:`);
    const updatedTours = await prisma.tour.findMany({
      where: {
        id: {
          in: delhiTours.map(t => t.id)
        }
      },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true
      }
    });
    
    updatedTours.forEach(tour => {
      console.log(`   ${tour.title} (${tour.city}, ${tour.country}): ${tour.status}`);
    });
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error approving Delhi tours:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

approveDelhiTours();
