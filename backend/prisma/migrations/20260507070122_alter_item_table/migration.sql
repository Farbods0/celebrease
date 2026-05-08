-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'LOW_STOCK');

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';
