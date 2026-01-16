/*
  Warnings:

  - Added the required column `country` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "country" TEXT NOT NULL,
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
INSERT INTO "new_tours" ("approved_at", "category", "city", "created_at", "currency", "duration", "full_description", "guide_type", "id", "images", "included", "languages", "locations", "meeting_point", "not_included", "price_per_person", "rejection_reason", "short_description", "status", "supplier_id", "title", "updated_at") SELECT "approved_at", "category", "city", "created_at", "currency", "duration", "full_description", "guide_type", "id", "images", "included", "languages", "locations", "meeting_point", "not_included", "price_per_person", "rejection_reason", "short_description", "status", "supplier_id", "title", "updated_at" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
CREATE INDEX "tours_supplier_id_idx" ON "tours"("supplier_id");
CREATE INDEX "tours_status_idx" ON "tours"("status");
CREATE INDEX "tours_city_idx" ON "tours"("city");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
