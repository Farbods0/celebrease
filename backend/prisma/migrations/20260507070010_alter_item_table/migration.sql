/*
  Warnings:

  - You are about to drop the column `initialStatus` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "item" DROP COLUMN "initialStatus",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "ItemStatus";
