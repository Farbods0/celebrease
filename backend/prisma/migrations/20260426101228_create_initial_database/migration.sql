/*
  Warnings:

  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HolidayCategory" AS ENUM ('TRADITIONAL', 'CULTURAL', 'EVENT_BASED');

-- CreateEnum
CREATE TYPE "KitTier" AS ENUM ('STARTER', 'PREMIUM', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "KitStatus" AS ENUM ('DRAFT', 'ACTIVE', 'HIDDEN', 'LOW_STOCK');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('ACTIVE', 'LOW_STOCK', 'RETIRED');

-- CreateEnum
CREATE TYPE "InventoryUnitStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SHIPPED', 'IN_CLEANING', 'IN_REPAIR', 'RETIRED', 'LOST');

-- CreateEnum
CREATE TYPE "DamageEventType" AS ENUM ('BROKEN', 'MISSING_PART', 'LOST_BY_CUSTOMER', 'DAMAGED_BY_CUSTOMER', 'WORN_OUT', 'OTHER');

-- CreateEnum
CREATE TYPE "AddOnStatus" AS ENUM ('ACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('STARTER', 'PREMIUM', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionStage" AS ENUM ('NOT_STARTED', 'IN_USE', 'RETURNED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "HolidaySlotStatus" AS ENUM ('PENDING', 'SELECTED', 'SHIPPED', 'RETURNED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "RentalDuration" AS ENUM ('THIRTY_DAY', 'SIXTY_DAY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'HELD', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FORFEITED');

-- CreateEnum
CREATE TYPE "DeliveryOption" AS ENUM ('STANDARD', 'EXPRESS');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD');

-- CreateEnum
CREATE TYPE "ReturnCondition" AS ENUM ('EXCELLENT', 'MINOR_SCUFFS', 'MAJOR_DAMAGE');

-- CreateEnum
CREATE TYPE "RefundDecision" AS ENUM ('NO_REFUND', 'PARTIAL_REFUND', 'FULL_REFUND');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "city",
DROP COLUMN "code",
DROP COLUMN "identifier",
ADD COLUMN     "region" TEXT;

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'SHIPPING',
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "streetLine1" TEXT NOT NULL,
    "streetLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deliveryNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL DEFAULT 'CARD',
    "provider" TEXT,
    "providerRef" TEXT,
    "brand" TEXT,
    "last4" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "holderName" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "HolidayCategory" NOT NULL,
    "iconUrl" TEXT,
    "coverUrl" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "vendorId" TEXT,
    "costPerUnit" DECIMAL(10,2) NOT NULL,
    "totalQty" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 0,
    "initialStatus" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "status" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_image" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_item_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_holiday" (
    "itemId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,

    CONSTRAINT "inventory_item_holiday_pkey" PRIMARY KEY ("itemId","holidayId")
);

-- CreateTable
CREATE TABLE "inventory_unit" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" "InventoryUnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "currentOrderItemId" TEXT,
    "notes" TEXT,
    "retiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damage_event" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "unitId" TEXT,
    "type" "DamageEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loggedById" TEXT,
    "returnId" TEXT,

    CONSTRAINT "damage_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tier" "KitTier" NOT NULL,
    "holidayId" TEXT NOT NULL,
    "status" "KitStatus" NOT NULL DEFAULT 'DRAFT',
    "price30Day" DECIMAL(10,2) NOT NULL,
    "price60Day" DECIMAL(10,2),
    "deposit" DECIMAL(10,2) NOT NULL,
    "seasonStart" TIMESTAMP(3),
    "seasonEnd" TIMESTAMP(3),
    "alwaysVisible" BOOLEAN NOT NULL DEFAULT false,
    "visibleOnPdp" BOOLEAN NOT NULL DEFAULT true,
    "addOnsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "limitInventory" BOOLEAN NOT NULL DEFAULT false,
    "inventoryLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_image" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kit_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_item" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "kit_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_preview_item" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kit_preview_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "status" "AddOnStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_image" (
    "id" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "addon_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_holiday" (
    "addOnId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,

    CONSTRAINT "addon_holiday_pkey" PRIMARY KEY ("addOnId","holidayId")
);

-- CreateTable
CREATE TABLE "kit_addon" (
    "kitId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,

    CONSTRAINT "kit_addon_pkey" PRIMARY KEY ("kitId","addOnId")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "code" "PlanCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "yearlyPrice" DECIMAL(10,2),
    "holidaysPerYear" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_feature" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plan_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stage" "SubscriptionStage" NOT NULL DEFAULT 'NOT_STARTED',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "paymentMethodId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycleStart" TIMESTAMP(3),
    "cycleEnd" TIMESTAMP(3),
    "nextBillingAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_holiday_slot" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "slotNumber" INTEGER NOT NULL,
    "holidayId" TEXT,
    "status" "HolidaySlotStatus" NOT NULL DEFAULT 'PENDING',
    "orderId" TEXT,

    CONSTRAINT "subscription_holiday_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,
    "duration" "RentalDuration" NOT NULL DEFAULT 'THIRTY_DAY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item_addon" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cart_item_addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "kitId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,
    "duration" "RentalDuration" NOT NULL DEFAULT 'THIRTY_DAY',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "shippingAddressId" TEXT,
    "billingAddressId" TEXT,
    "paymentMethodId" TEXT,
    "deliveryOption" "DeliveryOption" NOT NULL DEFAULT 'STANDARD',
    "deliveryNote" TEXT,
    "rentalPrice" DECIMAL(10,2) NOT NULL,
    "addOnsTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "depositAmount" DECIMAL(10,2) NOT NULL,
    "depositStatus" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "depositRefund" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "rentalStart" TIMESTAMP(3) NOT NULL,
    "rentalEnd" TIMESTAMP(3) NOT NULL,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "expectedReturnAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "trackingCarrier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_addon" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "order_addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "inspectedAt" TIMESTAMP(3),
    "inspectedById" TEXT,
    "condition" "ReturnCondition",
    "damageNotes" TEXT,
    "refundDecision" "RefundDecision" NOT NULL DEFAULT 'NO_REFUND',
    "refundAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_damage_image" (
    "id" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "return_damage_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_userId_idx" ON "address"("userId");

-- CreateIndex
CREATE INDEX "payment_method_userId_idx" ON "payment_method"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_slug_key" ON "holiday"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_sku_key" ON "inventory_item"("sku");

-- CreateIndex
CREATE INDEX "inventory_item_vendorId_idx" ON "inventory_item"("vendorId");

-- CreateIndex
CREATE INDEX "inventory_item_image_itemId_idx" ON "inventory_item_image"("itemId");

-- CreateIndex
CREATE INDEX "inventory_item_holiday_holidayId_idx" ON "inventory_item_holiday"("holidayId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_unit_serialNumber_key" ON "inventory_unit"("serialNumber");

-- CreateIndex
CREATE INDEX "inventory_unit_itemId_status_idx" ON "inventory_unit"("itemId", "status");

-- CreateIndex
CREATE INDEX "damage_event_itemId_idx" ON "damage_event"("itemId");

-- CreateIndex
CREATE INDEX "damage_event_unitId_idx" ON "damage_event"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "kit_sku_key" ON "kit"("sku");

-- CreateIndex
CREATE INDEX "kit_holidayId_idx" ON "kit"("holidayId");

-- CreateIndex
CREATE INDEX "kit_tier_idx" ON "kit"("tier");

-- CreateIndex
CREATE INDEX "kit_image_kitId_idx" ON "kit_image"("kitId");

-- CreateIndex
CREATE INDEX "kit_item_itemId_idx" ON "kit_item"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "kit_item_kitId_itemId_key" ON "kit_item"("kitId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "kit_preview_item_kitId_itemId_key" ON "kit_preview_item"("kitId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "addon_sku_key" ON "addon"("sku");

-- CreateIndex
CREATE INDEX "addon_image_addOnId_idx" ON "addon_image"("addOnId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_code_key" ON "plan"("code");

-- CreateIndex
CREATE INDEX "plan_feature_planId_idx" ON "plan_feature"("planId");

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_holiday_slot_orderId_key" ON "subscription_holiday_slot"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_holiday_slot_subscriptionId_slotNumber_key" ON "subscription_holiday_slot"("subscriptionId", "slotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_key" ON "cart"("userId");

-- CreateIndex
CREATE INDEX "cart_item_cartId_idx" ON "cart_item"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_addon_cartItemId_addOnId_key" ON "cart_item_addon"("cartItemId", "addOnId");

-- CreateIndex
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");

-- CreateIndex
CREATE INDEX "order_userId_idx" ON "order"("userId");

-- CreateIndex
CREATE INDEX "order_subscriptionId_idx" ON "order"("subscriptionId");

-- CreateIndex
CREATE INDEX "order_kitId_idx" ON "order"("kitId");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "order_item_orderId_idx" ON "order_item"("orderId");

-- CreateIndex
CREATE INDEX "order_addon_orderId_idx" ON "order_addon"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "return_returnNumber_key" ON "return"("returnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "return_orderId_key" ON "return"("orderId");

-- CreateIndex
CREATE INDEX "return_damage_image_returnId_idx" ON "return_damage_image"("returnId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_method" ADD CONSTRAINT "payment_method_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_image" ADD CONSTRAINT "inventory_item_image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_holiday" ADD CONSTRAINT "inventory_item_holiday_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_holiday" ADD CONSTRAINT "inventory_item_holiday_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_currentOrderItemId_fkey" FOREIGN KEY ("currentOrderItemId") REFERENCES "order_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_event" ADD CONSTRAINT "damage_event_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_event" ADD CONSTRAINT "damage_event_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "inventory_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_event" ADD CONSTRAINT "damage_event_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_event" ADD CONSTRAINT "damage_event_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "return"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit" ADD CONSTRAINT "kit_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_image" ADD CONSTRAINT "kit_image_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_item" ADD CONSTRAINT "kit_item_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_item" ADD CONSTRAINT "kit_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_preview_item" ADD CONSTRAINT "kit_preview_item_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_preview_item" ADD CONSTRAINT "kit_preview_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_image" ADD CONSTRAINT "addon_image_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_holiday" ADD CONSTRAINT "addon_holiday_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_holiday" ADD CONSTRAINT "addon_holiday_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_addon" ADD CONSTRAINT "kit_addon_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_addon" ADD CONSTRAINT "kit_addon_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_feature" ADD CONSTRAINT "plan_feature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_holiday_slot" ADD CONSTRAINT "subscription_holiday_slot_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_holiday_slot" ADD CONSTRAINT "subscription_holiday_slot_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_holiday_slot" ADD CONSTRAINT "subscription_holiday_slot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_addon" ADD CONSTRAINT "cart_item_addon_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "cart_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_addon" ADD CONSTRAINT "cart_item_addon_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addon" ADD CONSTRAINT "order_addon_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addon" ADD CONSTRAINT "order_addon_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return" ADD CONSTRAINT "return_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return" ADD CONSTRAINT "return_inspectedById_fkey" FOREIGN KEY ("inspectedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_damage_image" ADD CONSTRAINT "return_damage_image_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "return"("id") ON DELETE CASCADE ON UPDATE CASCADE;
