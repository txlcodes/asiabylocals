-- AlterTable
ALTER TABLE "tour_options" ADD COLUMN     "group_price" DOUBLE PRECISION,
ADD COLUMN     "max_group_size" INTEGER,
ADD COLUMN     "pricing_type" TEXT NOT NULL DEFAULT 'per_person';
