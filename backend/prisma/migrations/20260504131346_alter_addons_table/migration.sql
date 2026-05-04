/*
  Warnings:

  - You are about to drop the `kit_addon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "kit_addon" DROP CONSTRAINT "kit_addon_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "kit_addon" DROP CONSTRAINT "kit_addon_kitId_fkey";

-- DropTable
DROP TABLE "kit_addon";

-- CreateTable
CREATE TABLE "addon_holiday" (
    "addOnId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,

    CONSTRAINT "addon_holiday_pkey" PRIMARY KEY ("addOnId","holidayId")
);

-- AddForeignKey
ALTER TABLE "addon_holiday" ADD CONSTRAINT "addon_holiday_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_holiday" ADD CONSTRAINT "addon_holiday_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE CASCADE ON UPDATE CASCADE;
