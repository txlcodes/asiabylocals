import prisma from './db.js';

async function approveAllSuppliers() {
  try {
    console.log('🔄 Approving all suppliers...');
    
    const result = await prisma.supplier.updateMany({
      where: {
        status: {
          in: ['pending', 'rejected']
        }
      },
      data: {
        status: 'approved'
      }
    });
    
    console.log(`✅ Approved ${result.count} suppliers`);
    
    // Also approve any suppliers that might have other statuses
    const allSuppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true
      }
    });
    
    console.log(`\n📊 Current supplier statuses:`);
    allSuppliers.forEach(supplier => {
      console.log(`   ${supplier.email} (${supplier.fullName}): ${supplier.status}`);
    });
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error approving suppliers:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

approveAllSuppliers();

