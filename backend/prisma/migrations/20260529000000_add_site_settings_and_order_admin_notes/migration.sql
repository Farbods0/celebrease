-- AddSiteSettingsTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "companyName" TEXT NOT NULL DEFAULT 'CeleBrease',
    "supportEmail" TEXT NOT NULL DEFAULT '',
    "supportPhone" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "tiktok" TEXT NOT NULL DEFAULT '',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "smtpHost" TEXT NOT NULL DEFAULT '',
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "smtpUser" TEXT NOT NULL DEFAULT '',
    "smtpPass" TEXT NOT NULL DEFAULT '',
    "smtpFromEmail" TEXT NOT NULL DEFAULT '',
    "smtpFromName" TEXT NOT NULL DEFAULT 'CeleBrease',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.08,
    "shippingStandard" DOUBLE PRECISION NOT NULL DEFAULT 15.00,
    "shippingExpress" DOUBLE PRECISION NOT NULL DEFAULT 25.00,
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "heroTitle" TEXT NOT NULL DEFAULT 'Celebrate Beautifully, Without The Storage.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Rent professionally curated holiday decor kits, delivered to your door.',
    "heroBadgeText" TEXT NOT NULL DEFAULT 'New: 2026 Holiday Kits Available',
    "heroCtaPrimary" TEXT NOT NULL DEFAULT 'Browse Holiday Kits',
    "heroCtaSecondary" TEXT NOT NULL DEFAULT 'See How It Works',
    "tagline" TEXT NOT NULL DEFAULT 'Celebrate beautifully, without the storage.',
    "announcementBanner" TEXT NOT NULL DEFAULT '',
    "announcementBannerActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- AddAdminNotesToOrder
ALTER TABLE "order" ADD COLUMN "adminNotes" TEXT;
