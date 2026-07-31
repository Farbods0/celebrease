import { apiPrefix, apiURL, readError } from "./base";



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
