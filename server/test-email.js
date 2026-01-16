// Quick test script to verify email is working
import dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/email.js';

dotenv.config();

// Test email
const testEmail = process.argv[2] || 'test@example.com';
const testName = 'Test User';
const testToken = 'test-token-12345';

console.log('📧 Testing email from asiabylocals@gmail.com...');
console.log(`To: ${testEmail}`);
console.log(`From: asiabylocals@gmail.com`);
console.log('');

sendVerificationEmail(testEmail, testName, testToken)
  .then(result => {
    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Check ${testEmail} inbox for verification email from asiabylocals@gmail.com`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to send email:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 Make sure:');
      console.error('1. EMAIL_APP_PASSWORD is set in .env file');
      console.error('2. You\'re using App Password, not regular password');
      console.error('3. 2-Step Verification is enabled on asiabylocals@gmail.com');
    }
    process.exit(1);
  });


