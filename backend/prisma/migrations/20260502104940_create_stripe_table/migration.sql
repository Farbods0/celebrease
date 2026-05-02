/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceMonthlyId]` on the table `plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePriceYearlyId]` on the table `plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "stripePriceMonthlyId" TEXT,
ADD COLUMN     "stripePriceYearlyId" TEXT;

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "stripeSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "plan_stripePriceMonthlyId_key" ON "plan"("stripePriceMonthlyId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_stripePriceYearlyId_key" ON "plan"("stripePriceYearlyId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeSubscriptionId_key" ON "subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "user"("stripeCustomerId");
