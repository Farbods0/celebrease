import { IsBoolean, IsNumber, IsOptional, IsString, IsInt, Min, Max } from "class-validator";

export class UpdateSettingsDto {
    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    supportEmail?: string;

    @IsString()
    @IsOptional()
    supportPhone?: string;

    @IsString()
    @IsOptional()
    websiteUrl?: string;

    @IsString()
    @IsOptional()
    instagram?: string;

    @IsString()
    @IsOptional()
    facebook?: string;

    @IsString()
    @IsOptional()
    tiktok?: string;

    @IsBoolean()
    @IsOptional()
    maintenanceMode?: boolean;

    @IsString()
    @IsOptional()
    smtpHost?: string;

    @IsNumber()
    @IsOptional()
    smtpPort?: number;

    @IsString()
    @IsOptional()
    smtpUser?: string;

    @IsString()
    @IsOptional()
    smtpPass?: string;

    @IsString()
    @IsOptional()
    smtpFromEmail?: string;

    @IsString()
    @IsOptional()
    smtpFromName?: string;

    // P1-23/24: Pricing & Fees
    @IsNumber()
    @IsOptional()
    taxRate?: number;

    @IsNumber()
    @IsOptional()
    shippingStandard?: number;

    @IsNumber()
    @IsOptional()
    shippingExpress?: number;

    // P1-25: Company logo
    @IsString()
    @IsOptional()
    logoUrl?: string;

    // P2-1/2: Homepage content
    @IsString()
    @IsOptional()
    heroTitle?: string;

    @IsString()
    @IsOptional()
    heroSubtitle?: string;

    @IsString()
    @IsOptional()
    heroBadgeText?: string;

    @IsString()
    @IsOptional()
    heroCtaPrimary?: string;

    @IsString()
    @IsOptional()
    heroCtaSecondary?: string;

    @IsString()
    @IsOptional()
    tagline?: string;

    // P2-3: Announcement banner
    @IsString()
    @IsOptional()
    announcementBanner?: string;

    @IsBoolean()
    @IsOptional()
    announcementBannerActive?: boolean;

    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    yearlyDiscountPercent?: number;
}
