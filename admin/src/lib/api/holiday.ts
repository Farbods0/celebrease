import { request } from "./base";

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
    list: () => request<{ items: ApiHoliday[] }>(`/holidays/admin`),
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
