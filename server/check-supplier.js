import prisma from './db.js';

async function checkSupplier() {
  try {
    const email = 'txlweb3@gmail.com';
    console.log(`🔍 Checking supplier: ${email}\n`);
    
    const supplier = await prisma.supplier.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
        emailVerified: true,
        phone: true,
        whatsapp: true,
        createdAt: true
      }
    });
    
    if (!supplier) {
      console.log('❌ Supplier not found');
      await prisma.$disconnect();
      process.exit(1);
    }
    
    console.log('📋 Supplier Details:');
    console.log(`   ID: ${supplier.id}`);
    console.log(`   Email: ${supplier.email}`);
    console.log(`   Full Name: ${supplier.fullName}`);
    console.log(`   Status: ${supplier.status}`);
    console.log(`   Email Verified: ${supplier.emailVerified}`);
    console.log(`   Phone: ${supplier.phone || 'Not set'}`);
    console.log(`   WhatsApp: ${supplier.whatsapp || 'Not set'}`);
    console.log(`   Created: ${supplier.createdAt}`);
    
    console.log('\n✅ Tour Creation Requirements Check:');
    
    const checks = {
      'Supplier exists': true,
      'Supplier is approved': supplier.status === 'approved',
      'Email is verified': supplier.emailVerified,
      'Has email': !!supplier.email,
      'Has phone or WhatsApp': !!(supplier.phone || supplier.whatsapp)
    };
    
    let canCreateTours = true;
    for (const [check, passed] of Object.entries(checks)) {
      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${check}`);
      if (!passed) canCreateTours = false;
    }
    
    console.log('\n📊 Result:');
    if (canCreateTours) {
      console.log('   ✅ YES - This supplier CAN create tours');
    } else {
      console.log('   ❌ NO - This supplier CANNOT create tours');
      console.log('\n⚠️  Issues to fix:');
      if (supplier.status !== 'approved') {
        console.log(`   • Supplier status is "${supplier.status}" - needs to be "approved"`);
      }
      if (!supplier.emailVerified) {
        console.log('   • Email is not verified');
      }
      if (!supplier.phone && !supplier.whatsapp) {
        console.log('   • Missing phone number or WhatsApp number');
      }
    }
    
    // Check existing tours
    const tours = await prisma.tour.findMany({
      where: { supplierId: supplier.id },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true
      }
    });
    
    console.log(`\n📝 Existing Tours: ${tours.length}`);
    if (tours.length > 0) {
      tours.forEach(tour => {
        console.log(`   • ${tour.title} (${tour.city}, ${tour.country}) - ${tour.status}`);
      });
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking supplier:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkSupplier();

