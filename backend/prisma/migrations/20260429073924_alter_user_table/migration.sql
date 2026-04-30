/*
  Warnings:

  - You are about to drop the column `isBan` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" RENAME COLUMN "isBan" TO "banned";
