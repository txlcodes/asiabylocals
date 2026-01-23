import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from './utils/email.js';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function resendVerification(email) {
  try {
    console.log(`📧 Resending verification email to: ${email}\n`);
    
    // Find supplier by email
    const supplier = await prisma.supplier.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        emailVerificationToken: true,
        emailVerificationExpires: true
      }
    });

    if (!supplier) {
      console.log(`❌ No supplier found with email: ${email}`);
      return;
    }

    if (supplier.emailVerified) {
      console.log(`✅ Email ${email} is already verified!`);
      console.log(`   Supplier ID: ${supplier.id}`);
      console.log(`   Name: ${supplier.fullName}`);
      return;
    }

    console.log(`📋 Supplier found:`);
    console.log(`   ID: ${supplier.id}`);
    console.log(`   Name: ${supplier.fullName}`);
    console.log(`   Email: ${supplier.email}`);
    console.log(`   Verified: ${supplier.emailVerified}`);
    console.log(`   Current Token: ${supplier.emailVerificationToken ? supplier.emailVerificationToken.substring(0, 20) + '...' : 'None'}`);
    console.log('');

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 48); // 48 hours expiry

    console.log(`🔑 Generating new verification token...`);
    console.log(`   Token: ${verificationToken.substring(0, 20)}...`);
    console.log(`   Expires: ${verificationExpires.toLocaleString()}`);
    console.log('');

    // Update supplier with new token
    await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    console.log(`✅ Token updated in database`);
    console.log('');

    // Send verification email
    console.log(`📤 Sending verification email...`);
    try {
      const emailResult = await sendVerificationEmail(
        supplier.email,
        supplier.fullName,
        verificationToken
      );
      
      console.log(`✅ Verification email sent successfully!`);
      console.log(`   Message ID: ${emailResult.messageId || 'N/A'}`);
      console.log(`   To: ${supplier.email}`);
      console.log(`   From: info@asiabylocals.com`);
      console.log('');
      console.log(`📬 The user should receive the email shortly.`);
      console.log(`   They can click the verification link to verify their email.`);
      
    } catch (emailError) {
      console.error(`❌ Failed to send verification email:`);
      console.error(`   Error: ${emailError.message || emailError}`);
      console.error(`   Full error:`, emailError);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node resend-verification.js <email>');
  console.log('Example: node resend-verification.js bilalmohd3160@gmail.com');
  process.exit(1);
}

resendVerification(email);

