// Send test email to verify the new template
import dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/email.js';

dotenv.config();

const testEmail = 'txlweb3@gmail.com';
const testName = 'Test User';
const testToken = 'test-verification-token-' + Date.now();

console.log('📧 Sending test email to:', testEmail);
console.log('📬 From: asiabylocals@gmail.com');
console.log('📋 Template: New GetYourGuide-style design');
console.log('');

sendVerificationEmail(testEmail, testName, testToken)
  .then(result => {
    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log('');
    console.log('📬 Check the inbox at:', testEmail);
    console.log('📧 Email will be from: asiabylocals@gmail.com');
    console.log('📋 Subject: AsiaByLocals Registration Confirmation');
    console.log('');
    console.log('✨ The email features:');
    console.log('   - Professional GetYourGuide-style design');
    console.log('   - Green brand colors (#10B981)');
    console.log('   - Clean layout with CTA button');
    console.log('   - Footer with social media links');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to send email:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 Email configuration issue:');
      console.error('   Check EMAIL_APP_PASSWORD in .env file');
    }
    process.exit(1);
  });

