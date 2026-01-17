import prisma from './db.js';

async function listSuppliers() {
  try {
    console.log('📋 Listing all suppliers...\n');
    
    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        companyName: true,
        status: true,
        emailVerified: true,
        phone: true,
        whatsapp: true,
        city: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Total Suppliers: ${suppliers.length}\n`);
    console.log('=' .repeat(80));
    
    suppliers.forEach((supplier, index) => {
      console.log(`\n${index + 1}. Supplier ID: ${supplier.id}`);
      console.log(`   Email: ${supplier.email}`);
      console.log(`   Full Name: ${supplier.fullName}`);
      if (supplier.companyName) {
        console.log(`   Company: ${supplier.companyName}`);
      }
      console.log(`   Status: ${supplier.status}`);
      console.log(`   Email Verified: ${supplier.emailVerified ? 'Yes' : 'No'}`);
      if (supplier.phone) {
        console.log(`   Phone: ${supplier.phone}`);
      }
      if (supplier.whatsapp) {
        console.log(`   WhatsApp: ${supplier.whatsapp}`);
      }
      if (supplier.city) {
        console.log(`   City: ${supplier.city}`);
      }
      console.log(`   Created: ${supplier.createdAt.toLocaleDateString()}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${suppliers.length}`);
    console.log(`   Approved: ${suppliers.filter(s => s.status === 'approved').length}`);
    console.log(`   Pending: ${suppliers.filter(s => s.status === 'pending').length}`);
    console.log(`   Rejected: ${suppliers.filter(s => s.status === 'rejected').length}`);
    console.log(`   Email Verified: ${suppliers.filter(s => s.emailVerified).length}`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing suppliers:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

listSuppliers();

