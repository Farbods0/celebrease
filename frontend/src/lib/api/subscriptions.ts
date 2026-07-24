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

export type ApiPaymentMethod = {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
};

export async function getMyPaymentMethod(): Promise<ApiPaymentMethod | null> {
    const res = await fetch(apiURL(`${apiPrefix}/subscription/payment-method`));

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get payment method"));
    }

    try {
        const data = await res.json();
        return data;
    } catch {
        return null;
    }
}
