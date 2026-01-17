import sqlite3 from 'sqlite3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Open SQLite database
const sqliteDbPath = join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3.Database(sqliteDbPath);

// Promisify SQLite methods
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

async function migrateData() {
  console.log('🔄 Starting migration from SQLite to PostgreSQL...\n');

  try {
    // 1. Migrate Suppliers
    console.log('📦 Migrating Suppliers...');
    const suppliers = await dbAll('SELECT * FROM suppliers');
    console.log(`   Found ${suppliers.length} suppliers`);

    for (const supplier of suppliers) {
      try {
        await prisma.supplier.create({
          data: {
            id: supplier.id,
            businessType: supplier.business_type || 'individual',
            companyEmployees: supplier.company_employees || null,
            companyActivities: supplier.company_activities || null,
            individualActivities: supplier.individual_activities || null,
            otherActivities: supplier.other_activities || null,
            fullName: supplier.full_name,
            email: supplier.email,
            passwordHash: supplier.password_hash,
            companyName: supplier.company_name || null,
            mainHub: supplier.main_hub || null,
            city: supplier.city || null,
            tourLanguages: supplier.tour_languages || null,
            phone: supplier.phone || null,
            whatsapp: supplier.whatsapp || null,
            verificationDocumentUrl: supplier.verification_document_url || null,
            emailVerified: supplier.email_verified === 1,
            emailVerificationToken: supplier.email_verification_token || null,
            emailVerificationExpires: supplier.email_verification_expires 
              ? new Date(supplier.email_verification_expires) 
              : null,
            status: supplier.status || 'pending',
            createdAt: supplier.created_at ? new Date(supplier.created_at) : new Date(),
            updatedAt: supplier.updated_at ? new Date(supplier.updated_at) : new Date(),
          },
        });
        console.log(`   ✅ Migrated supplier: ${supplier.email}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️  Supplier ${supplier.email} already exists, skipping...`);
        } else {
          console.error(`   ❌ Error migrating supplier ${supplier.email}:`, error.message);
        }
      }
    }

    // 2. Migrate Tours
    console.log('\n📦 Migrating Tours...');
    const tours = await dbAll('SELECT * FROM tours');
    console.log(`   Found ${tours.length} tours`);

    for (const tour of tours) {
      try {
        await prisma.tour.create({
          data: {
            id: tour.id,
            supplierId: tour.supplier_id,
            parentTourId: tour.parent_tour_id || null,
            title: tour.title,
            slug: tour.slug,
            country: tour.country,
            city: tour.city,
            category: tour.category,
            locations: tour.locations,
            duration: tour.duration,
            pricePerPerson: tour.price_per_person,
            currency: tour.currency || 'INR',
            shortDescription: tour.short_description || null,
            fullDescription: tour.full_description,
            highlights: tour.highlights || null,
            included: tour.included,
            notIncluded: tour.not_included || null,
            meetingPoint: tour.meeting_point || null,
            guideType: tour.guide_type || null,
            images: tour.images,
            languages: tour.languages,
            reviews: tour.reviews || null,
            status: tour.status || 'draft',
            rejectionReason: tour.rejection_reason || null,
            createdAt: tour.created_at ? new Date(tour.created_at) : new Date(),
            updatedAt: tour.updated_at ? new Date(tour.updated_at) : new Date(),
            approvedAt: tour.approved_at ? new Date(tour.approved_at) : null,
          },
        });
        console.log(`   ✅ Migrated tour: ${tour.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️  Tour ${tour.slug} already exists, skipping...`);
        } else {
          console.error(`   ❌ Error migrating tour ${tour.title}:`, error.message);
        }
      }
    }

    // 3. Migrate Tour Options
    console.log('\n📦 Migrating Tour Options...');
    const tourOptions = await dbAll('SELECT * FROM tour_options');
    console.log(`   Found ${tourOptions.length} tour options`);

    for (const option of tourOptions) {
      try {
        await prisma.tourOption.create({
          data: {
            id: option.id,
            tourId: option.tour_id,
            optionTitle: option.option_title,
            optionDescription: option.option_description,
            durationHours: option.duration_hours,
            price: option.price,
            currency: option.currency || 'INR',
            language: option.language || 'English',
            pickupIncluded: option.pickup_included === 1,
            entryTicketIncluded: option.entry_ticket_included === 1,
            guideIncluded: option.guide_included !== 0,
            carIncluded: option.car_included === 1,
            sortOrder: option.sort_order || 0,
            createdAt: option.created_at ? new Date(option.created_at) : new Date(),
            updatedAt: option.updated_at ? new Date(option.updated_at) : new Date(),
          },
        });
        console.log(`   ✅ Migrated tour option: ${option.option_title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️  Tour option ${option.id} already exists, skipping...`);
        } else {
          console.error(`   ❌ Error migrating tour option:`, error.message);
        }
      }
    }

    // 4. Migrate Bookings
    console.log('\n📦 Migrating Bookings...');
    const bookings = await dbAll('SELECT * FROM bookings');
    console.log(`   Found ${bookings.length} bookings`);

    for (const booking of bookings) {
      try {
        await prisma.booking.create({
          data: {
            id: booking.id,
            tourId: booking.tour_id,
            tourOptionId: booking.tour_option_id || null,
            supplierId: booking.supplier_id,
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            customerPhone: booking.customer_phone || null,
            bookingDate: booking.booking_date,
            numberOfGuests: booking.number_of_guests,
            totalAmount: booking.total_amount,
            currency: booking.currency || 'INR',
            specialRequests: booking.special_requests || null,
            status: booking.status || 'pending',
            paymentStatus: booking.payment_status || 'pending',
            razorpayOrderId: booking.razorpay_order_id || null,
            razorpayPaymentId: booking.razorpay_payment_id || null,
            razorpaySignature: booking.razorpay_signature || null,
            createdAt: booking.created_at ? new Date(booking.created_at) : new Date(),
            updatedAt: booking.updated_at ? new Date(booking.updated_at) : new Date(),
          },
        });
        console.log(`   ✅ Migrated booking: ${booking.customer_name} - ${booking.customer_email}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️  Booking ${booking.id} already exists, skipping...`);
        } else {
          console.error(`   ❌ Error migrating booking:`, error.message);
        }
      }
    }

    // 5. Migrate Messages (if table exists)
    console.log('\n📦 Migrating Messages...');
    try {
      const messages = await dbAll('SELECT * FROM messages');
      console.log(`   Found ${messages.length} messages`);

      for (const message of messages) {
        try {
          await prisma.message.create({
            data: {
              id: message.id,
              bookingId: message.booking_id,
              senderType: message.sender_type,
              senderEmail: message.sender_email,
              message: message.message,
              read: message.read === 1,
              createdAt: message.created_at ? new Date(message.created_at) : new Date(),
              updatedAt: message.updated_at ? new Date(message.updated_at) : new Date(),
            },
          });
          console.log(`   ✅ Migrated message: ${message.id}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`   ⚠️  Message ${message.id} already exists, skipping...`);
          } else {
            console.error(`   ❌ Error migrating message:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log(`   ℹ️  Messages table not found or empty, skipping...`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    const finalCounts = {
      suppliers: await prisma.supplier.count(),
      tours: await prisma.tour.count(),
      tourOptions: await prisma.tourOption.count(),
      bookings: await prisma.booking.count(),
      messages: await prisma.message.count(),
    };
    console.log(`   Suppliers: ${finalCounts.suppliers}`);
    console.log(`   Tours: ${finalCounts.tours}`);
    console.log(`   Tour Options: ${finalCounts.tourOptions}`);
    console.log(`   Bookings: ${finalCounts.bookings}`);
    console.log(`   Messages: ${finalCounts.messages}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    db.close();
    await prisma.$disconnect();
  }
}

migrateData()
  .then(() => {
    console.log('\n🎉 All done! Your data is now in PostgreSQL.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration error:', error);
    process.exit(1);
  });

