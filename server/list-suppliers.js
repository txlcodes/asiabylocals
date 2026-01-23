import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listSuppliers() {
  try {
    console.log('📋 Fetching all registered suppliers...\n');
    
    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        emailVerificationExpires: true,
        businessType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${suppliers.length} registered suppliers\n`);
    console.log('='.repeat(100));
    console.log('SUPPLIER LIST');
    console.log('='.repeat(100));
    console.log('');

    if (suppliers.length === 0) {
      console.log('No suppliers found in database.');
      return;
    }

    suppliers.forEach((supplier, index) => {
      const createdDate = new Date(supplier.createdAt).toLocaleString();
      const expiresDate = supplier.emailVerificationExpires 
        ? new Date(supplier.emailVerificationExpires).toLocaleString()
        : 'N/A';
      
      const isExpired = supplier.emailVerificationExpires 
        ? new Date(supplier.emailVerificationExpires) < new Date()
        : false;
      
      const verificationStatus = supplier.emailVerified 
        ? '✅ VERIFIED' 
        : (isExpired ? '⏰ EXPIRED' : '⏳ PENDING');
      
      console.log(`${index + 1}. ID: ${supplier.id}`);
      console.log(`   Email: ${supplier.email}`);
      console.log(`   Name: ${supplier.fullName || 'N/A'}`);
      console.log(`   Business Type: ${supplier.businessType || 'N/A'}`);
      console.log(`   Status: ${supplier.status}`);
      console.log(`   Verification: ${verificationStatus}`);
      console.log(`   Registered: ${createdDate}`);
      if (!supplier.emailVerified && supplier.emailVerificationExpires) {
        console.log(`   Token Expires: ${expiresDate} ${isExpired ? '(EXPIRED)' : ''}`);
      }
      console.log('');
    });

    // Summary statistics
    console.log('='.repeat(100));
    console.log('SUMMARY');
    console.log('='.repeat(100));
    const verified = suppliers.filter(s => s.emailVerified).length;
    const pending = suppliers.filter(s => !s.emailVerified).length;
    const expired = suppliers.filter(s => 
      !s.emailVerified && 
      s.emailVerificationExpires && 
      new Date(s.emailVerificationExpires) < new Date()
    ).length;
    
    console.log(`Total Suppliers: ${suppliers.length}`);
    console.log(`✅ Verified: ${verified}`);
    console.log(`⏳ Pending Verification: ${pending}`);
    console.log(`⏰ Expired Tokens: ${expired}`);
    console.log(`📧 Fresh (Unverified, Not Expired): ${pending - expired}`);
    console.log('');

    // List fresh emails (unverified and not expired)
    const freshEmails = suppliers.filter(s => 
      !s.emailVerified && 
      (!s.emailVerificationExpires || new Date(s.emailVerificationExpires) >= new Date())
    );

    if (freshEmails.length > 0) {
      console.log('='.repeat(100));
      console.log('FRESH EMAILS (Ready for Testing)');
      console.log('='.repeat(100));
      freshEmails.forEach((supplier, index) => {
        console.log(`${index + 1}. ${supplier.email} (ID: ${supplier.id}) - Registered: ${new Date(supplier.createdAt).toLocaleString()}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error fetching suppliers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listSuppliers();
