import { apiPrefix, apiURL } from "./base";
import { HolidayCategory, KitTier } from "@/lib/api/holiday";

export type Duration = "THIRTY_DAY" | "SIXTY_DAY";

export type ApiCartItem = {
    qty: number;
    item: { id: string; sku: string; name: string; image: string; category: string | null };
};

export type ApiCartAddOn = {
    qty: number;
    price: string;
    deposit: string;
    addOn: { id: string; sku: string | null; name: string; image: string };
};

export type ApiCart = {
    id: string;
    duration: Duration;
    startDate: string;
    endDate: string;
    rentalFee: string;
    extendedFee: string;
    kitDeposit: string;
    addOnsFee: string;
    addOnDeposit: string;
    total: string;
    createdAt: string;
    updatedAt: string;
    kit: { id: string; sku: string; tier: KitTier };
    holiday: { id: string; name: string; image: string; category: HolidayCategory };
    items: ApiCartItem[];
    addOns: ApiCartAddOn[];
};

export type AddToCartPayload = {
    holidayId: string;
    kitId: string;
    duration: Duration;
    startDate: string;
    endDate: string;
    addOns?: { addOnId: string; qty?: number }[];
};

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // not JSON
    }
    return `${fallback}: ${res.statusText}`;
}

export async function getMyCarts(): Promise<{ items: ApiCart[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/cart`));
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get carts"));
    }
    return res.json();
}

export async function addToCart(payload: AddToCartPayload): Promise<ApiCart> {
    const res = await fetch(apiURL(`${apiPrefix}/cart`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to add to cart"));
    }
    return res.json();
}

export async function removeFromCart(cartId: string): Promise<{ ok: true }> {
    const res = await fetch(apiURL(`${apiPrefix}/cart/${cartId}`), {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to remove cart item"));
    }
    return res.json();
}
