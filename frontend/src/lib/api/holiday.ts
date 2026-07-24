const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // not JSON
    }
    return `${fallback}: ${res.statusText}`;
}

export type HolidayCategory = "TRADITIONAL" | "CULTURAL" | "EVENT_BASED";
export type KitTier = "STARTER" | "PREMIUM" | "ULTIMATE";
export type KitStatus = "DRAFT" | "ACTIVE" | "HIDDEN" | "LOW_STOCK";
export type ItemStatus = "ACTIVE" | "LOW_STOCK" | "RETIRED";

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

export type ApiKitPreviewItem = {
    sortOrder: number;
    item: {
        id: string;
        sku: string;
        name: string;
        image: string;
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
    previewItems: Array<ApiKitPreviewItem>;
};

export type ApiHolidayAddOn = {
    addOn: {
        id: string;
        sku: string;
        name: string;
        image: string;
        price: number;
        deposit: number;
        description: string | null;
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

import { events } from "@/data/index";

const mockHolidays: ApiHoliday[] = events.map((e, i) => ({
    id: e.id,
    name: e.title,
    image: `/${e.image}`,
    category: e.type.toUpperCase().replace("-", "_") as HolidayCategory,
    description: e.description,
    sortOrder: i,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kits: [
        {
            id: `kit-${e.id}-starter`,
            sku: `${e.id}-STARTER`,
            tier: "STARTER",
            price30Day: e.price.basic.split("-")[0] || "30",
            price60Day: "50",
            deposit: "25",
            items: [],
            previewItems: []
        },
        {
            id: `kit-${e.id}-premium`,
            sku: `${e.id}-PREMIUM`,
            tier: "PREMIUM",
            price30Day: e.price.premium.split("-")[0] || "50",
            price60Day: "80",
            deposit: "40",
            items: [],
            previewItems: []
        }
    ]
}));

export async function getHolidays(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays`, { cache: "no-store" });
    if (!res.ok) {
        return { items: mockHolidays };
    }
    return res.json();
}

export async function getHolidayById(
    id: string,
): Promise<{ holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}`, { cache: "no-store" });
    if (!res.ok) {
        const holiday = mockHolidays.find(h => h.id === id) || mockHolidays[0];
        return {
            holiday: holiday as ApiHolidayDetail,
            kits: holiday.kits,
            addOns: [],
            holidays: mockHolidays
        };
    }
    return res.json();
}

export async function getHolidaysByLoves(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/loves`, { cache: "no-store" });
    if (!res.ok) {
        return { items: mockHolidays.slice(0, 4) };
    }
    return res.json();
}

export async function getMyHolidayLoves(): Promise<{ holidayIds: string[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/me/loves`, { credentials: "include" });
    if (!res.ok) {
        return { holidayIds: [] };
    }
    return res.json();
}

export async function getMyWishlist(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/me/wishlist`, { credentials: "include" });
    if (!res.ok) {
        return { items: [] };
    }
    return res.json();
}

export async function loveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        const errorMsg = await readError(res, "Failed to save to wishlist");
        throw new Error(errorMsg);
    }
    return res.json();
}

export async function unloveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const errorMsg = await readError(res, "Failed to remove from wishlist");
        throw new Error(errorMsg);
    }
    return res.json();
}
