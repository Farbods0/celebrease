-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('THIRTY_DAY', 'SIXTY_DAY');

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL DEFAULT 'THIRTY_DAY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "rentalFee" DECIMAL(10,2) NOT NULL,
    "extendedFee" DECIMAL(10,2) NOT NULL,
    "kitDeposit" DECIMAL(10,2) NOT NULL,
    "addOnsFee" DECIMAL(10,2) NOT NULL,
    "addOnDeposit" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "cartId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "cart_addon" (
    "cartId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_cartId_itemId_key" ON "cart_item"("cartId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_addon_cartId_addOnId_key" ON "cart_addon"("cartId", "addOnId");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_addon" ADD CONSTRAINT "cart_addon_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_addon" ADD CONSTRAINT "cart_addon_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
