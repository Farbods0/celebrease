/*
  Warnings:

  - A unique constraint covering the columns `[holidayId,tier]` on the table `kit` will be added. If there are existing duplicate values, this will fail.
  - Made the column `price60Day` on table `kit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "kit" ALTER COLUMN "price60Day" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kit_holidayId_tier_key" ON "kit"("holidayId", "tier");
