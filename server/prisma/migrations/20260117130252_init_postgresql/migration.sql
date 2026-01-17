-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
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
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "email_verification_expires" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "parent_tour_id" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "locations" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price_per_person" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "short_description" TEXT,
    "full_description" TEXT NOT NULL,
    "highlights" TEXT,
    "included" TEXT NOT NULL,
    "not_included" TEXT,
    "meeting_point" TEXT,
    "guide_type" TEXT,
    "images" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "reviews" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_options" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "option_title" TEXT NOT NULL,
    "option_description" TEXT NOT NULL,
    "duration_hours" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "language" TEXT NOT NULL DEFAULT 'English',
    "pickup_included" BOOLEAN NOT NULL DEFAULT false,
    "entry_ticket_included" BOOLEAN NOT NULL DEFAULT false,
    "guide_included" BOOLEAN NOT NULL DEFAULT true,
    "car_included" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "tour_option_id" INTEGER,
    "supplier_id" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "booking_date" TEXT NOT NULL,
    "number_of_guests" INTEGER NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "special_requests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_parent_tour_id_fkey" FOREIGN KEY ("parent_tour_id") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_options" ADD CONSTRAINT "tour_options_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_option_id_fkey" FOREIGN KEY ("tour_option_id") REFERENCES "tour_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
