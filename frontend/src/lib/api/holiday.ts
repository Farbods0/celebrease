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
        description: string | null;
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
    try {
        const res = await fetch(`${baseURL}${apiPrefix}/holidays`, { credentials: "include" });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch (error) {
        console.warn("API unreachable. Falling back to mock data for getHolidays.");
        return { items: MOCK_HOLIDAYS };
    }
}

export async function getHolidayById(
    id: string,
): Promise<{ holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] }> {
    try {
        const res = await fetch(`${baseURL}${apiPrefix}/holidays/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch (error) {
        console.warn("API unreachable. Falling back to mock data for getHolidayById.");
        const mock = MOCK_HOLIDAYS.find(h => h.id === id) || MOCK_HOLIDAYS[0];
        return {
            holiday: mock,
            kits: mock.kits,
            addOns: [],
            holidays: MOCK_HOLIDAYS
        };
    }
}

const MOCK_HOLIDAYS: ApiHoliday[] = [
    {
        id: "mock-christmas",
        name: "Classic Christmas",
        image: "/gradient/hero.png",
        category: "TRADITIONAL",
        description: "A beautiful, traditional Christmas setup with timeless ornaments.",
        sortOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        kits: [{
            id: "kit-1",
            sku: "XMAS-TRAD-1",
            tier: "PREMIUM",
            price30Day: "89",
            price60Day: "149",
            deposit: "50",
            items: [],
            previewItems: []
        }]
    },
    {
        id: "mock-halloween",
        name: "Spooky Halloween",
        image: "/gradient/section.png",
        category: "EVENT_BASED",
        description: "Everything you need for a hauntingly good time.",
        sortOrder: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        kits: [{
            id: "kit-2",
            sku: "HALLO-SPOOK-1",
            tier: "STARTER",
            price30Day: "49",
            price60Day: "89",
            deposit: "30",
            items: [],
            previewItems: []
        }]
    },
    {
        id: "mock-thanksgiving",
        name: "Autumn Harvest",
        image: "/gradient/footer.png",
        category: "TRADITIONAL",
        description: "Warm tones and elegant pieces for your Thanksgiving table.",
        sortOrder: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        kits: [{
            id: "kit-3",
            sku: "TG-AUTUMN-1",
            tier: "ULTIMATE",
            price30Day: "129",
            price60Day: "199",
            deposit: "75",
            items: [],
            previewItems: []
        }]
    }
];

export async function getHolidaysByLoves(): Promise<{ items: ApiHoliday[] }> {
    try {
        const res = await fetch(`${baseURL}${apiPrefix}/holidays/loves`, { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch (error) {
        console.warn("API unreachable. Falling back to mock data for getHolidaysByLoves.");
        return { items: MOCK_HOLIDAYS };
    }
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

export async function getMyWishlist(): Promise<{ items: ApiHoliday[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/holidays/me/wishlist`, {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get wishlist"));
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
