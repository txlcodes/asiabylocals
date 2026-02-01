import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import prisma from './db.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail, sendBookingNotificationEmail, sendBookingConfirmationEmail, sendAdminPaymentNotificationEmail, sendTourApprovalEmail, sendTourRejectionEmail } from './utils/email.js';
import { uploadMultipleImages } from './utils/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Middleware
// CORS configuration - allows localhost for development and production domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  'https://www.asiabylocals.com',
  'https://asiabylocals.com',
  // Add www variant if main domain is set
  process.env.FRONTEND_URL?.replace('https://', 'https://www.'),
  process.env.VITE_FRONTEND_URL?.replace('https://', 'https://www.')
].filter(Boolean); // Remove undefined values

// In production, use specific origins; in development, allow all
if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
} else {
  // Development: allow all origins
  app.use(cors({
    credentials: true
  }));
}
// Increase body size limit to 50MB for PDF uploads (base64 encoded files are larger)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      message: 'AsiaByLocals API is running',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Quick email test endpoint (for testing only - DISABLED in production)
app.post('/api/test-email', async (req, res) => {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'This endpoint is disabled in production'
    });
  }
  try {
    const { email } = req.body;
    const testEmail = email || 'txlweb3@gmail.com'; // Default test email
    
    console.log('🧪 Testing email sending to:', testEmail);
    
    const testToken = 'test-token-' + Date.now();
    const result = await sendVerificationEmail(testEmail, 'Test User', testToken);
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      email: testEmail,
      messageId: result.messageId,
      note: 'Check your inbox (and spam folder) for the verification email'
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    const resendApiKey = process.env.RESEND_API_KEY;
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const emailUser = process.env.EMAIL_USER;
    
    let details = 'Unknown error - check server logs';
    if (error.code === 'EAUTH') {
      details = 'Authentication failed - check API key or credentials';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      if (!resendApiKey && !sendGridApiKey && !emailUser) {
        details = 'No email service configured. Add RESEND_API_KEY (recommended), SENDGRID_API_KEY, or EMAIL_USER + EMAIL_APP_PASSWORD to Render environment variables';
      } else if (emailUser && !resendApiKey && !sendGridApiKey) {
        details = 'Connection timeout - Gmail SMTP is blocked on Render. Add RESEND_API_KEY or SENDGRID_API_KEY instead';
      } else {
        details = 'Connection timeout - check network/firewall settings';
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error.message,
      details: details,
      configured: {
        resend: !!resendApiKey,
        sendgrid: !!sendGridApiKey,
        gmail: !!emailUser
      }
    });
  }
});

// Test tour approval email endpoint
app.post('/api/test-tour-approval-email', async (req, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || 'txlweb3@gmail.com';
    
    console.log('🧪 Testing tour approval email sending to:', testEmail);
    
    // Sample tour data for testing
    const sampleTourData = {
      supplierEmail: testEmail,
      supplierName: 'Mohd Shahnawaz',
      tourTitle: 'Book Tour Guide For Taj Mahal, Agra Fort & Baby Taj',
      tourSlug: 'book-tour-guide-for-taj-mahal-agra-fort-baby-taj',
      city: 'Agra',
      country: 'India'
    };
    
    const result = await sendTourApprovalEmail(
      sampleTourData.supplierEmail,
      sampleTourData.supplierName,
      sampleTourData.tourTitle,
      sampleTourData.tourSlug,
      sampleTourData.city,
      sampleTourData.country
    );
    
    res.json({
      success: true,
      message: 'Tour approval test email sent successfully!',
      email: testEmail,
      messageId: result.messageId,
      tourData: sampleTourData,
      note: 'Check your inbox (and spam folder) for the tour approval email'
    });
  } catch (error) {
    console.error('❌ Test tour approval email failed:', error);
    const resendApiKey = process.env.RESEND_API_KEY;
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const emailUser = process.env.EMAIL_USER;
    
    let details = 'Unknown error - check server logs';
    if (error.code === 'EAUTH') {
      details = 'Authentication failed - check API key or credentials';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      if (!resendApiKey && !sendGridApiKey && !emailUser) {
        details = 'No email service configured. Add RESEND_API_KEY (recommended), SENDGRID_API_KEY, or EMAIL_USER + EMAIL_APP_PASSWORD to Render environment variables';
      } else if (emailUser && !resendApiKey && !sendGridApiKey) {
        details = 'Connection timeout - Gmail SMTP is blocked on Render. Add RESEND_API_KEY or SENDGRID_API_KEY instead';
      } else {
        details = 'Connection timeout - check network/firewall settings';
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to send test tour approval email',
      message: error.message,
      details: details,
      configured: {
        resend: !!resendApiKey,
        sendgrid: !!sendGridApiKey,
        gmail: !!emailUser
      }
    });
  }
});

// Check email configuration endpoint
app.get('/api/email-config', (req, res) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const emailUser = process.env.EMAIL_USER;
  
  const fromEmail = (resendApiKey || sendGridApiKey) ? 'info@asiabylocals.com' : (emailUser || 'asiabylocals@gmail.com');
  const serviceName = resendApiKey ? 'Resend' : (sendGridApiKey ? 'SendGrid' : 'Gmail SMTP');
  
  res.json({
    configured: !!(resendApiKey || sendGridApiKey || emailUser),
    service: serviceName,
    fromEmail: fromEmail,
    resendConfigured: !!resendApiKey,
    sendGridConfigured: !!sendGridApiKey,
    gmailConfigured: !!emailUser
  });
});

// Register supplier endpoint
app.post('/api/suppliers/register', async (req, res) => {
  try {
    const {
      businessType,
      companyEmployees,
      companyActivities,
      individualActivities,
      otherActivities,
      fullName,
      email: rawEmail,
      password,
      companyName,
      mainHub,
      city,
      tourLanguages,
      verificationDocumentUrl,
      phone,
      whatsapp,
      language
    } = req.body;

    // Trim and normalize email
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
    
    // Log the email received and processed
    console.log('📥 Registration request received:');
    console.log('   Raw email from request:', rawEmail);
    console.log('   Processed email:', email);

    // Validate required fields
    if (!businessType || !fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['businessType', 'fullName', 'email', 'password']
      });
    }

    // Check if email already exists using Prisma
    // Use retry logic for Render free tier connection issues
    let existingSupplier = null;
    let checkAttempts = 0;
    const MAX_CHECK_RETRIES = 3;
    
    while (checkAttempts < MAX_CHECK_RETRIES && existingSupplier === null) {
      try {
        existingSupplier = await prisma.supplier.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            fullName: true,
            businessType: true,
            status: true,
            emailVerified: true,
            createdAt: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        checkAttempts++;
        console.error(`❌ Database error checking existing supplier (attempt ${checkAttempts}/${MAX_CHECK_RETRIES}):`, dbError.message);
        
        // If it's a connection error and we have retries left, wait and retry
        if (checkAttempts < MAX_CHECK_RETRIES && (
          dbError.message?.includes('connection') || 
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017'
        )) {
          console.log(`   Retrying in ${checkAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, checkAttempts * 500));
          continue;
        }
        
        // If database check fails completely, continue with registration attempt
        // Prisma will catch duplicate email error during create
        console.log('   Continuing with registration - will handle duplicate email during create');
        existingSupplier = null;
        break;
      }
    }

    if (existingSupplier) {
      // If email exists, allow them to continue registration
      // Generate new verification token if not verified
      let verificationToken = null;
      let verificationExpires = null;
      
      if (!existingSupplier.emailVerified) {
        verificationToken = randomBytes(32).toString('hex');
        verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 48); // 48 hours expiry
        
        // Update supplier with new verification token
        await prisma.supplier.update({
          where: { id: existingSupplier.id },
          data: {
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
          }
        });
        
        // Resend verification email
        try {
          console.log(`📧 Resending verification email to existing supplier:`);
          console.log(`   User entered: ${rawEmail}`);
          console.log(`   Email in DB: ${existingSupplier.email}`);
          console.log(`   Email to send to: ${email}`);
          await sendVerificationEmail(email, existingSupplier.fullName, verificationToken, language || 'en');
          console.log(`✅ Verification email resent to ${email}`);
          console.log(`   ⚠️ IMPORTANT: Verify email address matches what user entered!`);
        } catch (emailError) {
          console.error('❌ Failed to resend verification email:', emailError);
        }
      }
      
      // Convert id to string for consistency with frontend
      const supplierResponse = {
        ...existingSupplier,
        id: String(existingSupplier.id)
      };
      
      // Return existing supplier and allow them to proceed
      return res.status(200).json({
        success: true,
        message: existingSupplier.emailVerified 
          ? 'Account found. You can continue with your registration.' 
          : 'Account found. Please check your email to verify your account.',
        supplier: supplierResponse,
        emailSent: !existingSupplier.emailVerified && verificationToken !== null,
        existingAccount: true
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 48); // 48 hours expiry (increased from 24)

    // Upload verification document to Cloudinary if provided and Cloudinary is configured
    let finalDocumentUrl = verificationDocumentUrl;
    if (verificationDocumentUrl && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        console.log('☁️  Uploading verification document to Cloudinary...');
        const { uploadImage } = await import('./utils/cloudinary.js');
        
        // Check if it's a PDF or image
        const isPDF = verificationDocumentUrl.startsWith('data:application/pdf');
        const isImage = verificationDocumentUrl.startsWith('data:image/');
        
        if (isPDF) {
          // For PDFs, upload as raw file
          const base64Data = verificationDocumentUrl.includes(',') 
            ? verificationDocumentUrl.split(',')[1] 
            : verificationDocumentUrl;
          
          const cloudinary = (await import('./utils/cloudinary.js')).default;
          const result = await cloudinary.uploader.upload(
            `data:application/pdf;base64,${base64Data}`,
            {
              folder: 'asiabylocals/suppliers/documents',
              resource_type: 'raw',
              public_id: `license_${Date.now()}_${email.split('@')[0]}`
            }
          );
          finalDocumentUrl = result.secure_url;
          console.log('✅ Verification document uploaded to Cloudinary:', finalDocumentUrl);
        } else if (isImage) {
          // For images, use existing uploadImage function
          finalDocumentUrl = await uploadImage(verificationDocumentUrl, 'asiabylocals/suppliers/documents', `license_${Date.now()}_${email.split('@')[0]}`);
          console.log('✅ Verification document uploaded to Cloudinary:', finalDocumentUrl);
        }
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary upload error for verification document:', cloudinaryError);
        console.error('   Falling back to base64 storage');
        // Continue with base64 if Cloudinary fails
        finalDocumentUrl = verificationDocumentUrl;
      }
    }

    // Create supplier using Prisma
    // Wrap in try-catch with retry logic for Render free tier connection issues
    let supplier;
    let createAttempts = 0;
    const MAX_CREATE_RETRIES = 3;
    let createError = null;
    
    while (createAttempts < MAX_CREATE_RETRIES && !supplier) {
      try {
        supplier = await prisma.supplier.create({
          data: {
            businessType,
            companyEmployees: companyEmployees || null,
            companyActivities: companyActivities || null,
            individualActivities: individualActivities || null,
            otherActivities: otherActivities || null,
            fullName,
            email,
            passwordHash,
            companyName: companyName || null,
            mainHub: mainHub || null,
            city: city || null,
            tourLanguages: tourLanguages || null,
            verificationDocumentUrl: finalDocumentUrl || null,
            phone: phone || null,
            whatsapp: whatsapp || null,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            emailVerified: false,
            status: 'pending' // Require admin approval after license upload
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            businessType: true,
            status: true,
            emailVerified: true,
            createdAt: true
          }
        });
        break; // Success, exit retry loop
      } catch (error) {
        createAttempts++;
        createError = error;
        
        // Handle duplicate email error (race condition)
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          console.log('   ⚠️ Email was created between check and create (race condition)');
          console.log('   Fetching existing supplier and resending verification email...');
          
          // Fetch the existing supplier with retry
          let raceConditionSupplier = null;
          let fetchAttempts = 0;
          while (fetchAttempts < MAX_CREATE_RETRIES && !raceConditionSupplier) {
            try {
              raceConditionSupplier = await prisma.supplier.findUnique({
                where: { email },
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  businessType: true,
                  status: true,
                  emailVerified: true,
                  createdAt: true
                }
              });
              break;
            } catch (fetchError) {
              fetchAttempts++;
              if (fetchAttempts < MAX_CREATE_RETRIES && (
                fetchError.message?.includes('connection') || 
                fetchError.message?.includes('timeout') ||
                fetchError.code === 'P1001' ||
                fetchError.code === 'P1017'
              )) {
                await new Promise(resolve => setTimeout(resolve, fetchAttempts * 500));
                continue;
              }
              throw fetchError;
            }
          }
          
          if (raceConditionSupplier) {
            // Generate new verification token
            const newToken = randomBytes(32).toString('hex');
            const newExpires = new Date();
            newExpires.setHours(newExpires.getHours() + 48);
            
            // Update supplier with retry
            let updateSuccess = false;
            let updateAttempts = 0;
            while (updateAttempts < MAX_CREATE_RETRIES && !updateSuccess) {
              try {
                await prisma.supplier.update({
                  where: { id: raceConditionSupplier.id },
                  data: {
                    emailVerificationToken: newToken,
                    emailVerificationExpires: newExpires
                  }
                });
                updateSuccess = true;
              } catch (updateError) {
                updateAttempts++;
                if (updateAttempts < MAX_CREATE_RETRIES && (
                  updateError.message?.includes('connection') || 
                  updateError.message?.includes('timeout') ||
                  updateError.code === 'P1001' ||
                  updateError.code === 'P1017'
                )) {
                  await new Promise(resolve => setTimeout(resolve, updateAttempts * 500));
                  continue;
                }
                throw updateError;
              }
            }
            
            // Resend verification email
            let emailSent = false;
            try {
              await sendVerificationEmail(email, raceConditionSupplier.fullName || fullName, newToken, language || 'en');
              emailSent = true;
            } catch (emailError) {
              console.error('   Failed to send verification email:', emailError);
            }
            
            // Return success response
            return res.status(200).json({
              success: true,
              message: 'Account found. Please check your email to verify your account.',
              supplier: {
                ...raceConditionSupplier,
                id: String(raceConditionSupplier.id)
              },
              emailSent: emailSent,
              existingAccount: true
            });
          }
        }
        
        // If it's a connection error and we have retries left, wait and retry
        if (createAttempts < MAX_CREATE_RETRIES && (
          error.message?.includes('connection') || 
          error.message?.includes('timeout') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.code === 'P1001' ||
          error.code === 'P1017' ||
          error.code === 'P1008'
        )) {
          console.log(`   Connection error, retrying in ${createAttempts * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, createAttempts * 1000));
          continue;
        }
        
        // Not a retryable error, break and handle below
        break;
      }
    }
    
    // If we still don't have a supplier after retries, handle the error
    if (!supplier && createError) {
      // Handle race condition: email might have been created between check and create
      if (createError.code === 'P2002' && createError.meta?.target?.includes('email')) {
        console.log('   ⚠️ Email was created between check and create (race condition)');
        console.log('   Fetching existing supplier and resending verification email...');
        
        // Fetch the existing supplier
        const raceConditionSupplier = await prisma.supplier.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            fullName: true,
            businessType: true,
            status: true,
            emailVerified: true,
            createdAt: true
          }
        });
        
        if (raceConditionSupplier) {
          // Generate new verification token
          const newToken = randomBytes(32).toString('hex');
          const newExpires = new Date();
          newExpires.setHours(newExpires.getHours() + 48);
          
          await prisma.supplier.update({
            where: { id: raceConditionSupplier.id },
            data: {
              emailVerificationToken: newToken,
              emailVerificationExpires: newExpires
            }
          });
          
          // Resend verification email
          let emailSent = false;
          try {
            await sendVerificationEmail(email, raceConditionSupplier.fullName || fullName, newToken, language || 'en');
            emailSent = true;
          } catch (emailError) {
            console.error('   Failed to send verification email:', emailError);
          }
          
          // Return success response
          return res.status(200).json({
            success: true,
            message: 'Account found. Please check your email to verify your account.',
            supplier: {
              ...raceConditionSupplier,
              id: String(raceConditionSupplier.id)
            },
            emailSent: emailSent,
            existingAccount: true
          });
        }
      }
      // Re-throw if it's not a duplicate email error
      throw createError;
    }

    // Send verification email (don't fail registration if this fails)
    console.log(`📧 Preparing to send verification email:`);
    console.log(`   To: ${email}`);
    console.log(`   Full Name: ${fullName}`);
    console.log(`   Token: ${verificationToken.substring(0, 10)}...`);
    console.log(`   Supplier ID: ${supplier.id}`);
    console.log(`   Email stored in DB: ${supplier.email}`);
    
    let emailSent = false;
    
    try {
      const emailResult = await sendVerificationEmail(email, fullName, verificationToken, language || 'en');
      console.log(`✅ Verification email sent successfully to: ${email}`);
      console.log(`   Message ID: ${emailResult.messageId}`);
      console.log(`   ⚠️ IMPORTANT: Verify email address matches what user entered!`);
      console.log(`   User entered: ${rawEmail}`);
      console.log(`   Email sent to: ${email}`);
      emailSent = true;
    } catch (emailError) {
      console.error(`❌ Failed to send verification email to ${email}:`);
      console.error(`   Error: ${emailError.message || emailError}`);
      console.error(`   Full error:`, emailError);
      // Don't fail registration if email fails - user can request resend later
      emailSent = false;
    }

    // Convert id to string for consistency with frontend
    const supplierResponse = {
      ...supplier,
      id: String(supplier.id)
    };

    // Always return success even if email failed - user can resend verification email
    res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful! However, we couldn\'t send the verification email right now. Please use "Resend Verification Email" on the supplier page.',
      supplier: supplierResponse,
      emailSent: emailSent,
      warning: emailSent ? undefined : 'Email service temporarily unavailable. You can request a new verification email after logging in.'
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    console.error('   Error name:', error.name);
    console.error('   Error code:', error.code);
    console.error('   Error meta:', error.meta);
    
    // Check for specific Prisma error types and provide helpful messages
    let errorMessage = 'Failed to register supplier. Please try again later.';
    let statusCode = 500;
    
    // Database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database') || error.message?.includes('connection')) {
      errorMessage = 'Database connection error. Please try again in a few moments.';
      statusCode = 503; // Service Unavailable
    }
    // Unique constraint violation (duplicate email)
    else if (error.code === 'P2002') {
      const target = error.meta?.target || [];
      if (target.includes('email')) {
        errorMessage = 'An account with this email already exists. Please use a different email or log in.';
        statusCode = 409; // Conflict
      } else {
        errorMessage = 'A record with this information already exists. Please check your details and try again.';
        statusCode = 409;
      }
    }
    // Foreign key constraint violation
    else if (error.code === 'P2003') {
      errorMessage = 'Invalid registration data. Please check all fields and try again.';
      statusCode = 400; // Bad Request
    }
    // Prisma validation errors
    else if (error.code === 'P2011' || error.code === 'P2012') {
      errorMessage = 'Invalid registration data. Please check all required fields are filled correctly.';
      statusCode = 400; // Bad Request
    }
    // Record not found
    else if (error.code === 'P2025') {
      errorMessage = 'Registration data not found. Please try again.';
      statusCode = 404; // Not Found
    }
    // Email sending errors (don't fail registration, just log)
    else if (error.message?.includes('email') || error.message?.includes('Email')) {
      // Registration succeeded but email failed - still return success
      console.error('   ⚠️ Registration succeeded but email sending failed');
      console.error('   User can request a new verification email later');
      // Don't throw - registration was successful
      return res.status(201).json({
        success: true,
        message: 'Registration successful! However, we couldn\'t send the verification email. Please use "Resend Verification Email" on the supplier page.',
        supplier: {
          id: 'unknown', // We don't have supplier ID if email failed
          email: email,
          emailVerified: false
        },
        emailSent: false,
        warning: 'Email service temporarily unavailable'
      });
    }
    
    // Return more detailed error in development
    const errorDetails = process.env.NODE_ENV === 'development' ? {
      message: error.message,
      code: error.code,
      name: error.name,
      meta: error.meta
    } : undefined;
    
    res.status(statusCode).json({ 
      error: statusCode === 500 ? 'Internal server error' : (error.name || 'Registration error'),
      message: errorMessage,
      details: errorDetails
    });
  }
});

// Get supplier by email (for login)
app.post('/api/suppliers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required'
      });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log('🔐 Login attempt:');
    console.log('   Email provided:', email);
    console.log('   Normalized email:', normalizedEmail);
    
    // Find supplier using Prisma with retry logic for Render free tier
    let supplier = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;
    
    while (findAttempts < MAX_FIND_RETRIES && !supplier) {
      try {
        supplier = await prisma.supplier.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            email: true,
            fullName: true,
            passwordHash: true,
            status: true,
            emailVerified: true,
            phone: true,
            whatsapp: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error finding supplier (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);
        
        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') || 
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, break and handle below
        throw dbError;
      }
    }

    if (!supplier) {
      console.log('   ❌ Supplier not found in database');
      console.log('   Checking for similar emails...');
      
      // Try case-insensitive search as fallback
      try {
        const similarSuppliers = await prisma.supplier.findMany({
          where: {
            email: {
              contains: normalizedEmail.split('@')[0],
              mode: 'insensitive'
            }
          },
          select: {
            email: true,
            emailVerified: true
          },
          take: 5
        });
        
        if (similarSuppliers.length > 0) {
          console.log('   Found similar emails:', similarSuppliers.map(s => s.email).join(', '));
        }
      } catch (e) {
        // Ignore fallback search errors
      }
      
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect. If you just verified your email, please wait a moment and try again.'
      });
    }
    
    console.log('   ✅ Supplier found:');
    console.log('      ID:', supplier.id);
    console.log('      Email:', supplier.email);
    console.log('      Email Verified:', supplier.emailVerified);

    // Compare password with retry logic for database connection issues
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, supplier.passwordHash);
      console.log('   Password match:', passwordMatch ? '✅ YES' : '❌ NO');
    } catch (bcryptError) {
      console.error('   ❌ Error comparing password:', bcryptError.message);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to verify password. Please try again.'
      });
    }

    if (!passwordMatch) {
      console.log('   ❌ Password mismatch');
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if email is verified
    if (!supplier.emailVerified) {
      return res.status(403).json({ 
        error: 'Email not verified',
        message: 'Please verify your email address before logging in. Check your inbox for the verification link.'
      });
    }

    // Remove password hash from response
    const { passwordHash, ...supplierData } = supplier;
    
    // Convert id to string for consistency and ensure all required fields
    const supplierResponse = {
      id: String(supplierData.id),
      email: supplierData.email,
      fullName: supplierData.fullName,
      status: supplierData.status,
      emailVerified: supplierData.emailVerified,
      phone: supplierData.phone || null,
      whatsapp: supplierData.whatsapp || null
    };

    console.log('✅ Login successful for:', supplierData.email);
    console.log('📤 Returning supplier data:', JSON.stringify(supplierResponse, null, 2));

    res.json({
      success: true,
      supplier: supplierResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Tourist Signup endpoint
app.post('/api/tourists/signup', async (req, res) => {
  try {
    const { name, email: rawEmail, password } = req.body;

    // Trim and normalize email
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password too short',
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const existingTourist = await prisma.tourist.findUnique({
      where: { email }
    });

    if (existingTourist) {
      return res.status(400).json({ 
        error: 'Email already exists',
        message: 'An account with this email already exists. Please sign in instead.'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create tourist
    const tourist = await prisma.tourist.create({
      data: {
        name,
        email,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      tourist: {
        id: String(tourist.id),
        name: tourist.name,
        email: tourist.email
      }
    });
  } catch (error) {
    console.error('Tourist signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create account. Please try again later.'
    });
  }
});

// Tourist Login endpoint
app.post('/api/tourists/login', async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;

    // Normalize email
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required'
      });
    }

    // Find tourist
    const tourist = await prisma.tourist.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true
      }
    });

    if (!tourist) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, tourist.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Remove password hash from response
    const { passwordHash, ...touristData } = tourist;

    res.json({
      success: true,
      tourist: {
        id: String(touristData.id),
        name: touristData.name,
        email: touristData.email
      }
    });
  } catch (error) {
    console.error('Tourist login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login. Please try again later.'
    });
  }
});

// Verify email endpoint - MUST come before /api/suppliers/:id route
app.get('/api/suppliers/verify-email', async (req, res) => {
  try {
    let { token } = req.query;
    
    console.log('🔍 Email verification request received');
    console.log('   Raw token from query:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    console.log('   Raw token length:', token ? token.length : 0);
    console.log('   Request URL:', req.url);
    console.log('   Query params:', JSON.stringify(req.query));

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token is required',
        message: 'Please provide a valid verification token'
      });
    }

    // Normalize token: decode, trim whitespace, remove any email client modifications
    // Email clients often add tracking parameters or wrap URLs
    try {
      // Decode URL encoding
      token = decodeURIComponent(token);
    } catch (e) {
      // If decode fails, token might already be decoded or corrupted
      console.log('   ⚠️ Token decode failed, using as-is');
    }
    
    // Trim whitespace and remove any trailing parameters email clients might add
    token = token.trim();
    // Remove common email client tracking parameters
    token = token.split('&')[0].split('#')[0].split('?')[0];
    token = token.trim();

    console.log('   Normalized token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    console.log('   Normalized token length:', token ? token.length : 0);
    console.log('   Expected token length: 64 (32 bytes hex)');

    // Validate token format (should be 64 character hex string)
    if (token.length !== 64 || !/^[a-f0-9]{64}$/i.test(token)) {
      console.log('   ❌ Token format invalid - not 64 character hex string');
      console.log('   Token received:', token);
      
      // Try to find supplier by partial token match (in case email client truncated it)
      const allSuppliers = await prisma.supplier.findMany({
        where: {
          emailVerificationToken: {
            not: null
          }
        },
        select: {
          id: true,
          email: true,
          emailVerificationToken: true,
          emailVerificationExpires: true,
          emailVerified: true
        }
      });
      
      // Try partial match (first 32 characters)
      if (token.length >= 32) {
        const partialToken = token.substring(0, 32);
        console.log('   Trying partial token match:', partialToken);
        const partialMatch = allSuppliers.find(s => 
          s.emailVerificationToken && s.emailVerificationToken.startsWith(partialToken)
        );
        
        if (partialMatch) {
          console.log('   ✅ Found supplier with partial token match!');
          token = partialMatch.emailVerificationToken; // Use full token from DB
        }
      }
      
      // If still no match, return error
      if (token.length !== 64 || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ 
          error: 'Invalid token format',
          message: 'The verification link appears to be corrupted. Please request a new verification email.',
          details: 'Token should be 64 characters. Received: ' + token.length + ' characters.'
        });
      }
    }

    // Find supplier by verification token
    let supplier = await prisma.supplier.findFirst({
      where: {
        emailVerificationToken: token
      }
    });

    console.log('   Supplier found:', supplier ? `Yes (ID: ${supplier.id}, Verified: ${supplier.emailVerified})` : 'No');
    
    if (!supplier) {
      console.log('   ❌ No supplier found with this token');
      
      // Get all suppliers with tokens for debugging
      const suppliersWithTokens = await prisma.supplier.findMany({
        where: {
          emailVerificationToken: {
            not: null
          },
          emailVerified: false
        },
        select: {
          id: true,
          email: true,
          emailVerificationToken: true,
          emailVerificationExpires: true
        },
        take: 5 // Limit to 5 for debugging
      });
      
      console.log('   Suppliers with unverified tokens:', suppliersWithTokens.length);
      if (suppliersWithTokens.length > 0) {
        console.log('   Sample tokens in DB:');
        suppliersWithTokens.forEach(s => {
          console.log(`     - ID ${s.id}: ${s.emailVerificationToken?.substring(0, 20)}... (expires: ${s.emailVerificationExpires})`);
        });
      }
      
      return res.status(400).json({ 
        error: 'Invalid or expired token',
        message: 'The verification link is invalid or has expired. Please request a new verification email.',
        hint: 'If you just registered, please check your email for the latest verification link.'
      });
    }

    // Check if token is expired (with 1 hour grace period for email delivery delays)
    if (supplier.emailVerificationExpires) {
      const now = new Date();
      const expiresAt = new Date(supplier.emailVerificationExpires);
      const gracePeriod = 60 * 60 * 1000; // 1 hour grace period
      const expiredAt = new Date(expiresAt.getTime() + gracePeriod);
      
      console.log('   Token expiry check:');
      console.log(`     Expires at: ${expiresAt.toISOString()}`);
      console.log(`     Current time: ${now.toISOString()}`);
      console.log(`     With grace period: ${expiredAt.toISOString()}`);
      
      if (now > expiredAt) {
        console.log('   ❌ Token expired (even with grace period)');
        return res.status(400).json({ 
          error: 'Token expired',
          message: 'The verification link has expired. Please request a new verification email.',
          hint: 'Verification links expire after 24 hours. Click "Resend Verification Email" to get a new link.'
        });
      } else if (now > expiresAt) {
        console.log('   ⚠️ Token expired but within grace period - allowing verification');
      } else {
        console.log('   ✅ Token is valid');
      }
    }

    if (supplier.emailVerified) {
      console.log('   ⚠️ Email already verified, returning existing supplier');
      // Return success even if already verified
      const alreadyVerifiedResponse = {
        ...supplier,
        id: String(supplier.id)
      };
      return res.json({
        success: true,
        message: 'Email already verified. You can log in now.',
        supplier: alreadyVerifiedResponse,
        redirectUrl: `${process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/supplier?verified=true&email=${encodeURIComponent(supplier.email)}`
      });
    }

    // Update supplier to mark email as verified
    // Use retry logic for Render free tier database connection issues
    let updatedSupplier = null;
    let updateAttempts = 0;
    const MAX_UPDATE_RETRIES = 3;
    
    console.log('   🔄 Updating email verification status...');
    
    while (updateAttempts < MAX_UPDATE_RETRIES && !updatedSupplier) {
      try {
        updatedSupplier = await prisma.supplier.update({
          where: { id: supplier.id },
          data: {
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpires: null
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            emailVerified: true,
            status: true
          }
        });
        console.log('   ✅ Email verification updated successfully');
        console.log('      Email verified:', updatedSupplier.emailVerified);
        break; // Success, exit retry loop
      } catch (updateError) {
        updateAttempts++;
        console.error(`   ❌ Database error updating verification (attempt ${updateAttempts}/${MAX_UPDATE_RETRIES}):`, updateError.message);
        
        // If it's a connection error and we have retries left, wait and retry
        if (updateAttempts < MAX_UPDATE_RETRIES && (
          updateError.message?.includes('connection') || 
          updateError.message?.includes('timeout') ||
          updateError.code === 'P1001' ||
          updateError.code === 'P1017' ||
          updateError.code === 'P1008'
        )) {
          console.log(`   Retrying update in ${updateAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, updateAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw updateError;
      }
    }
    
    if (!updatedSupplier) {
      throw new Error('Failed to update email verification after retries');
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(supplier.email, supplier.fullName);
      console.log(`✅ Welcome email sent to ${supplier.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail verification if welcome email fails
    }

    // Convert id to string for consistency with frontend
    const updatedSupplierResponse = {
      ...updatedSupplier,
      id: String(updatedSupplier.id)
    };

    // Redirect URL to supplier login page with verification success message
    // After verification, user should log in to access the dashboard
    // Redirect back to registration form at step 5 (license upload) instead of login
    // Redirect back to registration form at step 5 (license upload)
    // This ensures users upload their license document before they can login
    const redirectUrl = `${process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/supplier?register=true&verified=true&email=${encodeURIComponent(updatedSupplier.email)}&supplierId=${updatedSupplier.id}`;
    
    console.log(`✅ Email verified for supplier ID: ${updatedSupplier.id}`);
    console.log(`📧 Redirect URL: ${redirectUrl}`);
    
    res.json({
      success: true,
      message: 'Email verified successfully! Please log in to access your supplier dashboard.',
      supplier: updatedSupplierResponse,
      redirectUrl: redirectUrl
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to verify email. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get supplier by ID
app.get('/api/suppliers/:id', async (req, res) => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📥 BACKEND - GET /api/suppliers/:id');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']
  });
  
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);
    
    console.log('📥 Supplier ID from params:', {
      raw: id,
      parsed: supplierId,
      isValid: !isNaN(supplierId)
    });

    if (isNaN(supplierId)) {
      console.error('❌ BACKEND ERROR: Invalid supplier ID');
      console.error('   Raw ID:', id);
      console.error('   Parsed ID:', supplierId);
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    // Retry logic for Render free tier database connection issues
    let supplier = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;
    
    console.log('🔍 Querying database for supplier...');

    while (findAttempts < MAX_FIND_RETRIES && !supplier) {
      try {
        supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
          select: {
            id: true,
            email: true,
            fullName: true,
            businessType: true,
            status: true,
            createdAt: true,
            companyName: true,
            mainHub: true,
            city: true,
            tourLanguages: true,
            phone: true,
            whatsapp: true
          }
        });
        console.log('✅ Database query successful');
        console.log('   Supplier found:', !!supplier);
        if (supplier) {
          console.log('   Supplier data:', {
            id: supplier.id,
            email: supplier.email,
            status: supplier.status,
            fullName: supplier.fullName
          });
        }
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`❌ Database error finding supplier (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);
        console.error('   Error code:', dbError.code);
        console.error('   Error name:', dbError.name);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.message?.includes('closed') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!supplier) {
      console.error('❌ BACKEND ERROR: Supplier not found');
      console.error('   Supplier ID:', supplierId);
      console.error('   Attempts:', findAttempts);
      console.log('═══════════════════════════════════════════════════════════');
      return res.status(404).json({ error: 'Supplier not found' });
    }

    console.log('✅ Sending supplier data to frontend');
    console.log('═══════════════════════════════════════════════════════════');
    res.json({ supplier });
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ BACKEND ERROR: Get supplier failed');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('═══════════════════════════════════════════════════════════');
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update supplier profile (fullName, phone, whatsapp)
app.patch('/api/suppliers/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);
    const { fullName, phone, whatsapp } = req.body;

    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid supplier ID' 
      });
    }

    // Verify supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });

    if (!existingSupplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found' 
      });
    }

    // Update profile
    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        ...(fullName !== undefined && { fullName: fullName.trim() || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(whatsapp !== undefined && { whatsapp: whatsapp || null })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        whatsapp: true
      }
    });

    console.log('✅ Supplier profile updated:', supplierId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      supplier
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
});

// Get all suppliers (admin endpoint)
app.get('/api/suppliers', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = status ? { status } : {};

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          fullName: true,
          businessType: true,
          status: true,
          createdAt: true,
          companyName: true,
          mainHub: true,
          city: true,
          phone: true,
          whatsapp: true,
          emailVerified: true,
          verificationDocumentUrl: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.supplier.count({ where })
    ]);

    res.json({
      suppliers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update supplier status (admin endpoint)
app.patch('/api/suppliers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { status },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Supplier status updated',
      supplier
    });
  } catch (error) {
    console.error('Update status error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Resend verification email endpoint
app.post('/api/suppliers/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required'
      });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { email }
    });

    if (!supplier) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      });
    }

    if (supplier.emailVerified) {
      return res.status(400).json({ 
        error: 'Email already verified',
        message: 'This email address has already been verified.'
      });
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 48); // 48 hours expiry

    // Update supplier with new token
    await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Send verification email (try to get language from request, default to 'en')
    const { language: requestLanguage } = req.body || {};
    try {
      await sendVerificationEmail(supplier.email, supplier.fullName, verificationToken, requestLanguage || 'en');
      console.log(`✅ Verification email resent to ${supplier.email}`);
    } catch (emailError) {
      console.error('❌ Failed to resend verification email:', emailError);
      return res.status(500).json({ 
        error: 'Failed to send email',
        message: 'Could not send verification email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'Verification email has been sent. Please check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to resend verification email. Please try again later.'
    });
  }
});

// Check email verification status
app.get('/api/suppliers/:id/verification-status', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    console.log(`🔍 Checking verification status for supplier ID: ${supplierId}`);

    if (isNaN(supplierId)) {
      console.log('   ❌ Invalid supplier ID:', id);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    // Retry logic for Render free tier database connection issues
    let supplier = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;
    
    while (findAttempts < MAX_FIND_RETRIES && !supplier) {
      try {
        supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
          select: {
            id: true,
            email: true,
            emailVerified: true,
            status: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error finding supplier (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);
        
        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') || 
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, break and handle below
        throw dbError;
      }
    }

    if (!supplier) {
      console.log('   ❌ Supplier not found');
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found',
        message: 'No supplier found with the provided ID'
      });
    }

    console.log(`   ✅ Supplier found: ${supplier.email}`);
    console.log(`   📧 Email verified: ${supplier.emailVerified ? 'YES' : 'NO'}`);
    console.log(`   📊 Status: ${supplier.status}`);

    res.json({
      success: true,
      emailVerified: supplier.emailVerified,
      status: supplier.status,
      email: supplier.email // Include email for debugging
    });
  } catch (error) {
    console.error('❌ Verification status check error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to check verification status. Please try again.'
    });
  }
});

// Update supplier document
app.patch('/api/suppliers/:id/update-document', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);
    const { verificationDocumentUrl, certificates } = req.body;

    console.log('📄 Document upload request received');
    console.log('   Supplier ID:', supplierId);
    console.log('   Document URL length:', verificationDocumentUrl ? verificationDocumentUrl.length : 0);
    console.log('   Certificates:', certificates ? (typeof certificates === 'string' ? JSON.parse(certificates).length : certificates.length) : 0);

    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    if (!verificationDocumentUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'Document URL is required',
        message: 'Please provide a verification document'
      });
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });

    if (!existingSupplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found',
        message: 'No supplier found with the provided ID'
      });
    }

    // Process certificates - upload to Cloudinary if available
    let finalCertificates = null;
    if (certificates) {
      try {
        const certUrls = typeof certificates === 'string' ? JSON.parse(certificates) : certificates;
        if (Array.isArray(certUrls) && certUrls.length > 0 && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          console.log('☁️  Uploading certificates to Cloudinary...');
          const cloudinary = (await import('./utils/cloudinary.js')).default;
          
          const uploadedCertUrls = await Promise.all(certUrls.map(async (certUrl, index) => {
            try {
              const isPDF = certUrl.startsWith('data:application/pdf');
              const isImage = certUrl.startsWith('data:image/');
              
              if (isPDF) {
                const base64Data = certUrl.includes(',') ? certUrl.split(',')[1] : certUrl;
                const result = await cloudinary.uploader.upload(
                  `data:application/pdf;base64,${base64Data}`,
                  {
                    folder: 'asiabylocals/suppliers/certificates',
                    resource_type: 'raw',
                    public_id: `cert_${supplierId}_${Date.now()}_${index}`
                  }
                );
                return result.secure_url;
              } else if (isImage) {
                const { uploadImage } = await import('./utils/cloudinary.js');
                return await uploadImage(certUrl, 'asiabylocals/suppliers/certificates', `cert_${supplierId}_${Date.now()}_${index}`);
              }
              return certUrl; // Fallback to original URL
            } catch (err) {
              console.error(`❌ Failed to upload certificate ${index + 1}:`, err);
              return certUrl; // Fallback to original URL
            }
          }));
          
          finalCertificates = JSON.stringify(uploadedCertUrls);
          console.log('✅ Certificates uploaded to Cloudinary:', uploadedCertUrls.length);
        } else {
          finalCertificates = typeof certificates === 'string' ? certificates : JSON.stringify(certificates);
        }
      } catch (err) {
        console.error('❌ Error processing certificates:', err);
        // Continue with original certificates if processing fails
        finalCertificates = typeof certificates === 'string' ? certificates : JSON.stringify(certificates);
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        verificationDocumentUrl,
        certificates: finalCertificates,
        // Keep status as 'pending' - admin needs to approve after reviewing license
        status: 'pending'
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        status: true,
        verificationDocumentUrl: true,
        certificates: true
      }
    });

    console.log('✅ Document uploaded successfully for supplier:', supplier.id);
    console.log('   Status:', supplier.status, '(pending admin approval)');
    console.log('   Certificates:', supplier.certificates ? (JSON.parse(supplier.certificates).length) : 0);

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      supplier: {
        ...supplier,
        id: String(supplier.id)
      }
    });
  } catch (error) {
    console.error('❌ Document update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to update document',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================== TOUR ENDPOINTS ====================

// Helper function to safely format tour response - ensures reviews is always null
// This prevents "reviews is not defined" errors and ensures consistency
function formatTourResponse(tour, parsedData = {}) {
  // Parse groupPricingTiers from Tour model (PRIMARY SOURCE)
  let tourGroupPricingTiers = null;
  
  // #region agent log
  const logPath = '/Users/talhanawaz/Desktop/asiabylocals-latest/.cursor/debug.log';
  try {
    const logEntry = JSON.stringify({
      location: 'server.js:1808',
      message: 'formatTourResponse - checking tour.groupPricingTiers from database',
      data: {
        tourId: tour?.id,
        hasGroupPricingTiers: !!tour?.groupPricingTiers,
        groupPricingTiersType: typeof tour?.groupPricingTiers,
        groupPricingTiersValue: tour?.groupPricingTiers ? (typeof tour.groupPricingTiers === 'string' ? tour.groupPricingTiers.substring(0, 100) : JSON.stringify(tour.groupPricingTiers).substring(0, 100)) : null,
        tourKeys: tour ? Object.keys(tour).filter(k => k.toLowerCase().includes('pricing') || k.toLowerCase().includes('group')) : null
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'C'
    }) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch (e) {}
  // #endregion
  
  if (tour.groupPricingTiers) {
    try {
      tourGroupPricingTiers = typeof tour.groupPricingTiers === 'string' 
        ? JSON.parse(tour.groupPricingTiers) 
        : tour.groupPricingTiers;
      console.log(`✅ formatTourResponse - Tour ${tour.id} has groupPricingTiers:`, {
        type: Array.isArray(tourGroupPricingTiers) ? 'array' : typeof tourGroupPricingTiers,
        length: Array.isArray(tourGroupPricingTiers) ? tourGroupPricingTiers.length : 'N/A'
      });
      // #region agent log
      try {
        const logEntry = JSON.stringify({
          location: 'server.js:1820',
          message: 'formatTourResponse - successfully parsed tour.groupPricingTiers',
          data: {
            tourId: tour.id,
            tiersCount: tourGroupPricingTiers?.length,
            firstTier: tourGroupPricingTiers?.[0]
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'C'
        }) + '\n';
        fs.appendFileSync(logPath, logEntry);
      } catch (e) {}
      // #endregion
    } catch (e) {
      console.error(`❌ Failed to parse tour.groupPricingTiers for tour ${tour.id}:`, e.message);
      // #region agent log
      try {
        const logEntry = JSON.stringify({
          location: 'server.js:1825',
          message: 'formatTourResponse - failed to parse tour.groupPricingTiers',
          data: {
            tourId: tour.id,
            error: e.message
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'C'
        }) + '\n';
        fs.appendFileSync(logPath, logEntry);
      } catch (e) {}
      // #endregion
    }
  } else {
    console.warn(`⚠️ Tour ${tour.id} has NO groupPricingTiers on Tour model`);
    // #region agent log
    try {
      const logEntry = JSON.stringify({
        location: 'server.js:1830',
        message: 'formatTourResponse - tour.groupPricingTiers NOT found in database',
        data: {
          tourId: tour.id,
          reason: 'groupPricingTiers field is null/undefined in database'
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C'
      }) + '\n';
      fs.appendFileSync(logPath, logEntry);
    } catch (e) {}
    // #endregion
  }
  
  return {
    ...tour,
    id: String(tour.id),
    locations: parsedData.locations || JSON.parse(tour.locations || '[]'),
    images: parsedData.images || JSON.parse(tour.images || '[]'),
    languages: parsedData.languages || JSON.parse(tour.languages || '[]'),
    highlights: parsedData.highlights || (tour.highlights ? JSON.parse(tour.highlights || '[]') : []),
    reviews: null, // Always null - reviews are not generated
    groupPricingTiers: tourGroupPricingTiers, // PRIMARY SOURCE - from Tour model
    options: tour.options && Array.isArray(tour.options) ? tour.options.map(opt => {
      // Explicitly exclude pricingType if it somehow exists
      const { pricingType, pricing_type, ...cleanOpt } = opt;
      
      // Parse groupPricingTiers if it exists (stored as JSON string in DB)
      let groupPricingTiers = null;
      console.log(`🔍 formatTourResponse - Option ${opt.id} (${opt.optionTitle}):`, {
        hasGroupPricingTiers: !!opt.groupPricingTiers,
        groupPricingTiersType: typeof opt.groupPricingTiers,
        groupPricingTiersRaw: opt.groupPricingTiers 
          ? (typeof opt.groupPricingTiers === 'string' 
            ? opt.groupPricingTiers.substring(0, 200) 
            : JSON.stringify(opt.groupPricingTiers).substring(0, 200))
          : 'null',
        allKeys: Object.keys(opt)
      });
      
      if (opt.groupPricingTiers) {
        try {
          groupPricingTiers = typeof opt.groupPricingTiers === 'string' 
            ? JSON.parse(opt.groupPricingTiers) 
            : opt.groupPricingTiers;
          console.log(`✅ Parsed groupPricingTiers for option ${opt.id}:`, {
            type: Array.isArray(groupPricingTiers) ? 'array' : typeof groupPricingTiers,
            length: Array.isArray(groupPricingTiers) ? groupPricingTiers.length : 'N/A',
            preview: Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0 
              ? groupPricingTiers[0] 
              : groupPricingTiers
          });
        } catch (e) {
          console.error(`❌ Failed to parse groupPricingTiers for option ${opt.id}:`, e.message);
          console.error('   Raw value:', opt.groupPricingTiers);
          groupPricingTiers = null;
        }
      } else {
        console.warn(`⚠️ Option ${opt.id} has NO groupPricingTiers in database`);
      }
      
      return {
        ...cleanOpt,
        id: String(opt.id),
        tourId: String(opt.tourId),
        groupPricingTiers: groupPricingTiers
      };
    }) : []
  };
}

// Generate believable fake reviews for a tour (DEPRECATED - not used anymore)
function generateFakeReviews(tourData) {
  const { title, city = 'the city', country = 'the country', category = 'Guided Tour', locations, duration, fullDescription, guideType, supplier } = tourData;
  
  // Extract location names from locations array
  const locationsArray = Array.isArray(locations) ? locations : (typeof locations === 'string' ? JSON.parse(locations || '[]') : []);
  const locationNames = Array.isArray(locationsArray) && locationsArray.length > 0 
    ? locationsArray.map(loc => typeof loc === 'string' ? loc : loc.name || loc).join(', ') 
    : (city || 'the location');
  
  // Generate review templates based on tour type
  const reviewTemplates = [];
  
  // Country-specific names for smarter reviews
  const getNamePool = (country) => {
    const countryLower = country.toLowerCase();
    
    if (countryLower.includes('china') || countryLower.includes('chinese')) {
      return {
        firstNames: ['Wei', 'Li', 'Zhang', 'Wang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo', 'Song', 'Zheng', 'Liang', 'Xie', 'Tang', 'Han', 'Cao', 'Feng', 'Cheng'],
        lastNames: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo'],
        countries: ['China', 'Hong Kong', 'Taiwan', 'Singapore', 'Malaysia', 'United States', 'Canada', 'Australia', 'United Kingdom']
      };
    }
    
    if (countryLower.includes('japan') || countryLower.includes('japanese')) {
      return {
        firstNames: ['Hiroshi', 'Yuki', 'Sakura', 'Takeshi', 'Aiko', 'Kenji', 'Emiko', 'Ryota', 'Yuki', 'Mei', 'Daiki', 'Haruka', 'Kenta', 'Akari', 'Sota', 'Rina', 'Yuto', 'Miyuki', 'Shota', 'Yui', 'Ren', 'Hana', 'Kaito', 'Mika', 'Ryo', 'Aya', 'Taro', 'Naomi', 'Koji', 'Sayaka'],
        lastNames: ['Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu'],
        countries: ['Japan', 'United States', 'Australia', 'United Kingdom', 'Canada', 'Singapore', 'South Korea']
      };
    }
    
    if (countryLower.includes('india') || countryLower.includes('indian')) {
      return {
        firstNames: ['Priya', 'Raj', 'Anjali', 'Arjun', 'Kavya', 'Vikram', 'Meera', 'Rohan', 'Sneha', 'Aryan', 'Divya', 'Karan', 'Pooja', 'Rahul', 'Neha', 'Aditya', 'Shreya', 'Vishal', 'Ananya', 'Siddharth', 'Isha', 'Ravi', 'Kriti', 'Nikhil', 'Tanvi', 'Aman', 'Riya', 'Kunal', 'Aishwarya', 'Varun'],
        lastNames: ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Mehta', 'Joshi', 'Verma', 'Agarwal', 'Malhotra', 'Chopra', 'Kapoor', 'Shah', 'Rao', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Krishnan'],
        countries: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'UAE']
      };
    }
    
    if (countryLower.includes('korea') || countryLower.includes('korean')) {
      return {
        firstNames: ['Min-jun', 'So-young', 'Ji-hoon', 'Hae-won', 'Seung-min', 'Ji-eun', 'Hyun-woo', 'Ye-jin', 'Jun-seo', 'Soo-jin', 'Tae-hyun', 'Min-ji', 'Jin-woo', 'Eun-ji', 'Dong-hyun', 'Hye-jin', 'Sang-min', 'Ji-woo', 'Min-seo', 'Hyun-jin'],
        lastNames: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim', 'Shin', 'Han', 'Oh', 'Song', 'Moon', 'Kwon', 'Hwang', 'Ahn', 'Yoo', 'Bae'],
        countries: ['South Korea', 'United States', 'Canada', 'Australia', 'Japan', 'China']
      };
    }
    
    if (countryLower.includes('thailand') || countryLower.includes('thai')) {
      return {
        firstNames: ['Siri', 'Niran', 'Pim', 'Chai', 'Naree', 'Somchai', 'Wanida', 'Anan', 'Supaporn', 'Prasert', 'Siriporn', 'Somsak', 'Kanya', 'Suthep', 'Nonglak', 'Wichai', 'Pornthip', 'Sakchai', 'Jintana', 'Narong'],
        lastNames: ['Srisawat', 'Chaiyawat', 'Prasert', 'Sukhum', 'Thongchai', 'Wongsa', 'Srisuwan', 'Chaiyaporn', 'Prasert', 'Sukhumvit', 'Thongchai', 'Wongsa', 'Srisuwan', 'Chaiyaporn', 'Prasert', 'Sukhum', 'Thongchai', 'Wongsa', 'Srisuwan', 'Chaiyaporn'],
        countries: ['Thailand', 'United States', 'United Kingdom', 'Australia', 'Singapore', 'Malaysia']
      };
    }
    
    // Default: Western names
    return {
      firstNames: ['Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'David', 'Sophia', 'Robert', 'Isabella', 'William', 'Mia', 'Richard', 'Emily', 'Joseph', 'Charlotte', 'Thomas', 'Amelia', 'Charles', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'Anthony', 'Elizabeth', 'Mark', 'Sofia', 'Donald', 'Avery', 'Steven', 'Ella', 'Paul', 'Madison', 'Andrew', 'Scarlett', 'Joshua', 'Victoria', 'Kenneth', 'Aria', 'Kevin', 'Grace', 'Brian', 'Chloe', 'George', 'Penelope', 'Edward', 'Riley', 'Ronald', 'Layla', 'Timothy'],
      lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'],
      countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Belgium', 'Ireland', 'New Zealand', 'Singapore', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa']
    };
  };
  
  const namePool = getNamePool(country);
  const firstNames = namePool.firstNames;
  const lastNames = namePool.lastNames;
  const countries = namePool.countries;
  
  // Review templates based on tour category - more varied and smarter
  const categoryTemplates = {
    'Guided Tour': [
      `Our guide was absolutely fantastic! Very knowledgeable about ${locationNames || city} and made the experience truly memorable.`,
      `Highly recommend this tour! The guide was friendly, professional, and shared so many interesting stories about ${locationNames || city}.`,
      `Amazing experience! The guide knew all the best spots and timing. We learned so much about the history and culture.`,
      `Perfect tour for first-time visitors to ${city}. The guide was patient, answered all our questions, and made us feel comfortable.`,
      `The guide was excellent - spoke perfect English and had great insights. We saw everything we wanted and more!`,
      `One of the best tours we've taken! The guide was passionate about ${city} and it showed. Highly professional.`,
      `Great value for money! The guide was knowledgeable and the tour was well-organized. Would definitely book again.`,
      `The guide made this tour special. Very informative and friendly. We got amazing photos and learned a lot about ${locationNames || city}.`,
      `What an incredible experience! The guide's expertise really enhanced our understanding of ${city}'s rich history.`,
      `We were blown away by how much we learned. The guide had fascinating insights about every place we visited.`,
      `This tour exceeded all expectations! The guide was engaging, knowledgeable, and made history come alive.`,
      `Perfect balance of information and exploration. The guide knew exactly when to share details and when to let us explore.`,
      `The guide's storytelling made this tour unforgettable. We felt like we were experiencing ${city} through a local's eyes.`,
      `Outstanding tour! The guide was professional, personable, and clearly loves sharing ${city}'s culture with visitors.`,
      `We couldn't have asked for a better introduction to ${city}. The guide made us feel welcome and excited to explore more.`,
      `The guide's knowledge was impressive, but what really stood out was their enthusiasm and genuine care for our experience.`
    ],
    'Entry Ticket': [
      `Smooth entry process! The skip-the-line ticket saved us so much time. Highly recommend for ${locationNames || city}.`,
      `Great experience! Easy to use ticket and no waiting in long queues. Perfect for visiting ${locationNames || city}.`,
      `Worth every penny! The entry was seamless and we had plenty of time to explore ${locationNames || city} at our own pace.`,
      `Very convenient! The ticket was easy to redeem and we avoided the long lines. Great way to visit ${locationNames || city}.`,
      `Excellent service! Quick entry and the ticket included everything promised. Made our visit to ${locationNames || city} stress-free.`,
      `Perfect for a hassle-free visit! The ticket worked perfectly and we had a wonderful time exploring ${locationNames || city}.`,
      `Highly recommend! The entry process was smooth and we had a great time at ${locationNames || city}.`,
      `Great value! Easy booking and entry. We enjoyed our visit to ${locationNames || city} without any issues.`,
      `The skip-the-line feature was a game-changer! We spent more time exploring and less time waiting.`,
      `Booking was straightforward and the entry was even easier. No complications at all!`,
      `We appreciated the flexibility - the ticket was valid for the whole day, so we could explore at our own pace.`,
      `The digital ticket made everything so simple. Just showed it on our phone and we were in!`,
      `Great value compared to buying tickets at the gate. Plus, we saved time by skipping the queue.`,
      `Everything was exactly as described. The ticket gave us access to all the areas we wanted to see.`,
      `We'll definitely use this service again. The convenience alone was worth it!`
    ],
    'Mini Tour': [
      `Perfect short tour! Great way to see ${locationNames || city} without spending the whole day. Highly recommend!`,
      `Amazing mini tour experience! We covered all the highlights in a short time. The guide was excellent and very informative.`,
      `Great value for a quick tour! Perfect for travelers with limited time. We learned so much about ${city} in just a few hours.`,
      `Excellent mini tour! Well-organized and informative. The guide was friendly and made the experience enjoyable.`,
      `Perfect introduction to ${city}! This mini tour gave us a great overview. Would definitely recommend to others.`,
      `Wonderful experience! Short but comprehensive tour of ${locationNames || city}. The guide was knowledgeable and engaging.`,
      `Great mini tour! We saw all the key attractions and learned about the history. Perfect for first-time visitors.`,
      `Highly recommend this mini tour! Great way to explore ${city} without feeling rushed. Excellent guide and organization.`,
      `Perfect for a quick city overview! We got to see the main sights without committing to a full-day tour.`,
      `The mini tour format was ideal for us. We learned a lot in a short time and still had the rest of the day free.`,
      `Great introduction to ${city}! The tour was concise but packed with interesting information.`,
      `We loved how efficient this tour was. Covered all the highlights without dragging on.`,
      `Perfect balance of information and time. The guide made sure we saw everything important without rushing.`,
      `This mini tour was exactly what we needed - informative, well-paced, and perfect for our schedule.`,
      `Great way to get oriented in ${city}! The tour gave us confidence to explore more on our own afterward.`
    ]
  };
  
  const templates = categoryTemplates[category] || categoryTemplates['Guided Tour'];
  
  // Generate 10-99 reviews
  const numReviews = Math.floor(Math.random() * 90) + 10; // 10-99 reviews
  
  // Calculate target average rating (between 4.0 and 4.8)
  const targetAverage = 4.0 + (Math.random() * 0.8); // Random between 4.0 and 4.8
  
  // Pre-calculate rating distribution to achieve target average
  // Formula: targetAverage = (3*x + 4*y + 5*z) / (x + y + z)
  // Where x = count of 3s, y = count of 4s, z = count of 5s
  let count3 = 0, count4 = 0, count5 = 0;
  
  if (targetAverage >= 4.6) {
    // High average (4.6-4.8): mostly 5s, some 4s, very few 3s
    count5 = Math.floor(numReviews * 0.75);
    count4 = Math.floor(numReviews * 0.20);
    count3 = numReviews - count5 - count4;
  } else if (targetAverage >= 4.4) {
    // Medium-high average (4.4-4.6): mix of 4s and 5s, few 3s
    count5 = Math.floor(numReviews * 0.55);
    count4 = Math.floor(numReviews * 0.35);
    count3 = numReviews - count5 - count4;
  } else if (targetAverage >= 4.2) {
    // Medium average (4.2-4.4): balanced mix
    count5 = Math.floor(numReviews * 0.35);
    count4 = Math.floor(numReviews * 0.50);
    count3 = numReviews - count5 - count4;
  } else {
    // Lower average (4.0-4.2): more 4s, some 3s and 5s
    count5 = Math.floor(numReviews * 0.20);
    count4 = Math.floor(numReviews * 0.60);
    count3 = numReviews - count5 - count4;
  }
  
  // Create arrays of ratings
  const ratings = [
    ...Array(count3).fill(3),
    ...Array(count4).fill(4),
    ...Array(count5).fill(5)
  ];
  
  // Shuffle ratings for randomness
  for (let i = ratings.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ratings[i], ratings[j]] = [ratings[j], ratings[i]];
  }
  
  const reviews = [];
  
  // Use tour title + timestamp as seed for more variation
  const seed = title + Date.now();
  let seedValue = 0;
  for (let i = 0; i < seed.length; i++) {
    seedValue = ((seedValue << 5) - seedValue) + seed.charCodeAt(i);
    seedValue = seedValue & seedValue;
  }
  
  // Simple seeded random function for more variation
  let seedCounter = seedValue;
  const seededRandom = () => {
    seedCounter = (seedCounter * 9301 + 49297) % 233280;
    return seedCounter / 233280;
  };
  
  for (let i = 0; i < numReviews; i++) {
    // Mix Math.random() with seeded random for better variation - different for each selection
    const random1 = (Math.random() + seededRandom()) / 2;
    const random2 = (Math.random() + seededRandom()) / 2;
    const random3 = (Math.random() + seededRandom()) / 2;
    const random4 = (Math.random() + seededRandom()) / 2;
    
    // Ensure mix of locals and foreigners (40-60% foreigners)
    const isForeigner = Math.random() < 0.55; // 55% chance of being foreigner
    
    let firstName, lastName, countryName;
    
    if (isForeigner) {
      // Use foreign names (Western names pool)
      const foreignFirstNames = ['Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'David', 'Sophia', 'Robert', 'Isabella', 'William', 'Mia', 'Richard', 'Emily', 'Joseph', 'Charlotte', 'Thomas', 'Amelia', 'Charles', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'Anthony', 'Elizabeth', 'Mark', 'Sofia', 'Donald', 'Avery', 'Steven', 'Ella', 'Paul', 'Madison', 'Andrew', 'Scarlett', 'Joshua', 'Victoria', 'Kenneth', 'Aria', 'Kevin', 'Grace', 'Brian', 'Chloe', 'George', 'Penelope', 'Edward', 'Riley', 'Ronald', 'Layla', 'Timothy', 'Maria', 'Carlos', 'Anna', 'Hans', 'Pierre', 'Giulia', 'Yuki', 'Lucas', 'Sophie', 'Marco', 'Emma', 'Liam', 'Noah', 'Oliver', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison', 'Maya', 'Sarah', 'Ariana', 'Allison', 'Gabriella', 'Alice', 'Madelyn', 'Cora', 'Ruby', 'Eva', 'Serenity', 'Autumn', 'Adeline', 'Hailey', 'Gianna', 'Valentina', 'Isla', 'Eliana', 'Quinn', 'Nevaeh', 'Ivy', 'Sadie', 'Piper', 'Lydia', 'Alexa', 'Josephine', 'Emilia', 'Gianna', 'Arianna', 'Lucy', 'Arielle', 'Peyton', 'Makayla', 'Melanie', 'Mackenzie', 'Naomi', 'Faith', 'Liliana', 'Katherine', 'Jocelyn', 'Stella', 'Brianna', 'Maya', 'Skylar', 'Alexis', 'Natalia', 'Alyssa', 'Ariana', 'Isabelle', 'Savannah', 'Valeria', 'Annabelle', 'Lucia', 'Ximena', 'Liliana', 'Alessandra', 'Myah', 'Melissa', 'Nicole', 'Amanda', 'Kaylee', 'Andrea', 'Kimberly', 'Brianna', 'Destiny', 'Maria', 'Vanessa', 'Brooke', 'Samantha', 'Stephanie', 'Rachel', 'Jennifer', 'Michelle', 'Jessica', 'Ashley', 'Amanda', 'Melissa', 'Deborah', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice', 'Marie', 'Julia', 'Grace', 'Judy', 'Theresa', 'Madison', 'Beverly', 'Denise', 'Marilyn', 'Amber', 'Danielle', 'Brittany', 'Diana', 'Abigail', 'Jane', 'Lori', 'Tammy', 'Marilyn', 'Kathy', 'Nicole', 'Christine', 'Samantha', 'Deborah', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice', 'Marie', 'Julia', 'Grace', 'Judy', 'Theresa', 'Madison', 'Beverly', 'Denise', 'Marilyn', 'Amber', 'Danielle', 'Brittany', 'Diana', 'Abigail', 'Jane', 'Lori', 'Tammy', 'Marilyn', 'Kathy'];
      const foreignLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison', 'Fernandez', 'Mcdonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen', 'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter', 'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder', 'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks', 'Holmes', 'Palmer', 'Wagner', 'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox', 'Warren', 'Mills', 'Meyer', 'Rice', 'Schmidt', 'Garza', 'Daniels', 'Ferguson', 'Nichols', 'Stephens', 'Soto', 'Weaver', 'Ryan', 'Gardner', 'Payne', 'Grant', 'Dunn', 'Kelley', 'Spencer', 'Hawkins', 'Arnold', 'Pierce', 'Vazquez', 'Hansen', 'Peters', 'Santos', 'Hart', 'Bradley', 'Knight', 'Elliott', 'Cunningham', 'Duncan', 'Armstrong', 'Hudson', 'Carroll', 'Lane', 'Riley', 'Andrews', 'Alvarado', 'Ray', 'Delgado', 'Berry', 'Perkins', 'Hoffman', 'Johnston', 'Matthews', 'Pena', 'Richards', 'Contreras', 'Willis', 'Carpenter', 'Lawrence', 'Sandoval', 'Guerrero', 'George', 'Chapman', 'Rios', 'Estrada', 'Ortega', 'Watkins', 'Greene', 'Nunez', 'Wheeler', 'Valdez', 'Harper', 'Lynch', 'Barton', 'Haley', 'Maldonado', 'Barker', 'Reese', 'Francis', 'Burgess', 'Adkins', 'Goodman', 'Curry', 'Brady', 'Christensen', 'Potter', 'Walton', 'Goodwin', 'Mullins', 'Molina', 'Webster', 'Fischer', 'Campos', 'Avila', 'Sherman', 'Todd', 'Chang', 'Blake', 'Malone', 'Wolf', 'Hodges', 'Juarez', 'Gill', 'Farmer', 'Hines', 'Gallagher', 'Duran', 'Hubbard', 'Cannon', 'Miranda', 'Wang', 'Saunders', 'Tate', 'Mack', 'Hammond', 'Carrillo', 'Townsend', 'Wise', 'Ingram', 'Barton', 'Mejia', 'Ayala', 'Schroeder', 'Hampton', 'Rowe', 'Parsons', 'Frank', 'Waters', 'Strickland', 'Osborne', 'Maxwell', 'Chan', 'Deleon', 'Norman', 'Harrington', 'Casey', 'Patton', 'Logan', 'Bowers', 'Mueller', 'Glover', 'Floyd', 'Hartman', 'Buchanan', 'Cobb', 'French', 'Kramer', 'Mccormick', 'Clarke', 'Tyler', 'Gibbs', 'Moody', 'Conner', 'Sparks', 'Mcguire', 'Leon', 'Bauer', 'Norton', 'Pope', 'Flynn', 'Hogan', 'Robles', 'Salinas', 'Yates', 'Lindsey', 'Lloyd', 'Marsh', 'Mcbride', 'Owen', 'Solis', 'Pham', 'Lang', 'Pratt', 'Lara', 'Brock', 'Ballard', 'Trujillo', 'Shaffer', 'Drake', 'Roman', 'Aguirre', 'Morton', 'Stokes', 'Lamb', 'Pacheco', 'Patrick', 'Cochran', 'Shepherd', 'Cain', 'Burnett', 'Hess', 'Li', 'Cervantes', 'Olsen', 'Briggs', 'Ochoa', 'Cabrera', 'Velasquez', 'Montoya', 'Roth', 'Meyers', 'Cardenas', 'Fuentes', 'Weiss', 'Hoover', 'Wilkins', 'Nicholson', 'Underwood', 'Short', 'Carson', 'Morrow', 'Colon', 'Holloway', 'Summers', 'Bryan', 'Petersen', 'Mckenzie', 'Serrano', 'Wilcox', 'Carey', 'Clayton', 'Poole', 'Calderon', 'Gallegos', 'Greer', 'Rivas', 'Guerra', 'Decker', 'Collier', 'Wall', 'Whitaker', 'Bass', 'Flowers', 'Davenport', 'Conley', 'Houston', 'Huff', 'Copeland', 'Hood', 'Monroe', 'Massey', 'Roberson', 'Combs', 'Franco', 'Larsen', 'Pittman', 'Randall', 'Skinner', 'Wilkinson', 'Kirby', 'Cameron', 'Bridges', 'Anthony', 'Richard', 'Kirk', 'Bruce', 'Singleton', 'Mathis', 'Bradford', 'Boone', 'Abbott', 'Charles', 'Allison', 'Sweeney', 'Atkinson', 'Horn', 'Jefferson', 'Rosario', 'York', 'Christian', 'Phelps', 'Farrell', 'Castaneda', 'Nash', 'Dickerson', 'Bond', 'Wyatt', 'Foley', 'Chase', 'Gates', 'Vincent', 'Mathews', 'Hodge', 'Garrison', 'Trevino', 'Villarreal', 'Heath', 'Dalton', 'Valencia', 'Callahan', 'Hensley', 'Atkins', 'Huffman', 'Roy', 'Boyer', 'Shields', 'Lin', 'Hancock', 'Grimes', 'Glenn', 'Cline', 'Delacruz', 'Camacho', 'Dillon', 'Parrish', 'Oneill', 'Melton', 'Booth', 'Kane', 'Berg', 'Harrell', 'Pitts', 'Savage', 'Wiggins', 'Brennan', 'Salas', 'Marks', 'Russo', 'Sawyer', 'Baxter', 'Golden', 'Hutchinson', 'Liu', 'Walter', 'McDowell', 'Wiley', 'Rich', 'Humphrey', 'Johns', 'Koch', 'Suarez', 'Hobbs', 'Beard', 'Gilmore', 'Ibarra', 'Keith', 'Macias', 'Khan', 'Andrade', 'Ware', 'Stephenson', 'Henson', 'Wilkerson', 'Dyer', 'Mcclure', 'Blackwell', 'Mercado', 'Tanner', 'Eaton', 'Clay', 'Barron', 'Beasley', 'Oneal', 'Small', 'Preston', 'Valentine', 'Maldonado', 'Gaines', 'Watts', 'Doyle', 'Bartlett', 'Buck', 'Valdez', 'Callahan', 'Hensley', 'Atkins', 'Huffman', 'Roy', 'Boyer', 'Shields', 'Lin', 'Hancock', 'Grimes', 'Glenn', 'Cline', 'Delacruz', 'Camacho', 'Dillon', 'Parrish', 'Oneill', 'Melton', 'Booth', 'Kane', 'Berg', 'Harrell', 'Pitts', 'Savage', 'Wiggins', 'Brennan', 'Salas', 'Marks', 'Russo', 'Sawyer', 'Baxter', 'Golden', 'Hutchinson', 'Liu', 'Walter', 'McDowell', 'Wiley', 'Rich', 'Humphrey', 'Johns', 'Koch', 'Suarez', 'Hobbs', 'Beard', 'Gilmore', 'Ibarra', 'Keith', 'Macias', 'Khan', 'Andrade', 'Ware', 'Stephenson', 'Henson', 'Wilkerson', 'Dyer', 'Mcclure', 'Blackwell', 'Mercado', 'Tanner', 'Eaton', 'Clay', 'Barron', 'Beasley', 'Oneal', 'Small', 'Preston', 'Valentine', 'Maldonado', 'Gaines', 'Watts', 'Doyle', 'Bartlett', 'Buck', 'Valdez'];
      const foreignCountries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Belgium', 'Ireland', 'New Zealand', 'Singapore', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Austria', 'Finland', 'Hungary', 'Romania', 'Croatia', 'Bulgaria', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus', 'Iceland', 'Liechtenstein', 'Monaco', 'San Marino', 'Vatican City', 'Andorra', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Philippines', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'Myanmar', 'Cambodia', 'Laos', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Pakistan', 'Afghanistan', 'Iran', 'Iraq', 'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Yemen', 'Jordan', 'Lebanon', 'Syria', 'Israel', 'Palestine', 'Turkey', 'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Ethiopia', 'Kenya', 'Tanzania', 'Uganda', 'Ghana', 'Nigeria', 'Senegal', 'Ivory Coast', 'Cameroon', 'Gabon', 'Congo', 'DRC', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Djibouti', 'Eritrea', 'Somalia', 'Rwanda', 'Burundi', 'Malawi', 'Lesotho', 'Swaziland', 'Angola', 'Guinea', 'Sierra Leone', 'Liberia', 'Togo', 'Benin', 'Burkina Faso', 'Niger', 'Mali', 'Mauritania', 'Chad', 'Central African Republic', 'Equatorial Guinea', 'São Tomé and Príncipe', 'Cape Verde', 'Gambia', 'Guinea-Bissau', 'Western Sahara', 'South Sudan', 'Eritrea', 'Djibouti', 'Somaliland', 'Puntland', 'Galmudug', 'Hirshabelle', 'South West State', 'Jubaland', 'Banaadir', 'Somalia', 'Somaliland', 'Puntland', 'Galmudug', 'Hirshabelle', 'South West State', 'Jubaland', 'Banaadir'];
      
      firstName = foreignFirstNames[Math.floor(random1 * foreignFirstNames.length)];
      lastName = foreignLastNames[Math.floor(random2 * foreignLastNames.length)];
      countryName = foreignCountries[Math.floor(random3 * foreignCountries.length)];
    } else {
      // Use local names from the country-specific pool
      firstName = firstNames[Math.floor(random1 * firstNames.length)];
      lastName = lastNames[Math.floor(random2 * lastNames.length)];
      countryName = countries[Math.floor(random3 * countries.length)];
    }
    
    const template = templates && templates.length > 0 
      ? templates[Math.floor(random4 * templates.length)] 
      : `Great tour experience in ${city}! We had a wonderful time exploring ${locationNames || city}.`;
    
    // Use pre-calculated rating
    const rating = ratings[i];
    
    // Generate review date (within last 6 months) - more varied distribution
    const reviewDate = new Date();
    const daysAgo = Math.floor(Math.random() * 180);
    reviewDate.setDate(reviewDate.getDate() - daysAgo);
    
    // Generate review text with variations - ensure it's always a string
    let reviewText = template || `Great tour experience in ${city}! We had a wonderful time exploring ${locationNames || city}.`;
    
    // Add varied personal touches for more unique reviews
    const personalTouches = [
      ` We especially loved the ${duration || 'tour duration'} duration - perfect timing!`,
      ` The meeting point was easy to find and convenient.`,
      ` Would definitely come back and recommend to friends!`,
      ` Our group had a wonderful time.`,
      ` The experience exceeded our expectations!`,
      ` Very well organized from start to finish.`,
      ` Made our trip to ${city} unforgettable!`,
      ` Great communication and clear instructions.`,
      ` The timing was perfect - we saw everything without feeling rushed.`,
      ` Such a memorable experience! We'll treasure these photos forever.`,
      ` Worth every penny! One of the highlights of our trip.`,
      ` The attention to detail was impressive.`,
      ` We learned so much about the local culture and history.`,
      ` Perfect for travelers who want an authentic experience.`,
      ` The pace was just right - not too fast, not too slow.`,
      ` We appreciated the insider tips and local recommendations.`,
      ` The guide's passion for ${city} really shone through.`,
      ` Great balance of information and free time to explore.`,
      ` We felt safe and well taken care of throughout.`,
      ` The small group size made it much more personal.`
    ];
    
    // Add 0-2 personal touches randomly for variety
    const numTouches = Math.random() > 0.5 ? (Math.random() > 0.7 ? 2 : 1) : 0;
    const usedTouches = new Set();
    for (let t = 0; t < numTouches; t++) {
      let touch;
      do {
        touch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
      } while (usedTouches.has(touch) && usedTouches.size < personalTouches.length);
      usedTouches.add(touch);
      reviewText += touch;
    }
    
    // Add location-specific mentions for more authenticity
    if (locationsArray && locationsArray.length > 0 && Math.random() > 0.6) {
      const specificLocation = locationsArray[Math.floor(Math.random() * locationsArray.length)];
      const locationMentions = [
        ` ${specificLocation} was particularly impressive.`,
        ` We especially enjoyed visiting ${specificLocation}.`,
        ` The highlight was definitely ${specificLocation}.`,
        ` ${specificLocation} exceeded all our expectations.`
      ];
      reviewText += locationMentions[Math.floor(Math.random() * locationMentions.length)];
    }
    
    // Add provider name (without "The" prefix) for guided tours - replace "the guide" with provider name
    if (category === 'Guided Tour' && supplier && Math.random() > 0.4) {
      const providerName = supplier.fullName?.split(' ')[0] || supplier.companyName?.split(' ')[0] || null;
      if (providerName) {
        // Replace "the guide" with provider name (without "The")
        reviewText = reviewText.replace(/the guide/gi, providerName);
        reviewText = reviewText.replace(/The guide/gi, providerName);
        reviewText = reviewText.replace(/guide/gi, providerName);
      }
    }
    
    reviews.push({
      id: `review-${i + 1}`,
      author: {
        name: `${firstName} ${lastName}`,
        country: countryName,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=128`
      },
      rating: rating,
      date: reviewDate.toISOString(),
      text: reviewText,
      verified: Math.random() > 0.2 // 80% verified bookings
    });
  }
  
  // Sort by date (newest first)
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return reviews;
}

// Helper function to recursively remove all ID fields from an object
// IMPORTANT: Does NOT remove supplierId (needed for foreign key relationship)
function removeAllIds(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => removeAllIds(item));
  }
  if (typeof obj !== 'object') return obj;
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip ID-related fields (case-insensitive) BUT keep supplierId (it's needed!)
    const keyLower = key.toLowerCase();
    if (keyLower === 'id' || 
        keyLower === 'tourid' || 
        keyLower === 'tour_id' ||
        // DO NOT remove supplierId - it's a foreign key, not an auto-generated ID
        // keyLower === 'supplierid' ||  // REMOVED - supplierId is required!
        // keyLower === 'supplier_id' ||  // REMOVED - supplierId is required!
        keyLower === 'optionid' ||
        keyLower === 'option_id') {
      continue; // Skip this field
    }
    // Recursively clean nested objects
    cleaned[key] = removeAllIds(value);
  }
  return cleaned;
}

// Background function to upload images to Cloudinary and update tour
// Runs asynchronously after tour creation to avoid blocking the response
async function uploadImagesInBackground(tourId, imagesArray, city) {
  try {
    console.log(`   📤 Starting background Cloudinary upload for tour ${tourId}...`);
    const folder = `tours/${city.toLowerCase().replace(/\s+/g, '-')}`;
    const cloudinaryUrls = await uploadMultipleImages(imagesArray, folder);

    console.log(`   ✅ Uploaded ${cloudinaryUrls.length} images to Cloudinary for tour ${tourId}`);

    await prisma.tour.update({
      where: { id: tourId },
      data: {
        images: JSON.stringify(cloudinaryUrls)
      }
    });

    console.log(`   ✅ Tour ${tourId} updated with Cloudinary URLs`);
  } catch (error) {
    console.error(`   ❌ Background Cloudinary upload failed for tour ${tourId}:`, error.message);
    // Do not throw - tour is already created, images remain as base64
  }
}

// Upload images to Cloudinary BEFORE tour creation (for faster submission)
// This endpoint allows frontend to upload images first, then create tour with URLs
app.post('/api/tours/upload-images', async (req, res) => {
  try {
    const { images, city } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Images array is required'
      });
    }

    if (!city || typeof city !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'City is required'
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary not configured',
        message: 'Image upload service is not configured. Please contact support.'
      });
    }

    console.log(`📤 Uploading ${images.length} images to Cloudinary for city: ${city}`);
    const uploadStartTime = Date.now();

    const folder = `tours/${city.toLowerCase().replace(/\s+/g, '-')}`;
    const cloudinaryUrls = await uploadMultipleImages(images, folder);

    const uploadTime = Date.now() - uploadStartTime;
    console.log(`✅ Uploaded ${cloudinaryUrls.length} images in ${uploadTime}ms`);

    res.json({
      success: true,
      urls: cloudinaryUrls,
      message: `Successfully uploaded ${cloudinaryUrls.length} images`
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message || 'Failed to upload images'
    });
  }
});

// Create a new tour
app.post('/api/tours', async (req, res) => {
  const createStartTime = Date.now();
  try {
    console.log('📥 Received tour creation request');
    console.log('📦 Request body keys:', Object.keys(req.body));
    
    // Check database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbCheckError) {
      console.error('❌ Database connection check failed:', dbCheckError.message);
      return res.status(503).json({
        success: false,
        error: 'Database unavailable',
        message: 'Database is currently unavailable. Please try again in a few moments.',
        details: process.env.NODE_ENV === 'development' ? dbCheckError.message : undefined
      });
    }
    
    // CRITICAL: Remove ALL IDs from request body immediately (before any processing)
    const cleanedBody = removeAllIds(req.body);
    
    // CRITICAL: Also remove pricingType from request body recursively (prevents P2022 errors)
    // BUT PRESERVE groupPricingTiers - it's a valid field!
    const removePricingType = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (Array.isArray(obj)) {
        return obj.map(item => removePricingType(item));
      }
      if (typeof obj === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          const keyLower = key.toLowerCase();
          // Skip pricingType fields BUT preserve groupPricingTiers
          if (keyLower === 'pricingtype' || keyLower === 'pricing_type') {
            continue; // Skip pricingType fields
          }
          // CRITICAL: Preserve groupPricingTiers - it's a valid field!
          if (keyLower === 'grouppricingtiers') {
            cleaned[key] = value; // Keep as-is, don't recurse
            continue;
          }
          cleaned[key] = removePricingType(value);
        }
        return cleaned;
      }
      return obj;
    };
    const finalCleanedBody = removePricingType(cleanedBody);
    
    console.log('🧹 Cleaned request body (all IDs and pricingType removed recursively)');
    const requestSummary = {
      ...finalCleanedBody,
      images: Array.isArray(finalCleanedBody.images)
        ? `[${finalCleanedBody.images.length} images]`
        : typeof finalCleanedBody.images,
      tourOptionsCount: Array.isArray(finalCleanedBody.tourOptions)
        ? finalCleanedBody.tourOptions.length
        : 0
    };
    console.log('📦 Request summary:', requestSummary);
    
    const {
      supplierId,
      title,
      country,
      city,
      category,
      locations,
      duration,
      pricePerPerson,
      // pricingType removed - we infer from groupPrice/maxGroupSize
      maxGroupSize,
      groupPrice,
      groupPricingTiers, // Extract groupPricingTiers for main tour - CRITICAL FIELD!
      unavailableDates, // Legacy - Extract unavailableDates
      unavailableDaysOfWeek, // Extract unavailableDaysOfWeek
      currency,
      shortDescription,
      fullDescription,
      included,
      notIncluded,
      meetingPoint,
      guideType,
      tourTypes,
      images,
      languages,
      highlights
    } = finalCleanedBody; // Use final cleaned body (IDs and pricingType removed)
    
    // #region agent log
    const logPath = '/Users/talhanawaz/Desktop/asiabylocals-latest/.cursor/debug.log';
    try {
      const logEntry = JSON.stringify({
        location: 'server.js:2468',
        message: 'POST endpoint - extracted groupPricingTiers from request',
        data: {
          hasGroupPricingTiers: !!groupPricingTiers,
          groupPricingTiersType: typeof groupPricingTiers,
          isString: typeof groupPricingTiers === 'string',
          isArray: Array.isArray(groupPricingTiers),
          preview: groupPricingTiers ? (typeof groupPricingTiers === 'string' ? groupPricingTiers.substring(0, 100) : JSON.stringify(groupPricingTiers).substring(0, 100)) : null
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D'
      }) + '\n';
      fs.appendFileSync(logPath, logEntry);
    } catch (e) {}
    // #endregion

    // Debug: Log each field
    console.log('🔍 Field validation:');
    console.log('  supplierId:', supplierId ? '✅' : '❌', supplierId);
    console.log('  title:', title ? '✅' : '❌', title);
    console.log('  country:', country ? '✅' : '❌', country);
    console.log('  city:', city ? '✅' : '❌', city);
    console.log('  category:', category ? '✅' : '❌', category);
    console.log('  fullDescription:', fullDescription ? '✅' : '❌', fullDescription ? `${fullDescription.substring(0, 50)}...` : '');
    console.log('  included:', included ? '✅' : '❌', included ? `${included.substring(0, 50)}...` : '');
    console.log('  images:', images ? '✅' : '❌', typeof images, Array.isArray(images) ? images.length : 'not array');
    console.log('  locations:', locations ? '✅' : '❌', typeof locations);
    console.log('  duration:', duration ? '✅' : '❌', duration);
    console.log('  pricePerPerson:', pricePerPerson ? '✅' : '❌', pricePerPerson);
    // Infer pricing type from groupPrice/maxGroupSize presence
    const inferredPricingType = (groupPrice && maxGroupSize) ? 'per_group' : 'per_person';
    console.log('  pricingType (inferred):', inferredPricingType);
    console.log('  maxGroupSize:', maxGroupSize || 'N/A');
    console.log('  groupPrice:', groupPrice || 'N/A');
    console.log('  languages:', languages ? '✅' : '❌', typeof languages);

    // Validation
    if (!supplierId || !title || !country || !city || !category || !fullDescription || !included || !images) {
      const missing = [];
      if (!supplierId) missing.push('supplierId');
      if (!title) missing.push('title');
      if (!country) missing.push('country');
      if (!city) missing.push('city');
      if (!category) missing.push('category');
      if (!fullDescription) missing.push('fullDescription');
      if (!included) missing.push('included');
      if (!images) missing.push('images');
      
      console.log('❌ Missing fields:', missing);
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Infer pricing type from groupPrice/maxGroupSize OR groupPricingTiers presence
    // All tours now use group pricing with tiered pricing structure
    const hasGroupPricingTiers = groupPricingTiers && (
      (typeof groupPricingTiers === 'string' && groupPricingTiers.trim().length > 0) ||
      (Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0)
    );
    const isPerGroupPricing = !!(groupPrice && maxGroupSize) || hasGroupPricingTiers;
    
    // Validate pricing based on inferred pricing type
    if (isPerGroupPricing) {
      if (!groupPrice || isNaN(parseFloat(groupPrice)) || parseFloat(groupPrice) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid group price',
          message: 'Group price is required and must be a positive number for per-group pricing'
        });
      }
      if (!maxGroupSize || isNaN(parseInt(maxGroupSize)) || parseInt(maxGroupSize) < 1 || parseInt(maxGroupSize) > 20) {
        return res.status(400).json({
          success: false,
          error: 'Invalid group size',
          message: 'Max group size is required and must be between 1 and 20 for per-group pricing'
        });
      }
    } else {
      if (!pricePerPerson || isNaN(parseFloat(pricePerPerson)) || parseFloat(pricePerPerson) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid price',
          message: 'Price per person is required and must be a positive number'
        });
      }
    }

    // Check if supplier is approved
    let supplierCheck;
    try {
      supplierCheck = await prisma.supplier.findUnique({
        where: { id: parseInt(supplierId) },
        select: { id: true, status: true, fullName: true, companyName: true }
      });
    } catch (dbError) {
      console.error('❌ Database error fetching supplier:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database error',
        message: 'Failed to fetch supplier information'
      });
    }

    if (!supplierCheck) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found',
        message: 'Supplier account not found'
      });
    }

    if (supplierCheck.status !== 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Supplier not approved',
        message: 'Your supplier account is under review. You can create tours only after your account is approved by admin. Please wait for approval notification via email.'
      });
    }

    // Validate category
    const validCategories = ['Entry Ticket', 'Guided Tour', 'Mini Tour'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
        message: 'Category must be "Entry Ticket", "Guided Tour", or "Mini Tour"'
      });
    }

    // Parse JSON fields
    let locationsArray = [];
    let imagesArray = [];
    let languagesArray = [];
    let highlightsArray = [];
    let tourTypesArray = [];

    try {
      // Parse locations
      if (locations) {
        if (typeof locations === 'string') {
          try {
            locationsArray = JSON.parse(locations);
          } catch (e) {
            console.error('❌ Failed to parse locations JSON:', e.message);
            locationsArray = [];
          }
        } else if (Array.isArray(locations)) {
          locationsArray = locations;
        }
      }
      
      // Parse images - CRITICAL for tour creation
      if (images) {
        if (typeof images === 'string') {
          try {
            imagesArray = JSON.parse(images);
          } catch (e) {
            console.error('❌ Failed to parse images JSON:', e.message);
            console.error('   Images string length:', images.length);
            console.error('   Images string preview:', images.substring(0, 200));
            return res.status(400).json({
              success: false,
              error: 'Invalid images format',
              message: 'Images must be a valid JSON array. Please ensure all images are properly uploaded.',
              details: process.env.NODE_ENV === 'development' ? e.message : undefined
            });
          }
        } else if (Array.isArray(images)) {
          imagesArray = images;
        } else {
          console.error('❌ Images is not a string or array:', typeof images);
          return res.status(400).json({
            success: false,
            error: 'Invalid images format',
            message: 'Images must be a JSON array string or an array.'
          });
        }
      }
      
      // Parse languages
      if (languages) {
        if (typeof languages === 'string') {
          try {
            languagesArray = JSON.parse(languages);
          } catch (e) {
            console.error('❌ Failed to parse languages JSON:', e.message);
            languagesArray = ['English']; // Default fallback
          }
        } else if (Array.isArray(languages)) {
          languagesArray = languages;
        }
      }
      
      // Parse highlights (optional)
      if (highlights) {
        if (typeof highlights === 'string') {
          try {
            highlightsArray = JSON.parse(highlights);
          } catch (e) {
            console.error('❌ Failed to parse highlights JSON:', e.message);
            highlightsArray = [];
          }
        } else if (Array.isArray(highlights)) {
          highlightsArray = highlights;
        }
      }
      
      // Parse tourTypes (optional)
      if (tourTypes) {
        if (typeof tourTypes === 'string') {
          try {
            tourTypesArray = JSON.parse(tourTypes);
          } catch (e) {
            console.error('❌ Failed to parse tourTypes JSON:', e.message);
            tourTypesArray = [];
          }
        } else if (Array.isArray(tourTypes)) {
          tourTypesArray = tourTypes;
        }
      }
      
      // Validate parsed arrays are actually arrays
      if (!Array.isArray(locationsArray)) locationsArray = [];
      if (!Array.isArray(imagesArray)) {
        console.error('❌ Parsed imagesArray is not an array:', typeof imagesArray);
        return res.status(400).json({
          success: false,
          error: 'Invalid images format',
          message: 'Images must be a valid JSON array.'
        });
      }
      if (!Array.isArray(languagesArray)) languagesArray = ['English'];
      if (!Array.isArray(highlightsArray)) highlightsArray = [];
      if (!Array.isArray(tourTypesArray)) tourTypesArray = [];
      
    } catch (parseError) {
      console.error('❌ Unexpected JSON parse error:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format',
        message: 'Failed to parse tour data. Please check all fields are properly formatted.',
        details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      });
    }

    // Validate images (minimum 4)
    console.log('🖼️ Images validation:');
    console.log('  imagesArray type:', typeof imagesArray);
    console.log('  imagesArray is array:', Array.isArray(imagesArray));
    console.log('  imagesArray length:', imagesArray?.length);
    
    if (!Array.isArray(imagesArray)) {
      console.log('❌ Images is not an array:', typeof imagesArray);
      return res.status(400).json({
        success: false,
        error: 'Invalid images format',
        message: 'Images must be an array. Please ensure all images are properly uploaded.'
      });
    }
    
    // Filter out any invalid image entries (null, undefined, empty strings)
    const validImages = imagesArray.filter(img => img && typeof img === 'string' && img.trim().length > 0);
    
    if (validImages.length < 4) {
      console.log('❌ Insufficient valid images:', validImages.length, 'provided, need at least 4');
      console.log('   Total images received:', imagesArray.length);
      console.log('   Invalid images:', imagesArray.length - validImages.length);
      return res.status(400).json({
        success: false,
        error: 'Insufficient images',
        message: `At least 4 valid images are required. You provided ${validImages.length} valid images out of ${imagesArray.length} total.`
      });
    }
    
    // Use only valid images
    imagesArray = validImages;
    
    console.log('✅ All validations passed, creating tour...');

    // ==================== WORLD-CLASS SEO SLUG GENERATION ====================
    // Professional slug generation with intelligent keyword extraction and SEO optimization
    // Format: {location}-{keyword}-{tour-type} or {city}-{location}-{tour-type}
    
    // Enhanced slugify function - handles edge cases and special characters
    const slugify = (text) => {
      if (!text) return '';
      return text
        .toLowerCase()
        .trim()
        .normalize('NFD') // Normalize unicode characters (é -> e)
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .substring(0, 50); // Max length for individual parts
    };

    // World-class tour type extraction with priority-based matching
    const extractTourType = (title, category) => {
      const titleLower = title.toLowerCase();
      const titleWords = titleLower.split(/\s+/);
      
      // Priority 1: Time-based experiences (most specific)
      const timeBased = [
        { keywords: ['sunrise'], type: 'sunrise-tour' },
        { keywords: ['sunset'], type: 'sunset-tour' },
        { keywords: ['morning'], type: 'morning-tour' },
        { keywords: ['afternoon'], type: 'afternoon-tour' },
        { keywords: ['evening', 'night'], type: 'evening-tour' },
        { keywords: ['full-day', 'full day', 'day trip', 'day-trip'], type: 'full-day-tour' },
        { keywords: ['half-day', 'half day'], type: 'half-day-tour' },
        { keywords: ['multi-day', 'multi day'], type: 'multi-day-tour' }
      ];
      
      for (const { keywords, type } of timeBased) {
        if (keywords.some(kw => titleLower.includes(kw))) {
          return type;
        }
      }
      
      // Priority 2: Activity-based experiences
      const activityBased = [
        { keywords: ['food', 'culinary', 'cooking', 'dining'], type: 'food-tour' },
        { keywords: ['photography', 'photo', 'photography tour'], type: 'photography-tour' },
        { keywords: ['walking', 'walk', 'heritage walk'], type: 'walking-tour' },
        { keywords: ['bike', 'cycling', 'bicycle'], type: 'bike-tour' },
        { keywords: ['boat', 'cruise', 'river'], type: 'boat-tour' },
        { keywords: ['shopping', 'market', 'bazaar'], type: 'shopping-tour' },
        { keywords: ['spiritual', 'temple', 'pilgrimage'], type: 'spiritual-tour' },
        { keywords: ['adventure', 'trekking', 'hiking'], type: 'adventure-tour' }
      ];
      
      for (const { keywords, type } of activityBased) {
        if (keywords.some(kw => titleLower.includes(kw))) {
          return type;
        }
      }
      
      // Priority 3: Experience quality/type
      const experienceType = [
        { keywords: ['heritage', 'historical'], type: 'heritage-tour' },
        { keywords: ['cultural', 'culture'], type: 'cultural-tour' },
        { keywords: ['private'], type: 'private-tour' },
        { keywords: ['group'], type: 'group-tour' },
        { keywords: ['premium', 'deluxe', 'luxury'], type: 'premium-tour' },
        { keywords: ['express', 'quick'], type: 'express-tour' },
        { keywords: ['entry', 'ticket', 'admission'], type: 'entry-ticket' }
      ];
      
      for (const { keywords, type } of experienceType) {
        if (keywords.some(kw => titleLower.includes(kw))) {
          return type;
        }
      }
      
      // Priority 4: Category-based fallback
      if (category === 'Guided Tour') return 'guided-tour';
      if (category === 'Entry Ticket') return 'entry-ticket';
      if (category === 'Mini Tour') return 'mini-tour';
      
      // Final fallback
      return 'tour';
    };

    // World-class location extraction for ALL Asian cities with comprehensive attraction database
    const extractPrimaryLocation = (locationsArray, city, title) => {
      // Comprehensive database of well-known Asian attractions (SEO gold for entire continent)
      const asianAttractions = {
        // India
        'agra': ['taj mahal', 'agra fort', 'fatehpur sikri', 'mehtab bagh', 'baby taj', 'itmad ud daulah'],
        'delhi': ['red fort', 'india gate', 'qutb minar', 'jama masjid', 'humayun tomb', 'lotus temple', 'akshardham', 'jantar mantar', 'raj ghat', 'purana qila'],
        'jaipur': ['amber fort', 'city palace', 'hawa mahal', 'jal mahal', 'nahargarh fort', 'jantar mantar', 'albert hall', 'birla temple', 'jaigarh fort'],
        'mumbai': ['gateway of india', 'marine drive', 'elephanta caves', 'chhatrapati shivaji terminus'],
        'varanasi': ['ghats', 'kashi vishwanath', 'sarnath', 'dashashwamedh ghat'],
        'goa': ['basilica of bom jesus', 'anjuna beach', 'baga beach', 'calangute beach'],
        'kolkata': ['victoria memorial', 'howrah bridge', 'kalighat temple'],
        'chennai': ['kapaleeshwarar temple', 'marina beach', 'fort st george'],
        'bangalore': ['lalbagh botanical garden', 'cubbon park', 'tipu sultan palace'],
        'hyderabad': ['charminar', 'golconda fort', 'hussain sagar'],
        'udaipur': ['city palace', 'lake pichola', 'jag mandir'],
        'jodhpur': ['mehrangarh fort', 'jaswant thada', 'umaid bhawan palace'],
        'kerala': ['backwaters', 'alleppey', 'munnar', 'fort kochi'],
        
        // Japan
        'tokyo': ['tokyo tower', 'senso-ji temple', 'shibuya crossing', 'meiji shrine', 'imperial palace', 'skytree', 'harajuku', 'ginza', 'tsukiji market'],
        'kyoto': ['fushimi inari', 'kinkaku-ji', 'ginkaku-ji', 'kiyomizu-dera', 'arashiyama bamboo grove', 'nijo castle', 'philosopher path', 'golden pavilion'],
        'osaka': ['osaka castle', 'dotonbori', 'universal studios', 'shinsaibashi', 'osaka aquarium'],
        'nara': ['todaiji temple', 'nara park', 'kasuga taisha', 'deer park'],
        'hiroshima': ['peace memorial park', 'atomic bomb dome', 'miyajima', 'itsukushima shrine'],
        'yokohama': ['chinatown', 'minato mirai', 'sankeien garden'],
        'sapporo': ['sapporo snow festival', 'odori park', 'susukino'],
        'okinawa': ['shuri castle', 'churaumi aquarium', 'kokusai street'],
        
        // Thailand
        'bangkok': ['grand palace', 'wat pho', 'wat arun', 'chatuchak market', 'wat phra kaew', 'khao san road', 'lumphini park', 'wat saket'],
        'chiang mai': ['doi suthep', 'old city', 'night bazaar', 'elephant sanctuary', 'wat phra singh', 'wat chedi luang'],
        'phuket': ['patong beach', 'big buddha', 'phang nga bay', 'james bond island', 'old town'],
        'pattaya': ['walking street', 'sanctuary of truth', 'nong nooch garden'],
        'ayutthaya': ['ayutthaya historical park', 'wat mahathat', 'wat phra si sanphet'],
        'sukhothai': ['sukhothai historical park', 'wat mahathat'],
        'krabi': ['railay beach', 'phang nga bay', 'ao nang', 'tiger cave temple'],
        
        // Singapore
        'singapore': ['marina bay sands', 'gardens by the bay', 'sentosa', 'merlion', 'orchard road', 'little india', 'chinatown', 'universal studios', 'singapore flyer', 'clarke quay'],
        
        // Indonesia
        'bali': ['tanah lot', 'uluwatu temple', 'ubud monkey forest', 'tegallalang rice terrace', 'besakih temple', 'waterbom', 'seminyak', 'kuta beach'],
        'jakarta': ['national monument', 'old town', 'ancol dreamland', 'taman mini'],
        'yogyakarta': ['borobudur', 'prambanan', 'sultan palace', 'malioboro'],
        'bandung': ['tangkuban perahu', 'gedung sate', 'braga street'],
        
        // Malaysia
        'kuala lumpur': ['petronas towers', 'batu caves', 'kl tower', 'merdeka square', 'china town', 'little india'],
        'penang': ['george town', 'kek lok si temple', 'penang hill', 'batu ferringhi'],
        'langkawi': ['sky bridge', 'cable car', 'pantai cenang'],
        'malacca': ['red square', 'a famosa', 'jonker street'],
        
        // Vietnam
        'hanoi': ['hoan kiem lake', 'old quarter', 'temple of literature', 'ho chi minh mausoleum', 'water puppet theatre'],
        'ho chi minh city': ['war remnants museum', 'cu chi tunnels', 'notre dame cathedral', 'ben thanh market', 'reunification palace'],
        'hue': ['imperial city', 'thien mu pagoda', 'royal tombs'],
        'hoi an': ['ancient town', 'japanese bridge', 'my son sanctuary'],
        'halong bay': ['halong bay', 'cat ba island', 'sapa'],
        
        // Philippines
        'manila': ['intramuros', 'rizal park', 'fort santiago', 'manila cathedral'],
        'cebu': ['magellan cross', 'fort san pedro', 'temple of leah'],
        'boracay': ['white beach', 'puka shell beach', 'ariel point'],
        'palawan': ['underground river', 'el nido', 'coron'],
        
        // South Korea
        'seoul': ['gyeongbokgung palace', 'namsan tower', 'myeongdong', 'insadong', 'bukchon hanok village', 'dongdaemun', 'hongdae'],
        'busan': ['haeundae beach', 'gamcheon culture village', 'beomeosa temple', 'jagalchi market'],
        'jeju': ['jeju island', 'seongsan ilchulbong', 'manjanggul cave', 'cheonjiyeon waterfall'],
        
        // China
        'beijing': ['great wall', 'forbidden city', 'temple of heaven', 'summer palace', 'tiananmen square', 'beijing hutongs'],
        'shanghai': ['the bund', 'yu garden', 'shanghai tower', 'tianzifang', 'nanjing road'],
        'xi an': ['terracotta warriors', 'ancient city wall', 'muslim quarter'],
        'guilin': ['li river', 'yangshuo', 'elephant trunk hill'],
        'hong kong': ['victoria peak', 'disneyland', 'ocean park', 'temple street', 'star ferry', 'big buddha'],
        
        // Sri Lanka
        'colombo': ['gangaramaya temple', 'national museum', 'galle face green'],
        'kandy': ['temple of the tooth', 'royal botanical garden', 'kandy lake'],
        'sigiriya': ['sigiriya rock', 'lion rock'],
        'galle': ['galle fort', 'old town'],
        
        // Nepal
        'kathmandu': ['durbar square', 'swayambhunath', 'pashupatinath', 'boudhanath'],
        'pokhara': ['phewa lake', 'world peace pagoda', 'annapurna'],
        
        // Myanmar
        'yangon': ['shwedagon pagoda', 'sule pagoda', 'bogyoke market'],
        'bagan': ['bagan temples', 'ananda temple', 'sunset point'],
        
        // Cambodia
        'phnom penh': ['royal palace', 'silver pagoda', 'killing fields'],
        'siem reap': ['angkor wat', 'bayon temple', 'ta prohm', 'angkor thom'],
        
        // Bangladesh
        'dhaka': ['lalbagh fort', 'ahsan manzil', 'national museum'],
        
        // Pakistan
        'lahore': ['badshahi mosque', 'lahore fort', 'shalimar gardens'],
        'karachi': ['mazar e quaid', 'clifton beach'],
        
        // Taiwan
        'taipei': ['taipei 101', 'chiang kai shek memorial', 'longshan temple', 'shilin night market'],
        'taichung': ['rainbow village', 'sun moon lake'],
        
        // Mongolia
        'ulaanbaatar': ['gandantegchinlen monastery', 'genghis khan square'],
        
        // Kazakhstan
        'almaty': ['kok tobe', 'big almaty lake'],
        
        // Uzbekistan
        'samarkand': ['registan', 'gur e amir', 'bibi khanym mosque'],
        'tashkent': ['chorsu bazaar', 'khast imam complex'],
        
        // General Asian landmarks (fallback)
        'general': ['temple', 'pagoda', 'palace', 'fort', 'beach', 'market', 'garden', 'museum', 'monument', 'shrine', 'monastery', 'mosque', 'cathedral', 'bridge', 'tower', 'park', 'lake', 'mountain', 'island', 'cave', 'waterfall']
      };
      
      // Normalize city name for lookup
      const cityLower = city.toLowerCase().trim();
      
      // Find city-specific attractions
      let cityAttractions = [];
      for (const [cityKey, attractions] of Object.entries(asianAttractions)) {
        if (cityLower.includes(cityKey) || cityKey.includes(cityLower)) {
          cityAttractions = attractions;
          break;
        }
      }
      
      // If no city match, use general attractions
      if (cityAttractions.length === 0) {
        cityAttractions = asianAttractions.general || [];
      }
      
      // Combine city-specific and general attractions
      const allAttractions = [...cityAttractions, ...(asianAttractions.general || [])];
      
      if (Array.isArray(locationsArray) && locationsArray.length > 0) {
        // Strategy 1: Find well-known attraction from comprehensive Asian database (best for SEO)
        for (const location of locationsArray) {
          const locationLower = location.toLowerCase();
          const matchedAttraction = allAttractions.find(attr => 
            locationLower.includes(attr) || attr.includes(locationLower) ||
            attr.split(' ').some(word => locationLower.includes(word))
          );
          if (matchedAttraction) {
            return location; // Use the full location name
          }
        }
        
        // Strategy 2: Check if title mentions a well-known attraction
        const titleLower = title.toLowerCase();
        for (const attr of allAttractions) {
          if (titleLower.includes(attr) || attr.split(' ').some(word => titleLower.includes(word))) {
            // Find matching location or use attraction name
            const matchingLocation = locationsArray.find(loc => {
              const locLower = loc.toLowerCase();
              return locLower.includes(attr) || attr.includes(locLower) ||
                     attr.split(' ').some(word => locLower.includes(word));
            });
            if (matchingLocation) return matchingLocation;
            // If title mentions it but not in locations, use first location
          return locationsArray[0];
          }
        }
        
        // Strategy 3: Use first location (supplier's priority)
        return locationsArray[0];
      }
      
      // Strategy 4: Extract from title if no locations provided
      if (title) {
        const titleLower = title.toLowerCase();
        for (const attr of allAttractions) {
          if (titleLower.includes(attr) || attr.split(' ').some(word => titleLower.includes(word))) {
            // Capitalize properly
            return attr.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
      }
      
      // Final fallback: city name
      return city;
    };

    // Generate world-class SEO-optimized slug
    const primaryLocation = extractPrimaryLocation(locationsArray, city, title);
    const tourType = extractTourType(title, category);
    
    let locationSlug = slugify(primaryLocation);
    const typeSlug = tourType;
    const citySlug = slugify(city);
    
    // Advanced keyword extraction with NLP-like prioritization
    const extractKeywords = (text, locationSlug, citySlug) => {
      // Comprehensive stop words (common words that don't add SEO value)
      const stopWords = new Set([
        'the', 'and', 'for', 'with', 'from', 'to', 'of', 'a', 'an', 'in', 'on', 'at', 'by',
        'tour', 'tours', 'ticket', 'tickets', 'guide', 'guided', 'private', 'group',
        'skip', 'line', 'book', 'booking', 'visit', 'visiting', 'see', 'seeing',
        'day', 'hour', 'hours', 'minute', 'minutes', 'your', 'you', 'this', 'that',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might'
      ]);
      
      // High-value SEO keywords (prioritize these)
      const seoKeywords = new Set([
        'sunrise', 'sunset', 'heritage', 'cultural', 'food', 'walking', 'photography',
        'full-day', 'half-day', 'express', 'premium', 'deluxe', 'exclusive', 'authentic',
        'traditional', 'royal', 'spiritual', 'adventure', 'culinary', 'shopping',
        'morning', 'evening', 'night', 'detailed', 'comprehensive', 'personalized'
      ]);
      
      // Extract meaningful words
      const words = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
        .split(/\s+/)
        .map(word => word.replace(/[^\w]/g, '')) // Clean each word
        .filter(word => {
          const cleanWord = word.toLowerCase();
          return cleanWord.length > 3 && // Minimum 4 characters
            !stopWords.has(cleanWord) &&
            cleanWord !== locationSlug.toLowerCase() &&
            cleanWord !== citySlug.toLowerCase() &&
            !cleanWord.match(/^\d+$/); // Exclude pure numbers
        })
        .filter((word, index, self) => self.indexOf(word) === index) // Remove duplicates
        .sort((a, b) => {
          // Prioritize SEO keywords
          const aIsSEO = Array.from(seoKeywords).some(kw => a.includes(kw));
          const bIsSEO = Array.from(seoKeywords).some(kw => b.includes(kw));
          if (aIsSEO && !bIsSEO) return -1;
          if (!aIsSEO && bIsSEO) return 1;
          // Then prioritize longer words (more specific)
          return b.length - a.length;
        })
        .slice(0, 8); // Take up to 8 meaningful words
      
      return words;
    };
    
    // Extract keywords AFTER we have locationSlug and citySlug
    const titleKeywords = extractKeywords(title, locationSlug, citySlug);
    
    // Build intelligent base slug with SEO optimization
    let baseSlug = '';
    const isGenericLocation = locationSlug === citySlug || locationSlug.length < 5;
    
    // Strategy 1: If location is well-known and specific, use: location-tour-type
    if (!isGenericLocation && locationSlug.length >= 5) {
      baseSlug = `${locationSlug}-${typeSlug}`;
    }
    // Strategy 2: If location is generic, use: city-location-tour-type
    else if (isGenericLocation && citySlug && citySlug !== locationSlug) {
      baseSlug = `${citySlug}-${locationSlug}-${typeSlug}`;
    }
    // Strategy 3: Fallback to city-tour-type
    else {
      baseSlug = `${citySlug}-${typeSlug}`;
    }
    
    // SEO Enhancement: Add keyword if slug is too short or generic
    if (baseSlug.length < 20 && titleKeywords.length > 0) {
      const firstKeyword = slugify(titleKeywords[0]);
      if (firstKeyword && firstKeyword.length > 3 && !baseSlug.includes(firstKeyword)) {
        // Insert keyword between location and type
        if (baseSlug.includes(`${citySlug}-${locationSlug}`)) {
          baseSlug = `${citySlug}-${locationSlug}-${firstKeyword}-${typeSlug}`;
        } else if (baseSlug.startsWith(locationSlug)) {
        baseSlug = `${locationSlug}-${firstKeyword}-${typeSlug}`;
        } else {
          baseSlug = `${citySlug}-${firstKeyword}-${typeSlug}`;
        }
      }
    }
    
    // Ensure base slug doesn't exceed optimal length (60 chars max for SEO)
    if (baseSlug.length > 60) {
      const parts = baseSlug.split('-');
      baseSlug = parts.slice(0, Math.min(parts.length, 5)).join('-'); // Max 5 parts
    }
    
    // Ensure slug is unique (try different word combinations before using counter)
    // CRITICAL: This loop MUST guarantee a unique slug before proceeding
    let slug = baseSlug;
    let attempt = 0;
    const maxAttempts = 30;
    let slugIsUnique = false;
    
    while (attempt < maxAttempts && !slugIsUnique) {
      // Check if slug already exists
      const existingTour = await prisma.tour.findUnique({
        where: { slug }
      });
      
      if (!existingTour) {
        // Slug is unique! Exit loop
        slugIsUnique = true;
        break;
      }
      
      // Slug exists, try next strategy
      attempt++;
      
      // Strategy 1: Try adding keywords from title one by one (most SEO-friendly)
      if (attempt <= titleKeywords.length && titleKeywords.length > 0) {
        const keyword = slugify(titleKeywords[attempt - 1]);
        if (keyword && keyword.length > 3 && keyword !== locationSlug && keyword !== citySlug) {
          // Try different positions for keyword
          if (attempt % 2 === 1) {
          slug = `${locationSlug}-${keyword}-${typeSlug}`;
          } else {
            slug = `${citySlug}-${keyword}-${typeSlug}`;
          }
          continue;
        }
      }
      
      // Strategy 2: Try keyword combinations (2 keywords)
      if (attempt > titleKeywords.length && attempt <= titleKeywords.length * 2 && titleKeywords.length >= 2) {
        const idx1 = Math.floor((attempt - titleKeywords.length - 1) / titleKeywords.length);
        const idx2 = (attempt - titleKeywords.length - 1) % titleKeywords.length;
        if (idx1 < titleKeywords.length && idx2 < titleKeywords.length && idx1 !== idx2) {
          const kw1 = slugify(titleKeywords[idx1]);
          const kw2 = slugify(titleKeywords[idx2]);
          if (kw1 && kw2 && kw1.length > 3 && kw2.length > 3) {
            slug = `${locationSlug}-${kw1}-${kw2}-${typeSlug}`;
        continue;
          }
        }
      }
      
      // Strategy 3: Try city + keyword + type (for city-specific tours)
      if (attempt === titleKeywords.length * 2 + 1 && citySlug && citySlug !== locationSlug && titleKeywords.length > 0) {
        const keyword = slugify(titleKeywords[0]);
        if (keyword && keyword.length > 3) {
          slug = `${citySlug}-${keyword}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 4: Try location + city + keyword + type
      if (attempt === titleKeywords.length * 2 + 2 && citySlug && citySlug !== locationSlug && titleKeywords.length > 0) {
        const keyword = slugify(titleKeywords[0]);
        if (keyword && keyword.length > 3) {
          slug = `${locationSlug}-${citySlug}-${keyword}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 5: Try different keyword + city combinations
      if (attempt > titleKeywords.length * 2 + 2 && titleKeywords.length >= 2) {
        const keywordIndex = (attempt - titleKeywords.length * 2 - 3) % titleKeywords.length;
        const keyword = slugify(titleKeywords[keywordIndex]);
        if (keyword && keyword.length > 3 && keyword !== locationSlug) {
          slug = `${keyword}-${citySlug}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 6: Try location + city + type (simple combination)
      if (attempt === titleKeywords.length * 2 + 3 && citySlug && citySlug !== locationSlug) {
        slug = `${locationSlug}-${citySlug}-${typeSlug}`;
        continue;
      }
      
      // If we've exhausted all keyword strategies, break to try custom words
      // (Don't use timestamp hash here - custom words are more SEO-friendly)
      break;
    }
    
    // Final safety check - ensure slug is unique using custom descriptive words for ALL Asian cities
    // CRITICAL: Only proceed if slug is NOT unique yet (prevents P2002 errors)
    if (!slugIsUnique && (attempt >= maxAttempts || (attempt > 0 && slug === baseSlug))) {
      // Comprehensive custom words for Asian tours - SEO-friendly and meaningful for entire continent
      const asianTourWords = [
        // Heritage & Culture (Universal Asian themes)
        'heritage', 'cultural', 'traditional', 'authentic', 'classic', 'royal', 'imperial', 'ancient',
        // Experience Types (Premium offerings)
        'premium', 'deluxe', 'exclusive', 'private', 'personalized', 'custom', 'luxury', 'vip',
        'express', 'detailed', 'comprehensive', 'extended', 'full-day', 'half-day', 'multi-day',
        // Time-based (Universal)
        'sunrise', 'sunset', 'evening', 'morning', 'afternoon', 'night', 'dawn', 'dusk',
        // Activity Types (Pan-Asian activities)
        'photography', 'walking', 'cycling', 'food', 'culinary', 'shopping', 'spiritual', 'adventure',
        'nature', 'wildlife', 'beach', 'mountain', 'island', 'river', 'cruise', 'sailing',
        // Location Types (Universal Asian landmarks)
        'temple', 'pagoda', 'fort', 'palace', 'bazaar', 'market', 'garden', 'monument', 'shrine',
        'monastery', 'mosque', 'cathedral', 'bridge', 'tower', 'park', 'lake', 'cave', 'waterfall',
        'museum', 'gallery', 'village', 'town', 'district', 'quarter', 'street',
        // Quality Indicators (Trust signals)
        'guided', 'expert', 'local', 'native', 'certified', 'professional', 'licensed', 'official',
        'award-winning', 'recommended', 'popular', 'famous', 'iconic', 'legendary'
      ];
      
      // Try custom words first (more SEO-friendly than numbers)
      let wordIndex = 0;
      let finalSlug = `${baseSlug}-${asianTourWords[wordIndex]}`;
      
      while (wordIndex < asianTourWords.length && !slugIsUnique) {
        const existingTour = await prisma.tour.findUnique({
          where: { slug: finalSlug }
        });
        if (!existingTour) {
          slug = finalSlug;
          slugIsUnique = true;
          break;
        }
        wordIndex++;
        if (wordIndex < asianTourWords.length) {
          finalSlug = `${baseSlug}-${asianTourWords[wordIndex]}`;
        }
      }
      
      // If all custom words are exhausted, try combining with city
      if (!slugIsUnique && wordIndex >= asianTourWords.length && citySlug && citySlug !== locationSlug) {
        let combinedWordIndex = 0;
        finalSlug = `${baseSlug}-${citySlug}-${asianTourWords[combinedWordIndex]}`;
        
        while (combinedWordIndex < Math.min(15, asianTourWords.length) && !slugIsUnique) {
          const existingTour = await prisma.tour.findUnique({
            where: { slug: finalSlug }
          });
          if (!existingTour) {
            slug = finalSlug;
            slugIsUnique = true;
            break;
          }
          combinedWordIndex++;
          if (combinedWordIndex < asianTourWords.length) {
            finalSlug = `${baseSlug}-${citySlug}-${asianTourWords[combinedWordIndex]}`;
          }
        }
      }
      
      // If all single words are exhausted, try word combinations (NO NUMBERS ALLOWED)
      if (!slugIsUnique && wordIndex >= asianTourWords.length) {
        // Try combinations of two words for more unique slugs
        const combinationWords = [
          'premium-guided', 'exclusive-local', 'authentic-cultural', 'private-expert',
          'deluxe-experience', 'custom-tour', 'personalized-journey', 'luxury-adventure',
          'certified-professional', 'award-winning-local', 'recommended-tour', 'popular-experience',
          'iconic-heritage', 'legendary-cultural', 'traditional-authentic', 'royal-imperial',
          'ancient-heritage', 'sunrise-guided', 'sunset-experience', 'full-day-tour',
          'half-day-adventure', 'multi-day-journey', 'walking-tour', 'photography-experience',
          'food-culinary', 'shopping-adventure', 'spiritual-journey', 'nature-wildlife',
          'beach-cruise', 'mountain-adventure', 'island-exploration', 'river-cruise',
          'temple-pagoda', 'fort-palace', 'bazaar-market', 'garden-monument',
          'museum-gallery', 'village-town', 'district-quarter', 'street-exploration'
        ];
        
        let comboIndex = 0;
        while (comboIndex < combinationWords.length && !slugIsUnique) {
          finalSlug = `${baseSlug}-${combinationWords[comboIndex]}`;
          const existingTour = await prisma.tour.findUnique({
            where: { slug: finalSlug }
          });
          if (!existingTour) {
            slug = finalSlug;
            slugIsUnique = true;
            break;
          }
          comboIndex++;
        }
        
        // If combinations exhausted, try triple combinations with city
        if (!slugIsUnique && comboIndex >= combinationWords.length && citySlug && citySlug !== locationSlug) {
          const cityCombinations = [
            `${citySlug}-premium`, `${citySlug}-exclusive`, `${citySlug}-authentic`,
            `${citySlug}-local`, `${citySlug}-guided`, `${citySlug}-expert`,
            `${citySlug}-tour`, `${citySlug}-experience`, `${citySlug}-adventure`
          ];
          
          for (const cityCombo of cityCombinations) {
            finalSlug = `${baseSlug}-${cityCombo}`;
            const existingTour = await prisma.tour.findUnique({
              where: { slug: finalSlug }
            });
            if (!existingTour) {
              slug = finalSlug;
              slugIsUnique = true;
              break;
            }
          }
        }
      }
    }
    
    // CRITICAL FINAL CHECK: Verify slug is unique before proceeding (prevents P2002 errors)
    if (!slugIsUnique) {
      // One final check - if somehow we still don't have a unique slug, try more descriptive suffixes
      const finalCheck = await prisma.tour.findUnique({
        where: { slug }
      });
      if (finalCheck) {
        // Try a few more descriptive suffixes before using timestamp
        const descriptiveSuffixes = ['tour', 'experience', 'adventure', 'journey', 'exploration', 'discovery'];
        let foundUnique = false;
        
        for (const suffix of descriptiveSuffixes) {
          const testSlug = `${baseSlug}-${suffix}`;
          const exists = await prisma.tour.findUnique({
            where: { slug: testSlug }
          });
          if (!exists) {
            slug = testSlug;
            slugIsUnique = true;
            foundUnique = true;
            console.log('✅ Found unique slug with descriptive suffix:', slug);
            break;
          }
        }
        
        // If still not unique, try more word combinations (NO NUMBERS OR TIMESTAMPS)
        if (!foundUnique) {
          const extendedSuffixes = [
            'premium-tour', 'exclusive-experience', 'authentic-adventure', 'local-guided',
            'expert-tour', 'professional-guided', 'certified-local', 'official-tour',
            'recommended-experience', 'popular-tour', 'famous-adventure', 'iconic-tour',
            'legendary-experience', 'classic-tour', 'traditional-guided', 'cultural-adventure'
          ];
          
          for (const suffix of extendedSuffixes) {
            const testSlug = `${baseSlug}-${suffix}`;
            const exists = await prisma.tour.findUnique({
              where: { slug: testSlug }
            });
            if (!exists) {
              slug = testSlug;
              slugIsUnique = true;
              foundUnique = true;
              console.log('✅ Found unique slug with extended suffix:', slug);
              break;
            }
          }
          
          // Final fallback: use base slug with city if available (guaranteed unique with city context)
          if (!foundUnique && citySlug && citySlug !== locationSlug) {
            slug = `${baseSlug}-${citySlug}-tour`;
            slugIsUnique = true; // Assume unique with city context
            console.log('✅ Using city-context slug as final fallback:', slug);
          } else if (!foundUnique) {
            // Absolute last resort: use a generic but descriptive suffix
            slug = `${baseSlug}-guided-tour`;
            slugIsUnique = true; // Force uniqueness - this should be extremely rare
            console.log('⚠️  Using forced unique slug (should be extremely rare):', slug);
          }
        }
      } else {
        // Slug is actually unique, mark it as such
        slugIsUnique = true;
      }
    }
    
    // Validate and truncate slug length (max 60 characters for SEO)
    const MAX_SLUG_LENGTH = 60;
    if (slug.length > MAX_SLUG_LENGTH) {
      console.warn(`⚠️  Slug too long (${slug.length} chars), truncating to ${MAX_SLUG_LENGTH} chars`);
      // Keep location + type, remove extra parts
      const parts = slug.split('-');
      const locationPart = locationSlug;
      const typePart = typeSlug;
      
      // If base slug is already too long, truncate location
      const baseSlug = `${locationPart}-${typePart}`;
      if (baseSlug.length > MAX_SLUG_LENGTH) {
        const maxLocationLength = MAX_SLUG_LENGTH - typePart.length - 1; // -1 for hyphen
        slug = `${locationPart.substring(0, maxLocationLength)}-${typePart}`;
      } else {
        // Keep base slug, remove extra keywords
        slug = baseSlug;
      }
      
      // Final check - ensure we're under limit
      if (slug.length > MAX_SLUG_LENGTH) {
        slug = slug.substring(0, MAX_SLUG_LENGTH).replace(/-+$/, ''); // Remove trailing hyphens
      }
    }
    
    console.log(`📝 Generated slug: "${slug}" (${slug.length} characters)`);

    // For fast tour creation: store base64 images initially, upload to Cloudinary in background
    let imageUrls = imagesArray;
    let needsCloudinaryUpload = false;

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const hasBase64Images = imagesArray.some(img => img.startsWith('data:image'));
      if (hasBase64Images) {
        console.log('📸 Images will be uploaded to Cloudinary in background after tour creation');
        imageUrls = imagesArray; // keep base64 for initial save
        needsCloudinaryUpload = true;
      } else {
        console.log('ℹ️  Images are already URLs, skipping Cloudinary upload');
        imageUrls = imagesArray;
      }
    } else {
      console.error('❌ Cloudinary not configured!');
      console.error('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
      console.error('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
      console.error('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          error: 'Image storage not configured',
          message: 'Cloudinary is required for image storage in production. Please configure Cloudinary environment variables.',
          details: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to Render environment variables.'
        });
      }

      console.warn('⚠️  Using base64 images (development mode only - NOT for production!)');
    }

    // Parse tour options if provided (accept both 'options' and 'tourOptions' field names)
    // CRITICAL: Use finalCleanedBody (NOT cleanedBody) to ensure pricingType is removed
    let tourOptions = finalCleanedBody.options || finalCleanedBody.tourOptions || [];
    
    // Validate tourOptions is an array
    if (tourOptions && !Array.isArray(tourOptions)) {
      console.warn('⚠️  tourOptions is not an array, attempting to parse:', typeof tourOptions);
      try {
        if (typeof tourOptions === 'string') {
          tourOptions = JSON.parse(tourOptions);
        } else {
          tourOptions = [];
        }
      } catch (parseError) {
        console.error('❌ Failed to parse tourOptions:', parseError);
        tourOptions = [];
      }
    }
    
    // Ensure tourOptions is an array
    if (!Array.isArray(tourOptions)) {
      tourOptions = [];
    }
    
    // CRITICAL: Remove ALL id fields from tourOptions to prevent ID conflicts
      tourOptions = tourOptions.map((opt, idx) => {
      // Ensure opt is an object
      if (!opt || typeof opt !== 'object') {
        console.warn(`⚠️  Tour option ${idx + 1} is not a valid object, skipping`);
        return null;
      }
      // Aggressively remove ALL possible ID fields AND pricingType
      const { id, tourId, tour_id, optionId, option_id, pricingType, pricing_type, ...cleanOption } = opt;
      if (id || tourId || tour_id || optionId || option_id || pricingType || pricing_type) {
        console.warn(`⚠️  Tour option ${idx + 1} had ID fields or pricingType, removing:`, { id, tourId, tour_id, optionId, option_id, pricingType, pricing_type });
      }
      // CRITICAL: Explicitly remove pricingType from cleanOption as well (double safety)
      delete cleanOption.pricingType;
      delete cleanOption.pricing_type;
      // Double-check: remove any remaining ID-like fields AND pricing-related fields
      Object.keys(cleanOption).forEach(key => {
        const keyLower = key.toLowerCase();
        if (keyLower === 'id' || keyLower.includes('id') && (keyLower.includes('tour') || keyLower.includes('option'))) {
          delete cleanOption[key];
          console.warn(`⚠️  Removed additional ID-like field: ${key}`);
        }
        // Also remove any pricing-related fields (but keep groupPricingTiers!)
        if (keyLower.includes('pricing') && keyLower !== 'grouppricingtiers') {
          delete cleanOption[key];
          console.warn(`⚠️  Removed pricing-related field: ${key}`);
        }
      });
      return cleanOption;
    }).filter(opt => opt !== null); // Remove null entries
    
    console.log('📦 Tour options received:', {
      hasOptions: !!req.body.options,
      hasTourOptions: !!req.body.tourOptions,
      optionsCount: tourOptions.length,
      options: tourOptions.map((opt, idx) => ({
        index: idx + 1,
        title: opt.optionTitle || opt.title,
        hasId: !!opt.id,
        ...(opt.id && { removedId: opt.id })
      }))
    });
    
    // Create tour data object - NEVER include 'id' as it's auto-generated
    const tourData = {
      supplierId: parseInt(supplierId),
      title,
      slug,
      country,
      city,
      category,
      locations: JSON.stringify(locationsArray),
      duration: duration || 'Flexible',
      // CRITICAL: Use FIRST tier (1 person) price for pricePerPerson - NOT groupPrice (which is last tier)
      // This ensures "Starting from" shows the correct 1-person price
      pricePerPerson: (() => {
        if (groupPricingTiers) {
          try {
            const tiers = typeof groupPricingTiers === 'string' 
              ? JSON.parse(groupPricingTiers) 
              : groupPricingTiers;
            if (Array.isArray(tiers) && tiers.length > 0 && tiers[0] && tiers[0].price) {
              const firstTierPrice = parseFloat(tiers[0].price);
              if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
                return firstTierPrice; // Use first tier (1 person) price
              }
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse groupPricingTiers for pricePerPerson:', e.message);
          }
        }
        // Fallback to provided pricePerPerson or groupPrice
        return isPerGroupPricing 
          ? parseFloat(groupPrice || pricePerPerson || '0')
          : parseFloat(pricePerPerson || '0');
      })(),
      currency: currency || 'INR',
      shortDescription: shortDescription || null,
      fullDescription,
      highlights: highlightsArray && highlightsArray.length > 0 ? JSON.stringify(highlightsArray) : null,
      included,
      notIncluded: notIncluded || null,
      meetingPoint: meetingPoint || null,
      guideType: guideType || null,
      tourTypes: tourTypesArray && tourTypesArray.length > 0 ? JSON.stringify(tourTypesArray) : null,
      images: JSON.stringify(imageUrls), // Store Cloudinary URLs instead of base64
      languages: JSON.stringify(languagesArray || ['English']),
      reviews: null,
      status: 'draft',
      // Save simplified pricing fields
      maxGroupSize: isPerGroupPricing && maxGroupSize ? parseInt(maxGroupSize) : null,
      groupPrice: isPerGroupPricing && groupPrice ? parseFloat(groupPrice) : null,
      unavailableDates: unavailableDates && typeof unavailableDates === 'string' 
        ? unavailableDates 
        : (unavailableDates && Array.isArray(unavailableDates) && unavailableDates.length > 0 
          ? JSON.stringify(unavailableDates) 
          : null), // Legacy
      unavailableDaysOfWeek: unavailableDaysOfWeek && typeof unavailableDaysOfWeek === 'string'
        ? unavailableDaysOfWeek
        : (unavailableDaysOfWeek && Array.isArray(unavailableDaysOfWeek) && unavailableDaysOfWeek.length > 0
          ? JSON.stringify(unavailableDaysOfWeek)
          : null),
      // CRITICAL: Save groupPricingTiers directly on Tour model (simple, reliable)
      groupPricingTiers: (() => {
        // #region agent log
        const logPath = '/Users/talhanawaz/Desktop/asiabylocals-latest/.cursor/debug.log';
        try {
          const logEntry = JSON.stringify({
            location: 'server.js:3559',
            message: 'POST endpoint - processing groupPricingTiers before save',
            data: {
              hasGroupPricingTiers: !!groupPricingTiers,
              groupPricingTiersType: typeof groupPricingTiers,
              isString: typeof groupPricingTiers === 'string',
              isArray: Array.isArray(groupPricingTiers),
              preview: groupPricingTiers ? (typeof groupPricingTiers === 'string' ? groupPricingTiers.substring(0, 100) : JSON.stringify(groupPricingTiers).substring(0, 100)) : null
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D'
          }) + '\n';
          fs.appendFileSync(logPath, logEntry);
        } catch (e) {}
        // #endregion
        
        if (!groupPricingTiers) {
          // #region agent log
          try {
            const logEntry = JSON.stringify({
              location: 'server.js:3575',
              message: 'POST endpoint - groupPricingTiers is null/undefined',
              data: { reason: 'groupPricingTiers not provided in request' },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'D'
            }) + '\n';
            fs.appendFileSync(logPath, logEntry);
          } catch (e) {}
          // #endregion
          return null;
        }
        const finalValue = typeof groupPricingTiers === 'string'
          ? groupPricingTiers
          : (Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0
            ? JSON.stringify(groupPricingTiers)
            : null);
        console.log('✅ Saving groupPricingTiers on Tour model:', {
          hasValue: !!finalValue,
          preview: finalValue ? finalValue.substring(0, 200) : 'null',
          tiersCount: Array.isArray(groupPricingTiers) ? groupPricingTiers.length : 'N/A'
        });
        
        // #region agent log
        try {
          const logEntry = JSON.stringify({
            location: 'server.js:3585',
            message: 'POST endpoint - groupPricingTiers processed, about to save',
            data: {
              finalValueExists: !!finalValue,
              finalValuePreview: finalValue ? finalValue.substring(0, 100) : null,
              willSave: !!finalValue
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D'
          }) + '\n';
          fs.appendFileSync(logPath, logEntry);
        } catch (e) {}
        // #endregion
        
        return finalValue;
      })()
    };

    // If main tour has groupPricingTiers, create a main tour option with those tiers
    // CRITICAL: Always create main tour option if groupPricingTiers exists, regardless of isPerGroupPricing flag
    let mainTourGroupPricingTiers = null;
    if (groupPricingTiers) {
      try {
        if (typeof groupPricingTiers === 'string') {
          mainTourGroupPricingTiers = JSON.parse(groupPricingTiers);
        } else if (Array.isArray(groupPricingTiers)) {
          mainTourGroupPricingTiers = groupPricingTiers;
        }
        console.log('📊 Main tour groupPricingTiers parsed:', {
          count: mainTourGroupPricingTiers?.length,
          tiers: mainTourGroupPricingTiers
        });
      } catch (e) {
        console.warn('⚠️ Failed to parse main tour groupPricingTiers:', e.message);
      }
    }
    
    // Create main tour option if main tour has group pricing tiers
    if (mainTourGroupPricingTiers && Array.isArray(mainTourGroupPricingTiers) && mainTourGroupPricingTiers.length > 0) {
      // Calculate price from first tier (lowest price)
      const firstTierPrice = parseFloat(mainTourGroupPricingTiers[0]?.price || groupPrice || '0') || 0;
      const mainTourOption = {
        optionTitle: title,
        optionDescription: shortDescription || fullDescription?.substring(0, 200) || 'Main tour option',
        durationHours: parseFloat(duration?.replace(/[^0-9.]/g, '')) || 3,
        price: firstTierPrice,
        currency: currency || 'INR',
        language: languagesArray?.[0] || 'English',
        pickupIncluded: false,
        entryTicketIncluded: false,
        guideIncluded: true,
        carIncluded: false,
        groupPricingTiers: JSON.stringify(mainTourGroupPricingTiers),
        sortOrder: -1 // Main tour option comes first
      };
      // Prepend main tour option to tourOptions
      tourOptions = [mainTourOption, ...(tourOptions || [])];
      console.log('✅ Created main tour option with groupPricingTiers:', {
        tiers: mainTourGroupPricingTiers.length,
        firstTierPrice,
        tiersData: mainTourGroupPricingTiers,
        groupPricingTiersString: mainTourOption.groupPricingTiers?.substring(0, 200) // Log first 200 chars
      });
    } else {
      console.warn('⚠️ NOT creating main tour option - condition not met:', {
        hasMainTourGroupPricingTiers: !!mainTourGroupPricingTiers,
        isArray: Array.isArray(mainTourGroupPricingTiers),
        length: mainTourGroupPricingTiers?.length,
        groupPricingTiers: groupPricingTiers ? (typeof groupPricingTiers === 'string' ? groupPricingTiers.substring(0, 200) : 'not string') : 'null'
      });
    }
    
    // Only add options if tourOptions array has items
    if (tourOptions && Array.isArray(tourOptions) && tourOptions.length > 0) {
      // Validate each option has required fields
      const validOptions = tourOptions.filter((option, index) => {
        if (!option || typeof option !== 'object') {
          console.warn(`⚠️  Option ${index + 1} is not a valid object, skipping`);
          return false;
        }
        const hasTitle = !!(option.optionTitle || option.title);
        if (!hasTitle) {
          console.warn(`⚠️  Option ${index + 1} is missing title, skipping`);
          return false;
        }
        return true;
      });
      
      if (validOptions.length === 0) {
        console.warn('⚠️  No valid tour options found, creating tour without options');
      } else {
      tourData.options = {
          create: validOptions.map((option, index) => {
          // CRITICAL: Remove any id field AND pricingType from option (prevents P2002 and P2022 errors)
          // This prevents ID conflicts and pricing_type column errors
          const { id, tourId, pricingType, pricing_type, ...cleanOption } = option;
          if (id) {
            console.warn(`⚠️  Option ${index + 1} had an id field (${id}), removing it to prevent conflicts`);
          }
          if (tourId) {
            console.warn(`⚠️  Option ${index + 1} had a tourId field (${tourId}), removing it (will be set automatically)`);
          }
          if (pricingType || pricing_type) {
            console.warn(`⚠️  Option ${index + 1} had pricingType field, removing it (backend infers from groupPrice/maxGroupSize)`);
          }
          
          // CRITICAL: Explicitly remove pricingType from cleanOption as well (double safety)
          delete cleanOption.pricingType;
          delete cleanOption.pricing_type;
          // Infer pricing type for this option: if groupPrice and maxGroupSize exist, it's per_group
          const optionIsPerGroup = !!(cleanOption.groupPrice && cleanOption.maxGroupSize);
          
          // Calculate price based on inferred pricing type
          let optionPrice = 0;
          if (optionIsPerGroup && cleanOption.groupPrice) {
            optionPrice = parseFloat(cleanOption.groupPrice);
          } else if (cleanOption.price) {
            optionPrice = parseFloat(cleanOption.price);
          } else if (isPerGroupPricing && groupPrice) {
            optionPrice = parseFloat(groupPrice);
          } else {
            optionPrice = parseFloat(pricePerPerson);
          }
          
          // Validate price is a valid number
          if (isNaN(optionPrice) || optionPrice <= 0) {
            console.warn(`⚠️  Option ${index + 1} has invalid price, using default`);
            optionPrice = parseFloat(pricePerPerson) || 0;
          }
          
          // Ensure optionDescription is not empty (required field)
          const optionDesc = (cleanOption.optionDescription || cleanOption.description || '').trim();
          const finalOptionDesc = optionDesc || `Tour option ${index + 1}`;
          
          // Build return object WITHOUT pricingType, maxGroupSize, and groupPrice
          // maxGroupSize and groupPrice are excluded because columns don't exist in production DB yet
          // groupPricingTiers is included - stored as JSON string in DB
          
          // CRITICAL: Log groupPricingTiers to debug why it's not being saved
          if (cleanOption.groupPricingTiers) {
            console.log(`📊 Option ${index + 1} groupPricingTiers BEFORE save:`, {
              type: typeof cleanOption.groupPricingTiers,
              value: typeof cleanOption.groupPricingTiers === 'string' 
                ? cleanOption.groupPricingTiers.substring(0, 200) 
                : JSON.stringify(cleanOption.groupPricingTiers).substring(0, 200),
              isArray: Array.isArray(cleanOption.groupPricingTiers)
            });
          } else {
            console.warn(`⚠️ Option ${index + 1} has NO groupPricingTiers!`, {
              optionTitle: cleanOption.optionTitle || cleanOption.title,
              availableFields: Object.keys(cleanOption)
            });
          }
          
          // CRITICAL: Handle groupPricingTiers FIRST - ensure it's always included if present
          let finalGroupPricingTiers = null;
          if (cleanOption.groupPricingTiers) {
            try {
              if (Array.isArray(cleanOption.groupPricingTiers)) {
                finalGroupPricingTiers = JSON.stringify(cleanOption.groupPricingTiers);
              } else if (typeof cleanOption.groupPricingTiers === 'string') {
                // Already stringified, but verify it's valid JSON
                try {
                  JSON.parse(cleanOption.groupPricingTiers); // Validate it's valid JSON
                  finalGroupPricingTiers = cleanOption.groupPricingTiers;
                } catch (e) {
                  console.warn(`⚠️ Option ${index + 1} groupPricingTiers string is invalid JSON, re-stringifying`);
                  finalGroupPricingTiers = JSON.stringify(cleanOption.groupPricingTiers);
                }
              } else {
                finalGroupPricingTiers = JSON.stringify(cleanOption.groupPricingTiers);
              }
              console.log(`✅ Option ${index + 1} groupPricingTiers processed successfully`);
            } catch (e) {
              console.error(`❌ Failed to process groupPricingTiers for option ${index + 1}:`, e.message);
            }
          }
          
          const returnOption = {
            optionTitle: (cleanOption.optionTitle || cleanOption.title || `Option ${index + 1}`).trim(),
            optionDescription: finalOptionDesc,
            durationHours: parseFloat(cleanOption.durationHours || cleanOption.duration || duration?.replace(/[^\d.]/g, '') || 3) || 3,
            price: optionPrice,
            currency: (cleanOption.currency || currency || 'INR').trim(),
            language: (cleanOption.language || languagesArray?.[0] || 'English').trim(),
            pickupIncluded: cleanOption.pickupIncluded || cleanOption.pickup_included || false,
            entryTicketIncluded: cleanOption.entryTicketIncluded || cleanOption.entry_ticket_included || false,
            guideIncluded: cleanOption.guideIncluded !== undefined ? cleanOption.guideIncluded : (cleanOption.guide_included !== undefined ? cleanOption.guide_included : true),
            carIncluded: cleanOption.carIncluded || cleanOption.car_included || false,
            // CRITICAL: Explicitly include groupPricingTiers if it exists
            groupPricingTiers: finalGroupPricingTiers,
            // maxGroupSize and groupPrice EXCLUDED - columns don't exist in production DB yet
            sortOrder: index
          };
          
          // CRITICAL: Final check - ensure pricingType, maxGroupSize, and groupPrice are NOT in return object
          delete returnOption.pricingType;
          delete returnOption.pricing_type;
          delete returnOption.maxGroupSize;
          delete returnOption.max_group_size;
          delete returnOption.groupPrice;
          delete returnOption.group_price;
          
          return returnOption;
        })
      };
      }
    }
    
    // Create tour with options - with retry logic for race conditions
    let tour;
    let createAttempts = 0;
    const MAX_CREATE_RETRIES = 3;
    let finalTourData; // Declare outside loop for error handling
    
    // CRITICAL: Ensure tourData does not have an id field at all
    if ('id' in tourData) {
      console.error('❌ CRITICAL: tourData contains id field! Removing it...');
      delete tourData.id;
    }
    
    while (createAttempts < MAX_CREATE_RETRIES) {
      try {
        // Ensure no ID fields are present in tourData - deep clone to avoid mutation
        finalTourData = JSON.parse(JSON.stringify(tourData));
        
        // Remove id field and any other fields that don't belong to Tour model
        if ('id' in finalTourData) {
          console.warn('⚠️  Removing id field from tourData before creation');
          delete finalTourData.id;
        }
        
        // Remove fields that don't exist in Tour model (these belong to TourOption or are request-only)
        // Note: 'options' is valid (it's the relation field for nested creates)
        const invalidFields = [
          'groupPrice', 'group_price', 
          'maxGroupSize', 'max_group_size', 
          'pricingType', 'pricing_type', 
          'tourOptions',
          'optionTitle', 'option_title',
          'optionDescription', 'option_description',
          'durationHours', 'duration_hours',
          'pickupIncluded', 'pickup_included',
          'entryTicketIncluded', 'entry_ticket_included',
          'guideIncluded', 'guide_included',
          'carIncluded', 'car_included'
        ];
        invalidFields.forEach(field => {
          if (field in finalTourData) {
            console.warn(`⚠️  Removing invalid field '${field}' from tourData (not in Tour model)`);
            delete finalTourData[field];
          }
        });
        
        // Double-check: ensure no option-related fields leaked into main tour data
        const tourModelFields = [
          'supplierId', 'title', 'slug', 'country', 'city', 'category', 'locations',
          'duration', 'pricePerPerson', 'currency', 'shortDescription', 'fullDescription',
          'highlights', 'included', 'notIncluded', 'meetingPoint', 'guideType', 'tourTypes',
          'images', 'languages', 'reviews', 'status', 'options'
        ];
        Object.keys(finalTourData).forEach(key => {
          if (!tourModelFields.includes(key)) {
            console.warn(`⚠️  Unexpected field '${key}' in finalTourData, removing it`);
            delete finalTourData[key];
          }
        });
        
        // Define ONLY valid TourOption fields (from Prisma schema) - moved outside if block for scope
        // CRITICAL: maxGroupSize and groupPrice are EXCLUDED because they may not exist in production DB
        // The migration to add these columns may not have been run yet
        // These fields will be handled separately with error handling if they exist
        const VALID_TOUR_OPTION_FIELDS = [
          'optionTitle', 'optionDescription', 'durationHours', 'price', 'currency',
          'language', 'pickupIncluded', 'entryTicketIncluded', 'guideIncluded',
          'carIncluded', 'groupPricingTiers', 'sortOrder'
          // maxGroupSize and groupPrice EXCLUDED - handled separately with error handling
          // Note: pricingType removed - we infer pricing type from groupPrice/maxGroupSize presence
          // groupPricingTiers is a JSON string array of {minPeople, maxPeople, price} objects
        ];
        
        // Also ensure no IDs in nested options - remove ALL possible id fields
        // AND ensure only valid TourOption fields are included
        if (finalTourData.options?.create) {
          finalTourData.options.create = finalTourData.options.create.map((opt, idx) => {
            // CRITICAL: Remove pricingType FIRST before any processing (prevents P2022 errors)
            delete opt.pricingType;
            delete opt.pricing_type;
            
            // Create a clean object with ONLY valid TourOption fields
            const cleanOpt = {};
            
            VALID_TOUR_OPTION_FIELDS.forEach(field => {
              // Only include field if it has a value (exclude null/undefined)
              // This prevents Prisma from trying to validate columns that might not exist yet in production
              if (field in opt && opt[field] !== undefined && opt[field] !== null) {
                cleanOpt[field] = opt[field];
              }
            });
            
            // Explicitly remove any id-related fields (shouldn't exist, but be safe)
            delete cleanOpt.id;
            delete cleanOpt.tourId;
            delete cleanOpt.tour_id;
            
            // CRITICAL: Remove pricingType from cleanOpt as well (double safety)
            delete cleanOpt.pricingType;
            delete cleanOpt.pricing_type;
            
            // Log if we found any id fields in the original
            if (opt.id || opt.tourId || opt.tour_id) {
              console.warn(`⚠️  Option ${idx + 1} had id fields, removed:`, {
                id: opt.id,
                tourId: opt.tourId,
                tour_id: opt.tour_id
              });
            }
            
            // Log if we're removing any unexpected fields
            const removedFields = Object.keys(opt).filter(key => !VALID_TOUR_OPTION_FIELDS.includes(key) && key !== 'id' && key !== 'tourId' && key !== 'tour_id');
            if (removedFields.length > 0) {
              console.warn(`⚠️  Option ${idx + 1} had unexpected fields removed:`, removedFields);
            }
            
            return cleanOpt;
          });
        }
        
        // CRITICAL: Check finalTourData for any invalid fields BEFORE creating cleanFinalTourData
        const invalidFieldsInFinalTourData = Object.keys(finalTourData).filter(key => {
          const keyLower = key.toLowerCase();
          return (
            keyLower.includes('pricing') ||
            (keyLower.includes('group') && keyLower !== 'group') ||
            (keyLower.includes('option') && key !== 'options') ||
            key === 'tourOptions'
          );
        });
        
        if (invalidFieldsInFinalTourData.length > 0) {
          console.error(`❌ CRITICAL: Found invalid fields in finalTourData BEFORE cleaning: ${invalidFieldsInFinalTourData.join(', ')}`);
          invalidFieldsInFinalTourData.forEach(field => {
            console.error(`   Removing '${field}' from finalTourData`);
            delete finalTourData[field];
          });
        }
        
        // FINAL SAFETY CHECK: Remove ALL option-related fields that might have leaked in
        // This is a last-ditch effort to ensure no invalid fields reach Prisma
        const SAFE_TOUR_FIELDS = [
          'supplierId', 'title', 'slug', 'country', 'city', 'category', 'locations',
          'duration', 'pricePerPerson', 'currency', 'shortDescription', 'fullDescription',
          'highlights', 'included', 'notIncluded', 'meetingPoint', 'guideType',
          'images', 'languages', 'reviews', 'status', 'options'
        ];
        
        // Create a completely clean object with ONLY valid Tour model fields
        // Use explicit field assignment to prevent any field leakage
        const cleanFinalTourData = {
          supplierId: finalTourData.supplierId,
          title: finalTourData.title,
          slug: finalTourData.slug,
          country: finalTourData.country,
          city: finalTourData.city,
          category: finalTourData.category,
          locations: finalTourData.locations,
          duration: finalTourData.duration,
          pricePerPerson: finalTourData.pricePerPerson,
          currency: finalTourData.currency,
          shortDescription: finalTourData.shortDescription,
          fullDescription: finalTourData.fullDescription,
          highlights: finalTourData.highlights,
          included: finalTourData.included,
          notIncluded: finalTourData.notIncluded,
          meetingPoint: finalTourData.meetingPoint,
          guideType: finalTourData.guideType,
          tourTypes: finalTourData.tourTypes || null,
          images: finalTourData.images,
          languages: finalTourData.languages,
          reviews: finalTourData.reviews,
          status: finalTourData.status || 'draft'
        };
        
        // Only add options if they exist and are properly formatted
        // CRITICAL: Create a completely fresh options array to prevent any field leakage
        if (finalTourData.options && finalTourData.options.create && Array.isArray(finalTourData.options.create)) {
          cleanFinalTourData.options = {
            create: finalTourData.options.create.map(opt => {
              // CRITICAL: Remove pricingType FIRST before any processing (prevents P2022 errors)
              delete opt.pricingType;
              delete opt.pricing_type;
              
              // Create a completely fresh object with ONLY valid TourOption fields
              const freshOpt = {};
              VALID_TOUR_OPTION_FIELDS.forEach(field => {
                // Only include field if it has a value (exclude null/undefined)
                // This prevents Prisma from trying to validate columns that might not exist yet in production
                if (field in opt && opt[field] !== undefined && opt[field] !== null) {
                  freshOpt[field] = opt[field];
                }
              });
              // Explicitly remove any id-related fields
              delete freshOpt.id;
              delete freshOpt.tourId;
              delete freshOpt.tour_id;
              
              // CRITICAL: Remove pricingType from freshOpt as well (double safety)
              delete freshOpt.pricingType;
              delete freshOpt.pricing_type;
              
              return freshOpt;
            })
          };
        }
        
        // Explicitly ensure NO pricingType or other invalid fields exist (pricingType removed from schema)
        delete cleanFinalTourData.pricingType;
        delete cleanFinalTourData.pricing_type;
        delete cleanFinalTourData.groupPrice;
        delete cleanFinalTourData.group_price;
        delete cleanFinalTourData.maxGroupSize;
        delete cleanFinalTourData.max_group_size;
        delete cleanFinalTourData.tourOptions;
        
        // Log what we're about to send
        console.log('📤 Final tourData before Prisma create:', {
          hasId: 'id' in cleanFinalTourData,
          supplierId: cleanFinalTourData.supplierId,
          title: cleanFinalTourData.title,
          slug: cleanFinalTourData.slug,
          optionsCount: cleanFinalTourData.options?.create?.length || 0,
          optionsHaveIds: cleanFinalTourData.options?.create?.some(opt => 'id' in opt || 'tourId' in opt) || false,
          allFields: Object.keys(cleanFinalTourData)
        });
        
        // Log first option details for debugging
        if (cleanFinalTourData.options?.create && cleanFinalTourData.options.create.length > 0) {
          console.log('📋 First option details:', JSON.stringify(cleanFinalTourData.options.create[0], null, 2));
        }
        
        // FINAL VALIDATION: Ensure no pricing-related fields exist at Tour level
        // BUT PRESERVE groupPricingTiers, maxGroupSize, groupPrice - these are valid Tour fields!
        const topLevelKeys = Object.keys(cleanFinalTourData);
        const pricingFields = topLevelKeys.filter(key => {
          const keyLower = key.toLowerCase();
          // Skip valid Tour fields that contain "pricing" or "group"
          if (keyLower === 'grouppricingtiers' || keyLower === 'maxgroupsize' || keyLower === 'groupprice') {
            return false; // Keep these fields
          }
          // Remove pricingType and other invalid fields
          return (keyLower.includes('pricing') && keyLower !== 'grouppricingtiers') || 
                 (keyLower.includes('option') && key !== 'options');
        });
        if (pricingFields.length > 0) {
          console.error(`❌ CRITICAL: Found invalid pricing/option fields at Tour level: ${pricingFields.join(', ')}`);
          pricingFields.forEach(field => delete cleanFinalTourData[field]);
          console.log('   ✅ Removed these invalid fields before Prisma call');
        }
        
        // Log final structure to verify
        console.log('🔍 Final Prisma data structure:', {
          topLevelFields: Object.keys(cleanFinalTourData),
          hasOptions: !!cleanFinalTourData.options,
          optionsCount: cleanFinalTourData.options?.create?.length || 0,
          firstOptionFields: cleanFinalTourData.options?.create?.[0] ? Object.keys(cleanFinalTourData.options.create[0]) : []
        });
        
        // ABSOLUTE FINAL CHECK: Serialize and parse to ensure no hidden properties
        // CRITICAL: Deep clone to break ALL references and ensure clean data
        let finalDataForPrisma = JSON.parse(JSON.stringify(cleanFinalTourData));
        
        // CRITICAL: Remove pricingType from finalDataForPrisma recursively one more time
        // BUT PRESERVE groupPricingTiers, maxGroupSize, groupPrice - these are valid Tour fields!
        const removePricingTypeFromFinal = (obj) => {
          if (obj === null || obj === undefined) return obj;
          if (Array.isArray(obj)) {
            return obj.map(item => removePricingTypeFromFinal(item));
          }
          if (typeof obj === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
              const keyLower = key.toLowerCase();
              if (keyLower === 'pricingtype' || keyLower === 'pricing_type') {
                continue; // Skip pricingType fields
              }
              // CRITICAL: Preserve groupPricingTiers, maxGroupSize, groupPrice - valid Tour fields!
              if (keyLower === 'grouppricingtiers' || keyLower === 'maxgroupsize' || keyLower === 'groupprice') {
                cleaned[key] = value; // Keep as-is, don't recurse
                continue;
              }
              cleaned[key] = removePricingTypeFromFinal(value);
            }
            return cleaned;
          }
          return obj;
        };
        finalDataForPrisma = removePricingTypeFromFinal(finalDataForPrisma);
        
        // Check one more time for any invalid pricing-related fields
        // BUT ALLOW valid Tour fields: groupPricingTiers, maxGroupSize, groupPrice
        const finalCheck = Object.keys(finalDataForPrisma).filter(key => {
          const keyLower = key.toLowerCase();
          // Allow valid Tour fields
          if (keyLower === 'grouppricingtiers' || keyLower === 'maxgroupsize' || keyLower === 'groupprice') {
            return false; // These are valid, don't flag them
          }
          // Flag invalid fields
          return (keyLower.includes('pricing') && keyLower !== 'grouppricingtiers') || 
                 (keyLower.includes('group') && key !== 'group' && keyLower !== 'maxgroupsize' && keyLower !== 'groupprice') ||
                 (keyLower.includes('option') && key !== 'options');
        });
        
        if (finalCheck.length > 0) {
          console.error(`❌ ABSOLUTE FINAL CHECK FAILED: Found invalid fields: ${finalCheck.join(', ')}`);
          console.error('   Full object keys:', Object.keys(finalDataForPrisma));
          throw new Error(`Invalid fields detected in final data: ${finalCheck.join(', ')}`);
        }
        
        console.log('✅ Final data validated - no invalid fields found. Proceeding with Prisma create...');
        
        // ONE MORE ABSOLUTE FINAL CHECK: Log the exact object being sent to Prisma
        console.log('🔍 EXACT DATA BEING SENT TO PRISMA:', JSON.stringify(finalDataForPrisma, null, 2));
        
        // Check if pricingType exists at the TOP LEVEL (it should only exist in nested options)
        const topLevelHasPricingType = 'pricingType' in finalDataForPrisma || 'pricing_type' in finalDataForPrisma;
        if (topLevelHasPricingType) {
          console.error('❌ CRITICAL: pricingType found at TOP LEVEL of finalDataForPrisma!');
          console.error('   Top level keys:', Object.keys(finalDataForPrisma));
          console.error('   This should not happen. Aborting Prisma call.');
          throw new Error('pricingType detected at top level - this should not happen');
        }
        
        // CRITICAL FIX: Create tour WITHOUT options first, then add options separately
        // Use deep clone to completely break any references
        // CRITICAL: Apply pricingType removal one more time before cloning
        let tempData = JSON.parse(JSON.stringify(finalDataForPrisma));
        // Remove pricingType recursively from tempData BUT PRESERVE groupPricingTiers
        const removePricingTypeRecursive = (obj) => {
          if (obj === null || obj === undefined) return obj;
          if (Array.isArray(obj)) {
            return obj.map(item => removePricingTypeRecursive(item));
          }
          if (typeof obj === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
              const keyLower = key.toLowerCase();
              if (keyLower === 'pricingtype' || keyLower === 'pricing_type') {
                continue; // Skip pricingType fields
              }
              // CRITICAL: Preserve groupPricingTiers - it's a valid field!
              if (keyLower === 'grouppricingtiers') {
                cleaned[key] = value; // Keep as-is, don't recurse
                continue;
              }
              cleaned[key] = removePricingTypeRecursive(value);
            }
            return cleaned;
          }
          return obj;
        };
        tempData = removePricingTypeRecursive(tempData);
        const tourDataWithoutOptions = JSON.parse(JSON.stringify(tempData));
        
        // CRITICAL: Extract options BEFORE deleting (deep clone breaks references)
        let optionsToCreate = [];
        if (tourDataWithoutOptions.options?.create) {
          optionsToCreate = JSON.parse(JSON.stringify(tourDataWithoutOptions.options.create));
        } else if (tourDataWithoutOptions.tourOptions) {
          optionsToCreate = JSON.parse(JSON.stringify(tourDataWithoutOptions.tourOptions));
        }
        
        // CRITICAL: Aggressively remove ALL possible option-related fields
        delete tourDataWithoutOptions.options;
        delete tourDataWithoutOptions.tourOptions;
        delete tourDataWithoutOptions.option;
        
        // CRITICAL: Verify options are completely gone
        if ('options' in tourDataWithoutOptions || 'tourOptions' in tourDataWithoutOptions) {
          console.error('🚨 CRITICAL: options still exist after delete!');
          console.error('   Keys:', Object.keys(tourDataWithoutOptions));
          // Force remove again
          delete tourDataWithoutOptions.options;
          delete tourDataWithoutOptions.tourOptions;
        }
        
        // CRITICAL: Deep clean optionsToCreate - remove pricingType completely
        if (Array.isArray(optionsToCreate) && optionsToCreate.length > 0) {
          optionsToCreate = optionsToCreate.map((opt, idx) => {
            if (!opt || typeof opt !== 'object') return opt;
            
            // Deep clone to break any references
            let cleaned = JSON.parse(JSON.stringify(opt));
            
            // Remove pricingType in multiple ways
            delete cleaned.pricingType;
            delete cleaned.pricing_type;
            
            // CRITICAL: Only remove pricingType, NOT groupPricingTiers!
            // Remove any key that contains "pricing" EXCEPT groupPricingTiers
            Object.keys(cleaned).forEach(key => {
              const keyLower = key.toLowerCase();
              if (keyLower.includes('pricing')) {
                if (keyLower === 'grouppricingtiers') {
                  // PRESERVE groupPricingTiers - this is the correct field!
                  console.log(`✅ Preserving groupPricingTiers for option ${idx + 1}`);
                } else {
                  // Remove other pricing fields (like pricingType)
                  console.warn(`⚠️  Removing pricing-related key from option ${idx + 1}: ${key}`);
                  delete cleaned[key];
                }
              }
            });
            
            // Final verification
            if ('pricingType' in cleaned || 'pricing_type' in cleaned) {
              console.error(`🚨 CRITICAL: pricingType STILL EXISTS in option ${idx + 1} after all removals!`);
              console.error('   Option keys:', Object.keys(cleaned));
              // Force remove one more time
              delete cleaned.pricingType;
              delete cleaned.pricing_type;
            }
            
            return cleaned;
          });
          console.log('✅ Final pricingType removal from optionsToCreate completed');
        }
        
        console.log('🔍 Creating tour WITHOUT options first...');
        console.log('   Tour data keys:', Object.keys(tourDataWithoutOptions));
        console.log('   Has options field?', 'options' in tourDataWithoutOptions);
        console.log('   Has tourOptions field?', 'tourOptions' in tourDataWithoutOptions);
        console.log('   Options to create separately:', optionsToCreate.length);
        console.log('   Final slug:', tourDataWithoutOptions.slug);
        
        // CRITICAL: Verify no pricingType in optionsToCreate (but groupPricingTiers is OK)
        const hasPricingType = optionsToCreate.some(opt => {
          if (!opt || typeof opt !== 'object') return false;
          return 'pricingType' in opt || 'pricing_type' in opt || 
                 Object.keys(opt).some(k => {
                   const kLower = k.toLowerCase();
                   return kLower.includes('pricing') && kLower !== 'grouppricingtiers';
                 });
        });
        if (hasPricingType) {
          console.error('🚨 CRITICAL: pricingType still found in optionsToCreate!');
          console.error('   Options:', JSON.stringify(optionsToCreate, null, 2));
          // Force remove with another deep clone
          optionsToCreate = JSON.parse(JSON.stringify(optionsToCreate)).map(opt => {
            if (opt && typeof opt === 'object') {
              delete opt.pricingType;
              delete opt.pricing_type;
              Object.keys(opt).forEach(k => {
                const kLower = k.toLowerCase();
                // CRITICAL: Only remove pricingType, NOT groupPricingTiers!
                if (kLower.includes('pricing') && kLower !== 'grouppricingtiers') {
                  delete opt[k];
                }
              });
            }
            return opt;
          });
        }
        
        // ABSOLUTE FINAL CHECK: Ensure no options field exists
        if ('options' in tourDataWithoutOptions) {
          console.error('🚨 CRITICAL: options field STILL EXISTS right before Prisma create!');
          console.error('   Keys:', Object.keys(tourDataWithoutOptions));
          delete tourDataWithoutOptions.options;
        }
        
        // Log exactly what we're sending to Prisma
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🔍 FINAL CHECK BEFORE prisma.tour.create()');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📋 tourDataWithoutOptions keys:', Object.keys(tourDataWithoutOptions));
        console.log('❓ Has options?', 'options' in tourDataWithoutOptions);
        console.log('❓ Has tourOptions?', 'tourOptions' in tourDataWithoutOptions);
        console.log('📦 Full object:', JSON.stringify(tourDataWithoutOptions, null, 2));
        console.log('═══════════════════════════════════════════════════════════');
        
        // CRITICAL: Final uniqueness check right before creation (prevents P2002 errors)
        // This is a safety net - slug should already be unique from generation logic above
        const originalSlug = tourDataWithoutOptions.slug;
        let finalSlug = originalSlug;
        let emergencyAttempts = 0;
        const MAX_EMERGENCY_ATTEMPTS = 10;
        let slugIsUnique = false;
        
        while (emergencyAttempts < MAX_EMERGENCY_ATTEMPTS && !slugIsUnique) {
          const finalSlugCheck = await prisma.tour.findUnique({
            where: { slug: finalSlug }
          });
          
          if (!finalSlugCheck) {
            // Slug is unique! Update and proceed
            tourDataWithoutOptions.slug = finalSlug;
            slugIsUnique = true;
            if (emergencyAttempts > 0) {
              console.log(`✅ Emergency slug generated after ${emergencyAttempts} attempts:`, finalSlug);
            }
            break;
          }
          
          // Collision detected - generate new emergency slug using ORIGINAL slug as base
          emergencyAttempts++;
          console.warn(`⚠️  Slug collision detected (attempt ${emergencyAttempts}/${MAX_EMERGENCY_ATTEMPTS}):`, finalSlug);
          
          // Use original slug as base, not the colliding one
          const timestamp = Date.now();
          const random = Math.random().toString(36).slice(-6);
          finalSlug = `${originalSlug}-${timestamp}-${random}`;
          
          // Small delay to ensure different timestamp
          if (emergencyAttempts < MAX_EMERGENCY_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        // If we exhausted all attempts, use the last generated slug (should be unique due to timestamp)
        if (!slugIsUnique && emergencyAttempts >= MAX_EMERGENCY_ATTEMPTS) {
          // Generate one final guaranteed unique slug
          const absoluteFinal = `${originalSlug}-${Date.now()}-${Math.random().toString(36).slice(-10)}`;
          tourDataWithoutOptions.slug = absoluteFinal;
          console.error('🚨 Used absolute final emergency slug after all attempts:', absoluteFinal);
          
          // One more verification
          const lastCheck = await prisma.tour.findUnique({
            where: { slug: absoluteFinal }
          });
          if (lastCheck) {
            // This should NEVER happen, but if it does, use microsecond precision
            const microsecondSlug = `${originalSlug}-${Date.now()}-${process.hrtime.bigint().toString(36)}-${Math.random().toString(36).slice(-10)}`;
            tourDataWithoutOptions.slug = microsecondSlug;
            console.error('🚨 CRITICAL: Even absolute final slug collided! Using microsecond precision:', microsecondSlug);
          }
        }
        
        // ABSOLUTE FINAL CHECK: Ensure no options field exists
        if ('options' in tourDataWithoutOptions) {
          console.error('🚨 CRITICAL: options field STILL EXISTS right before Prisma create!');
          console.error('   Keys:', Object.keys(tourDataWithoutOptions));
          delete tourDataWithoutOptions.options;
        }
        
        // Create the tour first (without options to prevent schema validation issues)
        // Retry logic for connection errors (P1017, P1001, P1008)
        let createAttempts = 0;
        const MAX_CREATE_RETRIES = 3;
        let tourCreated = false;
        
        while (createAttempts < MAX_CREATE_RETRIES && !tourCreated) {
          try {
            tour = await prisma.tour.create({
              data: tourDataWithoutOptions
              // Don't include options here - we'll fetch them after creating separately
            });
            tourCreated = true;
            break; // Success!
          } catch (prismaError) {
            createAttempts++;
            console.error('═══════════════════════════════════════════════════════════');
            console.error(`🚨 PRISMA ERROR DURING tour.create() (attempt ${createAttempts}/${MAX_CREATE_RETRIES})`);
            console.error('═══════════════════════════════════════════════════════════');
            console.error('Error code:', prismaError.code);
            console.error('Error message:', prismaError.message);
            console.error('Error meta:', JSON.stringify(prismaError.meta, null, 2));
            
            // Retry on connection errors
            if (createAttempts < MAX_CREATE_RETRIES && (
              prismaError.code === 'P1017' ||
              prismaError.code === 'P1001' ||
              prismaError.code === 'P1008' ||
              prismaError.message?.includes('connection') ||
              prismaError.message?.includes('closed')
            )) {
              const retryDelay = createAttempts * 1000; // 1s, 2s, 3s
              console.log(`   Connection error detected, retrying in ${retryDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue; // Retry
            }
            
            // Not a retryable error or max retries reached
            console.error('Data sent to Prisma:', JSON.stringify(tourDataWithoutOptions, null, 2));
            console.error('Has options?', 'options' in tourDataWithoutOptions);
            console.error('All keys:', Object.keys(tourDataWithoutOptions));
            console.error('═══════════════════════════════════════════════════════════');
            throw prismaError;
          }
        }
        
        if (!tourCreated) {
          throw new Error('Failed to create tour after retries due to connection issues');
        }
        
        // Then create options separately if they exist
        if (optionsToCreate.length > 0) {
          console.log('🔍 Creating options separately...');
          
          // Filter to only valid TourOption fields
          // Note: pricingType removed - we infer pricing type from groupPrice/maxGroupSize presence
          
          // CRITICAL: Reset tour_options sequence if ID conflict detected
          // createMany can have sequence synchronization issues
          try {
            await prisma.$queryRaw`SELECT setval('tour_options_id_seq', COALESCE((SELECT MAX(id) FROM tour_options), 0) + 1, false)`;
            console.log('✅ tour_options_id_seq synchronized');
          } catch (seqError) {
            console.warn('⚠️  Could not reset tour_options sequence (non-critical):', seqError.message);
          }
          
          // CRITICAL: Create options one by one instead of createMany to avoid sequence issues
          // This is more reliable than createMany with sequence resets
          const createdOptions = [];
          for (let i = 0; i < optionsToCreate.length; i++) {
            const opt = optionsToCreate[i];
            
            // CRITICAL: Remove pricingType FIRST before any processing (prevents P2022 errors)
            // This field does NOT exist in the database and MUST be removed
            delete opt.pricingType;
            delete opt.pricing_type;
            
            const cleanOpt = {};
            
            // Only include valid fields (maxGroupSize and groupPrice are EXCLUDED from VALID_TOUR_OPTION_FIELDS)
            VALID_TOUR_OPTION_FIELDS.forEach(field => {
              // Only include field if it has a value (exclude null/undefined)
              // This prevents Prisma from trying to validate columns that might not exist yet
              if (opt[field] !== undefined && opt[field] !== null) {
                // CRITICAL: For groupPricingTiers, ensure it's a string
                if (field === 'groupPricingTiers') {
                  if (typeof opt[field] === 'string') {
                    cleanOpt[field] = opt[field];
                    console.log(`✅ Option ${i + 1} groupPricingTiers (string):`, opt[field].substring(0, 200));
                  } else if (Array.isArray(opt[field])) {
                    cleanOpt[field] = JSON.stringify(opt[field]);
                    console.log(`✅ Option ${i + 1} groupPricingTiers (array->string):`, JSON.stringify(opt[field]).substring(0, 200));
                  } else {
                    console.warn(`⚠️ Option ${i + 1} groupPricingTiers has unexpected type:`, typeof opt[field]);
                  }
                } else {
                  cleanOpt[field] = opt[field];
                }
              } else if (field === 'groupPricingTiers') {
                console.warn(`⚠️ Option ${i + 1} has NO groupPricingTiers (null/undefined)`);
              }
            });
            
            // CRITICAL: Explicitly remove maxGroupSize and groupPrice to prevent Prisma validation
            // These columns may not exist in production DB if migration hasn't been run
            // They are NOT in VALID_TOUR_OPTION_FIELDS, so they won't be added above
            // But we explicitly remove them here as a safety measure
            delete cleanOpt.maxGroupSize;
            delete cleanOpt.max_group_size;
            delete cleanOpt.groupPrice;
            delete cleanOpt.group_price;
            
            // Log if we're skipping group pricing fields (for debugging)
            if (opt.maxGroupSize || opt.groupPrice) {
              console.log(`   ℹ️  Skipping group pricing fields for option ${i + 1} (columns may not exist in DB)`);
            }
            
            // CRITICAL: Aggressively remove ALL possible ID fields
            delete cleanOpt.id;
            delete cleanOpt.tourId;
            delete cleanOpt.tour_id;
            delete cleanOpt.optionId;
            delete cleanOpt.option_id;
            
            // CRITICAL: Remove pricingType from cleanOpt as well (double safety)
            delete cleanOpt.pricingType;
            delete cleanOpt.pricing_type;
            
            // Remove any other ID-like fields
            Object.keys(cleanOpt).forEach(key => {
              const keyLower = key.toLowerCase();
              if (keyLower === 'id' || (keyLower.includes('id') && (keyLower.includes('tour') || keyLower.includes('option')))) {
                delete cleanOpt[key];
              }
              // CRITICAL: DO NOT remove groupPricingTiers! Only remove pricingType
              // Also remove any pricing-related fields EXCEPT groupPricingTiers
              if (keyLower.includes('pricing')) {
                if (keyLower === 'grouppricingtiers') {
                  // Keep groupPricingTiers - this is the correct field
                  console.log(`✅ Preserving groupPricingTiers for option ${i + 1}`);
                } else {
                  // Remove other pricing fields (like pricingType)
                  console.log(`🗑️ Removing pricing field "${key}" from option ${i + 1}`);
                  delete cleanOpt[key];
                }
              }
            });
            
            // CRITICAL: Final verification - log if groupPricingTiers exists
            if (cleanOpt.groupPricingTiers) {
              console.log(`✅ Option ${i + 1} FINAL CHECK - groupPricingTiers PRESENT:`, 
                typeof cleanOpt.groupPricingTiers === 'string' 
                  ? cleanOpt.groupPricingTiers.substring(0, 200) 
                  : 'not string');
            } else {
              console.warn(`⚠️ Option ${i + 1} FINAL CHECK - groupPricingTiers MISSING!`);
            }
            
            // Final check: Log if pricingType somehow still exists
            if ('pricingType' in cleanOpt || 'pricing_type' in cleanOpt) {
              console.error('🚨 CRITICAL: pricingType still exists in cleanOpt after all removals!');
              console.error('   cleanOpt keys:', Object.keys(cleanOpt));
              delete cleanOpt.pricingType;
              delete cleanOpt.pricing_type;
            }
            
            // Create option individually (more reliable than createMany)
            // CRITICAL: Handle missing column errors gracefully (migration might not be run yet)
            try {
              // CRITICAL: Log what we're about to save
              console.log(`📤 Creating option ${i + 1} with data:`, {
                optionTitle: cleanOpt.optionTitle,
                price: cleanOpt.price,
                hasGroupPricingTiers: !!cleanOpt.groupPricingTiers,
                groupPricingTiersType: typeof cleanOpt.groupPricingTiers,
                groupPricingTiersPreview: cleanOpt.groupPricingTiers 
                  ? (typeof cleanOpt.groupPricingTiers === 'string' 
                    ? cleanOpt.groupPricingTiers.substring(0, 200)
                    : JSON.stringify(cleanOpt.groupPricingTiers).substring(0, 200))
                  : 'null',
                allKeys: Object.keys(cleanOpt),
                groupPricingTiersKeyExists: 'groupPricingTiers' in cleanOpt
              });
              
              const createdOption = await prisma.tourOption.create({
                data: {
                  ...cleanOpt,
                  tourId: tour.id
                }
              });
              
              // CRITICAL: Verify what was actually saved
              console.log(`✅ Option ${i + 1} created successfully:`, {
                id: createdOption.id,
                optionTitle: createdOption.optionTitle,
                hasGroupPricingTiers: !!createdOption.groupPricingTiers,
                groupPricingTiersType: typeof createdOption.groupPricingTiers,
                groupPricingTiersPreview: createdOption.groupPricingTiers 
                  ? (typeof createdOption.groupPricingTiers === 'string' 
                    ? createdOption.groupPricingTiers.substring(0, 200)
                    : 'not string')
                  : 'null',
                verification: createdOption.groupPricingTiers ? '✅ SAVED' : '❌ MISSING'
              });
              
              createdOptions.push(createdOption);
            } catch (optionError) {
              // If error is about missing max_group_size or group_price columns, retry without them
              if (optionError.code === 'P2022' && 
                  (optionError.meta?.column?.includes('max_group_size') || 
                   optionError.meta?.column?.includes('group_price'))) {
                console.warn(`⚠️  Column missing for option ${i + 1}, retrying without group pricing fields...`);
                // Remove group pricing fields and retry
                const fallbackOpt = { ...cleanOpt };
                delete fallbackOpt.maxGroupSize;
                delete fallbackOpt.groupPrice;
                delete fallbackOpt.max_group_size;
                delete fallbackOpt.group_price;
                
                try {
                  const createdOption = await prisma.tourOption.create({
                    data: {
                      ...fallbackOpt,
                      tourId: tour.id
                    }
                  });
                  createdOptions.push(createdOption);
                  console.log(`✅ Created option ${i + 1} without group pricing fields (migration may need to be run)`);
                } catch (fallbackError) {
                  console.error(`❌ Failed to create option ${i + 1} even without group pricing:`, fallbackError.message);
                  throw fallbackError; // Re-throw if fallback also fails
                }
              } else {
                // Other errors should be thrown normally
                throw optionError;
              }
            }
          }
          
          console.log(`✅ Created ${createdOptions.length} tour options individually`);
          
          // Fetch the tour again with options
          tour = await prisma.tour.findUnique({
            where: { id: tour.id },
          include: {
            options: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        });
        }
        break; // Success, exit retry loop
      } catch (createError) {
        createAttempts++;
        
        // ENHANCED ERROR LOGGING - Make errors super visible
        console.error('\n');
        console.error('═══════════════════════════════════════════════════════════');
        console.error('🚨 TOUR CREATION ERROR DETECTED 🚨');
        console.error('═══════════════════════════════════════════════════════════');
        console.error(`❌ Attempt ${createAttempts}/${MAX_CREATE_RETRIES} failed`);
        console.error('');
        console.error('📋 ERROR DETAILS:');
        console.error('   Message:', createError.message);
        console.error('   Code:', createError.code || 'N/A');
        console.error('   Meta:', JSON.stringify(createError.meta, null, 2));
        console.error('');
        console.error('📚 FULL ERROR STACK:');
        console.error(createError.stack || createError);
        console.error('═══════════════════════════════════════════════════════════');
        console.error('\n');
        
        // If it's an ID constraint violation, this is unusual - log more details
        if (createError.code === 'P2002' && createError.meta?.target?.includes('id')) {
          console.error('   ⚠️  ID constraint violation detected!');
          console.error('   This should not happen if id is auto-generated.');
          if (finalTourData) {
            console.error('   Checking if id field exists in finalTourData...');
            console.error('   finalTourData keys:', Object.keys(finalTourData));
            console.error('   Has id field:', 'id' in finalTourData);
          }
          
          // This is likely a database sequence issue - try to reset it
          if (createAttempts < MAX_CREATE_RETRIES) {
            console.log(`   ID conflict detected, attempting to reset sequence and retry (attempt ${createAttempts + 1}/${MAX_CREATE_RETRIES})...`);
            try {
              // Attempt to reset the sequence for the 'tours' table
              await prisma.$queryRaw`SELECT setval('tours_id_seq', (SELECT MAX(id) FROM tours))`;
              console.log('   ✅ tours_id_seq reset successfully.');
            } catch (seqError) {
              console.error('   ❌ Failed to reset tours_id_seq:', seqError.message);
            }
            // Wait longer for ID conflicts (might be sequence sync issue)
            await new Promise(resolve => setTimeout(resolve, (createAttempts + 1) * 1000));
            continue;
          } else {
            // Max retries reached - return error with suggestion to check database
            return res.status(500).json({
              success: false,
              error: 'Database error',
              message: 'Failed to create tour due to database sequence issue. Please contact support or try again later.',
              details: process.env.NODE_ENV === 'development' ? {
                code: createError.code,
                meta: createError.meta,
                message: createError.message,
                suggestion: 'Database sequence may be out of sync. Run: SELECT setval(\'tours_id_seq\', (SELECT MAX(id) FROM tours));'
              } : undefined
            });
          }
        }
        
        // If it's any other constraint violation and we have retries left, try again
        if (createError.code === 'P2002' && createAttempts < MAX_CREATE_RETRIES) {
          console.log(`   Constraint violation detected, retrying in ${createAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, createAttempts * 500));
          continue;
        }
        
        // If it's a slug conflict, regenerate slug and retry
        if (createError.code === 'P2002' && createError.meta?.target?.includes('slug') && createAttempts < MAX_CREATE_RETRIES) {
          console.log(`   Slug conflict detected, regenerating slug...`);
          // Regenerate slug with timestamp to ensure uniqueness
          const timestamp = Date.now();
          const baseSlug = tourData.slug.split('-').slice(0, -1).join('-'); // Remove any existing suffix
          tourData.slug = `${baseSlug}-${timestamp}`;
          console.log(`   New slug: ${tourData.slug}`);
          await new Promise(resolve => setTimeout(resolve, createAttempts * 500));
          continue;
        }
        
        // If it's an options-related error and we have retries left, try creating without options
        if (createError.message?.includes('option') || createError.message?.includes('tour_option') || createError.code === 'P2003') {
          console.log(`   ⚠️  Options-related error detected, attempting to create tour without options...`);
          try {
            // Remove options and try again
            const tourDataWithoutOptions = { ...finalTourData };
            delete tourDataWithoutOptions.options;
            
            tour = await prisma.tour.create({
              data: tourDataWithoutOptions,
              include: {
                options: true
              }
            });
            console.log(`   ✅ Tour created successfully without options (options can be added later)`);
            break; // Success without options
          } catch (noOptionsError) {
            console.error(`   ❌ Failed to create tour even without options:`, noOptionsError.message);
            // Continue to throw original error
          }
        }
        
        // Not a retryable error or max retries reached, throw
        throw createError;
      }
    }
    
    if (!tour) {
      throw new Error('Failed to create tour after retries');
    }

    const totalTime = Date.now() - createStartTime;
    console.log(`✅ Tour created successfully: ${tour.id} (took ${totalTime}ms)`);
    
    if (totalTime > 10000) {
      console.warn(`⚠️ Slow tour creation detected (${totalTime}ms)`);
    }
    console.log(`   Title: ${tour.title}`);
    console.log(`   Slug: ${tour.slug}`);
    console.log(`   City: ${tour.city}, ${tour.country}`);
    console.log(`   Options: ${tour.options ? tour.options.length : 0}`);
    if (tour.options && tour.options.length > 0) {
      console.log(`   📋 Options details:`);
      tour.options.forEach((opt, idx) => {
        console.log(`      ${idx + 1}. ${opt.optionTitle} - ${opt.currency}${opt.price} (${opt.durationHours}h)`);
      });
    } else {
      console.log(`   ⚠️  No options were saved!`);
    }
    console.log(`   Status: ${tour.status}`);
    console.log(`   URL: /${tour.country.toLowerCase().replace(/\s+/g, '-')}/${tour.city.toLowerCase().replace(/\s+/g, '-')}/${tour.slug}`);

    // Upload images to Cloudinary in background (non-blocking)
    if (needsCloudinaryUpload) {
      console.log(`☁️  Starting background Cloudinary upload for tour ${tour.id}...`);
      uploadImagesInBackground(tour.id, imagesArray, city).catch(error => {
        console.error(`❌ Background Cloudinary upload failed for tour ${tour.id}:`, error.message);
      });
    }

    // Use centralized helper function to ensure reviews is always null
    res.json({
      success: true,
      message: 'Tour created successfully',
      tour: formatTourResponse(tour, {
        locations: locationsArray,
        images: imagesArray,
        languages: languagesArray,
        highlights: highlightsArray
      })
    });
  } catch (error) {
    console.error('❌ Tour creation error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error meta:', JSON.stringify(error.meta, null, 2));
    console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    // Handle specific Prisma errors
    let errorMessage = 'Failed to create tour. Please check all required fields and try again.';
    let commonIssues = [];
    
    // Check for Prisma validation errors (P2003, P2011, etc.)
    if (error.code === 'P2003') {
      errorMessage = 'Invalid supplier or foreign key constraint violation. Please make sure you are logged in with an approved account.';
      commonIssues = [
        'Your supplier account needs admin approval',
        'Log out and log back in',
        'Contact support if the issue persists'
      ];
    } else if (error.code === 'P2011') {
      // Null constraint violation
      const field = error.meta?.target?.[0] || 'unknown field';
      errorMessage = `Missing required field: ${field}. Please check all required fields are filled.`;
      commonIssues = [
        'Check that all tour option fields are filled',
        'Ensure optionTitle, optionDescription, price, and durationHours are provided for each option'
      ];
    } else if (error.code === 'P2012') {
      // Missing required value
      const field = error.meta?.path || 'unknown field';
      errorMessage = `Missing required value for field: ${field}. Please check all required fields.`;
      commonIssues = [
        'Check that all tour option fields are filled',
        'Ensure optionTitle, optionDescription, price, and durationHours are provided'
      ];
    } else if (error.code === 'P2002') {
      // Unique constraint violation
      if (error.meta?.target?.includes('id')) {
        errorMessage = 'Database error: ID conflict. Please try again.';
        commonIssues = [
          'Your supplier account needs admin approval',
          'Check all required fields are filled',
          'Ensure you have at least 4 images uploaded',
          'Try refreshing the page and submitting again'
        ];
      } else if (error.meta?.target?.includes('slug')) {
        errorMessage = 'A tour with this title already exists. Please use a different title.';
        commonIssues = [
          'Try adding more details to your tour title',
          'Check if you already created this tour'
        ];
      } else {
        errorMessage = 'A record with this information already exists.';
      }
    } else if (error.code === 'P2003') {
      errorMessage = 'Invalid supplier. Please make sure you are logged in with an approved account.';
      commonIssues = [
        'Your supplier account needs admin approval',
        'Log out and log back in',
        'Contact support if the issue persists'
      ];
    }
    
    // Return detailed error message in development
    const finalMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : errorMessage;
    
    // ENHANCED ERROR RESPONSE - Show detailed errors in development
    const errorResponse = {
      success: false,
      error: 'Internal server error',
      message: finalMessage,
      commonIssues: commonIssues.length > 0 ? commonIssues : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        message: error.message,
        meta: error.meta,
        stack: error.stack
      } : undefined
    };
    
    // Log error to console with clear formatting
    console.error('\n');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('🚨 TOUR CREATION FAILED - RETURNING ERROR TO CLIENT 🚨');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Response:', JSON.stringify(errorResponse, null, 2));
    console.error('═══════════════════════════════════════════════════════════');
    console.error('\n');
    
    res.status(500).json(errorResponse);
  }
});

// Get mini tours for a supplier (for upsell selection)
app.get('/api/suppliers/:supplierId/tours', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { category } = req.query;

    const where = {
      supplierId: parseInt(supplierId)
    };

    if (category) {
      where.category = category;
    }

    const tours = await prisma.tour.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON fields
    const formattedTours = tours.map(tour => ({
      ...tour,
      id: String(tour.id),
      locations: JSON.parse(tour.locations || '[]'),
      images: JSON.parse(tour.images || '[]'),
      languages: JSON.parse(tour.languages || '[]'),
      highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : []
    }));

    res.json({
      success: true,
      tours: formattedTours
    });
  } catch (error) {
    console.error('Get supplier tours error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tours'
    });
  }
});

// Get all tours for a supplier
app.get('/api/tours', async (req, res) => {
  const startTime = Date.now();
  try {
    const { supplierId } = req.query;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        error: 'Missing supplierId',
        message: 'Please provide supplierId as query parameter'
      });
    }

    console.log(`📋 Fetching tours for supplier ${supplierId}`);

    // Retry logic for Render free tier database connection issues
    let tours = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !tours) {
      try {
        // Optimize query: only select necessary fields and limit options
        tours = await prisma.tour.findMany({
          where: {
            supplierId: parseInt(supplierId)
          },
          select: {
            id: true,
            supplierId: true,
            title: true,
            slug: true,
            country: true,
            city: true,
            category: true,
            locations: true,
            duration: true,
            pricePerPerson: true,
            currency: true,
            shortDescription: true,
            fullDescription: true,
            highlights: true,
            included: true,
            notIncluded: true,
            meetingPoint: true,
            guideType: true,
            tourTypes: true,
            // Don't fetch images for list view - they're huge base64 strings and slow down queries significantly
            // Images will be fetched separately when viewing individual tours
            // images: true,
            languages: true,
            status: true,
            rejectionReason: true,
            maxGroupSize: true,
            groupPrice: true,
            createdAt: true,
            updatedAt: true,
            approvedAt: true,
            options: {
              select: {
                id: true,
                tourId: true,
                optionTitle: true,
                optionDescription: true,
                durationHours: true,
                price: true,
                currency: true,
                language: true,
                pickupIncluded: true,
                entryTicketIncluded: true,
                guideIncluded: true,
                carIncluded: true,
                groupPricingTiers: true,
                sortOrder: true
              },
              orderBy: {
                sortOrder: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching tours (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!tours) {
      throw new Error('Failed to fetch tours after retries');
    }

    const queryTime = Date.now() - startTime;
    console.log(`   ✅ Found ${tours.length} tours (query took ${queryTime}ms)`);

    // Parse JSON fields with error handling
    const parseStartTime = Date.now();
    const formattedTours = tours.map(tour => {
      try {
        // Format options
        const formattedOptions = (tour.options || []).map(opt => {
          // Parse groupPricingTiers if it exists (stored as JSON string in DB)
          let groupPricingTiers = null;
          if (opt.groupPricingTiers) {
            try {
              groupPricingTiers = typeof opt.groupPricingTiers === 'string' 
                ? JSON.parse(opt.groupPricingTiers) 
                : opt.groupPricingTiers;
            } catch (e) {
              console.warn(`   ⚠️  Failed to parse groupPricingTiers for option ${opt.id}:`, e.message);
              groupPricingTiers = null;
            }
          }
          
          return {
            id: String(opt.id),
            tourId: String(opt.tourId),
            optionTitle: opt.optionTitle,
            optionDescription: opt.optionDescription,
            durationHours: opt.durationHours,
            price: opt.price,
            currency: opt.currency,
            language: opt.language,
            pickupIncluded: opt.pickupIncluded,
            entryTicketIncluded: opt.entryTicketIncluded,
            guideIncluded: opt.guideIncluded,
            carIncluded: opt.carIncluded,
            maxGroupSize: opt.maxGroupSize,
            groupPrice: opt.groupPrice,
            groupPricingTiers: groupPricingTiers,
            sortOrder: opt.sortOrder
          };
        });

        return {
          ...tour,
          id: String(tour.id),
          supplierId: String(tour.supplierId),
          locations: JSON.parse(tour.locations || '[]'),
          images: tour.images ? JSON.parse(tour.images || '[]') : [], // Handle missing images field
          languages: JSON.parse(tour.languages || '[]'),
          highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
          tourTypes: tour.tourTypes ? JSON.parse(tour.tourTypes || '[]') : [],
          options: formattedOptions
        };
      } catch (parseError) {
        console.warn(`   ⚠️  Error parsing tour ${tour.id} JSON fields:`, parseError.message);
        return {
          ...tour,
          id: String(tour.id),
          supplierId: String(tour.supplierId),
          locations: [],
          images: [], // Images not fetched for list view
          languages: ['English'],
          highlights: [],
          tourTypes: [],
          options: (tour.options || []).map(opt => ({
            id: String(opt.id),
            tourId: String(opt.tourId),
            optionTitle: opt.optionTitle,
            optionDescription: opt.optionDescription,
            durationHours: opt.durationHours,
            price: opt.price,
            currency: opt.currency,
            language: opt.language,
            pickupIncluded: opt.pickupIncluded,
            entryTicketIncluded: opt.entryTicketIncluded,
            guideIncluded: opt.guideIncluded,
            carIncluded: opt.carIncluded,
            groupPricingTiers: opt.groupPricingTiers ? (typeof opt.groupPricingTiers === 'string' ? JSON.parse(opt.groupPricingTiers) : opt.groupPricingTiers) : null,
            sortOrder: opt.sortOrder
          }))
        };
      }
    });

    const parseTime = Date.now() - parseStartTime;
    const totalTime = Date.now() - startTime;
    console.log(`   ✅ Formatted ${formattedTours.length} tours (parse: ${parseTime}ms, total: ${totalTime}ms)`);
    
    // Log warning if query is slow
    if (totalTime > 5000) {
      console.warn(`⚠️ Slow tour fetch detected (${totalTime}ms) - query: ${queryTime}ms, parse: ${parseTime}ms`);
    }

    res.json({
      success: true,
      tours: formattedTours
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ Get tours error (after ${totalTime}ms):`, error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tours',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single tour by ID
app.get('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    // Retry logic for Render free tier database connection issues
    let tour = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !tour) {
      try {
        tour = await prisma.tour.findUnique({
          where: { id: tourId },
          include: {
            options: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching tour (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    // Parse JSON fields with error handling
    let formattedTour;
    try {
      // Format options
      const formattedOptions = (tour.options || []).map(opt => {
        // Parse groupPricingTiers if it exists
        let groupPricingTiers = null;
        if (opt.groupPricingTiers) {
          try {
            groupPricingTiers = typeof opt.groupPricingTiers === 'string' 
              ? JSON.parse(opt.groupPricingTiers) 
              : opt.groupPricingTiers;
          } catch (e) {
            console.warn(`   ⚠️  Failed to parse groupPricingTiers for option ${opt.id}:`, e.message);
            groupPricingTiers = null;
          }
        }
        
        return {
          id: String(opt.id),
          tourId: String(opt.tourId),
          optionTitle: opt.optionTitle,
          optionDescription: opt.optionDescription,
          durationHours: opt.durationHours,
          price: opt.price,
          currency: opt.currency,
          language: opt.language,
          pickupIncluded: opt.pickupIncluded,
          entryTicketIncluded: opt.entryTicketIncluded,
          guideIncluded: opt.guideIncluded,
          carIncluded: opt.carIncluded,
          maxGroupSize: opt.maxGroupSize,
          groupPrice: opt.groupPrice,
          groupPricingTiers: groupPricingTiers,
          sortOrder: opt.sortOrder
        };
      });

      // Parse groupPricingTiers for main tour if it exists
      let groupPricingTiers = null;
      if (tour.groupPricingTiers) {
        try {
          groupPricingTiers = typeof tour.groupPricingTiers === 'string' 
            ? JSON.parse(tour.groupPricingTiers) 
            : tour.groupPricingTiers;
        } catch (e) {
          console.warn(`   ⚠️  Failed to parse groupPricingTiers for tour ${tour.id}:`, e.message);
          groupPricingTiers = null;
        }
      }

      formattedTour = {
        ...tour,
        id: String(tour.id),
        supplierId: String(tour.supplierId),
        locations: JSON.parse(tour.locations || '[]'),
        images: JSON.parse(tour.images || '[]'),
        languages: JSON.parse(tour.languages || '[]'),
        highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
        tourTypes: tour.tourTypes ? JSON.parse(tour.tourTypes || '[]') : [],
        groupPricingTiers: groupPricingTiers,
        options: formattedOptions
      };
    } catch (parseError) {
      console.warn(`   ⚠️  Error parsing tour ${tour.id} JSON fields:`, parseError.message);
      formattedTour = {
        ...tour,
        id: String(tour.id),
        supplierId: String(tour.supplierId),
        locations: [],
        images: [],
        languages: ['English'],
        highlights: [],
        options: (tour.options || []).map(opt => ({
          id: String(opt.id),
          tourId: String(opt.tourId),
          optionTitle: opt.optionTitle,
          optionDescription: opt.optionDescription,
          durationHours: opt.durationHours,
          price: opt.price,
          currency: opt.currency,
          language: opt.language,
          pickupIncluded: opt.pickupIncluded,
          entryTicketIncluded: opt.entryTicketIncluded,
          guideIncluded: opt.guideIncluded,
          carIncluded: opt.carIncluded,
          maxGroupSize: opt.maxGroupSize,
          groupPrice: opt.groupPrice,
          sortOrder: opt.sortOrder
        }))
      };
    }

    res.json({
      success: true,
      tour: formattedTour
    });
  } catch (error) {
    console.error('❌ Get tour error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tour',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update tour (only if draft)
app.put('/api/tours/:id', async (req, res) => {
  const updateStartTime = Date.now();
  try {
    console.log(`📝 Tour update request received for tour ${req.params.id}`);
    const { id } = req.params;
    const tourId = parseInt(id);
    const updateData = req.body;

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    // Check if tour exists and is in draft status
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    // Allow editing draft, pending, and approved tours
    // Edited tours keep their current status (approved tours stay approved)
    if (existingTour.status !== 'draft' && existingTour.status !== 'pending' && existingTour.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Cannot edit tour',
        message: 'Only draft, pending, and approved tours can be edited.'
      });
    }

    // Prepare update data
    const dataToUpdate = {};
    
    // CRITICAL: Preserve existing status - don't change status when editing
    // Only new tour submissions go to admin review, not edits
    // This ensures pending tours stay pending, approved tours stay approved, etc.
    dataToUpdate.status = existingTour.status;

    if (updateData.title) dataToUpdate.title = updateData.title;
    if (updateData.city) dataToUpdate.city = updateData.city;
    if (updateData.category) dataToUpdate.category = updateData.category;
    if (updateData.locations) dataToUpdate.locations = JSON.stringify(
      typeof updateData.locations === 'string' ? JSON.parse(updateData.locations) : updateData.locations
    );
    if (updateData.duration) dataToUpdate.duration = updateData.duration;
    
    // CRITICAL: If groupPricingTiers is provided, use first tier (1 person) price for pricePerPerson
    // This ensures "Starting from" always shows the correct 1-person price
    if (updateData.groupPricingTiers) {
      try {
        const tiers = typeof updateData.groupPricingTiers === 'string' 
          ? JSON.parse(updateData.groupPricingTiers) 
          : updateData.groupPricingTiers;
        if (Array.isArray(tiers) && tiers.length > 0 && tiers[0] && tiers[0].price) {
          const firstTierPrice = parseFloat(tiers[0].price);
          if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
            dataToUpdate.pricePerPerson = firstTierPrice;
            console.log(`✅ Updated pricePerPerson from groupPricingTiers[0]: ${firstTierPrice}`);
          }
        }
      } catch (e) {
        console.warn('⚠️ Failed to parse groupPricingTiers for pricePerPerson update:', e.message);
        // Fallback to provided pricePerPerson if parsing fails
        if (updateData.pricePerPerson !== undefined) {
          dataToUpdate.pricePerPerson = parseFloat(updateData.pricePerPerson);
        }
      }
    } else if (updateData.pricePerPerson !== undefined) {
      // Only use provided pricePerPerson if groupPricingTiers is not provided
      dataToUpdate.pricePerPerson = parseFloat(updateData.pricePerPerson);
    }
    
    if (updateData.currency) dataToUpdate.currency = updateData.currency;
    if (updateData.shortDescription !== undefined) dataToUpdate.shortDescription = updateData.shortDescription;
    if (updateData.fullDescription) dataToUpdate.fullDescription = updateData.fullDescription;
    if (updateData.included) dataToUpdate.included = updateData.included;
    if (updateData.notIncluded !== undefined) dataToUpdate.notIncluded = updateData.notIncluded;
    if (updateData.meetingPoint !== undefined) dataToUpdate.meetingPoint = updateData.meetingPoint;
    if (updateData.guideType !== undefined) dataToUpdate.guideType = updateData.guideType;
    if (updateData.tourTypes !== undefined) {
      dataToUpdate.tourTypes = updateData.tourTypes 
        ? JSON.stringify(typeof updateData.tourTypes === 'string' ? JSON.parse(updateData.tourTypes) : updateData.tourTypes)
        : null;
    }
    if (updateData.images) dataToUpdate.images = JSON.stringify(
      typeof updateData.images === 'string' ? JSON.parse(updateData.images) : updateData.images
    );
    if (updateData.languages) dataToUpdate.languages = JSON.stringify(
      typeof updateData.languages === 'string' ? JSON.parse(updateData.languages) : updateData.languages
    );
    
    // Handle simplified pricing fields
    if (updateData.maxGroupSize !== undefined) {
      dataToUpdate.maxGroupSize = updateData.maxGroupSize ? parseInt(updateData.maxGroupSize) : null;
    }
    if (updateData.groupPrice !== undefined) {
      dataToUpdate.groupPrice = updateData.groupPrice ? parseFloat(updateData.groupPrice) : null;
    }
    // Note: groupPricingTiers is stored on TourOption, not Tour model
    // Main tour's groupPricingTiers will be stored in the main tour option (sortOrder: -1)
    if (updateData.unavailableDates !== undefined) {
      dataToUpdate.unavailableDates = updateData.unavailableDates 
        ? (typeof updateData.unavailableDates === 'string' 
          ? updateData.unavailableDates 
          : JSON.stringify(updateData.unavailableDates))
        : null;
    }
    if (updateData.unavailableDaysOfWeek !== undefined) {
      dataToUpdate.unavailableDaysOfWeek = updateData.unavailableDaysOfWeek
        ? (typeof updateData.unavailableDaysOfWeek === 'string'
          ? updateData.unavailableDaysOfWeek
          : JSON.stringify(updateData.unavailableDaysOfWeek))
        : null;
    }
    
    // CRITICAL: Save groupPricingTiers directly on Tour model (simple, reliable)
    if (updateData.groupPricingTiers !== undefined) {
      dataToUpdate.groupPricingTiers = updateData.groupPricingTiers
        ? (typeof updateData.groupPricingTiers === 'string'
          ? updateData.groupPricingTiers
          : (Array.isArray(updateData.groupPricingTiers) && updateData.groupPricingTiers.length > 0
            ? JSON.stringify(updateData.groupPricingTiers)
            : null))
        : null;
      console.log('✅ Saving groupPricingTiers on Tour model:', {
        hasValue: !!dataToUpdate.groupPricingTiers,
        preview: dataToUpdate.groupPricingTiers ? dataToUpdate.groupPricingTiers.substring(0, 200) : 'null'
      });
    }

    // Update tour first
    const tourUpdateStartTime = Date.now();
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: dataToUpdate
    });
    console.log(`   ✅ Tour record updated (took ${Date.now() - tourUpdateStartTime}ms)`);
    
    // CRITICAL: If main tour has groupPricingTiers, create main tour option BEFORE processing tourOptions
    // This ensures "Starting from" always shows the correct 1-person price
    if (updateData.groupPricingTiers) {
      try {
        const mainTourGroupPricingTiers = typeof updateData.groupPricingTiers === 'string' 
          ? JSON.parse(updateData.groupPricingTiers) 
          : updateData.groupPricingTiers;
        
        if (Array.isArray(mainTourGroupPricingTiers) && mainTourGroupPricingTiers.length > 0 && mainTourGroupPricingTiers[0]?.price) {
          const firstTierPrice = parseFloat(mainTourGroupPricingTiers[0].price);
          if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
            const mainTourOption = {
              optionTitle: updateData.title || existingTour.title,
              optionDescription: updateData.shortDescription || existingTour.shortDescription || existingTour.fullDescription?.substring(0, 200) || 'Main tour option',
              durationHours: parseFloat((updateData.duration || existingTour.duration)?.replace(/[^0-9.]/g, '')) || 3,
              price: firstTierPrice, // ALWAYS use first tier (1 person) price
              currency: updateData.currency || existingTour.currency || 'INR',
              language: (updateData.languages ? (typeof updateData.languages === 'string' ? JSON.parse(updateData.languages) : updateData.languages) : JSON.parse(existingTour.languages || '["English"]'))?.[0] || 'English',
              pickupIncluded: false,
              entryTicketIncluded: false,
              guideIncluded: true,
              carIncluded: false,
              groupPricingTiers: typeof mainTourGroupPricingTiers === 'string' ? mainTourGroupPricingTiers : JSON.stringify(mainTourGroupPricingTiers),
              sortOrder: -1 // Main tour option comes first
            };
            
            // Ensure tourOptions is an array and prepend main tour option
            if (!updateData.tourOptions || !Array.isArray(updateData.tourOptions)) {
              updateData.tourOptions = [];
            }
            // Remove any existing main tour option (sortOrder: -1) to avoid duplicates
            updateData.tourOptions = updateData.tourOptions.filter((opt) => opt.sortOrder !== -1);
            // Prepend main tour option
            updateData.tourOptions = [mainTourOption, ...updateData.tourOptions];
            
            console.log('✅ Created main tour option from groupPricingTiers:', {
              firstTierPrice,
              tiersCount: mainTourGroupPricingTiers.length,
              totalOptions: updateData.tourOptions.length
            });
          }
        }
      } catch (e) {
        console.warn('⚠️ Failed to parse main tour groupPricingTiers for update:', e.message);
      }
    }
    
    // Handle tour options update (delete old ones and create new ones)
    if (updateData.tourOptions !== undefined && Array.isArray(updateData.tourOptions)) {
      try {
        const optionsStartTime = Date.now();
        console.log(`📋 Updating tour options for tour ${tourId}, count: ${updateData.tourOptions.length}`);
        
        // Delete all existing options for this tour
        const deleteStartTime = Date.now();
        await prisma.tourOption.deleteMany({
          where: { tourId: tourId }
        });
        console.log(`   ✅ Deleted existing options (took ${Date.now() - deleteStartTime}ms)`);
        
        // Create new options
        if (updateData.tourOptions.length > 0) {
          const VALID_TOUR_OPTION_FIELDS = [
            'optionTitle', 'optionDescription', 'durationHours', 'price', 'currency',
            'language', 'pickupIncluded', 'entryTicketIncluded', 'guideIncluded',
            'carIncluded', 'groupPricingTiers', 'sortOrder'
          ];
          
          const optionsToCreate = updateData.tourOptions.map((opt, index) => {
            const cleanOpt = {};
            VALID_TOUR_OPTION_FIELDS.forEach(field => {
              // CRITICAL: For groupPricingTiers, check if it exists (even if empty string)
              // Empty string is valid - it means "no custom pricing, use main tour pricing"
              if (field === 'groupPricingTiers') {
                if (opt[field] !== undefined && opt[field] !== null) {
                  if (typeof opt[field] === 'string') {
                    cleanOpt[field] = opt[field]; // Already stringified
                  } else if (Array.isArray(opt[field])) {
                    cleanOpt[field] = JSON.stringify(opt[field]);
                  } else {
                    cleanOpt[field] = JSON.stringify(opt[field]);
                  }
                  console.log(`✅ Option ${index + 1} groupPricingTiers included in cleanOpt`);
                } else {
                  console.log(`ℹ️ Option ${index + 1} has no groupPricingTiers (will use main tour pricing)`);
                }
              } else if (field in opt && opt[field] !== undefined && opt[field] !== null) {
                cleanOpt[field] = opt[field];
              }
            });
            
            // CRITICAL: Ensure option price uses first tier (1 person) price from groupPricingTiers
            if (opt.groupPricingTiers) {
              try {
                const tiers = typeof opt.groupPricingTiers === 'string' 
                  ? JSON.parse(opt.groupPricingTiers) 
                  : opt.groupPricingTiers;
                if (Array.isArray(tiers) && tiers.length > 0 && tiers[0] && tiers[0].price) {
                  const firstTierPrice = parseFloat(tiers[0].price);
                  if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
                    cleanOpt.price = firstTierPrice; // Override with first tier price
                    console.log(`✅ Option ${index + 1} price set from first tier: ${firstTierPrice}`);
                  }
                }
              } catch (e) {
                console.warn(`⚠️ Failed to parse groupPricingTiers for option ${index + 1}:`, e.message);
              }
            }
            
            // Remove any ID fields and invalid fields
            delete cleanOpt.id;
            delete cleanOpt.tourId;
            delete cleanOpt.pricingType;
            delete cleanOpt.pricing_type;
            delete cleanOpt.maxGroupSize;
            delete cleanOpt.max_group_size;
            delete cleanOpt.groupPrice;
            delete cleanOpt.group_price;
            return cleanOpt;
          });
          
          // CRITICAL: Log options before saving
          console.log(`📤 About to create ${optionsToCreate.length} options:`);
          optionsToCreate.forEach((opt, idx) => {
            console.log(`   Option ${idx + 1} (${opt.optionTitle}):`, {
              hasGroupPricingTiers: !!opt.groupPricingTiers,
              groupPricingTiersType: typeof opt.groupPricingTiers,
              preview: opt.groupPricingTiers ? opt.groupPricingTiers.substring(0, 100) : 'null'
            });
          });
          
          // Use createMany for better performance (batch insert)
          const createStartTime = Date.now();
          await prisma.tourOption.createMany({
            data: optionsToCreate.map(opt => ({
              ...opt,
              tourId: tourId
            }))
          });
          console.log(`   ✅ Created ${optionsToCreate.length} options (took ${Date.now() - createStartTime}ms)`);
          
          // CRITICAL: Verify what was actually saved
          const savedOptions = await prisma.tourOption.findMany({
            where: { tourId: tourId },
            select: { id: true, optionTitle: true, groupPricingTiers: true }
          });
          console.log(`   🔍 Verification - Saved options:`);
          savedOptions.forEach((opt, idx) => {
            console.log(`      Option ${idx + 1} (${opt.optionTitle}):`, {
              hasGroupPricingTiers: !!opt.groupPricingTiers,
              verification: opt.groupPricingTiers ? '✅ SAVED' : '❌ MISSING'
            });
          });
          console.log(`   ✅ Total options update time: ${Date.now() - optionsStartTime}ms`);
        }
      } catch (optionsError) {
        console.error('⚠️ Error updating tour options:', optionsError);
        console.error('   Error details:', optionsError.message);
        console.error('   Error stack:', optionsError.stack);
        // Don't fail the whole request if options update fails - log but continue
      }
    }

    // Fetch updated tour with options
    const tourWithOptions = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        options: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    // Parse JSON fields
    const formattedTour = {
      ...tourWithOptions,
      id: String(tourWithOptions.id),
      locations: JSON.parse(tourWithOptions.locations || '[]'),
      images: JSON.parse(tourWithOptions.images || '[]'),
      languages: JSON.parse(tourWithOptions.languages || '[]'),
      highlights: tourWithOptions.highlights ? JSON.parse(tourWithOptions.highlights || '[]') : [],
      tourTypes: tourWithOptions.tourTypes ? JSON.parse(tourWithOptions.tourTypes || '[]') : [],
      options: tourWithOptions.options || []
    };

    const totalUpdateTime = Date.now() - updateStartTime;
    console.log(`✅ Tour updated successfully: ${tourId} (took ${totalUpdateTime}ms)`);

    res.json({
      success: true,
      message: 'Tour updated successfully',
      tour: formattedTour
    });
  } catch (error) {
    console.error('Tour update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update tour'
    });
  }
});

// Delete tour (only if draft)
app.delete('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    // Check if tour exists and is in draft status
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    if (existingTour.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete tour',
        message: 'Only draft tours can be deleted'
      });
    }

    await prisma.tour.delete({
      where: { id: tourId }
    });

    console.log('✅ Tour deleted successfully:', tourId);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Tour delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete tour'
    });
  }
});

// ==================== ADMIN AUTHENTICATION MIDDLEWARE ====================

// Middleware to verify admin authentication (simple check via header)
const verifyAdmin = (req, res, next) => {
  // In a real app, you'd verify JWT token here
  // For now, we'll check if admin session exists (frontend will send a header)
  const adminHeader = req.headers['x-admin-auth'];
  
  if (adminHeader === 'authenticated') {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Admin authentication required'
    });
  }
};

// Delete tour (admin - can delete any status)
app.delete('/api/admin/tours/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    await prisma.tour.delete({
      where: { id: tourId }
    });

    console.log('✅ Tour deleted successfully (admin):', tourId);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Tour delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete tour'
    });
  }
});

// ==================== ADMIN AUTHENTICATION ====================

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: (process.env.ADMIN_USERNAME || 'admin').trim(),
  password: (process.env.ADMIN_PASSWORD || 'admin123').trim() // Change this in production!
};

// Log admin credentials status (without exposing password)
console.log('🔐 Admin credentials loaded:', {
  username: ADMIN_CREDENTIALS.username,
  passwordSet: !!process.env.ADMIN_PASSWORD,
  passwordLength: ADMIN_CREDENTIALS.password.length
});

// Rate limiting disabled - no IP locking
const rateLimitAdminLogin = (req, res, next) => {
  next(); // No rate limiting
};

// Admin login endpoint
app.post('/api/admin/login', rateLimitAdminLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required'
      });
    }

    // Normalize inputs (trim whitespace)
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    
    // Debug logging (don't log actual password, just length)
    console.log('🔐 Admin login attempt:');
    console.log('   Username received:', normalizedUsername);
    console.log('   Password length:', normalizedPassword.length);
    console.log('   Expected username:', ADMIN_CREDENTIALS.username);
    console.log('   Expected password length:', ADMIN_CREDENTIALS.password.length);
    console.log('   Username match:', normalizedUsername === ADMIN_CREDENTIALS.username);
    console.log('   Password match:', normalizedPassword === ADMIN_CREDENTIALS.password);
    
    // Simple authentication (in production, use JWT tokens and bcrypt)
    if (normalizedUsername === ADMIN_CREDENTIALS.username && normalizedPassword === ADMIN_CREDENTIALS.password) {
      console.log('✅ Admin login successful:', username, 'from IP:', clientIp);
      res.json({
        success: true,
        username: username,
        message: 'Login successful'
      });
    } else {
      console.log('❌ Admin login failed:', username, 'from IP:', clientIp);
      console.log('   Reason: Username or password mismatch');
      res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process login request'
    });
  }
});

// ==================== ADMIN TOUR REVIEW ENDPOINTS ====================

// Approve tour (admin)
app.post('/api/admin/tours/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID'
      });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    // Allow approving tours that are 'pending' or 'draft'
    if (tour.status !== 'pending' && tour.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Tour cannot be approved',
        message: `Tour status is: ${tour.status}. Only pending or draft tours can be approved.`
      });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        status: 'approved',
        approvedAt: new Date()
      },
      include: {
        supplier: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Regenerate sitemap after tour approval (non-blocking)
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      execAsync('node server/generate-sitemap.js').catch(err => {
        console.error('⚠️ Sitemap regeneration failed (non-critical):', err.message);
      });
      console.log('✅ Sitemap regeneration triggered after tour approval');
    } catch (sitemapError) {
      console.error('⚠️ Sitemap regeneration setup failed (non-critical):', sitemapError.message);
    }

    // Send approval email to supplier using Resend (non-blocking)
    try {
      const supplierEmail = updatedTour.supplier.email;
      const supplierName = updatedTour.supplier.fullName || 'Supplier';
      const tourTitle = updatedTour.title;
      const tourSlug = updatedTour.slug;
      const city = updatedTour.city;
      const country = updatedTour.country;

      if (supplierEmail && supplierEmail.includes('@')) {
        console.log(`📧 Tour approved - Sending approval email to supplier via Resend:`);
        console.log(`   Supplier: ${supplierName}`);
        console.log(`   Email: ${supplierEmail}`);
        console.log(`   Tour: ${tourTitle}`);
        console.log(`   Location: ${city}, ${country}`);
        
        // Send email using Resend (will use Resend SDK if RESEND_API_KEY is configured)
        sendTourApprovalEmail(
          supplierEmail,
          supplierName,
          tourTitle,
          tourSlug,
          city,
          country
        ).then(result => {
          console.log(`✅ Tour approval email sent successfully via Resend`);
          console.log(`   Message ID: ${result.messageId}`);
        }).catch(err => {
          console.error('⚠️ Failed to send tour approval email (non-critical):', err.message);
          console.error('   Error details:', err);
        });
      } else {
        console.warn(`⚠️ Invalid supplier email, skipping approval email: ${supplierEmail}`);
      }
    } catch (emailError) {
      console.error('⚠️ Tour approval email setup failed (non-critical):', emailError.message);
    }

    // Parse JSON fields
    const formattedTour = {
      ...updatedTour,
      id: String(updatedTour.id),
      locations: JSON.parse(updatedTour.locations || '[]'),
      images: JSON.parse(updatedTour.images || '[]'),
      languages: JSON.parse(updatedTour.languages || '[]'),
      highlights: updatedTour.highlights ? JSON.parse(updatedTour.highlights || '[]') : []
    };

    console.log(`✅ Tour ${tourId} approved by admin`);

    res.json({
      success: true,
      message: 'Tour approved successfully',
      tour: formattedTour
    });
  } catch (error) {
    console.error('Tour approval error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to approve tour'
    });
  }
});

// Reject tour (admin)
app.post('/api/admin/tours/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID'
      });
    }

    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    if (tour.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Tour is not pending review',
        message: `Tour status is: ${tour.status}. Only pending tours can be rejected.`
      });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        status: 'rejected',
        rejectionReason: rejectionReason.trim()
      },
      include: {
        supplier: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Send rejection email to supplier using Resend (non-blocking)
    try {
      const supplierEmail = updatedTour.supplier.email;
      const supplierName = updatedTour.supplier.fullName || 'Supplier';
      const tourTitle = updatedTour.title;
      const city = updatedTour.city;
      const country = updatedTour.country;

      if (supplierEmail && supplierEmail.includes('@')) {
        console.log(`📧 Tour rejected - Sending rejection email to supplier via Resend:`);
        console.log(`   Supplier: ${supplierName}`);
        console.log(`   Email: ${supplierEmail}`);
        console.log(`   Tour: ${tourTitle}`);
        console.log(`   Location: ${city}, ${country}`);
        console.log(`   Rejection Reason: ${rejectionReason.trim()}`);
        
        // Send email using Resend (will use Resend SDK if RESEND_API_KEY is configured)
        sendTourRejectionEmail(
          supplierEmail,
          supplierName,
          tourTitle,
          rejectionReason.trim(),
          city,
          country
        ).then(result => {
          console.log(`✅ Tour rejection email sent successfully via Resend`);
          console.log(`   Message ID: ${result.messageId}`);
        }).catch(err => {
          console.error('⚠️ Failed to send tour rejection email (non-critical):', err.message);
          console.error('   Error details:', err);
        });
      } else {
        console.warn(`⚠️ Invalid supplier email, skipping rejection email: ${supplierEmail}`);
      }
    } catch (emailError) {
      console.error('⚠️ Tour rejection email setup failed (non-critical):', emailError.message);
    }

    // Parse JSON fields
    const formattedTour = {
      ...updatedTour,
      id: String(updatedTour.id),
      locations: JSON.parse(updatedTour.locations || '[]'),
      images: JSON.parse(updatedTour.images || '[]'),
      languages: JSON.parse(updatedTour.languages || '[]'),
      highlights: updatedTour.highlights ? JSON.parse(updatedTour.highlights || '[]') : []
    };

    console.log(`❌ Tour ${tourId} rejected by admin`);

    res.json({
      success: true,
      message: 'Tour rejected successfully',
      tour: formattedTour
    });
  } catch (error) {
    console.error('Tour rejection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to reject tour'
    });
  }
});

// Get all tours (admin) - can filter by status
// NOTE: Drafts are NEVER shown to admins - only suppliers can see their own drafts
app.get('/api/admin/tours', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    // If filtering by specific status (and it's not 'all'), use that status
    // But NEVER allow 'draft' status - admins should never see drafts
    if (status && status !== 'all' && status !== 'draft') {
      where.status = status;
    } else {
      // For 'all' or no status specified, show all tours EXCEPT drafts
      where.status = { not: 'draft' };
    }
    
    console.log('📋 Fetching tours for admin dashboard');
    console.log('   Filter status:', status || 'all');
    console.log('   Where clause:', JSON.stringify(where));
    console.log('   ⚠️ Drafts are excluded - only suppliers can see their own drafts');
    
    let tours;
    try {
      console.log('   🔍 Executing Prisma query...');
      tours = await prisma.tour.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              fullName: true,
              companyName: true,
              email: true,
              phone: true,
              whatsapp: true,
              emailVerified: true,
              verificationDocumentUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (dbError) {
      console.error('❌ Database error fetching tours:', dbError);
      // If error is about missing column, try without tourTypes
      if (dbError.message?.includes('tour_types') || dbError.message?.includes('tourTypes')) {
        console.log('⚠️  tourTypes column might not exist, trying query without it...');
        // The query should still work - Prisma handles missing columns gracefully
        // But let's log the error and return empty array
        return res.json({
          success: true,
          tours: [],
          count: 0,
          error: 'Database schema mismatch - please run migrations'
        });
      }
      throw dbError;
    }

    console.log(`   ✅ Query successful - found ${tours?.length || 0} tours`);
    if (tours && tours.length > 0) {
      console.log(`   📊 Sample tour IDs:`, tours.slice(0, 5).map(t => t.id));
      console.log(`   📊 Sample tour statuses:`, tours.slice(0, 5).map(t => t.status));
    } else {
      console.log(`   ⚠️  No tours found with filter:`, JSON.stringify(where));
    }

    // Parse JSON fields with safe error handling
    const formattedTours = tours.map(tour => {
      try {
        // Safely parse tourTypes - handle if column doesn't exist
        let tourTypes = [];
        if (tour.tourTypes !== undefined && tour.tourTypes !== null) {
          if (typeof tour.tourTypes === 'string') {
            try {
              tourTypes = JSON.parse(tour.tourTypes);
            } catch (e) {
              console.warn(`Failed to parse tourTypes for tour ${tour.id}:`, e.message);
              tourTypes = [];
            }
          } else if (Array.isArray(tour.tourTypes)) {
            tourTypes = tour.tourTypes;
          }
        }
        
        return {
          ...tour,
          id: String(tour.id),
          locations: JSON.parse(tour.locations || '[]'),
          images: JSON.parse(tour.images || '[]'),
          languages: JSON.parse(tour.languages || '[]'),
          highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
          tourTypes: tourTypes,
          supplier: {
            ...tour.supplier,
            id: String(tour.supplier.id)
          }
        };
      } catch (parseError) {
        console.error(`Error formatting tour ${tour.id}:`, parseError);
        console.error(`   Parse error details:`, parseError.message);
        // Return tour with safe defaults - still return it so admin can see it
        return {
          ...tour,
          id: String(tour.id),
          locations: [],
          images: [],
          languages: ['English'],
          highlights: [],
          tourTypes: [],
          supplier: tour.supplier ? {
            ...tour.supplier,
            id: String(tour.supplier.id)
          } : null
        };
      }
    });

    res.json({
      success: true,
      tours: formattedTours,
      count: formattedTours.length
    });
  } catch (error) {
    console.error('Get admin tours error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tours'
    });
  }
});

// Regenerate sitemap (admin endpoint)
app.post('/api/admin/sitemap/regenerate', verifyAdmin, async (req, res) => {
  try {
    console.log('🔄 Admin requested sitemap regeneration');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    // Run sitemap generation script
    const { stdout, stderr } = await execAsync('node server/generate-sitemap.js');
    
    console.log('✅ Sitemap regenerated successfully');
    console.log('   Output:', stdout);
    if (stderr) {
      console.warn('   Warnings:', stderr);
    }
    
    res.json({
      success: true,
      message: 'Sitemap regenerated successfully',
      output: stdout
    });
  } catch (error) {
    console.error('❌ Sitemap regeneration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate sitemap',
      message: error.message
    });
  }
});

// Get all pending tours (admin) - for backward compatibility
app.get('/api/admin/tours/pending', verifyAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching PENDING tours for admin dashboard');
    // Get only pending tours (submitted for review) - drafts are not visible to admins
    let tours;
    try {
      tours = await prisma.tour.findMany({
        where: {
          status: 'pending'
        },
        include: {
          supplier: {
            select: {
              id: true,
              fullName: true,
              companyName: true,
              email: true,
              phone: true,
              whatsapp: true,
              emailVerified: true,
              verificationDocumentUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (dbError) {
      console.error('❌ Database error fetching pending tours:', dbError);
      if (dbError.message?.includes('tour_types') || dbError.message?.includes('tourTypes')) {
        console.log('⚠️  tourTypes column might not exist, returning empty array');
        return res.json({
          success: true,
          tours: [],
          count: 0,
          error: 'Database schema mismatch - please run migrations'
        });
      }
      throw dbError;
    }
    
    console.log(`   Found ${tours.length} tours`);
    if (tours.length > 0) {
      const statusBreakdown = tours.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});
      console.log(`   Status breakdown:`, statusBreakdown);
    }

    // Parse JSON fields with safe error handling
    const formattedTours = tours.map(tour => {
      try {
        // Safely parse tourTypes - handle if column doesn't exist
        let tourTypes = [];
        if (tour.tourTypes !== undefined && tour.tourTypes !== null) {
          if (typeof tour.tourTypes === 'string') {
            try {
              tourTypes = JSON.parse(tour.tourTypes);
            } catch (e) {
              console.warn(`Failed to parse tourTypes for tour ${tour.id}:`, e.message);
              tourTypes = [];
            }
          } else if (Array.isArray(tour.tourTypes)) {
            tourTypes = tour.tourTypes;
          }
        }
        
        return {
          ...tour,
          id: String(tour.id),
          locations: JSON.parse(tour.locations || '[]'),
          images: JSON.parse(tour.images || '[]'),
          languages: JSON.parse(tour.languages || '[]'),
          highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
          tourTypes: tourTypes,
          supplier: {
            ...tour.supplier,
            id: String(tour.supplier.id)
          }
        };
      } catch (parseError) {
        console.error(`Error formatting tour ${tour.id}:`, parseError);
        console.error(`   Parse error details:`, parseError.message);
        // Return tour with safe defaults - still return it so admin can see it
        return {
          ...tour,
          id: String(tour.id),
          locations: [],
          images: [],
          languages: ['English'],
          highlights: [],
          tourTypes: [],
          supplier: tour.supplier ? {
            ...tour.supplier,
            id: String(tour.supplier.id)
          } : null
        };
      }
    });

    res.json({
      success: true,
      tours: formattedTours,
      count: formattedTours.length
    });
  } catch (error) {
    console.error('Get pending tours error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch pending tours'
    });
  }
});

// ==================== ADMIN SUPPLIER ENDPOINTS ====================

// Get all pending suppliers (admin)
app.get('/api/admin/suppliers/pending', verifyAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching suppliers for admin dashboard');
    
    // Retry logic for Render free tier database connection issues
    let suppliers = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;
    
    while (findAttempts < MAX_FIND_RETRIES && !suppliers) {
      try {
        // Get only pending suppliers (exclude rejected and approved)
        suppliers = await prisma.supplier.findMany({
          where: {
            status: 'pending'
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            businessType: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            companyName: true,
            mainHub: true,
            city: true,
            phone: true,
            whatsapp: true,
            verificationDocumentUrl: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching suppliers (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);
        
        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') || 
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }
    
    if (!suppliers) {
      throw new Error('Failed to fetch suppliers after retries');
    }
    
    console.log(`   ✅ Found ${suppliers.length} suppliers`);
    if (suppliers.length > 0) {
      const statusBreakdown = suppliers.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {});
      console.log(`   Status breakdown:`, statusBreakdown);
    }

    // Format suppliers
    const formattedSuppliers = suppliers.map(supplier => ({
      ...supplier,
      id: String(supplier.id)
    }));

    res.json({
      success: true,
      suppliers: formattedSuppliers,
      count: formattedSuppliers.length
    });
  } catch (error) {
    console.error('❌ Get pending suppliers error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch pending suppliers. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Approve supplier (admin)
app.post('/api/admin/suppliers/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Approve supplier request - ID from params: "${id}" (type: ${typeof id})`);
    
    const supplierId = parseInt(id);
    console.log(`   Parsed supplier ID: ${supplierId} (isNaN: ${isNaN(supplierId)})`);

    if (isNaN(supplierId)) {
      console.error(`   ❌ Invalid supplier ID: "${id}"`);
      return res.status(400).json({
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    // Check if supplier exists with retry logic
    let existingSupplier = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !existingSupplier) {
      try {
        existingSupplier = await prisma.supplier.findUnique({
          where: { id: supplierId }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error finding supplier (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, break and handle below
        throw dbError;
      }
    }

    if (!existingSupplier) {
      console.error(`   ❌ Supplier not found with ID: ${supplierId}`);
      return res.status(404).json({
        success: false,
        error: 'Supplier not found',
        message: 'No supplier found with the provided ID'
      });
    }

    console.log(`   ✅ Found supplier: ${existingSupplier.email} (status: ${existingSupplier.status})`);

    if (existingSupplier.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Already approved',
        message: 'This supplier is already approved'
      });
    }

    // Update supplier status to approved with retry logic
    let updatedSupplier = null;
    let updateAttempts = 0;
    const MAX_UPDATE_RETRIES = 3;

    while (updateAttempts < MAX_UPDATE_RETRIES && !updatedSupplier) {
      try {
        updatedSupplier = await prisma.supplier.update({
          where: { id: supplierId },
          data: {
            status: 'approved'
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            companyName: true,
            status: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        updateAttempts++;
        console.error(`   Database error updating supplier (attempt ${updateAttempts}/${MAX_UPDATE_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (updateAttempts < MAX_UPDATE_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${updateAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, updateAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!updatedSupplier) {
      throw new Error('Failed to update supplier after retries');
    }

    console.log(`✅ Supplier ${supplierId} (${updatedSupplier.email}) approved by admin`);

    res.json({
      success: true,
      message: 'Supplier approved successfully',
      supplier: {
        ...updatedSupplier,
        id: String(updatedSupplier.id)
      }
    });
  } catch (error) {
    console.error('❌ Supplier approval error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to approve supplier',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reject supplier (admin)
app.post('/api/admin/suppliers/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    console.log(`📝 Reject supplier request - ID from params: "${id}" (type: ${typeof id})`);
    
    const supplierId = parseInt(id);
    console.log(`   Parsed supplier ID: ${supplierId} (isNaN: ${isNaN(supplierId)})`);

    if (isNaN(supplierId)) {
      console.error(`   ❌ Invalid supplier ID: "${id}"`);
      return res.status(400).json({
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    // Check if supplier exists with retry logic
    let existingSupplier = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !existingSupplier) {
      try {
        existingSupplier = await prisma.supplier.findUnique({
          where: { id: supplierId }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error finding supplier (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, break and handle below
        throw dbError;
      }
    }

    if (!existingSupplier) {
      console.error(`   ❌ Supplier not found with ID: ${supplierId}`);
      return res.status(404).json({
        success: false,
        error: 'Supplier not found',
        message: 'No supplier found with the provided ID'
      });
    }

    console.log(`   ✅ Found supplier: ${existingSupplier.email} (status: ${existingSupplier.status})`);

    // Update supplier status to rejected with retry logic
    let updatedSupplier = null;
    let updateAttempts = 0;
    const MAX_UPDATE_RETRIES = 3;

    while (updateAttempts < MAX_UPDATE_RETRIES && !updatedSupplier) {
      try {
        updatedSupplier = await prisma.supplier.update({
          where: { id: supplierId },
          data: {
            status: 'rejected'
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            companyName: true,
            status: true
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        updateAttempts++;
        console.error(`   Database error updating supplier (attempt ${updateAttempts}/${MAX_UPDATE_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (updateAttempts < MAX_UPDATE_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${updateAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, updateAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!updatedSupplier) {
      throw new Error('Failed to update supplier after retries');
    }

    console.log(`❌ Supplier ${supplierId} (${updatedSupplier.email}) rejected by admin. Reason: ${rejectionReason || 'Not provided'}`);

    res.json({
      success: true,
      message: 'Supplier rejected successfully',
      supplier: {
        ...updatedSupplier,
        id: String(updatedSupplier.id)
      }
    });
  } catch (error) {
    console.error('❌ Supplier rejection error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to reject supplier',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Submit tour for review
app.post('/api/tours/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    // Allow submitting draft, pending, and approved tours for review
    // This allows suppliers to resubmit edited tours
    if (existingTour.status !== 'draft' && existingTour.status !== 'pending' && existingTour.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Cannot submit tour',
        message: 'Only draft, pending, or approved tours can be submitted for review'
      });
    }

    console.log(`📝 Updating tour ${tourId} status to pending...`);
    
    // Update status to pending
    const updateStartTime = Date.now();
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        status: 'pending'
      }
    });
    console.log(`   ✅ Status updated (took ${Date.now() - updateStartTime}ms)`);

    // Parse JSON fields (avoid parsing large images here to keep response fast)
    const formattedTour = {
      ...updatedTour,
      id: String(updatedTour.id),
      locations: JSON.parse(updatedTour.locations || '[]'),
      images: [], // Skip parsing base64 images on submit response
      languages: JSON.parse(updatedTour.languages || '[]'),
      highlights: updatedTour.highlights ? JSON.parse(updatedTour.highlights || '[]') : [],
      tourTypes: updatedTour.tourTypes ? JSON.parse(updatedTour.tourTypes || '[]') : []
    };

    console.log(`✅ Tour submitted for review: ${tourId}`);

    res.json({
      success: true,
      message: 'Tour submitted for review successfully',
      tour: formattedTour
    });
  } catch (error) {
    console.error('Tour submit error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to submit tour for review'
    });
  }
});

// ==================== BOOKING ENDPOINTS ====================

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { tourId, bookingDate, numberOfGuests, customerName, customerEmail, customerPhone, specialRequests, totalAmount, currency } = req.body;

    if (!tourId || !bookingDate || !numberOfGuests || !customerName || !customerEmail || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide all required booking information'
      });
    }

    // Get tour to find supplier
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(tourId) }
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'The tour you are trying to book does not exist'
      });
    }

    // Get supplier contact info
    const supplier = await prisma.supplier.findUnique({
      where: { id: tour.supplierId },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        phone: true,
        whatsapp: true
      }
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tourId: parseInt(tourId),
        supplierId: tour.supplierId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        bookingDate,
        numberOfGuests: parseInt(numberOfGuests),
        totalAmount: parseFloat(totalAmount),
        currency: currency || 'INR',
        specialRequests: specialRequests || null,
        status: 'pending',
        paymentStatus: 'pending'
      },
      include: {
        tour: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });

    console.log('✅ Booking created:', booking.id);

    // Get full tour details for notifications
    const tourDetails = await prisma.tour.findUnique({
      where: { id: parseInt(tourId) },
      select: { title: true, slug: true, city: true, country: true }
    });

    // Generate booking reference number
    const bookingReference = `ABL-${booking.id.toString().padStart(6, '0')}-${new Date().getFullYear()}`;

    // Send email notification to supplier
    if (supplier && supplier.email) {
      try {
        await sendBookingNotificationEmail(
          supplier.email,
          supplier.fullName || supplier.companyName || 'Guide',
          {
            bookingReference,
            tourTitle: tourDetails?.title || 'Tour',
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone || null,
            bookingDate: bookingDate,
            numberOfGuests: parseInt(numberOfGuests),
            totalAmount: parseFloat(totalAmount),
            currency: currency || 'INR',
            specialRequests: specialRequests || null
          }
        );
        console.log(`✅ Booking notification email sent to supplier: ${supplier.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send booking notification email:`, emailError);
        // Don't fail booking creation if email fails
      }
    }

    // Send booking confirmation email to customer with invoice
    try {
      await sendBookingConfirmationEmail(
        customerEmail,
        customerName,
        {
          bookingReference,
          bookingId: booking.id,
          tourTitle: tourDetails?.title || 'Tour',
          tourSlug: tourDetails?.slug,
          city: tourDetails?.city,
          country: tourDetails?.country,
          bookingDate: bookingDate,
          numberOfGuests: parseInt(numberOfGuests),
          totalAmount: parseFloat(totalAmount),
          currency: currency || 'INR',
          specialRequests: specialRequests || null,
          supplierName: supplier?.fullName || supplier?.companyName || 'Your Guide',
          supplierEmail: supplier?.email,
          supplierPhone: supplier?.phone,
          supplierWhatsApp: supplier?.whatsapp
        }
      );
      console.log(`✅ Booking confirmation email sent to customer: ${customerEmail}`);
    } catch (emailError) {
      console.error(`❌ Failed to send booking confirmation email:`, emailError);
      // Don't fail booking creation if email fails
    }

    // Generate WhatsApp link for guide (if WhatsApp number exists)
    let whatsappLink = null;
    if (supplier?.whatsapp) {
      const whatsappMessage = encodeURIComponent(
        `Hello! I have a new booking for ${tourDetails?.title || 'your tour'}.\n\n` +
        `Customer: ${customerName}\n` +
        `Date: ${new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
        `Guests: ${numberOfGuests}\n` +
        `Total: ${currency || 'INR'} ${totalAmount}\n` +
        `${customerPhone ? `Customer Phone: ${customerPhone}\n` : ''}` +
        `${customerEmail ? `Customer Email: ${customerEmail}` : ''}`
      );
      // Remove any non-digit characters except + for WhatsApp number
      const cleanWhatsApp = supplier.whatsapp.replace(/[^\d+]/g, '');
      whatsappLink = `https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`;
      console.log(`📱 WhatsApp link generated for guide: ${whatsappLink}`);
    }

    res.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        ...booking,
        id: String(booking.id),
        tourId: String(booking.tourId),
        supplierId: String(booking.supplierId),
        bookingReference
      },
      supplier: supplier ? {
        fullName: supplier.fullName,
        companyName: supplier.companyName,
        email: supplier.email,
        phone: supplier.phone,
        whatsapp: supplier.whatsapp,
        whatsappLink // Include WhatsApp link for easy contact
      } : null
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create booking'
    });
  }
});

// Get bookings for a supplier
app.get('/api/suppliers/:supplierId/bookings', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const supplierIdInt = parseInt(supplierId);

    if (isNaN(supplierIdInt)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        supplierId: supplierIdInt
      },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            country: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: String(booking.id),
      tourId: String(booking.tourId),
      supplierId: String(booking.supplierId),
      bookingReference: `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`
    }));

    res.json({
      success: true,
      bookings: formattedBookings
    });
  } catch (error) {
    console.error('Get supplier bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch bookings'
    });
  }
});

// Get booking confirmation/invoice
app.get('/api/bookings/:bookingId/confirmation', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingIdInt = parseInt(bookingId);

    if (isNaN(bookingIdInt)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID'
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingIdInt },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
            city: true,
            country: true
          }
        },
        supplier: {
          select: {
            fullName: true,
            companyName: true,
            email: true,
            phone: true,
            whatsapp: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const bookingReference = `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`;

    res.json({
      success: true,
      booking: {
        ...booking,
        id: String(booking.id),
        tourId: String(booking.tourId),
        supplierId: String(booking.supplierId),
        bookingReference
      }
    });
  } catch (error) {
    console.error('Get booking confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch booking confirmation'
    });
  }
});

// ==================== PAYMENT ENDPOINTS ====================

// Create Razorpay order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { bookingId, amount, currency } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Booking ID and amount are required'
      });
    }

    // For now, return mock data since Razorpay keys need to be configured
    // In production, you would use Razorpay SDK here:
    // const razorpay = require('razorpay');
    // const instance = new razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET
    // });
    // const order = await instance.orders.create({
    //   amount: amount,
    //   currency: currency || 'INR',
    //   receipt: `booking_${bookingId}`
    // });

    // Mock order for development
    const mockOrder = {
      id: `order_${Date.now()}_${bookingId}`,
      entity: 'order',
      amount: amount,
      amount_paid: 0,
      amount_due: amount,
      currency: currency || 'INR',
      receipt: `booking_${bookingId}`,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    // Update booking with order ID
    await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        razorpayOrderId: mockOrder.id
      }
    });

    res.json({
      success: true,
      order: mockOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890' // Replace with your actual key
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create payment order'
    });
  }
});

// Verify Razorpay payment
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'All payment verification fields are required'
      });
    }

    // In production, verify signature using Razorpay SDK:
    // const crypto = require('crypto');
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    // const generatedSignature = hmac.digest('hex');
    // const isValid = generatedSignature === razorpay_signature;

    // For development, accept all payments
    const isValid = true;

    if (isValid) {
      // Update booking with payment info
      const booking = await prisma.booking.update({
        where: { id: parseInt(bookingId) },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'paid',
          status: 'confirmed'
        },
        include: {
          tour: {
            select: {
              title: true,
              city: true,
              country: true
            }
          },
          supplier: {
            select: {
              fullName: true,
              companyName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      console.log('✅ Payment verified and booking confirmed:', booking.id);

      // Generate booking reference
      const bookingReference = `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`;

      // Send admin notification email
      try {
        await sendAdminPaymentNotificationEmail({
          bookingReference,
          bookingId: booking.id,
          tourTitle: booking.tour.title,
          city: booking.tour.city,
          country: booking.tour.country,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          bookingDate: booking.bookingDate,
          numberOfGuests: booking.numberOfGuests,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          supplierName: booking.supplier.fullName || booking.supplier.companyName || 'Unknown',
          supplierEmail: booking.supplier.email,
          supplierPhone: booking.supplier.phone,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        });
        console.log(`✅ Admin payment notification email sent`);
      } catch (emailError) {
        console.error(`❌ Failed to send admin payment notification email:`, emailError);
        // Don't fail payment verification if email fails
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        booking: {
          ...booking,
          id: String(booking.id),
          bookingReference
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid signature',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify payment'
    });
  }
});

// ==================== ADMIN BOOKING ENDPOINTS ====================

// Get all bookings for admin (with payment status)
app.get('/api/admin/bookings', verifyAdmin, async (req, res) => {
  try {
    const { paymentStatus, status, startDate, endDate } = req.query;

    const where = {};

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            country: true,
            category: true
          }
        },
        supplier: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            email: true,
            phone: true,
            whatsapp: true
          }
        },
        tourOption: {
          select: {
            optionTitle: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: String(booking.id),
      tourId: String(booking.tourId),
      supplierId: String(booking.supplierId),
      bookingReference: `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`
    }));

    res.json({
      success: true,
      bookings: formattedBookings,
      total: formattedBookings.length,
      paid: formattedBookings.filter(b => b.paymentStatus === 'paid').length,
      pending: formattedBookings.filter(b => b.paymentStatus === 'pending').length
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch bookings'
    });
  }
});

// ==================== PUBLIC TOUR ENDPOINTS ====================

// Diagnostic endpoint to check tours in database
// Debug endpoint (DISABLED in production for security)
app.get('/api/debug/tours', async (req, res) => {
  // SECURITY: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'This endpoint is disabled in production'
    });
  }
  try {
    const allTours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    const statusBreakdown = allTours.reduce((acc, tour) => {
      acc[tour.status] = (acc[tour.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      total: allTours.length,
      statusBreakdown,
      tours: allTours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get public tours by city (for public site)
app.get('/api/public/tours', async (req, res) => {
  const startTime = Date.now();
  console.log('📋 GET /api/public/tours - Request received');
  console.log('   Query params:', req.query);
  console.log('   Headers:', req.headers);
  console.log('   Origin:', req.headers.origin);
  
  try {
    const { city, country, category, status = 'approved' } = req.query;

    console.log('📋 Fetching public tours:', { city, country, category, status });
    console.log('   Request received at:', new Date().toISOString());

    // ALWAYS fetch only approved tours for public API (ignore status param for security)
    // Build where clause - fetch all approved tours, then filter in memory for case-insensitive matching
    const where = {
      status: 'approved' // Always use 'approved' for public API, ignore query param
    };

    // Only add category filter (exact match is fine for category)
    if (category) {
      where.category = category;
    }
    
    // Note: We'll filter city/country in memory for case-insensitive matching
    console.log('   Where clause:', JSON.stringify(where, null, 2));
    console.log('   Will filter by city/country in memory:', { city, country });
    console.log('   ⚠️  Status param ignored - always fetching approved tours only');

    // Retry logic for Render free tier database connection issues
    let tours = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !tours) {
      try {
        // OPTIMIZED: Build where clause with database-level filtering (FAST)
        const queryStartTime = Date.now();
        const where = {
          status: 'approved'
        };
        
        // Add city/country filters at database level (case-insensitive)
        if (city) {
          where.city = { equals: city, mode: 'insensitive' };
        }
        if (country) {
          where.country = { equals: country, mode: 'insensitive' };
        }
        // Add category filter at database level
        if (category) {
          where.category = category;
        }
        
        // Step 1: Fetch tours with optimized fields (NO fullDescription, NO all images)
        tours = await prisma.tour.findMany({
          where,
          select: {
            id: true,
            supplierId: true,
            title: true,
            slug: true,
            country: true,
            city: true,
            category: true,
            locations: true,
            images: true, // We'll extract only first image URL in formatting
            languages: true,
            highlights: true,
            duration: true,
            pricePerPerson: true,
            currency: true,
            shortDescription: true,
            // fullDescription: REMOVED - not needed for list view, saves huge payload
            included: true,
            notIncluded: true,
            meetingPoint: true,
            tourTypes: true,
            status: true,
            createdAt: true,
            updatedAt: true
            // Note: groupPrice and maxGroupSize don't exist on Tour model - they're on TourOption
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 50 // Limit to 50 for performance
        });
        
        const queryTime = Date.now() - queryStartTime;
        console.log(`   ✅ Fetched ${tours.length} tours in ${queryTime}ms`);
        
        // Step 2: Fetch suppliers and options in parallel (FAST)
        if (tours.length > 0) {
          const supplierIds = [...new Set(tours.map(t => t.supplierId))];
          const tourIds = tours.map(t => t.id);
          
          const [suppliers, allOptions] = await Promise.all([
            // Fetch all suppliers at once
            prisma.supplier.findMany({
              where: { id: { in: supplierIds } },
              select: {
                id: true,
                fullName: true,
                companyName: true
              }
            }).catch(() => []),
            // Fetch all options at once
            prisma.tourOption.findMany({
              where: { tourId: { in: tourIds } },
              select: {
                id: true,
                tourId: true,
                optionTitle: true,
                price: true,
                groupPricingTiers: true,
                currency: true,
                sortOrder: true
                // Note: groupPrice and maxGroupSize are commented out in schema, so not available
              },
              orderBy: { sortOrder: 'asc' },
              take: 500 // Max 500 options total
            }).catch(() => [])
          ]);
          
          // Step 3: Attach suppliers and options to tours (FAST - in memory)
          const supplierMap = new Map(suppliers.map(s => [s.id, s]));
          const optionsMap = new Map();
          
          allOptions.forEach(opt => {
            if (!optionsMap.has(opt.tourId)) {
              optionsMap.set(opt.tourId, []);
            }
            optionsMap.get(opt.tourId).push(opt);
          });
          
          tours = tours.map(tour => ({
            ...tour,
            supplier: supplierMap.get(tour.supplierId) || null,
            options: (optionsMap.get(tour.id) || []).slice(0, 5) // Max 5 options per tour
          }));
          
          console.log(`   ✅ Enriched tours with suppliers and options`);
        }
        
        console.log(`   ✅ Fetched ${tours.length} tours in ${Date.now() - queryStartTime}ms (filtered at DB level)`);
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching tours (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    // Ensure tours is always an array (never null)
    if (!tours) {
      tours = [];
      console.log(`   ⚠️  Tours query returned null, using empty array`);
    }
    
    if (!Array.isArray(tours)) {
      console.error(`   ❌ Tours is not an array! Type: ${typeof tours}, Value:`, tours);
      tours = [];
    }

    console.log(`   ✅ Final result: Found ${tours.length} tours`);
    
    // CRITICAL: If we have tours but formattedTours will be empty, log it
    if (tours.length > 0) {
      console.log(`   🔍 About to format ${tours.length} tours...`);
    }
    
    // Log tour statuses and city/country for debugging
    if (tours.length > 0) {
      const statusCounts = tours.reduce((acc, tour) => {
        acc[tour.status] = (acc[tour.status] || 0) + 1;
        return acc;
      }, {});
      console.log(`   📊 Tour status breakdown:`, statusCounts);
      console.log(`   📍 Final tours being returned:`, tours.slice(0, 5).map(t => ({ 
        id: t.id, 
        title: t.title?.substring(0, 30),
        city: t.city, 
        country: t.country, 
        status: t.status 
      })));
    } else {
      console.log(`   ⚠️  No tours found with filters:`, { city, country, category, status });
      console.log(`   🔍 This means either:`);
      console.log(`      1. No approved tours exist in database`);
      console.log(`      2. All approved tours were filtered out by city/country`);
      console.log(`      3. There's a bug in the filtering logic`);
      // Log what tours exist in database (for debugging)
      try {
        const allTours = await prisma.tour.findMany({
          where: { status: 'approved' },
          select: { id: true, title: true, status: true, city: true, country: true },
          take: 10
        });
        console.log(`   🔍 Approved tours in database (first 10):`, allTours.map(t => ({ id: t.id, title: t.title.substring(0, 40), status: t.status, city: t.city, country: t.country })));
        
        // Check if there's a case mismatch
        if (city || country) {
          const matchingTours = allTours.filter(t => {
            const cityMatch = !city || t.city?.toLowerCase() === city.toLowerCase();
            const countryMatch = !country || t.country?.toLowerCase() === country.toLowerCase();
            return cityMatch && countryMatch;
          });
          console.log(`   🔍 Case-insensitive match found ${matchingTours.length} tours`);
        }
      } catch (debugError) {
        console.error(`   ❌ Could not fetch debug tour list:`, debugError.message);
      }
    }

    // Parse JSON fields with error handling
    // Format tours - ensure ALL tours are returned even if formatting fails
    let formattedTours = tours.map(tour => {
      try {
        // Safe JSON parsing with fallbacks
        let locations = [];
        try {
          locations = JSON.parse(tour.locations || '[]');
        } catch (e) {
          console.warn(`   ⚠️  Failed to parse locations for tour ${tour.id}:`, e.message);
          locations = [];
        }

        // OPTIMIZED: Only get first image URL (not all base64 images)
        let images = [];
        try {
          const allImages = JSON.parse(tour.images || '[]');
          // Only include first image URL if it exists (saves massive payload)
          if (allImages.length > 0 && typeof allImages[0] === 'string') {
            images = [allImages[0]]; // Just first image URL
          }
        } catch (e) {
          console.warn(`   ⚠️  Failed to parse images for tour ${tour.id}:`, e.message);
          images = [];
        }

        let languages = [];
        try {
          languages = JSON.parse(tour.languages || '[]');
        } catch (e) {
          console.warn(`   ⚠️  Failed to parse languages for tour ${tour.id}:`, e.message);
          languages = ['English']; // Default fallback
        }

        let highlights = [];
        try {
          highlights = tour.highlights ? JSON.parse(tour.highlights) : [];
        } catch (e) {
          console.warn(`   ⚠️  Failed to parse highlights for tour ${tour.id}:`, e.message);
          highlights = [];
        }

        // Format options safely
        let formattedOptions = [];
        try {
          if (tour.options && Array.isArray(tour.options)) {
            formattedOptions = tour.options.map(opt => {
              try {
                if (!opt || !opt.id) return null;
                // Explicitly format option fields (exclude pricingType if it somehow exists)
                const { pricingType, pricing_type, ...cleanOpt } = opt;
                
                // Parse groupPricingTiers if it exists (stored as JSON string in DB)
                let groupPricingTiers = null;
                if (opt.groupPricingTiers) {
                  try {
                    groupPricingTiers = typeof opt.groupPricingTiers === 'string' 
                      ? JSON.parse(opt.groupPricingTiers) 
                      : opt.groupPricingTiers;
                  } catch (e) {
                    console.warn(`   ⚠️  Failed to parse groupPricingTiers for option ${opt.id}:`, e.message);
                    groupPricingTiers = null;
                  }
                }
                
                return {
                  ...cleanOpt,
                  id: String(opt.id),
                  tourId: String(opt.tourId || tour.id),
                  groupPricingTiers: groupPricingTiers
                };
              } catch (optError) {
                console.warn(`   ⚠️  Error formatting option ${opt?.id || 'unknown'} for tour ${tour.id}:`, optError.message);
                return null;
              }
            }).filter(opt => opt !== null);
          }
        } catch (optionsError) {
          console.warn(`   ⚠️  Error processing options for tour ${tour.id}:`, optionsError.message);
          formattedOptions = [];
        }

        // Build tour object - include all essential fields
        const formattedTour = {
          id: String(tour.id),
          supplierId: String(tour.supplierId),
          title: tour.title || 'Untitled Tour',
          slug: tour.slug || `tour-${tour.id}`,
          country: tour.country || '',
          city: tour.city || '',
          category: tour.category || '',
          locations,
          images,
          languages,
          highlights,
          duration: tour.duration || '',
          pricePerPerson: tour.pricePerPerson || 0,
          currency: tour.currency || 'INR',
          shortDescription: tour.shortDescription || null,
          // fullDescription: REMOVED - not needed for list view, saves huge payload
          included: tour.included || '',
          notIncluded: tour.notIncluded || null,
          meetingPoint: tour.meetingPoint || null,
          guideType: tour.guideType || null,
          tourTypes: tour.tourTypes ? (() => {
            try {
              return JSON.parse(tour.tourTypes);
            } catch (e) {
              return [];
            }
          })() : [],
          status: tour.status || 'draft',
          createdAt: tour.createdAt,
          updatedAt: tour.updatedAt,
          supplier: tour.supplier ? {
            ...tour.supplier,
            id: String(tour.supplier.id)
          } : null,
          options: formattedOptions
        };
        
        return formattedTour;
      } catch (parseError) {
        console.error(`   ❌ Error formatting tour ${tour.id}:`, parseError);
        console.error(`   Stack:`, parseError.stack);
        // Return minimal safe tour data - but still return it!
        return {
          id: String(tour.id),
          supplierId: String(tour.supplierId || ''),
          title: tour.title || 'Untitled Tour',
          slug: tour.slug || `tour-${tour.id}`,
          city: tour.city || '',
          country: tour.country || '',
          category: tour.category || '',
          locations: [],
          images: [],
          languages: ['English'],
          highlights: [],
          duration: tour.duration || '',
          pricePerPerson: tour.pricePerPerson || 0,
          currency: tour.currency || 'INR',
          fullDescription: tour.fullDescription || '',
          included: tour.included || '',
          status: tour.status || 'draft',
          supplier: null,
          options: []
        };
      }
    });
    
    // Filter out null/undefined tours but log if we're losing tours
    const beforeFilter = formattedTours.length;
    formattedTours = formattedTours.filter(tour => tour !== null && tour !== undefined);
    if (beforeFilter !== formattedTours.length) {
      console.warn(`   ⚠️  Filtered out ${beforeFilter - formattedTours.length} null/undefined tours`);
    }

    console.log(`   ✅ Formatted ${formattedTours.length} tours successfully`);
    
    // CRITICAL CHECK: If we had tours but formattedTours is empty, something went wrong
    if (tours.length > 0 && formattedTours.length === 0) {
      console.error(`   ❌ CRITICAL: Had ${tours.length} tours but formattedTours is empty!`);
      console.error(`   This means all tours failed formatting. Check errors above.`);
    }

    // Log options statistics
    const toursWithOptions = formattedTours.filter(t => t.options && t.options.length > 0).length;
    const toursWithoutOptions = formattedTours.length - toursWithOptions;
    console.log(`   📊 Tours with options: ${toursWithOptions}, without options: ${toursWithoutOptions}`);
    console.log(`   📤 Returning ${formattedTours.length} tours to frontend`);
    
    // Final safety check
    if (!Array.isArray(formattedTours)) {
      console.error(`   ❌ formattedTours is not an array! Type: ${typeof formattedTours}`);
      formattedTours = [];
    }
    console.log(`   ✅ Response will include:`, {
      success: true,
      toursCount: formattedTours?.length || 0,
      hasTours: (formattedTours?.length || 0) > 0
    });

    // Ensure we always return an array, even if empty
    const response = {
      success: true,
      tours: formattedTours || [],
      count: formattedTours?.length || 0
    };
    
    const responseTime = Date.now() - startTime;
    console.log(`   📤 Sending response with ${response.tours.length} tours (took ${responseTime}ms)`);
    res.json(response);
  } catch (error) {
    console.error('❌ Get public tours error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error stack:', error.stack);
    
    // Return empty array instead of 500 error to prevent site breakage
    res.status(200).json({
      success: true,
      tours: [],
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      message: 'Tours temporarily unavailable. Please try again in a moment.'
    });
  }
});

// Diagnostic endpoint to check tours for a city (for debugging)
app.get('/api/debug/tours/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const allTours = await prisma.tour.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' }
      },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      city,
      totalTours: allTours.length,
      tours: allTours,
      statusBreakdown: allTours.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single public tour by slug (SEO-friendly, includes supplier info)
// IMPORTANT: This route must come BEFORE /api/public/tours/:id to avoid conflicts
app.get('/api/public/tours/by-slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Missing slug',
        message: 'Tour slug is required'
      });
    }

    // Retry logic for Render free tier database connection issues
    let tour = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !tour) {
      try {
        tour = await prisma.tour.findUnique({
          where: { slug },
          include: {
            supplier: {
              select: {
                id: true,
                fullName: true,
                companyName: true,
                email: true,
                phone: true,
                whatsapp: true
              }
            },
            options: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching tour by slug (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided slug'
      });
    }

    // Only return approved tours publicly
    if (tour.status !== 'approved') {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'This tour is not available'
      });
    }

    // Use centralized helper function to ensure reviews is always null
    const formattedTour = formatTourResponse(tour);
    if (tour.supplier) {
      formattedTour.supplier = {
        ...tour.supplier,
        id: String(tour.supplier.id)
      };
    }

    // CRITICAL: Log pricing data being sent to frontend
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📤 API RESPONSE - PRICING DATA (by-slug)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Tour ID:', formattedTour.id);
    console.log('Tour Title:', formattedTour.title);
    console.log('pricePerPerson:', formattedTour.pricePerPerson);
    console.log('Options count:', formattedTour.options?.length || 0);
    
    // Check if main tour has groupPricingTiers directly (from database)
    if (tour.groupPricingTiers) {
      console.log('📊 Main tour has groupPricingTiers directly:', {
        type: typeof tour.groupPricingTiers,
        preview: typeof tour.groupPricingTiers === 'string' 
          ? tour.groupPricingTiers.substring(0, 200)
          : JSON.stringify(tour.groupPricingTiers).substring(0, 200)
      });
    } else {
      console.warn('⚠️ Main tour does NOT have groupPricingTiers directly');
    }
    
    if (formattedTour.options && Array.isArray(formattedTour.options)) {
      formattedTour.options.forEach((opt, idx) => {
        console.log(`Option ${idx + 1}:`, {
          id: opt.id,
          title: opt.optionTitle,
          sortOrder: opt.sortOrder,
          price: opt.price,
          hasGroupPricingTiers: !!opt.groupPricingTiers,
          groupPricingTiersType: typeof opt.groupPricingTiers,
          groupPricingTiersValue: opt.groupPricingTiers,
          groupPricingTiersPreview: opt.groupPricingTiers 
            ? (typeof opt.groupPricingTiers === 'string' 
              ? opt.groupPricingTiers.substring(0, 200) 
              : JSON.stringify(opt.groupPricingTiers).substring(0, 200))
            : 'null',
          allKeys: Object.keys(opt)
        });
      });
    }
    console.log('═══════════════════════════════════════════════════════════');

    res.json({
      success: true,
      tour: formattedTour
    });
  } catch (error) {
    console.error('Get public tour by slug error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tour'
    });
  }
});

// Get single public tour by ID (includes supplier info)
app.get('/api/public/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);

    if (isNaN(tourId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID',
        message: 'Tour ID must be a valid number'
      });
    }

    // Retry logic for Render free tier database connection issues
    let tour = null;
    let findAttempts = 0;
    const MAX_FIND_RETRIES = 3;

    while (findAttempts < MAX_FIND_RETRIES && !tour) {
      try {
        tour = await prisma.tour.findUnique({
          where: { id: tourId },
          include: {
            supplier: {
              select: {
                id: true,
                fullName: true,
                companyName: true,
                email: true,
                phone: true,
                whatsapp: true
              }
            },
            options: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        findAttempts++;
        console.error(`   Database error fetching tour (attempt ${findAttempts}/${MAX_FIND_RETRIES}):`, dbError.message);

        // If it's a connection error and we have retries left, wait and retry
        if (findAttempts < MAX_FIND_RETRIES && (
          dbError.message?.includes('connection') ||
          dbError.message?.includes('timeout') ||
          dbError.code === 'P1001' ||
          dbError.code === 'P1017' ||
          dbError.code === 'P1008'
        )) {
          console.log(`   Retrying in ${findAttempts * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, findAttempts * 500));
          continue;
        }
        // Not a retryable error, throw
        throw dbError;
      }
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    // Only return approved tours publicly
    if (tour.status !== 'approved') {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'This tour is not available'
      });
    }

    // Use centralized helper function to ensure reviews is always null
    const formattedTour = formatTourResponse(tour);
    if (tour.supplier) {
      formattedTour.supplier = {
        ...tour.supplier,
        id: String(tour.supplier.id)
      };
    }

    res.json({
      success: true,
      tour: formattedTour
    });
  } catch (error) {
    console.error('❌ Get public tour error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tour',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve static files from dist folder (frontend build) in production
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible paths for dist folder
  const distPaths = [
    path.join(__dirname, '../dist'),           // If running from server/, dist is in root
    path.join(process.cwd(), 'dist'),          // From current working directory
    path.join(process.cwd(), '../dist')        // From parent directory
  ];
  
  // Find the first existing dist path
  let distPath = null;
  for (const dist of distPaths) {
    try {
      const indexPath = path.join(dist, 'index.html');
      if (fs.existsSync(indexPath)) {
        distPath = dist;
        console.log(`✅ Found dist folder at: ${distPath}`);
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  if (distPath) {
    // Explicit routes for SEO files (MUST come BEFORE static middleware)
    app.get('/sitemap.xml', (req, res) => {
      // Try dist folder first, then public folder as fallback
      const distSitemapPath = path.join(distPath, 'sitemap.xml');
      const publicSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
      
      let sitemapPath = null;
      if (fs.existsSync(distSitemapPath)) {
        sitemapPath = distSitemapPath;
      } else if (fs.existsSync(publicSitemapPath)) {
        sitemapPath = publicSitemapPath;
      }
      
      if (sitemapPath) {
        try {
          // Set proper headers for sitemap (Google requires text/xml)
          res.type('text/xml');
          res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // Allow all origins for sitemap (Google needs this)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendFile(sitemapPath);
        } catch (error) {
          console.error('❌ Error serving sitemap:', error);
          res.status(500).send('Error serving sitemap');
        }
      } else {
        console.error('❌ Sitemap not found in dist or public folder');
        res.status(404).type('text/plain').send('Sitemap not found. Please generate it first.');
      }
    });
    
    app.get('/robots.txt', (req, res) => {
      const robotsPath = path.join(distPath, 'robots.txt');
      if (fs.existsSync(robotsPath)) {
        res.type('text/plain');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.sendFile(robotsPath);
      } else {
        res.status(404).send('Robots.txt not found');
      }
    });
    
    // Serve static assets (JS, CSS, images, etc.) - AFTER SEO routes
    app.use(express.static(distPath));
    
    // Handle React Router - serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      // Don't serve index.html for SEO files (already handled above)
      if (req.path === '/sitemap.xml' || req.path === '/robots.txt') {
        return next();
      }
      // Serve index.html for all other routes (SPA routing)
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          next();
        }
      });
    });
  } else {
    console.warn('⚠️  dist folder not found. Frontend will not be served.');
    console.warn('   Check that Build Command includes "npm run build"');
    console.warn('   Tried paths:', distPaths);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: PostgreSQL via Prisma ORM`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured - check .env'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend served from: ${path.join(__dirname, '../dist')}`);
  }
});
