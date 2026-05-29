import { request } from "./base";
import type { KitTier } from "./kit";

export type ItemStatus = "ACTIVE" | "HIDDEN" | "LOW_STOCK";

export type ItemKit = {
    qty: number;
    kit: {
        id: string;
        sku: string;
        tier: KitTier;
        holidayId: string;
        holiday: { id: string; name: string };
    };
};

export type ApiItem = {
    id: string;
    sku: string;
    name: string;
    image: string;
    description: string | null;
    category: string | null;
    vendorName: string;
    vendorEmail: string;
    vendorPhone: string;
    costPerUnit: string;
    lowStockThreshold: number;
    status: ItemStatus;
    kitItems: ItemKit[];
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

export type KitMappingPayload = { kitId: string; qty: number };

export type CreateItemPayload = {
    sku: string;
    name: string;
    image: string;
    description?: string;
    category?: string;
    vendorName: string;
    vendorEmail: string;
    vendorPhone: string;
    costPerUnit: number;
    totalQty: number;
    lowStockThreshold?: number;
    status?: ItemStatus;
    kits?: KitMappingPayload[];
};

export type UpdateItemPayload = Partial<CreateItemPayload>;

export const inventoryApi = {
    listAll: () => request<{ items: ApiItem[] }>(`/inventory/admin`),
    get: (id: string) => request<ApiItem>(`/inventory/${id}`),
    create: (payload: CreateItemPayload) =>
        request<ApiItem>(`/inventory`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateItemPayload) =>
        request<ApiItem>(`/inventory/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/inventory/${id}`, {
            method: "DELETE",
        }),
};

const ITEM_STATUS_LABEL: Record<ApiItem["status"], string> = {
    ACTIVE: "Active",
    HIDDEN: "Hidden",
    LOW_STOCK: "Low Stock",
};

export function formatItemStatus(status: ApiItem["status"]) {
    return ITEM_STATUS_LABEL[status];
}
