import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkSupplierLogin() {
  const email = process.argv[2] || 'asiabylocals@gmail.com';
  const password = process.argv[3] || null;
  
  console.log('🔍 Checking supplier login for:', email);
  console.log('');
  
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log('📧 Normalized email:', normalizedEmail);
    console.log('');
    
    // Find supplier
    const supplier = await prisma.supplier.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        fullName: true,
        passwordHash: true,
        emailVerified: true,
        status: true,
        createdAt: true
      }
    });
    
    if (!supplier) {
      console.log('❌ Supplier NOT FOUND in database');
      console.log('');
      console.log('🔍 Searching for similar emails...');
      
      const similar = await prisma.supplier.findMany({
        where: {
          email: {
            contains: normalizedEmail.split('@')[0],
            mode: 'insensitive'
          }
        },
        select: {
          email: true,
          fullName: true,
          emailVerified: true
        },
        take: 5
      });
      
      if (similar.length > 0) {
        console.log('   Found similar emails:');
        similar.forEach(s => {
          console.log(`   - ${s.email} (${s.fullName}) - Verified: ${s.emailVerified ? '✅' : '❌'}`);
        });
      } else {
        console.log('   No similar emails found');
      }
      
      console.log('');
      console.log('💡 Solution:');
      console.log('   1. Register again with this email');
      console.log('   2. Or use a different email that exists');
      console.log('   3. Check if you\'re connected to the correct database (production vs local)');
      
      await prisma.$disconnect();
      return;
    }
    
    console.log('✅ Supplier FOUND:');
    console.log('   ID:', supplier.id);
    console.log('   Email:', supplier.email);
    console.log('   Full Name:', supplier.fullName);
    console.log('   Status:', supplier.status);
    console.log('   Email Verified:', supplier.emailVerified ? '✅' : '❌');
    console.log('   Created:', supplier.createdAt);
    console.log('');
    
    if (!supplier.emailVerified) {
      console.log('⚠️ Email is NOT verified!');
      console.log('   You need to verify your email before logging in.');
      console.log('   Check your inbox for the verification link.');
      console.log('');
    }
    
    if (password) {
      console.log('🔐 Testing password...');
      const match = await bcrypt.compare(password, supplier.passwordHash);
      console.log('   Password match:', match ? '✅ YES' : '❌ NO');
      console.log('');
      
      if (!match) {
        console.log('❌ Password is INCORRECT');
        console.log('');
        console.log('💡 Solutions:');
        console.log('   1. Try a different password');
        console.log('   2. Use "Forgot Password" to reset');
        console.log('   3. Check if password was changed after registration');
      } else {
        console.log('✅ Password is CORRECT');
        console.log('');
        if (!supplier.emailVerified) {
          console.log('⚠️ But email is not verified - you still can\'t log in!');
        } else {
          console.log('✅ Everything looks good - you should be able to log in!');
        }
      }
    } else {
      console.log('💡 To test password, run:');
      console.log(`   node check-supplier-login.js "${email}" "your-password"`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  }
  
  await prisma.$disconnect();
}

checkSupplierLogin();

