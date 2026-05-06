const baseURL = process.env.NEXT_PUBLIC_APP_SERVER as string;
const apiPrefix = "/api/v1";

export type PlanCode = "STARTER" | "PREMIUM" | "ULTIMATE";

export type ApiPlanFeature = {
    id: string;
    text: string;
    sortOrder: number;
};

export type ApiPlan = {
    id: string;
    code: PlanCode;
    name: string;
    description: string | null;
    monthlyPrice: string;
    yearlyPrice: string | null;
    holidaysPerYear: number;
    isActive: boolean;
    sortOrder: number;
    features: ApiPlanFeature[];
};

export async function getPlans(): Promise<ApiPlan[]> {
    const res = await fetch(`${baseURL}${apiPrefix}/plan`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: ApiPlan[] };
    return data.items;
}

export type BillingCycle = "MONTHLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
export type HolidaySlotStatus = "PENDING" | "SELECTED" | "SHIPPED" | "RETURNED" | "SKIPPED";

export type ApiSubscriptionHolidaySlot = {
    id: string;
    slotNumber: number;
    status: HolidaySlotStatus;
    holidayId: string | null;
    orderId: string | null;
};

export type ApiSubscription = {
    id: string;
    plan: { id: string; code: PlanCode; name: string; holidaysPerYear: number };
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    cycleStart: string | null;
    cycleEnd: string | null;
    nextBillingAt: string | null;
    cancelledAt: string | null;
    holidaySlots: ApiSubscriptionHolidaySlot[];
};

export class CheckoutConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CheckoutConflictError";
    }
}

export async function getMySubscription(): Promise<ApiSubscription | null> {
    const res = await fetch(`${baseURL}${apiPrefix}/subscription/me`, {
        credentials: "include",
        cache: "no-store",
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}

export async function createSubscriptionCheckout(args: { planId: string; billingCycle: BillingCycle }): Promise<{ url: string }> {
    const res = await fetch(`${baseURL}${apiPrefix}/subscription/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(args),
    });
    if (!res.ok) {
        let message = res.statusText;
        try {
            const body = await res.json();
            if (body && typeof body.message === "string") message = body.message;
        } catch {
            // body wasn't JSON — keep statusText
        }
        if (res.status === 409) throw new CheckoutConflictError(message || "You already have an active subscription");
        throw new Error(message || "Failed to start checkout");
    }
    return res.json();
}
