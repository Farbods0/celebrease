/*
  Warnings:

  - Added the required column `addOnDiscount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitDiscount` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "addOnDiscount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "kitDiscount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "addOnDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "kitDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0;
