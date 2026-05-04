import { request } from "./base";
import type { KitTier } from "./kit";

export type AddOnStatus = "ACTIVE" | "HIDDEN";

export type AddOnKitLink = {
    kitId: string;
    kit: {
        id: string;
        sku: string;
        tier: KitTier;
        holidayId: string;
        holiday: { id: string; name: string };
    };
};

export type ApiAddOn = {
    id: string;
    sku: string | null;
    name: string;
    image: string;
    description: string | null;
    price: string;
    deposit: string;
    inventory: number;
    status: AddOnStatus;
    kitLinks: AddOnKitLink[];
    holidays: { id: string; name: string }[];
    holidayIds: string[];
    createdAt: string;
    updatedAt: string;
};

export type CreateAddOnPayload = {
    sku?: string;
    name: string;
    image: string;
    description?: string;
    price: number;
    deposit?: number;
    inventory?: number;
    status?: AddOnStatus;
    holidayIds?: string[];
};

export type UpdateAddOnPayload = Partial<CreateAddOnPayload>;

export const addOnsApi = {
    listAll: () => request<{ items: ApiAddOn[] }>(`/addons/admin`),
    get: (id: string) => request<ApiAddOn>(`/addons/${id}`),
    create: (payload: CreateAddOnPayload) =>
        request<ApiAddOn>(`/addons`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateAddOnPayload) =>
        request<ApiAddOn>(`/addons/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/addons/${id}`, {
            method: "DELETE",
        }),
};
