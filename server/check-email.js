// Quick email check
import dotenv from 'dotenv';
dotenv.config();

console.log('📧 Email Configuration Check');
console.log('============================');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('');

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  console.log('✅ Email credentials are configured');
  console.log(`📬 Emails will be sent FROM: ${process.env.EMAIL_USER}`);
  console.log('');
  console.log('Testing email transporter...');
  
  import('./utils/email.js').then(() => {
    console.log('✅ Email module loaded successfully');
    console.log('✅ Check server logs for: "Email server is ready to send messages"');
    process.exit(0);
  }).catch(e => {
    console.error('❌ Error loading email module:', e.message);
    process.exit(1);
  });
} else {
  console.error('❌ Email credentials missing!');
  process.exit(1);
}




