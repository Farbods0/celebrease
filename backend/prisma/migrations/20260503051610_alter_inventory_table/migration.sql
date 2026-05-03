/*
  Warnings:

  - You are about to drop the column `vendorId` on the `inventory_item` table. All the data in the column will be lost.
  - You are about to drop the `inventory_item_holiday` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_item_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `inventory_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorEmail` to the `inventory_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorName` to the `inventory_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorPhone` to the `inventory_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventory_item" DROP CONSTRAINT "inventory_item_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_holiday" DROP CONSTRAINT "inventory_item_holiday_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_holiday" DROP CONSTRAINT "inventory_item_holiday_itemId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_item_image" DROP CONSTRAINT "inventory_item_image_itemId_fkey";

-- DropIndex
DROP INDEX "inventory_item_vendorId_idx";

-- AlterTable
ALTER TABLE "inventory_item" DROP COLUMN "vendorId",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "vendorEmail" TEXT NOT NULL,
ADD COLUMN     "vendorName" TEXT NOT NULL,
ADD COLUMN     "vendorPhone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kit" ADD COLUMN     "limitInventory" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "inventory_item_holiday";

-- DropTable
DROP TABLE "inventory_item_image";

-- DropTable
DROP TABLE "vendor";
