// Simple email test
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

console.log('📧 Testing email from asiabylocals@gmail.com...');
console.log('');

// Test email verification
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 Fix:');
      console.error('1. Check EMAIL_APP_PASSWORD in .env file');
      console.error('2. Make sure you\'re using App Password, not regular password');
      console.error('3. Verify 2-Step Verification is enabled');
    }
    process.exit(1);
  } else {
    console.log('✅ Email server is ready!');
    console.log('✅ Configuration correct');
    console.log('✅ Emails will be sent from: asiabylocals@gmail.com');
    console.log('');
    console.log('📬 To test sending:');
    console.log('   1. Register a supplier through the frontend');
    console.log('   2. Check the email inbox for verification email');
    console.log('   3. Email will come from: asiabylocals@gmail.com');
    process.exit(0);
  }
});


