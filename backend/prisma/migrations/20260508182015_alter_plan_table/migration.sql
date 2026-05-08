/*
  Warnings:

  - You are about to alter the column `addOnDiscount` on the `plan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `kitDiscount` on the `plan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "plan" ALTER COLUMN "addOnDiscount" SET DEFAULT 0,
ALTER COLUMN "addOnDiscount" SET DATA TYPE INTEGER,
ALTER COLUMN "kitDiscount" SET DEFAULT 0,
ALTER COLUMN "kitDiscount" SET DATA TYPE INTEGER;
