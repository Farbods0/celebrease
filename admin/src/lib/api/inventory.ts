import type { KitTier } from "./kit";
import { request } from "./base";

export type InventoryStatus = "ACTIVE" | "LOW_STOCK" | "RETIRED";

export type InventoryKitItem = {
    qty: number;
    kit: {
        id: string;
        sku: string;
        tier: KitTier;
        holidayId: string;
        holiday: { id: string; name: string };
    };
};

export type ApiInventoryItem = {
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
    totalQty: number;
    lowStockThreshold: number;
    initialStatus: InventoryStatus;
    status: InventoryStatus;
    kitItems: InventoryKitItem[];
    createdAt: string;
    updatedAt: string;
};

export type KitMappingPayload = { kitId: string; qty: number };

export type CreateInventoryItemPayload = {
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
    initialStatus?: InventoryStatus;
    status?: InventoryStatus;
    kits?: KitMappingPayload[];
};

export type UpdateInventoryItemPayload = Partial<Omit<CreateInventoryItemPayload, "initialStatus">>;

export const inventoryApi = {
    listAll: () => request<{ items: ApiInventoryItem[] }>(`/inventory/admin`),
    get: (id: string) => request<ApiInventoryItem>(`/inventory/${id}`),
    create: (payload: CreateInventoryItemPayload) =>
        request<ApiInventoryItem>(`/inventory`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateInventoryItemPayload) =>
        request<ApiInventoryItem>(`/inventory/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/inventory/${id}`, {
            method: "DELETE",
        }),
};
