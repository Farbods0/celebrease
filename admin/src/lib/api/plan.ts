import { request } from "./base";

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
    createdAt: string;
    updatedAt: string;
};

export type CreatePlanPayload = {
    code: PlanCode;
    name: string;
    description?: string;
    monthlyPrice: number;
    yearlyPrice?: number;
    holidaysPerYear?: number;
    kitDiscount?: number;
    addOnDiscount?: number;
    isActive?: boolean;
    sortOrder?: number;
    features: string[];
};

export type UpdatePlanPayload = {
    name?: string;
    description?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    holidaysPerYear?: number;
    kitDiscount?: number;
    addOnDiscount?: number;
    isActive?: boolean;
    sortOrder?: number;
    features?: string[];
};

export const plansApi = {
    list: () => request<{ items: ApiPlan[] }>(`/plan/admin`),
    get: (id: string) => request<ApiPlan>(`/plan/${id}`),
    create: (payload: CreatePlanPayload) =>
        request<ApiPlan>(`/plan`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdatePlanPayload) =>
        request<ApiPlan>(`/plan/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};
