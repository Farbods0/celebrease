import type { AddOnStatus } from "./addon";
import { request } from "./base";
import type { KitStatus, KitTier } from "./kit";

export type HolidayCategory = "TRADITIONAL" | "CULTURAL" | "EVENT_BASED";

export type ApiHoliday = {
    id: string;
    name: string;
    image: string;
    category: HolidayCategory;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
} & {
    kits: Array<{
        id: string;
        sku: string;
        tier: KitTier;
        holidayId: string;
        status: KitStatus;
        price30Day: number;
        price60Day: number;
        deposit: number;
    }>;
} & {
    addOns: Array<{
        addOn: {
            id: string;
            sku: string;
            name: string;
            image: string;
            price: number;
            deposit: number;
            inventory: number;
            status: AddOnStatus;
        };
    }>;
};

export type CreateHolidayPayload = {
    name: string;
    image: string;
    category: HolidayCategory;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
};

export type UpdateHolidayPayload = Partial<CreateHolidayPayload>;

export const holidaysApi = {
    list: () => request<{ items: ApiHoliday[] }>(`/holidays`),
    listAll: () => request<{ items: ApiHoliday[] }>(`/holidays/admin`),
    get: (id: string) => request<ApiHoliday>(`/holidays/${id}`),
    create: (payload: CreateHolidayPayload) =>
        request<ApiHoliday>(`/holidays`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateHolidayPayload) =>
        request<ApiHoliday>(`/holidays/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/holidays/${id}`, {
            method: "DELETE",
        }),
};
