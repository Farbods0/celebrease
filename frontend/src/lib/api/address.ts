const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

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

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // not JSON
    }
    return `${fallback}: ${res.statusText}`;
}

async function serverCookie(): Promise<string | undefined> {
    if (typeof window !== "undefined") return undefined;
    const { cookies } = await import("next/headers");
    return (await cookies()).toString();
}

export async function getMyAddress(): Promise<ApiAddress | null> {
    const res = await fetch(`${baseURL}${apiPrefix}/address/me`, {
        cache: "no-store",
        headers: {
            Cookie: await serverCookie(),
        },
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data ?? null;
}

export async function upsertMyAddress(payload: UpsertAddressPayload): Promise<ApiAddress> {
    const res = await fetch(`${baseURL}${apiPrefix}/address/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to save address"));
    }

    const data = await res.json();
    return data ?? null;
}
