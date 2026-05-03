/*
  Warnings:

  - You are about to drop the `addon_holiday` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `addon_image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `addon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addon_holiday" DROP CONSTRAINT "addon_holiday_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "addon_holiday" DROP CONSTRAINT "addon_holiday_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "addon_image" DROP CONSTRAINT "addon_image_addOnId_fkey";

-- AlterTable
ALTER TABLE "addon" ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "addon_holiday";

-- DropTable
DROP TABLE "addon_image";
