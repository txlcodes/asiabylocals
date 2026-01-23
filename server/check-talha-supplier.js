import prisma from './db.js';

async function checkTalhaSupplier() {
  try {
    // Find Talha Nawaz supplier
    const suppliers = await prisma.supplier.findMany({
      where: {
        fullName: {
          contains: 'Talha'
        }
      },
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
    
    console.log(`🔍 Found ${suppliers.length} supplier(s) with name containing "Talha"\n`);
    
    suppliers.forEach((supplier, index) => {
      console.log(`\n${index + 1}. Supplier Details:`);
      console.log(`   ID: ${supplier.id}`);
      console.log(`   Email: ${supplier.email}`);
      console.log(`   Full Name: ${supplier.fullName}`);
      console.log(`   Status: ${supplier.status}`);
      console.log(`   Email Verified: ${supplier.emailVerified}`);
      console.log(`   Phone: ${supplier.phone || 'Not set'}`);
      console.log(`   WhatsApp: ${supplier.whatsapp || 'Not set'}`);
      console.log(`   Created: ${supplier.createdAt}`);
      
      // Check what would be returned on login
      const supplierResponse = {
        id: String(supplier.id),
        email: supplier.email,
        fullName: supplier.fullName,
        status: supplier.status,
        emailVerified: supplier.emailVerified,
        phone: supplier.phone,
        whatsapp: supplier.whatsapp
      };
      
      console.log(`\n   📤 What gets stored in localStorage:`);
      console.log(`   ${JSON.stringify(supplierResponse, null, 2)}`);
      
      // Validate structure
      console.log(`\n   ✅ Validation:`);
      console.log(`   Has id: ${!!supplierResponse.id}`);
      console.log(`   Has email: ${!!supplierResponse.email}`);
      console.log(`   Can create tours: ${supplierResponse.status === 'approved' && supplierResponse.emailVerified && (!!supplierResponse.phone || !!supplierResponse.whatsapp)}`);
    });
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking supplier:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTalhaSupplier();



