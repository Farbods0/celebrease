const baseURL = "";
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
    kitDiscount: number;
    addOnDiscount: number;
    isActive: boolean;
    sortOrder: number;
    features: ApiPlanFeature[];
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

export async function getPlans(): Promise<{ items: ApiPlan[] }> {
    const res = await fetch(`${baseURL}${apiPrefix}/plan`, { cache: "no-store" });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get plans"));
    }

    const data = await res.json();
    return data;
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
    plan: {
        id: string;
        code: PlanCode;
        name: string;
        holidaysPerYear: number;
        kitDiscount: number;
        addOnDiscount: number;
    };
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    cycleStart: string | null;
    cycleEnd: string | null;
    nextBillingAt: string | null;
    cancelledAt: string | null;
    holidaySlots: ApiSubscriptionHolidaySlot[];
};

export async function getMySubscription(): Promise<ApiSubscription | null> {
    const res = await fetch(`${baseURL}${apiPrefix}/subscription/me`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get subscription"));
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
        throw new Error(await readError(res, "Failed to start checkout"));
    }

    const data = await res.json();
    return data;
}
