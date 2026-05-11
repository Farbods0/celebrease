-- AddStripeProductIdToPlan
ALTER TABLE "plan" ADD COLUMN "stripeProductId" TEXT;

ALTER TABLE "plan" ADD CONSTRAINT "plan_stripeProductId_key" UNIQUE ("stripeProductId");