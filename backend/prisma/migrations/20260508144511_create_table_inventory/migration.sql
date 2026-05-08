/*
  Warnings:

  - You are about to drop the column `inventory` on the `addon` table. All the data in the column will be lost.
  - You are about to drop the column `totalQty` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addon" DROP COLUMN "inventory";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "totalQty";

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "totalQty" INTEGER NOT NULL DEFAULT 0,
    "availableQty" INTEGER NOT NULL DEFAULT 0,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "shippedQty" INTEGER NOT NULL DEFAULT 0,
    "cleaningQty" INTEGER NOT NULL DEFAULT 0,
    "repairQty" INTEGER NOT NULL DEFAULT 0,
    "lostQty" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT,
    "addOnId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_itemId_key" ON "inventory"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_addOnId_key" ON "inventory"("addOnId");

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
