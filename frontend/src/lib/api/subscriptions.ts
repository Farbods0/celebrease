const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

export type ApiPaymentMethod = {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
};

async function serverCookie(): Promise<string | undefined> {
    if (typeof window !== "undefined") return undefined;
    const { cookies } = await import("next/headers");
    return (await cookies()).toString();
}

export async function getMyPaymentMethod(): Promise<ApiPaymentMethod | null> {
    const cookie = await serverCookie();
    const res = await fetch(`${baseURL}${apiPrefix}/subscription/payment-method`, {
        cache: "no-store",
        headers: {
            ...(cookie && { Cookie: cookie }),
        },
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}
