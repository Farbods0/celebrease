-- CreateEnum
CREATE TYPE "ReturnCondition" AS ENUM ('GOOD', 'DAMAGED', 'MISSING', 'LOST');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'RETURN_REQUESTED';
ALTER TYPE "OrderStatus" ADD VALUE 'RETURN_IN_TRANSIT';
ALTER TYPE "OrderStatus" ADD VALUE 'RETURN_RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE 'INSPECTED';

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "depositForfeited" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "depositRefunded" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "inspectedAt" TIMESTAMP(3),
ADD COLUMN     "inspectionNotes" TEXT,
ADD COLUMN     "returnLabelUrl" TEXT,
ADD COLUMN     "returnReceivedAt" TIMESTAMP(3),
ADD COLUMN     "returnRequestedAt" TIMESTAMP(3),
ADD COLUMN     "returnShippedAt" TIMESTAMP(3),
ADD COLUMN     "returnTrackingNumber" TEXT,
ADD COLUMN     "returnTrackingUrl" TEXT,
ADD COLUMN     "stripeRefundId" TEXT;

-- CreateTable
CREATE TABLE "order_return_line" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT,
    "addOnId" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "condition" "ReturnCondition" NOT NULL,
    "feeCharged" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_return_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_return_line_orderId_idx" ON "order_return_line"("orderId");

-- AddForeignKey
ALTER TABLE "order_return_line" ADD CONSTRAINT "order_return_line_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
