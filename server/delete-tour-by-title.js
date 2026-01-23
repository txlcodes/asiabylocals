import prisma from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const tourTitle = 'Mehtab Bagh Sunrise sightseeing';

async function deleteTour() {
  try {
    console.log(`🔍 Searching for tour: "${tourTitle}"...\n`);
    
    // Find tour by title (case-insensitive)
    const tours = await prisma.tour.findMany({
      where: {
        title: {
          contains: tourTitle,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        city: true,
        country: true,
        status: true
      }
    });

    if (tours.length === 0) {
      console.log('❌ No tour found with that title.');
      console.log('\n📋 Available tours:');
      const allTours = await prisma.tour.findMany({
        select: {
          id: true,
          title: true,
          city: true,
          status: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      });
      allTours.forEach(tour => {
        console.log(`  - ID: ${tour.id} | "${tour.title}" | ${tour.city} | Status: ${tour.status}`);
      });
      process.exit(1);
    }

    if (tours.length > 1) {
      console.log(`⚠️  Found ${tours.length} tours matching that title:\n`);
      tours.forEach(tour => {
        console.log(`  - ID: ${tour.id} | "${tour.title}" | ${tour.city}/${tour.country} | Status: ${tour.status}`);
      });
      console.log('\n❌ Please specify the exact tour ID to delete.');
      process.exit(1);
    }

    const tour = tours[0];
    console.log(`✅ Found tour:`);
    console.log(`   ID: ${tour.id}`);
    console.log(`   Title: "${tour.title}"`);
    console.log(`   Slug: ${tour.slug}`);
    console.log(`   Location: ${tour.city}, ${tour.country}`);
    console.log(`   Status: ${tour.status}\n`);

    // Delete the tour
    console.log('🗑️  Deleting tour...');
    await prisma.tour.delete({
      where: { id: tour.id }
    });

    console.log(`✅ Tour deleted successfully!`);
    console.log(`   Deleted: "${tour.title}" (ID: ${tour.id})`);
  } catch (error) {
    console.error('❌ Error deleting tour:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTour();



