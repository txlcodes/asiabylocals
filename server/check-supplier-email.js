import prisma from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkSupplierEmail() {
  try {
    const emailToCheck = process.argv[2] || 'nawaztalha14@gmail.com';
    
    console.log(`🔍 Checking supplier email: ${emailToCheck}\n`);
    
    // Normalize email (same as backend does)
    const normalizedEmail = emailToCheck.trim().toLowerCase();
    console.log(`   Normalized email: ${normalizedEmail}\n`);
    
    // Find supplier by email
    const supplier = await prisma.supplier.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        emailVerificationToken: true,
        emailVerificationExpires: true,
        createdAt: true
      }
    });
    
    if (supplier) {
      console.log('✅ Supplier found:');
      console.log(`   ID: ${supplier.id}`);
      console.log(`   Email in DB: ${supplier.email}`);
      console.log(`   Full Name: ${supplier.fullName}`);
      console.log(`   Email Verified: ${supplier.emailVerified}`);
      console.log(`   Created At: ${supplier.createdAt}`);
      if (supplier.emailVerificationToken) {
        console.log(`   Verification Token: ${supplier.emailVerificationToken.substring(0, 20)}...`);
        console.log(`   Token Expires: ${supplier.emailVerificationExpires}`);
      }
    } else {
      console.log('❌ Supplier not found with this email');
      
      // Check for similar emails
      console.log('\n🔍 Searching for similar emails...');
      const allSuppliers = await prisma.supplier.findMany({
        select: {
          id: true,
          email: true,
          fullName: true
        },
        take: 20,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`\n📋 Recent suppliers (last 20):`);
      allSuppliers.forEach(s => {
        const isSimilar = s.email.includes('nawaz') || s.email.includes('talha');
        console.log(`   ${isSimilar ? '⭐' : '  '} ${s.email} (${s.fullName})`);
      });
    }
    
    // Also check if there are multiple accounts with similar emails
    console.log('\n🔍 Checking for accounts with "nawaz" or "talha" in email...');
    const similarSuppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { email: { contains: 'nawaz', mode: 'insensitive' } },
          { email: { contains: 'talha', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    if (similarSuppliers.length > 0) {
      console.log(`\n📋 Found ${similarSuppliers.length} account(s) with similar emails:`);
      similarSuppliers.forEach(s => {
        console.log(`   - ${s.email} (${s.fullName}) - Verified: ${s.emailVerified} - Created: ${s.createdAt}`);
      });
    } else {
      console.log('   No accounts found with "nawaz" or "talha" in email');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSupplierEmail();

