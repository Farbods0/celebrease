/*
  Warnings:

  - You are about to drop the column `orderId` on the `subscription_holiday_slot` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_item_addon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `damage_event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_addon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `return` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `return_damage_image` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'LOW_STOCK', 'RETIRED');

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_userId_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cartId_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_kitId_fkey";

-- DropForeignKey
ALTER TABLE "cart_item_addon" DROP CONSTRAINT "cart_item_addon_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "cart_item_addon" DROP CONSTRAINT "cart_item_addon_cartItemId_fkey";

-- DropForeignKey
ALTER TABLE "damage_event" DROP CONSTRAINT "damage_event_itemId_fkey";

-- DropForeignKey
ALTER TABLE "damage_event" DROP CONSTRAINT "damage_event_loggedById_fkey";

-- DropForeignKey
ALTER TABLE "damage_event" DROP CONSTRAINT "damage_event_returnId_fkey";

-- DropForeignKey
ALTER TABLE "damage_event" DROP CONSTRAINT "damage_event_unitId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_unit" DROP CONSTRAINT "inventory_unit_currentOrderItemId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_unit" DROP CONSTRAINT "inventory_unit_itemId_fkey";

-- DropForeignKey
ALTER TABLE "kit_item" DROP CONSTRAINT "kit_item_itemId_fkey";

-- DropForeignKey
ALTER TABLE "kit_preview_item" DROP CONSTRAINT "kit_preview_item_itemId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_kitId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropForeignKey
ALTER TABLE "order_addon" DROP CONSTRAINT "order_addon_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "order_addon" DROP CONSTRAINT "order_addon_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- DropForeignKey
ALTER TABLE "return" DROP CONSTRAINT "return_inspectedById_fkey";

-- DropForeignKey
ALTER TABLE "return" DROP CONSTRAINT "return_orderId_fkey";

-- DropForeignKey
ALTER TABLE "return_damage_image" DROP CONSTRAINT "return_damage_image_returnId_fkey";

-- DropForeignKey
ALTER TABLE "subscription_holiday_slot" DROP CONSTRAINT "subscription_holiday_slot_orderId_fkey";

-- DropIndex
DROP INDEX "subscription_holiday_slot_orderId_key";

-- AlterTable
ALTER TABLE "subscription_holiday_slot" DROP COLUMN "orderId";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "cart";

-- DropTable
DROP TABLE "cart_item";

-- DropTable
DROP TABLE "cart_item_addon";

-- DropTable
DROP TABLE "damage_event";

-- DropTable
DROP TABLE "inventory_item";

-- DropTable
DROP TABLE "inventory_unit";

-- DropTable
DROP TABLE "order";

-- DropTable
DROP TABLE "order_addon";

-- DropTable
DROP TABLE "order_item";

-- DropTable
DROP TABLE "return";

-- DropTable
DROP TABLE "return_damage_image";

-- DropEnum
DROP TYPE "AddressType";

-- DropEnum
DROP TYPE "DamageEventType";

-- DropEnum
DROP TYPE "DeliveryOption";

-- DropEnum
DROP TYPE "DepositStatus";

-- DropEnum
DROP TYPE "InventoryStatus";

-- DropEnum
DROP TYPE "InventoryUnitStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentMethodType";

-- DropEnum
DROP TYPE "RefundDecision";

-- DropEnum
DROP TYPE "RentalDuration";

-- DropEnum
DROP TYPE "ReturnCondition";

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "vendorName" TEXT NOT NULL,
    "vendorEmail" TEXT NOT NULL,
    "vendorPhone" TEXT NOT NULL,
    "costPerUnit" DECIMAL(10,2) NOT NULL,
    "totalQty" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 0,
    "initialStatus" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_sku_key" ON "item"("sku");

-- AddForeignKey
ALTER TABLE "kit_item" ADD CONSTRAINT "kit_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_preview_item" ADD CONSTRAINT "kit_preview_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
