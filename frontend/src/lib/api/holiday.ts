export const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
export const apiPrefix = "/api/v1";

export type HolidayCategory = "TRADITIONAL" | "CULTURAL" | "EVENT_BASED";
export type KitTier = "STARTER" | "PREMIUM" | "ULTIMATE";
export type KitStatus = "DRAFT" | "ACTIVE" | "HIDDEN" | "LOW_STOCK";
export type ItemStatus = "ACTIVE" | "LOW_STOCK" | "RETIRED";
export type AddOnStatus = "ACTIVE" | "INACTIVE";

export type ApiKitItem = {
    qty: number;
    item: {
        id: string;
        sku: string;
        name: string;
        image: string;
        category: string;
    };
};

export type ApiHolidayKit = {
    id: string;
    sku: string;
    tier: KitTier;
    price30Day: string;
    price60Day: string;
    deposit: string;
    items: Array<ApiKitItem>;
};

export type ApiHolidayAddOn = {
    addOn: {
        id: string;
        sku: string;
        name: string;
        image: string;
        price: number;
        deposit: number;
    };
};

export type ApiHoliday = {
    id: string;
    name: string;
    image: string;
    category: HolidayCategory;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    kits: Array<ApiHolidayKit>;
    addOns: Array<ApiHolidayAddOn>;
};

export type ApiHolidayDetail = {
    id: string;
    name: string;
    image: string;
    category: HolidayCategory;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export async function getHolidays(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays`, { cache: "no-store" });
    if (!res.ok) {
        return { items: [] };
    }

    const data = await res.json();
    return data;
}

export async function getHolidayById(
    id: string,
): Promise<{ holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}`, { cache: "no-store" });
    if (!res.ok) {
        return { holiday: null, kits: [], addOns: [], holidays: [] };
    }

    const data = await res.json();
    return data;
}

export async function getHolidaysByLoves(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/loves`, { cache: "no-store" });
    if (!res.ok) {
        return { items: [] };
    }

    const data = await res.json();
    return data;
}

export async function getMyHolidayLoves(): Promise<{ holidayIds: string[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/me/loves`, {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) return { holidayIds: [] };
    return res.json();
}

export async function loveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to love holiday");
    return res.json();
}

export async function unloveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to unlove holiday");
    return res.json();
}
