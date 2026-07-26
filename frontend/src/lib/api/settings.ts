import { apiPrefix, apiURL } from "./base";

export type ApiSiteSettings = {
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    websiteUrl: string;
    yearlyDiscountPercent: number;
    aLaCarteStartingPrice: number;
    taxRate: number;
    shippingStandard: number;
    shippingExpress: number;
};

export async function getSiteSettings(): Promise<ApiSiteSettings> {
    try {
        const res = await fetch(apiURL(`${apiPrefix}/settings`), { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error("Failed to load settings");
        return await res.json();
    } catch (e) {
        return {
            companyName: "CeleBrease",
            supportEmail: "",
            supportPhone: "",
            websiteUrl: "",
            yearlyDiscountPercent: 20,
            aLaCarteStartingPrice: 79.00,
            taxRate: 0.08,
            shippingStandard: 15,
            shippingExpress: 25,
        };
    }
}
