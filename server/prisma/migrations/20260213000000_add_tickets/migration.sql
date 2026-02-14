-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "attraction_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "ticket_type" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "includes" TEXT NOT NULL,
    "not_included" TEXT,
    "base_price" DOUBLE PRECISION NOT NULL,
    "markup_percentage" DOUBLE PRECISION NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "short_description" TEXT,
    "full_description" TEXT NOT NULL,
    "highlights" TEXT,
    "images" TEXT NOT NULL,
    "booking_method" TEXT NOT NULL,
    "redemption_info" TEXT,
    "cancellation_policy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rejection_reason" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_bookings" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "visit_date" TEXT NOT NULL,
    "number_of_tickets" INTEGER NOT NULL,
    "ticket_type" TEXT,
    "base_price" DOUBLE PRECISION NOT NULL,
    "markup_amount" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "voucher_code" TEXT,
    "voucher_url" TEXT,
    "ticket_details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_slug_key" ON "tickets"("slug");

-- CreateIndex
CREATE INDEX "tickets_supplier_id_idx" ON "tickets"("supplier_id");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tickets"("status");

-- CreateIndex
CREATE INDEX "tickets_city_idx" ON "tickets"("city");

-- CreateIndex
CREATE INDEX "tickets_attraction_name_idx" ON "tickets"("attraction_name");

-- CreateIndex
CREATE INDEX "ticket_bookings_ticket_id_idx" ON "ticket_bookings"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_bookings_supplier_id_idx" ON "ticket_bookings"("supplier_id");

-- CreateIndex
CREATE INDEX "ticket_bookings_customer_email_idx" ON "ticket_bookings"("customer_email");

-- CreateIndex
CREATE INDEX "ticket_bookings_visit_date_idx" ON "ticket_bookings"("visit_date");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_bookings" ADD CONSTRAINT "ticket_bookings_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_bookings" ADD CONSTRAINT "ticket_bookings_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
