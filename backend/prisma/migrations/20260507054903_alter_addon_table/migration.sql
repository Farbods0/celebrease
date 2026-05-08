/*
  Warnings:

  - You are about to drop the column `status` on the `addon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addon" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
