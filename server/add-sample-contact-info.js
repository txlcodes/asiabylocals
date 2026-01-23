import prisma from './db.js';

const addSampleContactInfo = async () => {
  try {
    console.log('📞 Adding sample contact information to suppliers...\n');

    // Get all suppliers missing contact info
    const suppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { phone: null },
          { whatsapp: null }
        ]
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        whatsapp: true
      }
    });

    if (suppliers.length === 0) {
      console.log('✅ All suppliers already have contact information!');
      await prisma.$disconnect();
      return;
    }

    console.log(`Found ${suppliers.length} supplier(s) missing contact info:\n`);

    // Sample phone numbers (Indian format)
    const sampleNumbers = [
      { phone: '+91 9876543210', whatsapp: '+91 9876543210' },
      { phone: '+91 9876543211', whatsapp: '+91 9876543211' },
      { phone: '+91 9876543212', whatsapp: '+91 9876543212' },
      { phone: '+91 9876543213', whatsapp: '+91 9876543213' },
      { phone: '+91 9876543214', whatsapp: '+91 9876543214' },
    ];

    for (let i = 0; i < suppliers.length; i++) {
      const supplier = suppliers[i];
      const sampleNumber = sampleNumbers[i % sampleNumbers.length];

      const updated = await prisma.supplier.update({
        where: { id: supplier.id },
        data: {
          phone: supplier.phone || sampleNumber.phone,
          whatsapp: supplier.whatsapp || sampleNumber.whatsapp
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          whatsapp: true
        }
      });

      console.log(`✅ Updated Supplier #${updated.id}:`);
      console.log(`   Name: ${updated.fullName}`);
      console.log(`   Email: ${updated.email}`);
      console.log(`   Phone: ${updated.phone}`);
      console.log(`   WhatsApp: ${updated.whatsapp}`);
      console.log('');
    }

    console.log(`\n✅ Successfully added contact information to ${suppliers.length} supplier(s)!`);
    console.log('\n💡 These are sample numbers for testing purposes.');
    console.log('   Suppliers can update them with real numbers in their Profile tab.');

  } catch (error) {
    console.error('❌ Error adding sample contact info:', error);
  } finally {
    await prisma.$disconnect();
  }
};

addSampleContactInfo();




