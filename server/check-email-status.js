import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking Email Configuration...\n');

const resendApiKey = process.env.RESEND_API_KEY;
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_APP_PASSWORD;

console.log('📧 Email Service Configuration:');
console.log(`   RESEND_API_KEY: ${resendApiKey ? '✅ Set (' + resendApiKey.substring(0, 10) + '...)' : '❌ Missing'}`);
console.log(`   SENDGRID_API_KEY: ${sendGridApiKey ? '✅ Set (' + sendGridApiKey.substring(0, 10) + '...)' : '❌ Missing'}`);
console.log(`   EMAIL_USER: ${emailUser ? '✅ Set (' + emailUser + ')' : '❌ Missing'}`);
console.log(`   EMAIL_APP_PASSWORD: ${emailPassword ? '✅ Set (' + emailPassword.length + ' chars)' : '❌ Missing'}\n`);

// Determine which service will be used
let activeService = 'None';
let fromEmail = 'Not configured';

if (resendApiKey) {
  activeService = 'Resend SDK';
  fromEmail = 'info@asiabylocals.com';
} else if (sendGridApiKey) {
  activeService = 'SendGrid SMTP';
  fromEmail = 'info@asiabylocals.com';
} else if (emailUser && emailPassword) {
  activeService = 'Gmail SMTP';
  fromEmail = emailUser;
} else {
  activeService = 'None';
  fromEmail = 'Not configured';
}

console.log('📊 Active Email Service:');
console.log(`   Service: ${activeService}`);
console.log(`   From Email: ${fromEmail}\n`);

if (activeService === 'None') {
  console.log('❌ PROBLEM: No email service is configured!');
  console.log('\n💡 Solution:');
  console.log('   1. Go to Render Dashboard → Your Service → Environment');
  console.log('   2. Add RESEND_API_KEY (recommended)');
  console.log('      - Sign up at: https://resend.com/signup');
  console.log('      - Get API key from dashboard');
  console.log('      - Add to Render: RESEND_API_KEY=re_...');
  console.log('   3. Redeploy (happens automatically)');
} else if (activeService === 'Gmail SMTP') {
  console.log('⚠️  WARNING: Gmail SMTP may not work on Render!');
  console.log('   Gmail blocks cloud providers like Render.');
  console.log('   Recommendation: Use Resend instead (RESEND_API_KEY)');
} else {
  console.log('✅ Email service is configured!');
  console.log('\n🧪 To test email sending:');
  console.log('   curl -X POST https://www.asiabylocals.com/api/test-email \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"email": "your-email@gmail.com"}\'');
}

