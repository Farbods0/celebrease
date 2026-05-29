import { request } from "./base";

export type ApiSiteSettings = {
    id: string;
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    websiteUrl: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    maintenanceMode: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    smtpFromEmail: string;
    smtpFromName: string;
    // Pricing & Fees
    taxRate: number;
    shippingStandard: number;
    shippingExpress: number;
    // Logo
    logoUrl: string;
    // Homepage content
    heroTitle: string;
    heroSubtitle: string;
    heroBadgeText: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    tagline: string;
    // Announcement banner
    announcementBanner: string;
    announcementBannerActive: boolean;
    updatedAt: string;
};

export type UpdateSettingsPayload = Partial<Omit<ApiSiteSettings, "id" | "updatedAt">>;

export const settingsApi = {
    get: () => request<ApiSiteSettings>("/settings"),
    update: (payload: UpdateSettingsPayload) =>
        request<ApiSiteSettings>("/settings", {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    stripeStatus: () => request<{ mode: "live" | "test" | "unknown" }>("/settings/stripe-status"),
};
