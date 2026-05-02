/*
  Warnings:

  - You are about to drop the column `category` on the `kit` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryLimit` on the `kit` table. All the data in the column will be lost.
  - You are about to drop the column `limitInventory` on the `kit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kit" DROP COLUMN "category",
DROP COLUMN "inventoryLimit",
DROP COLUMN "limitInventory";
