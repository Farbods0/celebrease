import { apiPrefix, apiURL, readError } from "./base";

export type ApiAddress = {
    id: string;
    userId: string;
    name: string;
    phone: string;
    streetLine1: string;
    streetLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    createdAt: string;
    updatedAt: string;
};

export type UpsertAddressPayload = {
    name: string;
    phone: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};



export async function getMyAddress(): Promise<ApiAddress | null> {
    const res = await fetch(apiURL(`${apiPrefix}/address/me`));
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get address"));
    }
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export async function upsertMyAddress(payload: UpsertAddressPayload): Promise<ApiAddress> {
    const res = await fetch(apiURL(`${apiPrefix}/address/me`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to save address"));
    }
    return res.json();
}
