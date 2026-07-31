import { request, toQuery, type Paginated } from "./base";
import type { HolidayCategory } from "./holiday";

export type Duration = "THIRTY_DAY" | "SIXTY_DAY";
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
export type ReturnCondition = "GOOD" | "DAMAGED" | "MISSING" | "LOST";

// Backend supports STARTER | PREMIUM | ULTIMATE; admin's KitTier currently narrows to two,
// so for orders we keep the wider union to be safe regardless of the kit tier on the order.
export type OrderKitTier = "STARTER" | "PREMIUM" | "ULTIMATE";

export type ApiOrderUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: { phone: string } | null;
};

export type ApiOrderKit = {
    id: string;
    sku: string;
    tier: OrderKitTier;
};

export type ApiOrderHoliday = {
    id: string;
    name: string;
    image: string;
    category: HolidayCategory;
};

export type ApiOrderItem = {
    qty: number;
    item: { id: string; sku: string; name: string; image: string; category: string | null };
};

export type ApiOrderAddOn = {
    qty: number;
    price: string;
    deposit: string;
    addOn: { id: string; sku: string | null; name: string; image: string };
};

export type ApiReturnLine = {
    id: string;
    itemId: string | null;
    addOnId: string | null;
    qty: number;
    condition: ReturnCondition;
    feeCharged: string;
    notes: string | null;
};

export type ApiOrder = {
    id: string;
    orderNumber: string;
    userId: string;
    user: ApiOrderUser;
    kitId: string;
    kit: ApiOrderKit;
    holidayId: string;
    holiday: ApiOrderHoliday;
    duration: Duration;
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
    stripeRefundId: string | null;
    paidAt: string | null;
    stripePaymentIntentId: string | null;
    stripeChargeId: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    items: ApiOrderItem[];
    addOns: ApiOrderAddOn[];
    returnLines: ApiReturnLine[];
};

export type ListOrdersParams = {
    page?: number;
    limit?: number;
    search?: string;
    filter?: "active" | "recent" | "returns";
    startDate?: string;
    endDate?: string;
};

export type UpdateOrderStatusPayload = {
    status: OrderStatus;
    trackingNumber?: string;
    trackingUrl?: string;
};

export type SetReturnLabelPayload = {
    returnLabelUrl?: string;
    returnTrackingNumber?: string;
    returnTrackingUrl?: string;
};

export type InspectReturnLinePayload = {
    itemId?: string;
    addOnId?: string;
    qty: number;
    condition: ReturnCondition;
    feeCharged?: number;
    notes?: string;
};

export type InspectReturnPayload = {
    lines: InspectReturnLinePayload[];
    inspectionNotes?: string;
};

export const ordersApi = {
    list: (params: ListOrdersParams = {}) => request<Paginated<ApiOrder>>(`/order/admin${toQuery(params)}`),
    get: (id: string) => request<ApiOrder>(`/order/admin/${id}`),
    updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
        request<ApiOrder>(`/order/admin/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    setReturnLabel: (id: string, payload: SetReturnLabelPayload) =>
        request<ApiOrder>(`/order/admin/${id}/return-label`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    inspectReturn: (id: string, payload: InspectReturnPayload) =>
        request<ApiOrder>(`/order/admin/${id}/inspect`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    completeInspected: (id: string) =>
        request<ApiOrder>(`/order/admin/${id}/complete`, {
            method: "PATCH",
        }),
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: "Pending",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    RESERVED: "Reserved",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    RETURN_REQUESTED: "Return Requested",
    RETURN_IN_TRANSIT: "Return In Transit",
    RETURN_RECEIVED: "Return Received",
    INSPECTED: "Inspected",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
};

const DURATION_LABEL: Record<Duration, string> = {
    THIRTY_DAY: "30 Days",
    SIXTY_DAY: "60 Days",
};

const TIER_LABEL: Record<OrderKitTier, string> = {
    STARTER: "Starter",
    PREMIUM: "Premium",
    ULTIMATE: "Ultimate",
};

export function formatOrderStatus(status: OrderStatus) {
    return ORDER_STATUS_LABEL[status];
}

export function formatPaymentStatus(status: PaymentStatus) {
    return PAYMENT_STATUS_LABEL[status];
}

export function formatDuration(duration: Duration) {
    return DURATION_LABEL[duration];
}

export function formatTier(tier: OrderKitTier) {
    return TIER_LABEL[tier];
}

export function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined) return ", ";
    const n = typeof value === "string" ? Number.parseFloat(value) : value;
    if (Number.isNaN(n)) return ", ";
    return `$${n.toFixed(2)}`;
}

export function formatShipDate(order: ApiOrder) {
    const value = order.shippedAt ?? order.startDate;
    if (!value) return ", ";
    return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatAddOnsSummary(order: ApiOrder) {
    if (!order.addOns.length) return ", ";
    return order.addOns.map((a) => a.addOn.name).join(", ");
}

export function totalDeposit(order: ApiOrder) {
    return Number.parseFloat(order.kitDeposit) + Number.parseFloat(order.addOnDeposit);
}

/**
 * Returns the next valid status transition(s) for an order.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["RESERVED", "CANCELLED"],
    RESERVED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["COMPLETED"],
    RETURN_REQUESTED: ["RETURN_IN_TRANSIT"],
    RETURN_IN_TRANSIT: ["RETURN_RECEIVED"],
    RETURN_RECEIVED: [], // → /inspect (separate endpoint)
    INSPECTED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
};

export function getNextActions(order: ApiOrder): OrderStatus[] {
    // Don't allow status changes if payment isn't confirmed (except cancel)
    if (order.paymentStatus !== "PAID") {
        const transitions = ALLOWED_TRANSITIONS[order.status] ?? [];
        return transitions.filter((s) => s === "CANCELLED");
    }
    return ALLOWED_TRANSITIONS[order.status] ?? [];
}
