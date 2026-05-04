/*
  Warnings:

  - You are about to drop the column `description` on the `kit` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `kit` table. All the data in the column will be lost.
  - You are about to drop the `kit_image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `holiday` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "kit_image" DROP CONSTRAINT "kit_image_kitId_fkey";

-- AlterTable
ALTER TABLE "holiday" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kit" DROP COLUMN "description",
DROP COLUMN "name";

-- DropTable
DROP TABLE "kit_image";
