/*
  Warnings:

  - You are about to drop the column `group_price` on the `tour_options` table. All the data in the column will be lost.
  - You are about to drop the column `max_group_size` on the `tour_options` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tour_options" DROP COLUMN "group_price",
DROP COLUMN "max_group_size";

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "tour_types" TEXT;
