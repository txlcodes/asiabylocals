import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Check email service configuration
// Priority: Resend (easiest) > SendGrid > Gmail SMTP
const resendApiKey = process.env.RESEND_API_KEY;
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_APP_PASSWORD;

let transporter;
let resendClient = null;

if (resendApiKey) {
  // Use Resend SDK (recommended - more reliable than SMTP)
  console.log('📧 Using Resend SDK for email delivery');
  console.log('   RESEND_API_KEY: ✅ Set');
  console.log('   From Email: info@asiabylocals.com');
  resendClient = new Resend(resendApiKey);
  // Create a dummy transporter for compatibility (we'll use Resend SDK directly)
  transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false
  });
} else if (sendGridApiKey) {
  // Use SendGrid SMTP (recommended for cloud providers like Render)
  console.log('📧 Using SendGrid SMTP for email delivery');
  console.log('   SENDGRID_API_KEY: ✅ Set');
  console.log('   From Email: info@asiabylocals.com');
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey', // Must be exactly 'apikey' for SendGrid
      pass: sendGridApiKey // Your SendGrid API key
    },
    tls: {
      rejectUnauthorized: false
    }
  });
} else if (emailUser && emailPassword) {
  // Fallback to Gmail SMTP (may have connection issues on cloud providers)
  console.log('📧 Using Gmail SMTP for email delivery');
  console.log('   EMAIL_USER:', emailUser);
  console.log('   EMAIL_APP_PASSWORD: ✅ Set (' + emailPassword.length + ' chars)');
  console.log('   ⚠️ Note: Gmail SMTP may timeout on cloud providers. Consider using SendGrid.');
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    pool: true,
    maxConnections: 1,
    maxMessages: 3
  });
} else {
  console.warn('⚠️ Email credentials not configured!');
  console.warn('   Option 1 (Easiest): Set RESEND_API_KEY in Render');
  console.warn('   Option 2: Set SENDGRID_API_KEY in Render');
  console.warn('   Option 3: Set EMAIL_USER and EMAIL_APP_PASSWORD in Render');
  console.warn('   Email sending will fail until one is configured.');
  // Create a dummy transporter to prevent crashes
  transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false
  });
}

// Verify transporter configuration (skip if using Resend SDK)
if (!resendClient) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter verification failed:');
      console.error('   Error:', error.message);
      console.error('   Code:', error.code);
      if (error.code === 'EAUTH') {
        console.error('   ⚠️ Authentication failed! Check EMAIL_USER and EMAIL_APP_PASSWORD');
        console.error('   Make sure you\'re using a Gmail App Password, not your regular password.');
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
        console.error('   ⚠️ Connection timeout! Gmail SMTP might be blocked or unreachable.');
      }
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('✅ Resend SDK initialized - ready to send messages');
}

/**
 * Send verification email to supplier
 * @param {string} email - Recipient email address
 * @param {string} fullName - Supplier's full name
 * @param {string} verificationToken - Email verification token
 * @param {string} language - Language code ('en' or 'ja'), defaults to 'en'
 * @returns {Promise<Object>}
 */
export const sendVerificationEmail = async (email, fullName, verificationToken, language = 'en') => {
  // Check if email is configured
  if (!resendApiKey && !sendGridApiKey && (!emailUser || !emailPassword)) {
    const errorMsg = 'Email not configured. Please set RESEND_API_KEY (easiest), SENDGRID_API_KEY, or EMAIL_USER + EMAIL_APP_PASSWORD in Render environment variables.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate email parameter
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.error('❌ Invalid email address provided:', email);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Attempting to send verification email to: ${email}`);
  console.log(`   ⚠️ VERIFICATION: Email address being used: ${email}`);
  console.log(`   Email length: ${email.length}`);
  console.log(`   Email contains @: ${email.includes('@')}`);
  // Use info@asiabylocals.com for Resend (domain verified!) or SendGrid
  // Domain verified! Using info@asiabylocals.com
  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (emailUser || 'asiabylocals@gmail.com');
  const serviceName = resendApiKey ? 'Resend' : (sendGridApiKey ? 'SendGrid' : 'Gmail SMTP');
  console.log(`   From: ${fromEmail}`);
  console.log(`   Service: ${serviceName}`);
  console.log(`   To: ${email}`);
  // URL encode the token to prevent issues with email clients modifying the URL
  const encodedToken = encodeURIComponent(verificationToken);
  const verificationUrl = `${process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${encodedToken}`;

  // Email content based on language
  const isJapanese = language === 'ja';
  
  const emailContent = {
    en: {
      subject: 'AsiaByLocals Registration Confirmation',
      greeting: 'Dear supply partner,',
      body1: `Thanks for setting up your account — we're thrilled that you're partnering with us. This is the first step in your journey towards becoming an AsiaByLocals supply partner and delivering amazing travel experiences across Asia.`,
      body2: 'Once you confirm your email address below, you can already create activities on the AsiaByLocals Supplier Portal.',
      body3: `In the meantime, if you have any questions, please don't hesitate to reach out to us via the <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #0071EB; text-decoration: none;">contact form</a> in the <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/help" style="color: #0071EB; text-decoration: none;">Help Center</a>.`,
      englishNote: '', // Not needed for English emails
      buttonText: 'Confirm your email',
      fallbackText: 'If the above link does not work, please copy the following link into your browser\'s address bar:',
      closing: 'Best regards,<br><strong>The AsiaByLocals Team</strong>',
      footerLink1: 'Become a Supply Partner',
      footerLink2: 'Contact us',
      footerLink3: 'FAQ',
      textBody: `Welcome to AsiaByLocals!\n\nHi ${fullName},\n\nThank you for registering with AsiaByLocals! Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 48 hours.\n\nIf you didn't create an account with AsiaByLocals, please ignore this email.\n\n© 2025 AsiaByLocals`
    },
    ja: {
      subject: 'AsiaByLocals 登録確認',
      greeting: 'サプライパートナーの皆様へ',
      body1: 'アカウントの設定ありがとうございます。私たちと提携していただき、大変嬉しく思います。これは、AsiaByLocalsのサプライパートナーとなり、アジア全体で素晴らしい旅行体験を提供するための旅の第一歩です。',
      body2: '以下のメールアドレスを確認すると、AsiaByLocalsサプライヤーポータルでアクティビティを作成できるようになります。',
      body3: `ご質問がございましたら、<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #0071EB; text-decoration: none;">ヘルプセンター</a>の<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/help" style="color: #0071EB; text-decoration: none;">お問い合わせフォーム</a>からお気軽にお問い合わせください。`,
      englishNote: '<strong>重要：</strong>ツアーやアクティビティの作成時は、必ず英語でご入力ください。タイトル、説明、その他すべての情報を英語で作成していただく必要があります。',
      buttonText: 'メールアドレスを確認',
      fallbackText: '上記のリンクが機能しない場合は、以下のリンクをブラウザのアドレスバーにコピーしてください：',
      closing: '敬具<br><strong>AsiaByLocalsチーム</strong>',
      footerLink1: 'サプライパートナーになる',
      footerLink2: 'お問い合わせ',
      footerLink3: 'よくある質問',
      textBody: `AsiaByLocalsへようこそ！\n\n${fullName}様\n\nAsiaByLocalsにご登録いただき、ありがとうございます！以下のリンクをクリックしてメールアドレスを確認してください：\n\n${verificationUrl}\n\nこのリンクは48時間で期限切れになります。\n\n重要：ツアーやアクティビティの作成時は、必ず英語でご入力ください。タイトル、説明、その他すべての情報を英語で作成していただく必要があります。\n\nAsiaByLocalsでアカウントを作成していない場合は、このメールを無視してください。\n\n© 2025 AsiaByLocals`
    }
  };
  
  const content = emailContent[isJapanese ? 'ja' : 'en'];

  const mailOptions = {
    from: `"AsiaByLocals Registration" <${fromEmail}>`,
    to: email,
    subject: content.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #ffffff;">
                      <div style="margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #10B981; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h1>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        ${content.greeting}
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        ${content.body1}
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        ${content.body2}
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        ${content.body3}
                      </p>
                      
                      ${isJapanese ? `
                      <!-- Important Note for Japanese Suppliers -->
                      <div style="margin: 30px 0; padding: 20px; background-color: #FFF4E6; border-left: 4px solid #FFA500; border-radius: 4px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #001A33;">
                          ${content.englishNote}
                        </p>
                      </div>
                      ` : ''}
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${verificationUrl}" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                              ${content.buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Fallback Link -->
                      <p style="margin: 30px 0 10px 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        ${content.fallbackText}
                      </p>
                      <p style="margin: 0 0 30px 0; font-size: 12px; line-height: 1.5; color: #0071EB; word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 4px; border: 1px solid #e9ecef;">
                        ${verificationUrl}
                      </p>
                      
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        ${content.closing}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h2>
                      </div>
                      
                      <!-- Social Media Icons -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="https://facebook.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">f</a>
                            <a href="https://twitter.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">🐦</a>
                            <a href="https://instagram.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">📷</a>
                            <a href="https://linkedin.com/company/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">in</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved.
                      </p>
                      
                      <!-- Footer Links -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/become-a-supplier" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink1}</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink2}</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink3}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: content.textBody
  };

  try {
    // Use Resend SDK if available (more reliable than SMTP)
    if (resendClient) {
      console.log(`📧 Sending via Resend SDK to: ${email}`);
      console.log(`   From: ${fromEmail}`);
      
      console.log(`📤 Sending email via Resend SDK:`);
      console.log(`   To: ${email}`);
      console.log(`   From: ${fromEmail}`);
      console.log(`   Subject: AsiaByLocals Registration Confirmation`);
      
      const result = await resendClient.emails.send({
        from: `AsiaByLocals Registration <${fromEmail}>`,
        to: email,
        subject: content.subject,
        html: mailOptions.html,
        text: mailOptions.text
      });
      
      console.log(`📬 Resend API Response:`);
      console.log(`   Result:`, JSON.stringify(result, null, 2));
      
      // Check if Resend returned an error
      if (result.error) {
        console.error(`❌ Resend API Error:`);
        console.error('   Error:', result.error);
        throw new Error(`Resend API Error: ${JSON.stringify(result.error)}`);
      }
      
      console.log(`✅ Verification email sent successfully to ${email}`);
      console.log('📬 Message ID:', result.data?.id);
      console.log('📧 Resend Response:', JSON.stringify(result.data));
      return { success: true, messageId: result.data?.id };
    }
    
    // Fallback to nodemailer for SendGrid/Gmail
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to ${email}`);
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending verification email to ${email}:`);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Full error:', error);
    
    // Resend-specific error handling
    if (resendClient) {
      console.error('   ⚠️ Resend API Error!');
      if (error.message?.includes('Invalid API key') || error.message?.includes('Unauthorized')) {
        console.error('   → RESEND_API_KEY is invalid or expired');
        console.error('   → Go to https://resend.com/api-keys and create a new API key');
        console.error('   → Update RESEND_API_KEY in Render environment variables');
      } else if (error.message?.includes('domain') || error.message?.includes('Domain')) {
        console.error('   → Domain verification issue');
        console.error('   → Go to https://resend.com/domains and verify asiabylocals.com');
        console.error('   → Follow DNS setup guide: GODADDY_DNS_SETUP_RESEND.md');
      } else if (error.message?.includes('rate limit') || error.message?.includes('Rate limit')) {
        console.error('   → Resend rate limit exceeded');
        console.error('   → Free tier: 100 emails/day, 3,000/month');
        console.error('   → Wait a few hours or upgrade plan');
      } else {
        console.error('   → Check Resend dashboard: https://resend.com/logs');
        console.error('   → Verify API key is correct in Render');
      }
    }
    
    // Nodemailer error handling
    if (error.code === 'EAUTH') {
      console.error('   ⚠️ Authentication failed!');
      console.error('   → Check EMAIL_USER and EMAIL_APP_PASSWORD in Render');
      console.error('   → Make sure you\'re using a Gmail App Password (16 characters)');
      console.error('   → Not your regular Gmail password!');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.error('   ⚠️ Connection timeout!');
      console.error('   → Gmail SMTP might be blocking connections from Render');
      console.error('   → Check firewall/network settings');
      console.error('   → Try again in a few minutes');
    } else if (!emailUser || !emailPassword) {
      console.error('   ⚠️ Email credentials not configured!');
      console.error('   → Set EMAIL_USER and EMAIL_APP_PASSWORD in Render environment variables');
    }
    
    throw error;
  }
};

/**
 * Send welcome email after email verification
 * @param {string} email - Recipient email address
 * @param {string} fullName - Supplier's full name
 * @returns {Promise<Object>}
 */
export const sendWelcomeEmail = async (email, fullName) => {
  // Validate email parameter
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.error('❌ Invalid email address provided:', email);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Attempting to send welcome email to: ${email}`);
  const mailOptions = {
    from: `"AsiaByLocals" <${sendGridApiKey ? 'info@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com')}>`,
    to: email,
    subject: 'Welcome to AsiaByLocals - Your Account is Verified!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #ffffff;">
                      <div style="margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #10B981; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h1>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Dear ${fullName},
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Great news! Your email has been successfully verified. Your account is now active and ready to use.
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Our team will review your application and get back to you within 48 hours. In the meantime, you can:
                      </p>
                      
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Complete your business profile</li>
                        <li style="margin-bottom: 10px;">Explore our partner resources</li>
                        <li style="margin-bottom: 10px;">Prepare your activity listings</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/supplier/dashboard" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                              Go to Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        If you have any questions, feel free to reach out to our support team via the <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #0071EB; text-decoration: none;">contact form</a>.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>The AsiaByLocals Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h2>
                      </div>
                      
                      <!-- Social Media Icons -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="https://facebook.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">f</a>
                            <a href="https://twitter.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">🐦</a>
                            <a href="https://instagram.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">📷</a>
                            <a href="https://linkedin.com/company/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">in</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved.
                      </p>
                      
                      <!-- Footer Links -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/become-a-supplier" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink1}</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink2}</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">${content.footerLink3}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent successfully to ${email}`);
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${email}:`, error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

/**
 * Send booking notification email to supplier
 * @param {string} supplierEmail - Supplier's email address
 * @param {string} supplierName - Supplier's name
 * @param {object} bookingDetails - Booking information
 * @returns {Promise<Object>}
 */
export const sendBookingNotificationEmail = async (supplierEmail, supplierName, bookingDetails) => {
  if (!supplierEmail || typeof supplierEmail !== 'string' || !supplierEmail.includes('@')) {
    console.error('❌ Invalid email address provided:', supplierEmail);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Sending booking notification email to supplier: ${supplierEmail}`);
  
  const { bookingReference, tourTitle, customerName, customerEmail, customerPhone, bookingDate, numberOfGuests, totalAmount, currency, specialRequests } = bookingDetails;
  
  const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com');
  const mailOptions = {
    from: `"AsiaByLocals Bookings" <${fromEmail}>`,
    to: supplierEmail,
    subject: `New Booking Received: ${tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #10B981;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                        🎉 New Booking Received!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Dear ${supplierName},
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        You have received a new booking for your tour. Please review the details below and contact the customer to confirm and finalize arrangements.
                      </p>
                      
                      <!-- Booking Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Booking Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          ${bookingReference ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Booking Reference:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 700; font-size: 16px;">${bookingReference}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Tour:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${tourTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Date:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${formattedDate}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Guests:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Total Amount:</td>
                            <td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 18px;">${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Customer Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Customer Information</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Name:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${customerName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Email:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="mailto:${customerEmail}" style="color: #0071EB; text-decoration: none;">${customerEmail}</a>
                            </td>
                          </tr>
                          ${customerPhone ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="tel:${customerPhone}" style="color: #0071EB; text-decoration: none;">${customerPhone}</a>
                            </td>
                          </tr>
                          ` : ''}
                          ${specialRequests ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; vertical-align: top;">Special Requests:</td>
                            <td style="padding: 8px 0; color: #001A33;">${specialRequests}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        <strong>Next Steps:</strong>
                      </p>
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Contact the customer via email or phone to confirm the booking</li>
                        <li style="margin-bottom: 10px;">Arrange payment and finalize details</li>
                        <li style="margin-bottom: 10px;">Provide meeting point details and any additional information</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/supplier/dashboard" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                              View Booking in Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>The AsiaByLocals Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      New Booking Received!
      
      Dear ${supplierName},
      
      You have received a new booking for your tour: ${tourTitle}
      
      Booking Details:
      - Date: ${formattedDate}
      - Guests: ${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}
      - Total Amount: ${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}
      
      Customer Information:
      - Name: ${customerName}
      - Email: ${customerEmail}
      ${customerPhone ? `- Phone: ${customerPhone}` : ''}
      ${specialRequests ? `- Special Requests: ${specialRequests}` : ''}
      
      Please contact the customer to confirm the booking and arrange payment.
      
      View booking in dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/supplier/dashboard
      
      Best regards,
      The AsiaByLocals Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking notification email sent successfully to ${supplierEmail}`);
    console.log('📬 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending booking notification email to ${supplierEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send booking confirmation email to customer with invoice
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 * @param {object} bookingDetails - Booking information
 * @returns {Promise<Object>}
 */
export const sendBookingConfirmationEmail = async (customerEmail, customerName, bookingDetails) => {
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    console.error('❌ Invalid email address provided:', customerEmail);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Sending booking confirmation email to customer: ${customerEmail}`);
  
  const { 
    bookingReference,
    bookingId,
    tourTitle, 
    tourSlug,
    city,
    country,
    customerPhone, 
    bookingDate, 
    numberOfGuests, 
    totalAmount, 
    currency, 
    specialRequests,
    supplierName,
    supplierEmail,
    supplierPhone,
    supplierWhatsApp
  } = bookingDetails;
  
  const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const bookingConfirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-confirmation/${bookingId}`;

  // Generate WhatsApp link for guide contact
  let whatsappContactLink = null;
  if (supplierWhatsApp) {
    const cleanWhatsApp = supplierWhatsApp.replace(/[^\d+]/g, '');
    whatsappContactLink = `https://wa.me/${cleanWhatsApp}`;
  }

  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com');
  const mailOptions = {
    from: `"AsiaByLocals Bookings" <${fromEmail}>`,
    to: customerEmail,
    subject: `Booking Confirmation: ${tourTitle} - ${bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #10B981;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                        ✅ Booking Confirmed!
                      </h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; color: #ffffff; opacity: 0.9;">
                        Your booking reference: ${bookingReference}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Dear ${customerName},
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Thank you for booking with AsiaByLocals! Your booking has been confirmed. Please keep this email as your booking confirmation and invoice.
                      </p>
                      
                      <!-- Booking Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0; border-left: 4px solid #10B981;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Booking Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Booking Reference:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 700; font-size: 16px;">${bookingReference}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Tour:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${tourTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Location:</td>
                            <td style="padding: 8px 0; color: #001A33;">${city}, ${country}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Date:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${formattedDate}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Number of Guests:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}</td>
                          </tr>
                          ${specialRequests ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; vertical-align: top;">Special Requests:</td>
                            <td style="padding: 8px 0; color: #001A33;">${specialRequests}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <!-- Invoice Section -->
                      <div style="background-color: #001A33; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Invoice</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #ffffff; opacity: 0.9;">Total Amount:</td>
                            <td style="padding: 8px 0; text-align: right; color: #10B981; font-weight: 700; font-size: 24px;">
                              ${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #ffffff; opacity: 0.7; font-size: 14px;">Payment Status:</td>
                            <td style="padding: 8px 0; text-align: right; color: #ffffff; opacity: 0.9; font-size: 14px;">Pending</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Guide Contact Information -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Your Guide Contact</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Guide Name:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${supplierName}</td>
                          </tr>
                          ${supplierEmail ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Email:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="mailto:${supplierEmail}" style="color: #0071EB; text-decoration: none;">${supplierEmail}</a>
                            </td>
                          </tr>
                          ` : ''}
                          ${supplierPhone ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="tel:${supplierPhone}" style="color: #0071EB; text-decoration: none;">${supplierPhone}</a>
                            </td>
                          </tr>
                          ` : ''}
                          ${whatsappContactLink ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">WhatsApp:</td>
                            <td style="padding: 8px 0;">
                              <a href="${whatsappContactLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600;">
                                💬 Contact via WhatsApp
                              </a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        <strong>Important Information:</strong>
                      </p>
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Your guide will contact you soon to confirm meeting details</li>
                        <li style="margin-bottom: 10px;">Please save this confirmation email for your records</li>
                        <li style="margin-bottom: 10px;">In case of any disputes, please contact us with your booking reference: <strong>${bookingReference}</strong></li>
                        <li style="margin-bottom: 10px;">Keep this email as proof of your booking</li>
                      </ul>
                      
                      <!-- CTA Buttons -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${bookingConfirmationUrl}" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 10px 10px 10px;">
                              View Booking Details
                            </a>
                            ${whatsappContactLink ? `
                            <a href="${whatsappContactLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 10px 10px 10px;">
                              Contact Guide via WhatsApp
                            </a>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        If you have any questions or need assistance, please don't hesitate to contact our support team.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>The AsiaByLocals Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        This is your official booking confirmation and invoice. Please keep this email for your records.
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved. AsiaByLocals
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Booking Confirmation - ${bookingReference}
      
      Dear ${customerName},
      
      Thank you for booking with AsiaByLocals! Your booking has been confirmed.
      
      Booking Details:
      - Booking Reference: ${bookingReference}
      - Tour: ${tourTitle}
      - Location: ${city}, ${country}
      - Date: ${formattedDate}
      - Guests: ${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}
      ${specialRequests ? `- Special Requests: ${specialRequests}` : ''}
      
      Invoice:
      - Total Amount: ${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}
      - Payment Status: Pending
      
      Your Guide Contact:
      - Name: ${supplierName}
      ${supplierEmail ? `- Email: ${supplierEmail}` : ''}
      ${supplierPhone ? `- Phone: ${supplierPhone}` : ''}
      ${whatsappContactLink ? `- WhatsApp: ${whatsappContactLink}` : ''}
      
      Important: Please save this email as proof of your booking. Your booking reference is ${bookingReference}.
      
      View booking: ${bookingConfirmationUrl}
      
      Best regards,
      The AsiaByLocals Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent successfully to ${customerEmail}`);
    console.log('📬 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending booking confirmation email to ${customerEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send booking payment notification email to admin
 * @param {object} bookingDetails - Complete booking information with payment details
 * @returns {Promise<Object>}
 */
export const sendAdminPaymentNotificationEmail = async (bookingDetails) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@asiabylocals.com';
  
  if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
    console.error('❌ Invalid admin email address:', adminEmail);
    throw new Error('Invalid admin email address');
  }

  console.log(`📧 Sending payment notification email to admin: ${adminEmail}`);
  
  const { 
    bookingReference,
    bookingId,
    tourTitle,
    city,
    country,
    customerName,
    customerEmail,
    customerPhone,
    bookingDate,
    numberOfGuests,
    totalAmount,
    currency,
    supplierName,
    supplierEmail,
    supplierPhone,
    razorpayPaymentId,
    razorpayOrderId
  } = bookingDetails;
  
  const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com');
  const mailOptions = {
    from: `"AsiaByLocals Payments" <${fromEmail}>`,
    to: adminEmail,
    subject: `💰 Payment Completed: ${tourTitle} - ${bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #10B981;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                        💰 Payment Completed
                      </h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; color: #ffffff; opacity: 0.9;">
                        Booking Reference: ${bookingReference}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        A payment has been completed for a booking. Please review the details below.
                      </p>
                      
                      <!-- Payment Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0; border-left: 4px solid #10B981;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Payment Information</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Booking Reference:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 700; font-size: 16px;">${bookingReference}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Payment Status:</td>
                            <td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 16px;">✅ PAID</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Amount:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 700; font-size: 20px;">
                              ${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}
                            </td>
                          </tr>
                          ${razorpayPaymentId ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Razorpay Payment ID:</td>
                            <td style="padding: 8px 0; color: #001A33; font-family: monospace; font-size: 12px;">${razorpayPaymentId}</td>
                          </tr>
                          ` : ''}
                          ${razorpayOrderId ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Razorpay Order ID:</td>
                            <td style="padding: 8px 0; color: #001A33; font-family: monospace; font-size: 12px;">${razorpayOrderId}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <!-- Booking Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Booking Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Tour:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${tourTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Location:</td>
                            <td style="padding: 8px 0; color: #001A33;">${city}, ${country}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Date:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${formattedDate}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Guests:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Customer Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Customer Information</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Name:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${customerName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Email:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="mailto:${customerEmail}" style="color: #0071EB; text-decoration: none;">${customerEmail}</a>
                            </td>
                          </tr>
                          ${customerPhone ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="tel:${customerPhone}" style="color: #0071EB; text-decoration: none;">${customerPhone}</a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <!-- Supplier Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Supplier/Guide Information</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Name:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${supplierName}</td>
                          </tr>
                          ${supplierEmail ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Email:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="mailto:${supplierEmail}" style="color: #0071EB; text-decoration: none;">${supplierEmail}</a>
                            </td>
                          </tr>
                          ` : ''}
                          ${supplierPhone ? `
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone:</td>
                            <td style="padding: 8px 0; color: #001A33;">
                              <a href="tel:${supplierPhone}" style="color: #0071EB; text-decoration: none;">${supplierPhone}</a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/secure-panel-abl" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                              View in Admin Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>AsiaByLocals Payment System</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved. AsiaByLocals
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Payment Completed - ${bookingReference}
      
      A payment has been completed for a booking.
      
      Payment Information:
      - Booking Reference: ${bookingReference}
      - Payment Status: PAID
      - Amount: ${currency === 'INR' ? '₹' : '$'}${totalAmount.toLocaleString()}
      ${razorpayPaymentId ? `- Razorpay Payment ID: ${razorpayPaymentId}` : ''}
      ${razorpayOrderId ? `- Razorpay Order ID: ${razorpayOrderId}` : ''}
      
      Booking Details:
      - Tour: ${tourTitle}
      - Location: ${city}, ${country}
      - Date: ${formattedDate}
      - Guests: ${numberOfGuests} ${numberOfGuests === 1 ? 'person' : 'people'}
      
      Customer Information:
      - Name: ${customerName}
      - Email: ${customerEmail}
      ${customerPhone ? `- Phone: ${customerPhone}` : ''}
      
      Supplier Information:
      - Name: ${supplierName}
      ${supplierEmail ? `- Email: ${supplierEmail}` : ''}
      ${supplierPhone ? `- Phone: ${supplierPhone}` : ''}
      
      View in admin dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/secure-panel-abl
      
      Best regards,
      AsiaByLocals Payment System
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin payment notification email sent successfully to ${adminEmail}`);
    console.log('📬 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending admin payment notification email to ${adminEmail}:`, error.message);
    throw error;
  }
};

/**
 * Send tour approval notification email to supplier/guide
 * Uses Resend SDK (preferred) if RESEND_API_KEY is configured, otherwise falls back to SendGrid/Gmail SMTP
 * 
 * @param {string} supplierEmail - Supplier's email address
 * @param {string} supplierName - Supplier's full name
 * @param {string} tourTitle - Tour title
 * @param {string} tourSlug - Tour slug for URL
 * @param {string} city - City name
 * @param {string} country - Country name
 * @returns {Promise<Object>}
 */
export const sendTourApprovalEmail = async (supplierEmail, supplierName, tourTitle, tourSlug, city, country) => {
  // Check if email is configured (Resend is preferred, then SendGrid, then Gmail SMTP)
  if (!resendApiKey && !sendGridApiKey && (!emailUser || !emailPassword)) {
    const errorMsg = 'Email not configured. Please set RESEND_API_KEY (recommended - most reliable), SENDGRID_API_KEY, or EMAIL_USER + EMAIL_APP_PASSWORD in Render environment variables.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate email parameter
  if (!supplierEmail || typeof supplierEmail !== 'string' || !supplierEmail.includes('@')) {
    console.error('❌ Invalid email address provided:', supplierEmail);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Attempting to send tour approval email to: ${supplierEmail}`);
  console.log(`   Tour: ${tourTitle}`);
  console.log(`   Supplier: ${supplierName}`);

  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (emailUser || 'asiabylocals@gmail.com');
  const serviceName = resendApiKey ? 'Resend' : (sendGridApiKey ? 'SendGrid' : 'Gmail SMTP');
  
  // Build tour URL
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const tourUrl = `${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/${countrySlug}/${citySlug}/${tourSlug}`;
  const dashboardUrl = `${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/supplier/dashboard`;

  const mailOptions = {
    from: `"AsiaByLocals" <${fromEmail}>`,
    to: supplierEmail,
    subject: `✅ Your Tour Has Been Approved: ${tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tour Approved</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #10B981;">
                      <div style="margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ✅ Tour Approved!
                        </h1>
                      </div>
                      <p style="margin: 10px 0 0 0; font-size: 18px; color: #ffffff; opacity: 0.95;">
                        Your tour is now live on AsiaByLocals
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Dear ${supplierName},
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Great news! Your tour <strong>"${tourTitle}"</strong> has been reviewed and approved by our team. Your tour is now live on AsiaByLocals and visible to travelers searching for experiences in ${city}, ${country}.
                      </p>
                      
                      <!-- Tour Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0; border-left: 4px solid #10B981;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Tour Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Tour Title:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${tourTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Location:</td>
                            <td style="padding: 8px 0; color: #001A33;">${city}, ${country}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Status:</td>
                            <td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 16px;">✅ Approved & Live</td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        <strong>What happens next?</strong>
                      </p>
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Your tour is now visible on the AsiaByLocals website</li>
                        <li style="margin-bottom: 10px;">Travelers can discover and book your tour</li>
                        <li style="margin-bottom: 10px;">You'll receive email notifications when bookings come in</li>
                        <li style="margin-bottom: 10px;">You can manage your tour from your supplier dashboard</li>
                      </ul>
                      
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        <strong>Tips for success:</strong>
                      </p>
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Share your tour link on social media to attract more bookings</li>
                        <li style="margin-bottom: 10px;">Respond quickly to booking inquiries to build trust</li>
                        <li style="margin-bottom: 10px;">Keep your tour information up to date in your dashboard</li>
                        <li style="margin-bottom: 10px;">Consider adding more tours to increase your visibility</li>
                      </ul>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        If you have any questions or need assistance, please don't hesitate to reach out to our support team via the <a href="${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/contact" style="color: #0071EB; text-decoration: none;">contact form</a>.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>The AsiaByLocals Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #10B981; padding: 40px; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h2>
                      </div>
                      
                      <!-- Social Media Icons -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="https://facebook.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">f</a>
                            <a href="https://twitter.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">🐦</a>
                            <a href="https://instagram.com/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">📷</a>
                            <a href="https://linkedin.com/company/asiabylocals" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: 600;">in</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 20px 0; font-size: 12px; color: #ffffff; opacity: 0.9;">
                        2025 © All rights reserved.
                      </p>
                      
                      <!-- Footer Links -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/become-a-supplier" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Become a Supply Partner</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/contact" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Contact us</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/faq" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">FAQ</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Tour Approved - ${tourTitle}
      
      Dear ${supplierName},
      
      Great news! Your tour "${tourTitle}" has been reviewed and approved by our team. Your tour is now live on AsiaByLocals and visible to travelers searching for experiences in ${city}, ${country}.
      
      Tour Details:
      - Title: ${tourTitle}
      - Location: ${city}, ${country}
      - Status: ✅ Approved & Live
      
      What happens next?
      - Your tour is now visible on the AsiaByLocals website
      - Travelers can discover and book your tour
      - You'll receive email notifications when bookings come in
      - You can manage your tour from your supplier dashboard
      
      View your tour: ${tourUrl}
      
      Tips for success:
      - Share your tour link on social media to attract more bookings
      - Respond quickly to booking inquiries to build trust
      - Keep your tour information up to date in your dashboard
      - Consider adding more tours to increase your visibility
      
      If you have any questions, please contact our support team.
      
      Best regards,
      The AsiaByLocals Team
    `
  };

  try {
    // PRIORITY 1: Use Resend SDK if available (most reliable - recommended)
    if (resendClient) {
      console.log(`📧 Sending tour approval email via Resend SDK (preferred method)`);
      console.log(`   To: ${supplierEmail}`);
      console.log(`   From: ${fromEmail}`);
      console.log(`   Service: Resend`);
      console.log(`   Subject: ✅ Your Tour Has Been Approved: ${tourTitle}`);
      
      const result = await resendClient.emails.send({
        from: `AsiaByLocals <${fromEmail}>`,
        to: supplierEmail,
        subject: `✅ Your Tour Has Been Approved: ${tourTitle}`,
        html: mailOptions.html,
        text: mailOptions.text
      });
      
      // Check if Resend returned an error
      if (result.error) {
        console.error(`❌ Resend API Error:`);
        console.error('   Error:', result.error);
        throw new Error(`Resend API Error: ${JSON.stringify(result.error)}`);
      }
      
      console.log(`✅ Tour approval email sent successfully via Resend`);
      console.log(`   Message ID: ${result.data?.id}`);
      console.log(`   Supplier: ${supplierName}`);
      console.log(`   Tour: ${tourTitle}`);
      return { success: true, messageId: result.data?.id };
    }
    
    // Fallback to nodemailer for SendGrid/Gmail
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Tour approval email sent successfully to ${supplierEmail}`);
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending tour approval email to ${supplierEmail}:`);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Full error:', error);
    throw error;
  }
};

/**
 * Send tour rejection notification email to supplier/guide
 * Uses Resend SDK (preferred) if RESEND_API_KEY is configured, otherwise falls back to SendGrid/Gmail SMTP
 * 
 * @param {string} supplierEmail - Supplier's email address
 * @param {string} supplierName - Supplier's full name
 * @param {string} tourTitle - Tour title
 * @param {string} rejectionReason - Reason for rejection provided by admin
 * @param {string} city - City name
 * @param {string} country - Country name
 * @returns {Promise<Object>}
 */
export const sendTourRejectionEmail = async (supplierEmail, supplierName, tourTitle, rejectionReason, city, country) => {
  // Check if email is configured (Resend is preferred, then SendGrid, then Gmail SMTP)
  if (!resendApiKey && !sendGridApiKey && (!emailUser || !emailPassword)) {
    const errorMsg = 'Email not configured. Please set RESEND_API_KEY (recommended - most reliable), SENDGRID_API_KEY, or EMAIL_USER + EMAIL_APP_PASSWORD in Render environment variables.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate email parameter
  if (!supplierEmail || typeof supplierEmail !== 'string' || !supplierEmail.includes('@')) {
    console.error('❌ Invalid email address provided:', supplierEmail);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Attempting to send tour rejection email to: ${supplierEmail}`);
  console.log(`   Tour: ${tourTitle}`);
  console.log(`   Supplier: ${supplierName}`);
  console.log(`   Rejection Reason: ${rejectionReason}`);

  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (emailUser || 'asiabylocals@gmail.com');
  const serviceName = resendApiKey ? 'Resend' : (sendGridApiKey ? 'SendGrid' : 'Gmail SMTP');
  
  // Build dashboard URL
  const dashboardUrl = `${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/supplier/dashboard`;

  const mailOptions = {
    from: `"AsiaByLocals" <${fromEmail}>`,
    to: supplierEmail,
    subject: `❌ Tour Review Update: ${tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tour Review Update</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #EF4444;">
                      <div style="margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          Tour Review Update
                        </h1>
                      </div>
                      <p style="margin: 10px 0 0 0; font-size: 18px; color: #ffffff; opacity: 0.95;">
                        Your tour needs some adjustments
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Dear ${supplierName},
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Thank you for submitting your tour <strong>"${tourTitle}"</strong> for review. After careful consideration, our team has determined that some adjustments are needed before we can approve your tour.
                      </p>
                      
                      <!-- Tour Details Card -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0; border-left: 4px solid #EF4444;">
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #001A33;">Tour Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666; width: 40%;">Tour Title:</td>
                            <td style="padding: 8px 0; color: #001A33; font-weight: 600;">${tourTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Location:</td>
                            <td style="padding: 8px 0; color: #001A33;">${city}, ${country}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #666;">Status:</td>
                            <td style="padding: 8px 0; color: #EF4444; font-weight: 700; font-size: 16px;">❌ Needs Revision</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Rejection Reason Card -->
                      <div style="background-color: #FEF2F2; border-radius: 8px; padding: 24px; margin: 30px 0; border-left: 4px solid #EF4444;">
                        <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #001A33;">Feedback from Our Review Team</h2>
                        <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #001A33; white-space: pre-wrap;">${rejectionReason.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                      </div>
                      
                      <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        <strong>What happens next?</strong>
                      </p>
                      <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #001A33;">
                        <li style="margin-bottom: 10px;">Please review the feedback above and make the necessary adjustments to your tour</li>
                        <li style="margin-bottom: 10px;">You can edit your tour in your supplier dashboard</li>
                        <li style="margin-bottom: 10px;">Once you've made the changes, you can resubmit your tour for review</li>
                        <li style="margin-bottom: 10px;">Our team will review your updated tour submission</li>
                      </ul>
                      
                      <div style="background-color: #F0F9FF; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #BFDBFE;">
                        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #001A33;">
                          💡 Need Help?
                        </p>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #001A33;">
                          If you have any questions about the feedback or need assistance making changes, please don't hesitate to reach out to our support team via the <a href="${process.env.FRONTEND_URL || 'https://www.asiabylocals.com'}/contact" style="color: #0071EB; text-decoration: none;">contact form</a>.
                        </p>
                      </div>
                      
                      <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Best regards,<br>
                        <strong>The AsiaByLocals Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #001A33; padding: 40px; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ASIA<br>BY<br>LOCALS
                        </h2>
                      </div>
                      
                      <p style="margin: 0 0 20px 0; font-size: 14px; color: #ffffff; opacity: 0.8;">
                        Connecting travelers with authentic local experiences across Asia
                      </p>
                      
                      <p style="margin: 0; font-size: 12px; color: #ffffff; opacity: 0.6;">
                        © ${new Date().getFullYear()} AsiaByLocals. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Tour Review Update

Dear ${supplierName},

Thank you for submitting your tour "${tourTitle}" for review. After careful consideration, our team has determined that some adjustments are needed before we can approve your tour.

Tour Details:
- Tour Title: ${tourTitle}
- Location: ${city}, ${country}
- Status: Needs Revision

Feedback from Our Review Team:
${rejectionReason}

What happens next?
- Please review the feedback above and make the necessary adjustments to your tour
- You can edit your tour in your supplier dashboard
- Once you've made the changes, you can resubmit your tour for review
- Our team will review your updated tour submission

If you have any questions about the feedback or need assistance, please contact our support team.

Best regards,
The AsiaByLocals Team`
  };

  try {
    // PRIORITY 1: Use Resend SDK if available (most reliable - recommended)
    if (resendClient) {
      console.log(`📧 Sending tour rejection email via Resend SDK (preferred method)`);
      console.log(`   To: ${supplierEmail}`);
      console.log(`   From: ${fromEmail}`);
      console.log(`   Service: Resend`);
      console.log(`   Subject: ❌ Tour Review Update: ${tourTitle}`);
      
      const result = await resendClient.emails.send({
        from: `AsiaByLocals <${fromEmail}>`,
        to: supplierEmail,
        subject: `❌ Tour Review Update: ${tourTitle}`,
        html: mailOptions.html,
        text: mailOptions.text
      });
      
      // Check if Resend returned an error
      if (result.error) {
        console.error(`❌ Resend API Error:`);
        console.error('   Error:', result.error);
        throw new Error(`Resend API Error: ${JSON.stringify(result.error)}`);
      }
      
      console.log(`✅ Tour rejection email sent successfully via Resend`);
      console.log(`   Message ID: ${result.data?.id}`);
      console.log(`   Supplier: ${supplierName}`);
      console.log(`   Tour: ${tourTitle}`);
      return { success: true, messageId: result.data?.id };
    }
    
    // Fallback to nodemailer for SendGrid/Gmail
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Tour rejection email sent successfully to ${supplierEmail}`);
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending tour rejection email to ${supplierEmail}:`);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Full error:', error);
    throw error;
  }
};

export default transporter;

