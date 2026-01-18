import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import prisma from './db.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail, sendBookingNotificationEmail, sendBookingConfirmationEmail, sendAdminPaymentNotificationEmail } from './utils/email.js';
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
  process.env.VITE_FRONTEND_URL
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
      whatsapp
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
    const existingSupplier = await prisma.supplier.findUnique({
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

    if (existingSupplier) {
      // If email exists, allow them to continue registration
      // Generate new verification token if not verified
      let verificationToken = null;
      let verificationExpires = null;
      
      if (!existingSupplier.emailVerified) {
        verificationToken = randomBytes(32).toString('hex');
        verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours expiry
        
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
          await sendVerificationEmail(email, existingSupplier.fullName, verificationToken);
          console.log(`✅ Verification email resent to ${email}`);
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
    verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours expiry

    // Create supplier using Prisma
    const supplier = await prisma.supplier.create({
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
        verificationDocumentUrl: verificationDocumentUrl || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        emailVerified: false,
        status: 'approved' // Auto-approve suppliers
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

    // Send verification email
    console.log(`📧 Preparing to send verification email:`);
    console.log(`   To: ${email}`);
    console.log(`   Full Name: ${fullName}`);
    console.log(`   Token: ${verificationToken.substring(0, 10)}...`);
    try {
      const emailResult = await sendVerificationEmail(email, fullName, verificationToken);
      console.log(`✅ Verification email sent successfully to: ${email}`);
      console.log(`   Message ID: ${emailResult.messageId}`);
    } catch (emailError) {
      console.error(`❌ Failed to send verification email to ${email}:`);
      console.error(`   Error: ${emailError.message || emailError}`);
      console.error(`   Full error:`, emailError);
      // Don't fail registration if email fails, but log it
    }

    // Convert id to string for consistency with frontend
    const supplierResponse = {
      ...supplier,
      id: String(supplier.id)
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      supplier: supplierResponse,
      emailSent: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to register supplier. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    
    console.log('🔐 Login attempt:', normalizedEmail);
    
    // Find supplier using Prisma
    const supplier = await prisma.supplier.findUnique({
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

    if (!supplier) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const passwordMatch = await bcrypt.compare(password, supplier.passwordHash);

    if (!passwordMatch) {
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

// Verify email endpoint - MUST come before /api/suppliers/:id route
app.get('/api/suppliers/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    console.log('🔍 Email verification request received');
    console.log('   Token:', token ? `${token.substring(0, 10)}...` : 'MISSING');

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token is required',
        message: 'Please provide a valid verification token'
      });
    }

    // Find supplier by verification token (check both expired and non-expired)
    const supplier = await prisma.supplier.findFirst({
      where: {
        emailVerificationToken: token
      }
    });

    console.log('   Supplier found:', supplier ? `Yes (ID: ${supplier.id}, Verified: ${supplier.emailVerified})` : 'No');
    
    if (!supplier) {
      console.log('   ❌ No supplier found with this token');
      // Check if token might exist but expired
      const allSuppliers = await prisma.supplier.findMany({
        select: { id: true, email: true, emailVerificationToken: true }
      });
      console.log('   Total suppliers in DB:', allSuppliers.length);
      return res.status(400).json({ 
        error: 'Invalid or expired token',
        message: 'The verification link is invalid or has expired. Please request a new verification email.'
      });
    }

    // Check if token is expired
    if (supplier.emailVerificationExpires && new Date(supplier.emailVerificationExpires) < new Date()) {
      console.log('   ❌ Token expired');
      return res.status(400).json({ 
        error: 'Token expired',
        message: 'The verification link has expired. Please request a new verification email.'
      });
    }

    if (supplier.emailVerified) {
      return res.status(400).json({ 
        error: 'Email already verified',
        message: 'This email address has already been verified.'
      });
    }

    // Update supplier to mark email as verified
    const updatedSupplier = await prisma.supplier.update({
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

    // Redirect URL back to supplier page with registration open
    // Convert id to string for URL parameter
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/supplier?verified=true&supplierId=${String(updatedSupplier.id)}&openRegistration=true`;
    
    console.log(`✅ Email verified for supplier ID: ${updatedSupplier.id}`);
    console.log(`📧 Redirect URL: ${redirectUrl}`);
    
    res.json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
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
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const supplier = await prisma.supplier.findUnique({
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

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ supplier });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update supplier profile (phone, whatsapp)
app.patch('/api/suppliers/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);
    const { phone, whatsapp } = req.body;

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
        phone: phone || null,
        whatsapp: whatsapp || null
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

// Verify email endpoint
app.get('/api/suppliers/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    console.log('🔍 Email verification request received');
    console.log('   Token:', token ? `${token.substring(0, 10)}...` : 'MISSING');

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token is required',
        message: 'Please provide a valid verification token'
      });
    }

    // Find supplier by verification token (check both expired and non-expired)
    const supplier = await prisma.supplier.findFirst({
      where: {
        emailVerificationToken: token
      }
    });

    console.log('   Supplier found:', supplier ? `Yes (ID: ${supplier.id}, Verified: ${supplier.emailVerified})` : 'No');
    
    if (!supplier) {
      console.log('   ❌ No supplier found with this token');
      // Check if token might exist but expired
      const allSuppliers = await prisma.supplier.findMany({
        select: { id: true, email: true, emailVerificationToken: true }
      });
      console.log('   Total suppliers in DB:', allSuppliers.length);
      return res.status(400).json({ 
        error: 'Invalid or expired token',
        message: 'The verification link is invalid or has expired. Please request a new verification email.'
      });
    }

    // Check if token is expired
    if (supplier.emailVerificationExpires && new Date(supplier.emailVerificationExpires) < new Date()) {
      console.log('   ❌ Token expired');
      return res.status(400).json({ 
        error: 'Token expired',
        message: 'The verification link has expired. Please request a new verification email.'
      });
    }

    if (supplier.emailVerified) {
      return res.status(400).json({ 
        error: 'Email already verified',
        message: 'This email address has already been verified.'
      });
    }

    // Update supplier to mark email as verified
    const updatedSupplier = await prisma.supplier.update({
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

    // Redirect URL back to supplier page with registration open
    // Convert id to string for URL parameter
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/supplier?verified=true&supplierId=${String(updatedSupplier.id)}&openRegistration=true`;
    
    console.log(`✅ Email verified for supplier ID: ${updatedSupplier.id}`);
    console.log(`📧 Redirect URL: ${redirectUrl}`);
    
    res.json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
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
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Update supplier with new token
    await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(supplier.email, supplier.fullName, verificationToken);
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

    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
      });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        status: true
      }
    });

    if (!supplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found',
        message: 'No supplier found with the provided ID'
      });
    }

    res.json({
      success: true,
      emailVerified: supplier.emailVerified,
      status: supplier.status
    });
  } catch (error) {
    console.error('Verification status check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to check verification status'
    });
  }
});

// Update supplier document
app.patch('/api/suppliers/:id/update-document', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);
    const { verificationDocumentUrl } = req.body;

    console.log('📄 Document upload request received');
    console.log('   Supplier ID:', supplierId);
    console.log('   Document URL length:', verificationDocumentUrl ? verificationDocumentUrl.length : 0);

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

    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        verificationDocumentUrl
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        status: true
      }
    });

    console.log('✅ Document uploaded successfully for supplier:', supplier.id);

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
  return {
    ...tour,
    id: String(tour.id),
    locations: parsedData.locations || JSON.parse(tour.locations || '[]'),
    images: parsedData.images || JSON.parse(tour.images || '[]'),
    languages: parsedData.languages || JSON.parse(tour.languages || '[]'),
    highlights: parsedData.highlights || (tour.highlights ? JSON.parse(tour.highlights || '[]') : []),
    reviews: null, // Always null - reviews are not generated
    options: tour.options && Array.isArray(tour.options) ? tour.options.map(opt => ({
      ...opt,
      id: String(opt.id),
      tourId: String(opt.tourId)
    })) : []
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

// Create a new tour
app.post('/api/tours', async (req, res) => {
  try {
    console.log('📥 Received tour creation request');
    console.log('📦 Request body keys:', Object.keys(req.body));
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      supplierId,
      title,
      country,
      city,
      category,
      locations,
      duration,
      pricePerPerson,
      currency,
      shortDescription,
      fullDescription,
      included,
      notIncluded,
      meetingPoint,
      guideType,
      images,
      languages,
      highlights
    } = req.body;

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

    try {
      locationsArray = typeof locations === 'string' ? JSON.parse(locations) : (Array.isArray(locations) ? locations : []);
      imagesArray = typeof images === 'string' ? JSON.parse(images) : (Array.isArray(images) ? images : []);
      languagesArray = typeof languages === 'string' ? JSON.parse(languages) : (Array.isArray(languages) ? languages : []);
      highlightsArray = highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : (Array.isArray(highlights) ? highlights : [])) : [];
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format',
        message: 'locations, images, and languages must be valid JSON arrays',
        details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      });
    }

    // Validate images (minimum 4)
    console.log('🖼️ Images validation:');
    console.log('  imagesArray type:', typeof imagesArray);
    console.log('  imagesArray is array:', Array.isArray(imagesArray));
    console.log('  imagesArray length:', imagesArray?.length);
    
    if (!Array.isArray(imagesArray) || imagesArray.length < 4) {
      console.log('❌ Insufficient images:', imagesArray?.length || 0, 'provided, need at least 4');
      return res.status(400).json({
        success: false,
        error: 'Insufficient images',
        message: `At least 4 images are required. You provided ${imagesArray?.length || 0} images.`
      });
    }
    
    console.log('✅ All validations passed, creating tour...');

    // ==================== OPTION 2: SMART KEYWORD EXTRACTION ====================
    // Rule: Every slug must answer: WHAT place? + WHAT type of experience?
    // Format: {primary-attraction}-{tour-type}
    
    // Helper: Convert text to URL-friendly slug
    const slugify = (text) => {
      if (!text) return '';
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Extract tour type from title + category
    const extractTourType = (title, category) => {
      const titleLower = title.toLowerCase();
      
      // Specific tour types (check title first for most specific match)
      if (titleLower.includes('sunrise')) return 'sunrise-tour';
      if (titleLower.includes('sunset')) return 'sunset-tour';
      if (titleLower.includes('food') || titleLower.includes('culinary')) return 'food-tour';
      if (titleLower.includes('heritage') || titleLower.includes('heritage walk')) return 'heritage-walk';
      if (titleLower.includes('walking') || titleLower.includes('walk')) return 'walking-tour';
      if (titleLower.includes('photography') || titleLower.includes('photo')) return 'photography-tour';
      if (titleLower.includes('private')) return 'private-tour';
      if (titleLower.includes('group')) return 'group-tour';
      if (titleLower.includes('entry') || titleLower.includes('ticket') || titleLower.includes('admission')) return 'entry-ticket';
      if (titleLower.includes('day trip') || titleLower.includes('day-trip')) return 'day-trip';
      if (titleLower.includes('multi-day') || titleLower.includes('multi day')) return 'multi-day-tour';
      if (titleLower.includes('cultural') || titleLower.includes('culture')) return 'cultural-tour';
      if (titleLower.includes('shopping') || titleLower.includes('market')) return 'shopping-tour';
      if (titleLower.includes('night') || titleLower.includes('evening')) return 'night-tour';
      if (titleLower.includes('bike') || titleLower.includes('cycling')) return 'bike-tour';
      if (titleLower.includes('boat') || titleLower.includes('cruise')) return 'boat-tour';
      
      // Default based on category
      if (category === 'Guided Tour') return 'guided-tour';
      if (category === 'Entry Ticket') return 'entry-ticket';
      if (category === 'Mini Tour') return 'mini-tour';
      
      // Fallback
      return 'tour';
    };

    // Extract primary location from locations array (SEO-optimized)
    const extractPrimaryLocation = (locationsArray, city) => {
      // Use first location if available (most important attraction)
      if (Array.isArray(locationsArray) && locationsArray.length > 0) {
        // Prioritize well-known attractions for SEO
        const wellKnownAttractions = [
          'taj mahal', 'amber fort', 'city palace', 'hawa mahal', 
          'red fort', 'india gate', 'jama masjid', 'qutb minar',
          'jantar mantar', 'jal mahal', 'nahargarh fort'
        ];
        
        const firstLocation = locationsArray[0].toLowerCase();
        // If first location is a well-known attraction, use it
        if (wellKnownAttractions.some(attr => firstLocation.includes(attr))) {
          return locationsArray[0];
        }
        
        // Otherwise, use first location (supplier's priority)
        return locationsArray[0];
      }
      // Fallback to city name
      return city;
    };

    // Generate SEO-optimized slug: {primary-attraction}-{tour-type}
    const primaryLocation = extractPrimaryLocation(locationsArray, city);
    const tourType = extractTourType(title, category);
    
    let locationSlug = slugify(primaryLocation);
    const typeSlug = tourType; // Already in slug format
    const citySlug = slugify(city);
    
    // SEO Enhancement: Ensure location slug includes important keywords
    // If location is too generic, try to extract from title
    if (locationSlug.length < 5 || locationSlug === citySlug) {
      // Try to find location keywords in title
      const locationKeywords = ['taj', 'mahal', 'fort', 'palace', 'gate', 'temple', 'museum', 'bazaar', 'market', 'bagh', 'garden'];
      const titleLower = title.toLowerCase();
      const foundKeyword = locationKeywords.find(kw => titleLower.includes(kw));
      if (foundKeyword && !locationSlug.includes(foundKeyword)) {
        // Prepend keyword to location slug for better SEO
        const enhancedLocation = `${foundKeyword}-${locationSlug}`;
        if (enhancedLocation.length < 30) { // Don't make it too long
          locationSlug = slugify(enhancedLocation);
        }
      }
    }
    
    // Extract additional keywords from title for uniqueness (SEO-optimized)
    const extractKeywords = (text) => {
      const stopWords = ['the', 'and', 'for', 'with', 'from', 'to', 'of', 'a', 'an', 'in', 'on', 'at', 'by', 'tour', 'tours', 'ticket', 'tickets', 'guide', 'guided', 'private', 'group', 'skip', 'line', 'book', 'booking'];
      
      // SEO-important keywords that should be prioritized
      const seoKeywords = ['sunrise', 'sunset', 'heritage', 'cultural', 'food', 'walking', 'photography', 'full-day', 'half-day', 'express', 'premium', 'deluxe'];
      
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove special chars
        .split(/\s+/)
        .filter(word => {
          const cleanWord = word.replace(/[^\w]/g, '');
          return cleanWord.length > 3 && // Only words longer than 3 chars
            !stopWords.includes(cleanWord) &&
            cleanWord !== locationSlug.toLowerCase() && // Don't repeat location
            cleanWord !== citySlug.toLowerCase(); // Don't repeat city
        })
        .sort((a, b) => {
          // Prioritize SEO keywords
          const aIsSEO = seoKeywords.some(kw => a.includes(kw));
          const bIsSEO = seoKeywords.some(kw => b.includes(kw));
          if (aIsSEO && !bIsSEO) return -1;
          if (!aIsSEO && bIsSEO) return 1;
          return 0;
        })
        .slice(0, 6); // Take up to 6 meaningful words
      return words;
    };
    
    const titleKeywords = extractKeywords(title);
    
    // Combine: primary-attraction + tour-type
    // SEO Enhancement: Include city if it adds value (for multi-city attractions)
    let baseSlug = `${locationSlug}-${typeSlug}`;
    
    // If location is generic or same as city, consider adding city for SEO
    // But only if it doesn't make slug too long (keep under 50 chars for base)
    const isGenericLocation = locationSlug === citySlug || locationSlug.length < 5;
    if (isGenericLocation && citySlug && citySlug !== locationSlug && baseSlug.length < 45) {
      // City adds SEO value for generic locations
      baseSlug = `${citySlug}-${locationSlug}-${typeSlug}`;
    }
    
    // SEO: Ensure base slug is descriptive and keyword-rich
    // If base slug is too short or generic, try to enhance it
    if (baseSlug.length < 15 && titleKeywords.length > 0) {
      const firstKeyword = slugify(titleKeywords[0]);
      if (firstKeyword && firstKeyword.length > 3) {
        baseSlug = `${locationSlug}-${firstKeyword}-${typeSlug}`;
      }
    }
    
    // Ensure slug is unique (try different word combinations before using counter)
    let slug = baseSlug;
    let attempt = 0;
    const maxAttempts = 30;
    
    while (attempt < maxAttempts) {
      const existingTour = await prisma.tour.findUnique({
        where: { slug }
      });
      if (!existingTour) break;
      
      attempt++;
      
      // Strategy 1: Try adding keywords from title one by one
      if (attempt <= titleKeywords.length) {
        const keyword = slugify(titleKeywords[attempt - 1]);
        if (keyword && keyword !== locationSlug && keyword.length > 0) {
          slug = `${locationSlug}-${keyword}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 2: Try using city name if different from location
      if (attempt === titleKeywords.length + 1 && citySlug && citySlug !== locationSlug) {
        slug = `${citySlug}-${typeSlug}`;
        continue;
      }
      
      // Strategy 3: Try keyword + city combination
      if (attempt === titleKeywords.length + 2 && titleKeywords.length > 0 && citySlug && citySlug !== locationSlug) {
        const keyword = slugify(titleKeywords[0]);
        if (keyword && keyword !== locationSlug) {
          slug = `${keyword}-${citySlug}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 4: Try different keyword combinations (skip location, use other keywords)
      if (attempt > titleKeywords.length + 2 && titleKeywords.length >= 2) {
        const keywordIndex = (attempt - titleKeywords.length - 3) % titleKeywords.length;
        const keyword = slugify(titleKeywords[keywordIndex]);
        if (keyword && keyword !== locationSlug && keyword.length > 0) {
          slug = `${keyword}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 5: Try combining multiple keywords
      if (attempt > titleKeywords.length + 2 && titleKeywords.length >= 2) {
        const keyword1 = slugify(titleKeywords[0]);
        const keyword2 = slugify(titleKeywords[1]);
        if (keyword1 && keyword2 && keyword1 !== locationSlug && keyword2 !== locationSlug) {
          slug = `${locationSlug}-${keyword1}-${keyword2}-${typeSlug}`;
          continue;
        }
      }
      
      // Strategy 6: Try location + city + type
      if (attempt > titleKeywords.length + 3 && citySlug && citySlug !== locationSlug) {
        slug = `${locationSlug}-${citySlug}-${typeSlug}`;
        continue;
      }
      
      // Strategy 7: Use timestamp hash (last resort - no numbers)
      if (attempt >= maxAttempts - 1) {
        // Generate a short hash from timestamp (last 6 chars)
        const timestampHash = Date.now().toString(36).slice(-6);
        slug = `${locationSlug}-${typeSlug}-${timestampHash}`;
        continue;
      }
      
      // Strategy 8: Final fallback - use full timestamp hash
      const timestampHash = Date.now().toString(36);
      slug = `${locationSlug}-${typeSlug}-${timestampHash}`;
    }
    
    // Final safety check - use descriptive suffix instead of timestamp hash
    if (attempt >= maxAttempts) {
      // Use descriptive suffixes instead of timestamp hash for better SEO
      const suffixes = ['premium', 'express', 'classic', 'deluxe', 'standard', 'vip'];
      const suffixIndex = attempt % suffixes.length;
      slug = `${locationSlug}-${typeSlug}-${suffixes[suffixIndex]}`;
      
      // If still not unique after all suffixes, use supplier ID (short)
      const existingWithSuffix = await prisma.tour.findUnique({ where: { slug } });
      if (existingWithSuffix) {
        const supplierSlug = slugify(supplierId.toString()).substring(0, 4);
        slug = `${locationSlug}-${typeSlug}-${supplierSlug}`;
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

    // Upload images to Cloudinary (if Cloudinary is configured)
    let imageUrls = imagesArray;
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        console.log('☁️  Uploading images to Cloudinary...');
        // Check if images are base64 (data URLs) or already URLs
        const needsUpload = imagesArray.some(img => img.startsWith('data:image'));
        
        if (needsUpload) {
          // Upload base64 images to Cloudinary
          const folder = `tours/${city.toLowerCase().replace(/\s+/g, '-')}`;
          imageUrls = await uploadMultipleImages(imagesArray, folder);
          console.log(`✅ Uploaded ${imageUrls.length} images to Cloudinary`);
        } else {
          // Images are already URLs (from Cloudinary or other sources)
          console.log('ℹ️  Images are already URLs, skipping Cloudinary upload');
          imageUrls = imagesArray;
        }
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary upload error:', cloudinaryError);
        // Fallback: use base64 images if Cloudinary fails (for development)
        if (process.env.NODE_ENV === 'production') {
          return res.status(500).json({
            success: false,
            error: 'Image upload failed',
            message: 'Failed to upload images. Please try again.'
          });
        }
        console.warn('⚠️  Using base64 images as fallback (development mode)');
        imageUrls = imagesArray;
      }
    } else {
      console.log('ℹ️  Cloudinary not configured, using base64 images (development mode)');
    }

    // Parse tour options if provided (accept both 'options' and 'tourOptions' field names)
    const tourOptions = req.body.options || req.body.tourOptions || [];
    
    console.log('📦 Tour options received:', {
      hasOptions: !!req.body.options,
      hasTourOptions: !!req.body.tourOptions,
      optionsCount: tourOptions.length,
      options: tourOptions
    });
    
    // Create tour data object - NEVER include 'id' as it's auto-generated
    // Remove any id field that might have been sent from frontend
    const { id, ...cleanBody } = req.body;
    if (id) {
      console.warn('⚠️  Frontend sent an id field, ignoring it (id is auto-generated)');
    }
    
    const tourData = {
      supplierId: parseInt(supplierId),
      title,
      slug,
      country,
      city,
      category,
      locations: JSON.stringify(locationsArray),
      duration: duration || 'Flexible',
      pricePerPerson: parseFloat(pricePerPerson),
      currency: currency || 'INR',
      shortDescription: shortDescription || null,
      fullDescription,
      highlights: highlightsArray && highlightsArray.length > 0 ? JSON.stringify(highlightsArray) : null,
      included,
      notIncluded: notIncluded || null,
      meetingPoint: meetingPoint || null,
      guideType: guideType || null,
      images: JSON.stringify(imageUrls), // Store Cloudinary URLs instead of base64
      languages: JSON.stringify(languagesArray || ['English']),
      reviews: null,
      status: 'draft'
    };

    // Only add options if tourOptions array has items
    if (tourOptions && Array.isArray(tourOptions) && tourOptions.length > 0) {
      tourData.options = {
        create: tourOptions.map((option, index) => {
          // Remove any id field from option (id is auto-generated)
          const { id, ...cleanOption } = option;
          if (id) {
            console.warn(`⚠️  Option ${index + 1} had an id field, ignoring it`);
          }
          return {
            optionTitle: cleanOption.optionTitle || cleanOption.title || `Option ${index + 1}`,
            optionDescription: cleanOption.optionDescription || cleanOption.description || '',
            durationHours: parseFloat(cleanOption.durationHours || cleanOption.duration || duration?.replace(/[^\d.]/g, '') || 3),
            price: parseFloat(cleanOption.price || pricePerPerson),
            currency: cleanOption.currency || currency || 'INR',
            language: cleanOption.language || languagesArray?.[0] || 'English',
            pickupIncluded: cleanOption.pickupIncluded || cleanOption.pickup_included || false,
            entryTicketIncluded: cleanOption.entryTicketIncluded || cleanOption.entry_ticket_included || false,
            guideIncluded: cleanOption.guideIncluded !== undefined ? cleanOption.guideIncluded : (cleanOption.guide_included !== undefined ? cleanOption.guide_included : true),
            carIncluded: cleanOption.carIncluded || cleanOption.car_included || false,
            sortOrder: index
          };
        })
      };
    }
    
    // Create tour with options
    const tour = await prisma.tour.create({
      data: tourData,
      include: {
        options: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    console.log('✅ Tour created successfully:', tour.id);
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
    
    // Handle specific Prisma errors
    let errorMessage = 'Failed to create tour. Please check all required fields and try again.';
    let commonIssues = [];
    
    if (error.code === 'P2002') {
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
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: finalMessage,
      commonIssues: commonIssues.length > 0 ? commonIssues : undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
  try {
    const { supplierId } = req.query;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        error: 'Missing supplierId',
        message: 'Please provide supplierId as query parameter'
      });
    }

    const tours = await prisma.tour.findMany({
      where: {
        supplierId: parseInt(supplierId)
      },
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
    console.error('Get tours error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tours'
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

    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found',
        message: 'No tour found with the provided ID'
      });
    }

    // Parse JSON fields
    const formattedTour = {
      ...tour,
      id: String(tour.id),
      locations: JSON.parse(tour.locations || '[]'),
      images: JSON.parse(tour.images || '[]'),
      languages: JSON.parse(tour.languages || '[]'),
      highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : []
    };

    res.json({
      success: true,
      tour: formattedTour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tour'
    });
  }
});

// Update tour (only if draft)
app.put('/api/tours/:id', async (req, res) => {
  try {
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

    if (existingTour.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Cannot edit tour',
        message: 'Only draft tours can be edited'
      });
    }

    // Prepare update data
    const dataToUpdate = {};

    if (updateData.title) dataToUpdate.title = updateData.title;
    if (updateData.city) dataToUpdate.city = updateData.city;
    if (updateData.category) dataToUpdate.category = updateData.category;
    if (updateData.locations) dataToUpdate.locations = JSON.stringify(
      typeof updateData.locations === 'string' ? JSON.parse(updateData.locations) : updateData.locations
    );
    if (updateData.duration) dataToUpdate.duration = updateData.duration;
    if (updateData.pricePerPerson !== undefined) dataToUpdate.pricePerPerson = parseFloat(updateData.pricePerPerson);
    if (updateData.currency) dataToUpdate.currency = updateData.currency;
    if (updateData.shortDescription !== undefined) dataToUpdate.shortDescription = updateData.shortDescription;
    if (updateData.fullDescription) dataToUpdate.fullDescription = updateData.fullDescription;
    if (updateData.included) dataToUpdate.included = updateData.included;
    if (updateData.notIncluded !== undefined) dataToUpdate.notIncluded = updateData.notIncluded;
    if (updateData.meetingPoint !== undefined) dataToUpdate.meetingPoint = updateData.meetingPoint;
    if (updateData.guideType !== undefined) dataToUpdate.guideType = updateData.guideType;
    if (updateData.images) dataToUpdate.images = JSON.stringify(
      typeof updateData.images === 'string' ? JSON.parse(updateData.images) : updateData.images
    );
    if (updateData.languages) dataToUpdate.languages = JSON.stringify(
      typeof updateData.languages === 'string' ? JSON.parse(updateData.languages) : updateData.languages
    );

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: dataToUpdate
    });

    // Parse JSON fields
    const formattedTour = {
      ...updatedTour,
      id: String(updatedTour.id),
      locations: JSON.parse(updatedTour.locations || '[]'),
      images: JSON.parse(updatedTour.images || '[]'),
      languages: JSON.parse(updatedTour.languages || '[]'),
      highlights: updatedTour.highlights ? JSON.parse(updatedTour.highlights || '[]') : []
    };

    console.log('✅ Tour updated successfully:', tourId);

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
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123' // Change this in production!
};

// Rate limiting for admin login (prevent brute force attacks)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Clean up old attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(ip);
    }
  }
}, 60000); // Clean up every minute

// Rate limiting middleware for admin login
const rateLimitAdminLogin = (req, res, next) => {
  // Temporarily bypass rate limiting for development
  // TODO: Re-enable rate limiting in production
  next();
  
  /* Original rate limiting code (disabled for now)
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const attemptData = loginAttempts.get(clientIp);

  if (attemptData) {
    // Check if still locked out
    if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
      const minutesLeft = Math.ceil((attemptData.lockedUntil - now) / 60000);
      return res.status(429).json({
        error: 'Too many attempts',
        message: `Too many login attempts. Please try again in ${minutesLeft} minute(s).`
      });
    }

    // Reset if lockout expired
    if (attemptData.lockedUntil && now >= attemptData.lockedUntil) {
      loginAttempts.delete(clientIp);
    }
  }

  next();
  */
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

    // Simple authentication (in production, use JWT tokens and bcrypt)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Successful login - clear any previous attempts
      loginAttempts.delete(clientIp);
      console.log('✅ Admin login successful:', username, 'from IP:', clientIp);
      res.json({
        success: true,
        username: username,
        message: 'Login successful'
      });
    } else {
      // Failed login - track attempt
      const attemptData = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
      attemptData.count += 1;
      attemptData.lastAttempt = Date.now();

      if (attemptData.count >= MAX_ATTEMPTS) {
        attemptData.lockedUntil = Date.now() + LOCKOUT_DURATION;
        console.log('🔒 Admin login locked for IP:', clientIp, 'after', MAX_ATTEMPTS, 'failed attempts');
        loginAttempts.set(clientIp, attemptData);
        return res.status(429).json({
          error: 'Too many attempts',
          message: `Too many failed login attempts. Your IP has been temporarily locked for 15 minutes.`
        });
      }

      loginAttempts.set(clientIp, attemptData);
      console.log('❌ Admin login failed:', username, 'from IP:', clientIp, `(${attemptData.count}/${MAX_ATTEMPTS} attempts)`);
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

    if (tour.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Tour is not pending review',
        message: `Tour status is: ${tour.status}. Only pending tours can be approved.`
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

// Get all pending tours (admin)
app.get('/api/admin/tours/pending', verifyAdmin, async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
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

    // Parse JSON fields
    const formattedTours = tours.map(tour => ({
      ...tour,
      id: String(tour.id),
      locations: JSON.parse(tour.locations || '[]'),
      images: JSON.parse(tour.images || '[]'),
      languages: JSON.parse(tour.languages || '[]'),
      highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
      supplier: {
        ...tour.supplier,
        id: String(tour.supplier.id)
      }
    }));

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
    const suppliers = await prisma.supplier.findMany({
      where: {
        status: 'pending'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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
    console.error('Get pending suppliers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch pending suppliers'
    });
  }
});

// Approve supplier (admin)
app.post('/api/admin/suppliers/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
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

    if (existingSupplier.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Already approved',
        message: 'This supplier is already approved'
      });
    }

    // Update supplier status to approved
    const updatedSupplier = await prisma.supplier.update({
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

    console.log(`✅ Supplier ${supplierId} approved by admin`);

    res.json({
      success: true,
      message: 'Supplier approved successfully',
      supplier: {
        ...updatedSupplier,
        id: String(updatedSupplier.id)
      }
    });
  } catch (error) {
    console.error('Supplier approval error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to approve supplier'
    });
  }
});

// Reject supplier (admin)
app.post('/api/admin/suppliers/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid supplier ID',
        message: 'Supplier ID must be a valid number'
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

    // Update supplier status to rejected
    const updatedSupplier = await prisma.supplier.update({
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

    console.log(`❌ Supplier ${supplierId} rejected by admin. Reason: ${rejectionReason || 'Not provided'}`);

    res.json({
      success: true,
      message: 'Supplier rejected successfully',
      supplier: {
        ...updatedSupplier,
        id: String(updatedSupplier.id)
      }
    });
  } catch (error) {
    console.error('Supplier rejection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to reject supplier'
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
        error: 'Cannot submit tour',
        message: 'Only draft tours can be submitted for review'
      });
    }

    // Update status to pending
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        status: 'pending'
      }
    });

    // Parse JSON fields
    const formattedTour = {
      ...updatedTour,
      id: String(updatedTour.id),
      locations: JSON.parse(updatedTour.locations || '[]'),
      images: JSON.parse(updatedTour.images || '[]'),
      languages: JSON.parse(updatedTour.languages || '[]'),
      highlights: updatedTour.highlights ? JSON.parse(updatedTour.highlights || '[]') : []
    };

    console.log('✅ Tour submitted for review:', tourId);

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

// Get public tours by city (for public site)
app.get('/api/public/tours', async (req, res) => {
  try {
    const { city, country, category, status = 'approved' } = req.query;

    const where = {
      status: status
    };

    if (city) where.city = city;
    if (country) where.country = country;
    if (category) where.category = category;

    const tours = await prisma.tour.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            fullName: true,
            companyName: true
          }
        },
        options: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
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
      highlights: tour.highlights ? JSON.parse(tour.highlights || '[]') : [],
      supplier: {
        ...tour.supplier,
        id: String(tour.supplier.id)
      },
      options: tour.options && Array.isArray(tour.options) ? tour.options.map(opt => ({
        ...opt,
        id: String(opt.id),
        tourId: String(opt.tourId)
      })) : []
    }));

    res.json({
      success: true,
      tours: formattedTours
    });
  } catch (error) {
    console.error('Get public tours error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tours'
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

    const tour = await prisma.tour.findUnique({
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

    const tour = await prisma.tour.findUnique({
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
    console.error('Get public tour error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tour'
    });
  }
});

// Serve static files from dist folder (frontend build) in production
if (process.env.NODE_ENV === 'production') {
  import('fs').then(fs => {
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
      // Serve static assets (JS, CSS, images, etc.)
      app.use(express.static(distPath));
      
      // Handle React Router - serve index.html for all non-API routes
      app.get('*', (req, res, next) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api')) {
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
  }).catch(err => {
    console.error('Error setting up static file serving:', err);
  });
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
