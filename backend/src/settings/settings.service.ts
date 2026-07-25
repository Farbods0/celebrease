import { PrismaService } from "@/common/services/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

/** Fields safe to expose publicly (no SMTP credentials, no admin-only data).
 * NOTE: New fields (logoUrl, hero*, tagline, announcement*) are part of a pending migration.
 * Remove `as any` after `prisma generate` is re-run post-migration. */
const PUBLIC_FIELDS: Record<string, boolean> = {
    id: true,
    companyName: true,
    supportEmail: true,
    supportPhone: true,
    websiteUrl: true,
    instagram: true,
    facebook: true,
    tiktok: true,
    logoUrl: true,
    heroTitle: true,
    heroSubtitle: true,
    heroBadgeText: true,
    heroCtaPrimary: true,
    heroCtaSecondary: true,
    tagline: true,
    announcementBanner: true,
    announcementBannerActive: true,
    yearlyDiscountPercent: true,
};

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) {}

    async get() {
        return this.prisma.siteSettings.upsert({
            where: { id: "singleton" },
            create: { id: "singleton" },
            update: {},
        });
    }

    async getPublic() {
        return this.prisma.siteSettings.upsert({
            where: { id: "singleton" },
            create: { id: "singleton" },
            update: {},
            select: PUBLIC_FIELDS,
        });
    }

    async update(dto: UpdateSettingsDto) {
        return this.prisma.siteSettings.upsert({
            where: { id: "singleton" },
            create: { id: "singleton", ...dto },
            update: dto,
        });
    }
}
