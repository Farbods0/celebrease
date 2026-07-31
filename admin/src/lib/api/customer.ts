import { request, toQuery, type Paginated } from "./base";
import type { KitTier } from "./kit";
import type { OrderStatus } from "./order";

// ─── List types ───────────────────────────────────────────────

export type ApiCustomer = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    region: string | null;
    banned: boolean;
    createdAt: string;
    orderCount: number;
    completedCount: number;
    hasActiveSubscription: boolean;
    depositsHeld: number;
};

// ─── Detail types ─────────────────────────────────────────────

export type ApiCustomerAddress = {
    id: string;
    name: string;
    phone: string;
    streetLine1: string;
    streetLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export type ApiCustomerSubscription = {
    id: string;
    status: string;
    billingCycle: string;
    startedAt: string;
    nextBillingAt: string | null;
    plan: { id: string; code: string; name: string };
};

export type ApiCustomerOrder = {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: string;
    kitDeposit: string;
    addOnDeposit: string;
    createdAt: string;
    holiday: { id: string; name: string };
    kit: { id: string; tier: KitTier };
};

export type ApiCustomerDetail = ApiCustomer & {
    updatedAt: string;
    address: ApiCustomerAddress | null;
    subscription: ApiCustomerSubscription | null;
    recentOrders: ApiCustomerOrder[];
};

// ─── Params ───────────────────────────────────────────────────

export type ListCustomersParams = {
    page?: number;
    limit?: number;
    search?: string;
};

// ─── API ──────────────────────────────────────────────────────

export const customersApi = {
    list: (params: ListCustomersParams = {}) => request<Paginated<ApiCustomer>>(`/user/customer${toQuery(params)}`),
    get: (id: string) => request<ApiCustomerDetail>(`/user/customer/${id}`),
};

// ─── Helpers ──────────────────────────────────────────────────

export function formatCustomerDate(value: string | null | undefined) {
    if (!value) return ", ";
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDeposit(value: number) {
    return value === 0 ? "$0" : `$${value.toFixed(0)}`;
}

export function formatOnTimeReturns(completedCount: number, orderCount: number) {
    if (orderCount === 0) return ", ";
    return `${Math.round((completedCount / orderCount) * 100)}%`;
}

const SUB_STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Active",
    PAUSED: "Paused",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
};

export function formatSubStatus(status: string) {
    return SUB_STATUS_LABEL[status] ?? status;
}

const BILLING_LABEL: Record<string, string> = {
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

export function formatBillingCycle(cycle: string) {
    return BILLING_LABEL[cycle] ?? cycle;
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
