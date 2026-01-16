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
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tour_options_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
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
INSERT INTO "new_bookings" ("booking_date", "created_at", "currency", "customer_email", "customer_name", "customer_phone", "id", "number_of_guests", "payment_status", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "special_requests", "status", "supplier_id", "total_amount", "tour_id", "updated_at") SELECT "booking_date", "created_at", "currency", "customer_email", "customer_name", "customer_phone", "id", "number_of_guests", "payment_status", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "special_requests", "status", "supplier_id", "total_amount", "tour_id", "updated_at" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE INDEX "bookings_tour_id_idx" ON "bookings"("tour_id");
CREATE INDEX "bookings_tour_option_id_idx" ON "bookings"("tour_option_id");
CREATE INDEX "bookings_supplier_id_idx" ON "bookings"("supplier_id");
CREATE INDEX "bookings_customer_email_idx" ON "bookings"("customer_email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "tour_options_tour_id_idx" ON "tour_options"("tour_id");
