import { apiGet } from "./base";

export type ApiSiteSettings = {
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    websiteUrl: string;
    yearlyDiscountPercent: number;
    taxRate: number;
    shippingStandard: number;
    shippingExpress: number;
};

export async function getSiteSettings(): Promise<ApiSiteSettings> {
    try {
        return await apiGet<ApiSiteSettings>("/settings");
    } catch (e) {
        return {
            companyName: "CeleBrease",
            supportEmail: "",
            supportPhone: "",
            websiteUrl: "",
            yearlyDiscountPercent: 20,
            taxRate: 0.08,
            shippingStandard: 15,
            shippingExpress: 25,
        };
    }
}
