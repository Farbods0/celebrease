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
    const res = await fetch(`${baseURL}${apiPrefix}/plan`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: ApiPlan[] };
    return data.items;
}
