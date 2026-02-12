-- CreateTable
CREATE TABLE "suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "business_type" TEXT NOT NULL,
    "company_employees" TEXT,
    "company_activities" TEXT,
    "individual_activities" TEXT,
    "other_activities" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "company_name" TEXT,
    "main_hub" TEXT,
    "city" TEXT,
    "tour_languages" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "verification_document_url" TEXT,
    "certificates" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "email_verification_expires" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "payment_method" TEXT,
    "payment_method_details" TEXT,
    "payment_currency" TEXT,
    "payment_frequency" TEXT NOT NULL DEFAULT 'monthly',
    "tax_id" TEXT,
    "tax_id_type" TEXT,
    "tax_country" TEXT,
    "tax_verified" BOOLEAN NOT NULL DEFAULT false,
    "payment_details_verified" BOOLEAN NOT NULL DEFAULT false,
    "payment_details_verified_at" DATETIME
);

-- CreateTable
CREATE TABLE "tours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "parent_tour_id" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "locations" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price_per_person" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "short_description" TEXT,
    "full_description" TEXT NOT NULL,
    "highlights" TEXT,
    "included" TEXT NOT NULL,
    "not_included" TEXT,
    "meeting_point" TEXT,
    "guide_type" TEXT,
    "tour_types" TEXT,
    "images" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "reviews" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rejection_reason" TEXT,
    "max_group_size" INTEGER,
    "group_price" REAL,
    "group_pricing_tiers" TEXT,
    "unavailable_dates" TEXT,
    "unavailable_days_of_week" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "approved_at" DATETIME,
    CONSTRAINT "tours_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tours_parent_tour_id_fkey" FOREIGN KEY ("parent_tour_id") REFERENCES "tours" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tour_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tour_id" INTEGER NOT NULL,
    "option_title" TEXT NOT NULL,
    "option_description" TEXT NOT NULL,
    "duration_hours" REAL NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "language" TEXT NOT NULL DEFAULT 'English',
    "pickup_included" BOOLEAN NOT NULL DEFAULT false,
    "entry_ticket_included" BOOLEAN NOT NULL DEFAULT false,
    "guide_included" BOOLEAN NOT NULL DEFAULT true,
    "car_included" BOOLEAN NOT NULL DEFAULT false,
    "group_pricing_tiers" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tour_options_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tour_id" INTEGER NOT NULL,
    "tour_option_id" INTEGER,
    "supplier_id" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "booking_date" TEXT NOT NULL,
    "number_of_guests" INTEGER NOT NULL,
    "total_amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "special_requests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "bookings_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_tour_option_id_fkey" FOREIGN KEY ("tour_option_id") REFERENCES "tour_options" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "booking_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "messages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tourists" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "email_subscriptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "subscriptionType" TEXT NOT NULL DEFAULT 'itinerary',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "verified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_email_idx" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_email_verification_token_idx" ON "suppliers"("email_verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE INDEX "tours_supplier_id_idx" ON "tours"("supplier_id");

-- CreateIndex
CREATE INDEX "tours_status_idx" ON "tours"("status");

-- CreateIndex
CREATE INDEX "tours_city_idx" ON "tours"("city");

-- CreateIndex
CREATE INDEX "tours_parent_tour_id_idx" ON "tours"("parent_tour_id");

-- CreateIndex
CREATE INDEX "tour_options_tour_id_idx" ON "tour_options"("tour_id");

-- CreateIndex
CREATE INDEX "bookings_tour_id_idx" ON "bookings"("tour_id");

-- CreateIndex
CREATE INDEX "bookings_tour_option_id_idx" ON "bookings"("tour_option_id");

-- CreateIndex
CREATE INDEX "bookings_supplier_id_idx" ON "bookings"("supplier_id");

-- CreateIndex
CREATE INDEX "bookings_customer_email_idx" ON "bookings"("customer_email");

-- CreateIndex
CREATE INDEX "messages_booking_id_idx" ON "messages"("booking_id");

-- CreateIndex
CREATE INDEX "messages_sender_email_idx" ON "messages"("sender_email");

-- CreateIndex
CREATE UNIQUE INDEX "tourists_email_key" ON "tourists"("email");

-- CreateIndex
CREATE INDEX "tourists_email_idx" ON "tourists"("email");

-- CreateIndex
CREATE INDEX "email_subscriptions_email_idx" ON "email_subscriptions"("email");

-- CreateIndex
CREATE INDEX "email_subscriptions_city_idx" ON "email_subscriptions"("city");

-- CreateIndex
CREATE UNIQUE INDEX "email_subscriptions_email_city_subscriptionType_key" ON "email_subscriptions"("email", "city", "subscriptionType");
