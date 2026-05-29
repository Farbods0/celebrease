import { request } from "./base";

export type ApiAddOn = {
    id: string;
    sku: string | null;
    name: string;
    image: string;
    description: string | null;
    price: string;
    deposit: string;
    isActive: boolean;
    holidays: { holiday: { id: string; name: string } }[];
    inventory: {
        totalQty: number;
        availableQty: number;
        reservedQty: number;
        shippedQty: number;
        cleaningQty: number;
        repairQty: number;
        lostQty: number;
    } | null;
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
    totalQty?: number;
    isActive?: boolean;
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
