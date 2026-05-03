/*
  Warnings:

  - You are about to drop the column `paymentMethodId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `payment_method` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "payment_method" DROP CONSTRAINT "payment_method_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "paymentMethodId";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "paymentMethodId";

-- DropTable
DROP TABLE "payment_method";
