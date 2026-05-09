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

export type OrderStatus =
    | "PENDING"
    | "SHIPPED"
    | "DELIVERED"
    | "RESERVED"
    | "CANCELLED"
    | "COMPLETED"
    | "RETURN_REQUESTED"
    | "RETURN_IN_TRANSIT"
    | "RETURN_RECEIVED"
    | "INSPECTED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type ApiOrder = {
    id: string;
    orderNumber: string;
    userId: string;
    duration: string;
    startDate: string;
    endDate: string;
    rentalFee: string;
    extendedFee: string;
    kitDeposit: string;
    addOnsFee: string;
    addOnDeposit: string;
    total: string;
    tax: string;
    shippingFee: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    trackingNumber: string | null;
    trackingUrl: string | null;
    returnLabelUrl: string | null;
    returnTrackingNumber: string | null;
    returnTrackingUrl: string | null;
    returnRequestedAt: string | null;
    returnShippedAt: string | null;
    returnReceivedAt: string | null;
    inspectedAt: string | null;
    inspectionNotes: string | null;
    depositRefunded: string;
    depositForfeited: string;
    shippedAt: string | null;
    deliveredAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    kit: {
        id: string;
        sku: string;
        tier: string;
    };
    holiday: {
        id: string;
        name: string;
        image: string;
        category: string;
    };
    items: {
        qty: number;
        item: {
            id: string;
            sku: string;
            name: string;
            image: string;
            category: string;
        };
    }[];
    addOns: {
        qty: number;
        price: string;
        deposit: string;
        addOn: {
            id: string;
            sku: string;
            name: string;
            image: string;
        };
    }[];
};

export type ListOrdersResponse = {
    items: ApiOrder[];
    total: number;
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

    const data = await res.json();
    return data;
}

export async function listMyOrders(params?: { filter?: "active" | "recent"; page?: number; limit?: number }): Promise<ListOrdersResponse> {
    const url = new URL(`${baseURL}${apiPrefix}/order/me`);
    if (params?.filter) url.searchParams.set("filter", params.filter);
    if (params?.page) url.searchParams.set("page", params.page.toString());
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());

    const res = await fetch(url.toString(), { credentials: "include" });
    return res.json();
}

export async function cancelMyOrder(orderId: string): Promise<ApiOrder> {
    const res = await fetch(`${baseURL}${apiPrefix}/order/me/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to cancel order"));
    }
    return res.json();
}

export async function retryOrderPayment(orderId: string): Promise<{ url: string }> {
    const res = await fetch(`${baseURL}${apiPrefix}/order/me/${orderId}/retry-payment`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to retry payment"));
    }
    return res.json();
}

export async function requestOrderReturn(orderId: string): Promise<ApiOrder> {
    const res = await fetch(`${baseURL}${apiPrefix}/order/me/${orderId}/return`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to request return"));
    }
    return res.json();
}
