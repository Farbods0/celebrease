import { request } from "./base";
import type { PlanCode } from "./plan";

export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
export type SubscriptionStage = "NOT_STARTED" | "IN_USE" | "RETURNED" | "COMPLETED";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type HolidaySlotStatus = "PENDING" | "SELECTED" | "SHIPPED" | "RETURNED" | "SKIPPED";

export type ApiSubscriptionUser = {
    id: string;
    name: string;
    email: string;
};

export type ApiSubscriptionPlan = {
    id: string;
    code: PlanCode;
    name: string;
    holidaysPerYear: number;
};

export type ApiSubscriptionHoliday = {
    id: string;
    name: string;
};

export type ApiSubscriptionHolidaySlot = {
    id: string;
    slotNumber: number;
    status: HolidaySlotStatus;
    holidayId: string | null;
    orderId: string | null;
    holiday: ApiSubscriptionHoliday | null;
};

export type ApiSubscription = {
    id: string;
    userId: string;
    user: ApiSubscriptionUser;
    planId: string;
    plan: ApiSubscriptionPlan;
    status: SubscriptionStatus;
    stage: SubscriptionStage;
    billingCycle: BillingCycle;
    stripeSubscriptionId: string | null;
    startedAt: string;
    cycleStart: string | null;
    cycleEnd: string | null;
    nextBillingAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    holidaySlots: ApiSubscriptionHolidaySlot[];
};

export const subscriptionsApi = {
    list: () => request<{ items: ApiSubscription[] }>(`/subscription/admin`),
    get: (id: string) => request<ApiSubscription>(`/subscription/admin/${id}`),
    updateStatus: (id: string, payload: { status: SubscriptionStatus; note?: string }) =>
        request<ApiSubscription>(`/subscription/admin/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    assignHolidaySlot: (id: string, slotId: string, payload: { holidayId: string }) =>
        request<ApiSubscription>(`/subscription/admin/${id}/slots/${slotId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
    ACTIVE: "Active",
    PAUSED: "Paused",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
};

const SLOT_STATUS_LABEL: Record<HolidaySlotStatus, string> = {
    PENDING: "Pending",
    SELECTED: "Selected",
    SHIPPED: "Shipped",
    RETURNED: "Returned",
    SKIPPED: "Skipped",
};

export function formatSubId(id: string) {
    return `S-${id.slice(-4).toUpperCase()}`;
}

export function formatStatus(status: SubscriptionStatus) {
    return STATUS_LABEL[status];
}

export function formatSlotStatus(status: HolidaySlotStatus) {
    return SLOT_STATUS_LABEL[status];
}

export function formatPlanLabel(sub: ApiSubscription) {
    const cycle = sub.billingCycle === "YEARLY" ? "Yearly" : "Monthly";
    return `${sub.plan.name} (${cycle})`;
}

export function formatDate(value: string | null) {
    if (!value) return ", ";
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function getCurrentSlot(sub: ApiSubscription): ApiSubscriptionHolidaySlot | null {
    const inFlight = sub.holidaySlots.find((s) => s.status === "SELECTED" || s.status === "SHIPPED");
    if (inFlight) return inFlight;
    const nextPending = sub.holidaySlots.find((s) => s.status === "PENDING");
    if (nextPending) return nextPending;
    return sub.holidaySlots[sub.holidaySlots.length - 1] ?? null;
}

export function getCurrentHolidayName(sub: ApiSubscription) {
    return getCurrentSlot(sub)?.holiday?.name ?? ", ";
}

export function getStageLabel(sub: ApiSubscription) {
    const completed = sub.holidaySlots.filter((s) => s.status === "RETURNED" || s.status === "SKIPPED").length;
    const slot = getCurrentSlot(sub);
    if (!slot) return `Holiday ${completed}`;
    return `Holiday ${slot.slotNumber}`;
}

export function getNextActionLabel(sub: ApiSubscription) {
    if (sub.status === "CANCELLED") return "Renewal Decision";
    if (sub.status === "EXPIRED") return "Renewal Decision";
    if (sub.status === "PAUSED") return "Subscription Paused";

    const slot = getCurrentSlot(sub);
    if (!slot) return "Renewal Pending";

    if (slot.status === "PENDING") {
        const anyCompleted = sub.holidaySlots.some((s) => s.status !== "PENDING");
        return anyCompleted ? "Pick Next Holiday" : "Choose First Holiday";
    }
    if (slot.status === "SELECTED") return "In Transit";
    if (slot.status === "SHIPPED") return "Awaiting Return";
    if (slot.status === "RETURNED") {
        const hasNext = sub.holidaySlots.some((s) => s.status === "PENDING");
        return hasNext ? "Pick Next Holiday" : "Renewal Pending";
    }
    return "Renewal Pending";
}
