/*
  Warnings:

  - The primary key for the `kit_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `kit_item` table. All the data in the column will be lost.
  - The primary key for the `kit_preview_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `kit_preview_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kit_item" DROP CONSTRAINT "kit_item_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "kit_preview_item" DROP CONSTRAINT "kit_preview_item_pkey",
DROP COLUMN "id";
