-- CreateTable
CREATE TABLE "tours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "locations" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price_per_person" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "short_description" TEXT,
    "full_description" TEXT NOT NULL,
    "included" TEXT NOT NULL,
    "not_included" TEXT,
    "meeting_point" TEXT,
    "guide_type" TEXT,
    "images" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rejection_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "approved_at" DATETIME,
    CONSTRAINT "tours_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "tours_supplier_id_idx" ON "tours"("supplier_id");

-- CreateIndex
CREATE INDEX "tours_status_idx" ON "tours"("status");

-- CreateIndex
CREATE INDEX "tours_city_idx" ON "tours"("city");
