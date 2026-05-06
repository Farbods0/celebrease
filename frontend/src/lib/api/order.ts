const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

export type DeliveryOption = "STANDARD" | "EXPRESS";

export type CreateCheckoutPayload = {
    cartIds: string[];
    deliveryOption: DeliveryOption;
    deliveryNotes?: string;
};

export type CreateCheckoutResponse = {
    url: string | null;
    orderIds: string[];
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

export async function createOrderCheckout(payload: CreateCheckoutPayload): Promise<CreateCheckoutResponse> {
    const res = await fetch(`${baseURL}${apiPrefix}/order/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to start checkout"));
    }
    return res.json();
}
