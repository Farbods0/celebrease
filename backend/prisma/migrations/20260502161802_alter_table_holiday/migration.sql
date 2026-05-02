/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `holiday` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "holiday_slug_key";

-- AlterTable
ALTER TABLE "holiday" DROP COLUMN "coverUrl",
DROP COLUMN "iconUrl",
DROP COLUMN "slug";
