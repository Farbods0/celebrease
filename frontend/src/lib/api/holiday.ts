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
    const res = await fetch(`${baseURL}${apiPrefix}/holidays`, { credentials: "include" });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get holidays"));
    }

    const data = await res.json();
    return data;
}

export async function getHolidayById(
    id: string,
): Promise<{ holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}`, { cache: "no-store" });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get holiday"));
    }

    const data = await res.json();
    return data;
}

export async function getHolidaysByLoves(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/loves`, { cache: "no-store" });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get loves"));
    }

    const data = await res.json();
    return data;
}

export async function getMyHolidayLoves(): Promise<{ holidayIds: string[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/me/loves`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get my loves"));
    }

    const data = await res.json();
    return data;
}

export async function loveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to love holiday"));
    }

    const data = await res.json();
    return data;
}

export async function unloveHoliday(id: string): Promise<{ loved: boolean; loveCount: number }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}/love`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to unlove holiday"));
    }

    const data = await res.json();
    return data;
}
