import { request, toQuery } from "./base";

export type KitTier = "STARTER" | "PREMIUM";
export type KitStatus = "DRAFT" | "ACTIVE" | "HIDDEN" | "LOW_STOCK";

export type ApiKitItem = {
    qty: number;
    item: { id: string; sku: string; name: string; image: string; category: string | null; status: string };
};

export type ApiKitPreviewItem = {
    sortOrder: number;
    item: { id: string; sku: string; name: string; image: string };
};

export type ApiKit = {
    id: string;
    sku: string;
    tier: KitTier;
    holidayId: string;
    holiday: { id: string; name: string; category: string; image: string };
    status: KitStatus;
    price30Day: string;
    price60Day: string;
    deposit: string;
    seasonStart: string | null;
    seasonEnd: string | null;
    alwaysVisible: boolean;
    visibleOnPdp: boolean;
    addOnsEnabled: boolean;
    limitInventory: boolean;
    items: ApiKitItem[];
    previewItems: ApiKitPreviewItem[];
    createdAt: string;
    updatedAt: string;
};

export type CreateKitPayload = {
    sku: string;
    tier: KitTier;
    holidayId: string;
    status?: KitStatus;
    price30Day: number;
    price60Day: number;
    deposit: number;
    seasonStart?: string;
    seasonEnd?: string;
    alwaysVisible?: boolean;
    visibleOnPdp?: boolean;
    addOnsEnabled?: boolean;
    limitInventory?: boolean;
};

export type UpdateKitPayload = Partial<CreateKitPayload>;

export const kitsApi = {
    listAll: (params: { holidayId?: string } = {}) => request<{ items: ApiKit[] }>(`/kits/admin${toQuery(params)}`),
    get: (id: string) => request<ApiKit>(`/kits/${id}`),
    create: (payload: CreateKitPayload) =>
        request<ApiKit>(`/kits`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateKitPayload) =>
        request<ApiKit>(`/kits/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/kits/${id}`, {
            method: "DELETE",
        }),
    addItem: (kitId: string, payload: { itemId: string; qty?: number }) =>
        request<{ id: string }>(`/kits/${kitId}/items`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    removeItem: (kitId: string, itemId: string) =>
        request<{ id: string }>(`/kits/${kitId}/items/${itemId}`, {
            method: "DELETE",
        }),
    addPreviewItem: (kitId: string, payload: { itemId: string }) =>
        request<{ id: string }>(`/kits/${kitId}/preview-items`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    removePreviewItem: (kitId: string, itemId: string) =>
        request<{ id: string }>(`/kits/${kitId}/preview-items/${itemId}`, {
            method: "DELETE",
        }),
    reorderPreviewItems: (kitId: string, payload: { itemIds: string[] }) =>
        request<{ id: string }>(`/kits/${kitId}/preview-items/reorder`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};
