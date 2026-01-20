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
  console.log('   From Email: support@asiabylocals.com');
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
  console.log('   From Email: support@asiabylocals.com');
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
 * @returns {Promise<Object>}
 */
export const sendVerificationEmail = async (email, fullName, verificationToken) => {
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
  // Use onboarding@resend.dev for Resend (works without domain verification)
  // Use support@asiabylocals.com for SendGrid (requires domain verification)
  const fromEmail = resendApiKey ? 'onboarding@resend.dev' : (sendGridApiKey ? 'support@asiabylocals.com' : (emailUser || 'asiabylocals@gmail.com'));
  const serviceName = resendApiKey ? 'Resend' : (sendGridApiKey ? 'SendGrid' : 'Gmail SMTP');
  console.log(`   From: ${fromEmail}`);
  console.log(`   Service: ${serviceName}`);
  const verificationUrl = `${process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"AsiaByLocals Registration" <${fromEmail}>`,
    to: email,
    subject: 'AsiaByLocals Registration Confirmation',
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
                        Dear supply partner,
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Thanks for setting up your account — we're thrilled that you're partnering with us. This is the first step in your journey towards becoming an AsiaByLocals supply partner and delivering amazing travel experiences across Asia.
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        Once you confirm your email address below, you can already create activities on the AsiaByLocals Supplier Portal.
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #001A33;">
                        In the meantime, if you have any questions, please don't hesitate to reach out to us via the <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #0071EB; text-decoration: none;">contact form</a> in the <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/help" style="color: #0071EB; text-decoration: none;">Help Center</a>.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${verificationUrl}" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                              Confirm your email
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Fallback Link -->
                      <p style="margin: 30px 0 10px 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        If the above link does not work, please copy the following link into your browser's address bar:
                      </p>
                      <p style="margin: 0 0 30px 0; font-size: 12px; line-height: 1.5; color: #0071EB; word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 4px; border: 1px solid #e9ecef;">
                        ${verificationUrl}
                      </p>
                      
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #001A33;">
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
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/become-a-supplier" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Become a Supply Partner</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Contact us</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">FAQ</a>
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
      Welcome to AsiaByLocals!
      
      Hi ${fullName},
      
      Thank you for registering with AsiaByLocals! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with AsiaByLocals, please ignore this email.
      
      © 2025 AsiaByLocals
    `
  };

  try {
    // Use Resend SDK if available (more reliable than SMTP)
    if (resendClient) {
      const result = await resendClient.emails.send({
        from: `AsiaByLocals Registration <${fromEmail}>`,
        to: email,
        subject: 'AsiaByLocals Registration Confirmation',
        html: mailOptions.html,
        text: mailOptions.text
      });
      console.log(`✅ Verification email sent successfully to ${email}`);
      console.log('📬 Message ID:', result.data?.id);
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
    console.error('   Command:', error.command);
    console.error('   Response:', error.response);
    console.error('   Response Code:', error.responseCode);
    
    // Provide helpful error messages
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
    from: `"AsiaByLocals" <${sendGridApiKey ? 'support@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com')}>`,
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
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/become-a-supplier" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Become a Supply Partner</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">Contact us</a>
                            <span style="color: #ffffff; opacity: 0.5;">|</span>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq" style="display: inline-block; margin: 0 8px; color: #ffffff; text-decoration: none; font-size: 12px; opacity: 0.9;">FAQ</a>
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

  const fromEmail = resendApiKey ? 'onboarding@resend.dev' : (sendGridApiKey ? 'support@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com'));
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

  const fromEmail = resendApiKey ? 'onboarding@resend.dev' : (sendGridApiKey ? 'support@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com'));
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

  const fromEmail = resendApiKey ? 'onboarding@resend.dev' : (sendGridApiKey ? 'support@asiabylocals.com' : (process.env.EMAIL_USER || 'asiabylocals@gmail.com'));
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

export default transporter;

