-- CreateTable
CREATE TABLE "holiday_love" (
    "userId" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holiday_love_pkey" PRIMARY KEY ("userId","holidayId")
);

-- CreateIndex
CREATE INDEX "holiday_love_holidayId_idx" ON "holiday_love"("holidayId");

-- AddForeignKey
ALTER TABLE "holiday_love" ADD CONSTRAINT "holiday_love_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_love" ADD CONSTRAINT "holiday_love_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holiday"("id") ON DELETE CASCADE ON UPDATE CASCADE;
