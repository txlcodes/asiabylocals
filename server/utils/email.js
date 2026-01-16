import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using Gmail SMTP
// Using explicit SMTP configuration with port 587 (TLS) for better reliability
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password (not regular password)
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates if needed
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * Send verification email to supplier
 * @param {string} email - Recipient email address
 * @param {string} fullName - Supplier's full name
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<Object>}
 */
export const sendVerificationEmail = async (email, fullName, verificationToken) => {
  // Validate email parameter
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.error('❌ Invalid email address provided:', email);
    throw new Error('Invalid email address');
  }

  console.log(`📧 Attempting to send verification email to: ${email}`);
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"AsiaByLocals Registration" <${process.env.EMAIL_USER || 'asiabylocals@gmail.com'}>`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to ${email}`);
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending verification email to ${email}:`, error.message);
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
    from: `"AsiaByLocals" <${process.env.EMAIL_USER || 'asiabylocals@gmail.com'}>`,
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
  
  const { tourTitle, customerName, customerEmail, customerPhone, bookingDate, numberOfGuests, totalAmount, currency, specialRequests } = bookingDetails;
  
  const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const mailOptions = {
    from: `"AsiaByLocals Bookings" <${process.env.EMAIL_USER || 'asiabylocals@gmail.com'}>`,
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

export default transporter;

