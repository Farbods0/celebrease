export const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
export const apiPrefix = "/api/v1";

export type HolidayCategory = "TRADITIONAL" | "CULTURAL" | "EVENT_BASED";
export type KitTier = "STARTER" | "PREMIUM" | "ULTIMATE";
export type KitStatus = "DRAFT" | "ACTIVE" | "HIDDEN" | "LOW_STOCK";

export type ApiHolidayKit = {
    id: string;
    sku: string;
    tier: KitTier;
    holidayId: string;
    status: KitStatus;
    price30Day: string;
    price60Day: string;
    deposit: string;
};

export type ApiHoliday = {
    id: string;
    name: string;
    image: string;
    category: HolidayCategory;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    kits: ApiHolidayKit[];
    createdAt: string;
    updatedAt: string;
};

export async function getHolidays(): Promise<ApiHoliday[]> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: ApiHoliday[] };
    return data.items;
}
