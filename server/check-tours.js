const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTours() {
  try {
    console.log('🔍 Checking tours in database...\n');
    
    const tours = await prisma.tour.findMany({
      include: {
        supplier: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (tours.length === 0) {
      console.log('❌ No tours found in database yet.');
      console.log('\n📝 To create a tour:');
      console.log('   1. Go to http://localhost:3000/supplier');
      console.log('   2. Login/Register as supplier');
      console.log('   3. Click "Create New Tour"');
      console.log('   4. Fill in all fields for Agra');
      console.log('   5. Submit for review\n');
      return;
    }

    console.log(`✅ Found ${tours.length} tour(s) in database:\n`);
    
    tours.forEach((tour, index) => {
      console.log(`📋 Tour #${index + 1}:`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Title: ${tour.title}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Country: ${tour.country}`);
      console.log(`   City: ${tour.city}`);
      console.log(`   Category: ${tour.category}`);
      console.log(`   Status: ${tour.status}`);
      console.log(`   Price: ${tour.currency} ${tour.pricePerPerson} per person`);
      console.log(`   Supplier: ${tour.supplier.fullName} (${tour.supplier.email})`);
      console.log(`   Created: ${tour.createdAt.toLocaleString()}`);
      
      // Parse JSON fields
      const locations = JSON.parse(tour.locations || '[]');
      const images = JSON.parse(tour.images || '[]');
      const languages = JSON.parse(tour.languages || '[]');
      
      console.log(`   Locations: ${locations.join(', ') || 'None'}`);
      console.log(`   Images: ${images.length} photos`);
      console.log(`   Languages: ${languages.join(', ')}`);
      
      // Show URLs
      const countrySlug = tour.country.toLowerCase().replace(/\s+/g, '-');
      const citySlug = tour.city.toLowerCase().replace(/\s+/g, '-');
      console.log(`   City Page: http://localhost:3000/${countrySlug}/${citySlug}`);
      console.log(`   Tour Page: http://localhost:3000/${countrySlug}/${citySlug}/${tour.slug}`);
      
      if (tour.status === 'approved') {
        console.log(`   ✅ LIVE - Visible on city page!`);
      } else if (tour.status === 'pending') {
        console.log(`   ⏳ PENDING - Waiting for admin approval`);
      } else {
        console.log(`   📝 DRAFT - Not yet submitted`);
      }
      
      console.log('');
    });

    // Summary by city
    const toursByCity = tours.reduce((acc, tour) => {
      const key = `${tour.country}/${tour.city}`;
      if (!acc[key]) acc[key] = { total: 0, approved: 0, pending: 0, draft: 0 };
      acc[key].total++;
      acc[key][tour.status] = (acc[key][tour.status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Summary by City:');
    Object.entries(toursByCity).forEach(([city, stats]) => {
      console.log(`   ${city}:`);
      console.log(`      Total: ${stats.total}`);
      console.log(`      Approved: ${stats.approved} (live)`);
      console.log(`      Pending: ${stats.pending} (awaiting review)`);
      console.log(`      Draft: ${stats.draft} (not submitted)`);
    });

  } catch (error) {
    console.error('❌ Error checking tours:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTours();


