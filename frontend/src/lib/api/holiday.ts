import { apiPrefix, apiURL } from "./base";

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

export async function getHolidays(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays`), { cache: "no-store" });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to load holidays"));
    }
    return res.json();
}

export async function getHolidayById(
    id: string,
): Promise<{ holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/${id}`), { cache: "no-store" });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to load holiday"));
    }
    return res.json();
}

export async function getHolidaysByLoves(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/loves`), { cache: "no-store" });
    if (!res.ok) {
        return { items: [] };
    }
    return res.json();
}

export async function getMyHolidayLoves(): Promise<{ holidayIds: string[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/me/loves`));
    if (!res.ok) {
        return { holidayIds: [] };
    }
    return res.json();
}

export async function getMyWishlist(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/me/wishlist`));
    if (!res.ok) {
        return { items: [] };
    }
    return res.json();
}

export async function loveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/${id}/love`), {
        method: "POST",
    });
    if (!res.ok) {
        const errorMsg = await readError(res, "Failed to save to wishlist");
        throw new Error(errorMsg);
    }
    return res.json();
}

export async function unloveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(apiURL(`${apiPrefix}/holidays/${id}/love`), {
        method: "DELETE",
    });
    if (!res.ok) {
        const errorMsg = await readError(res, "Failed to remove from wishlist");
        throw new Error(errorMsg);
    }
    return res.json();
}
