const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

export type ApiPaymentMethod = {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
};

export async function getMyPaymentMethod(): Promise<ApiPaymentMethod | null> {
    const res = await fetch(`${baseURL}${apiPrefix}/subscription/payment-method`, { credentials: "include" });
    return res.json();
}
