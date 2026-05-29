import { request, toQuery, type Paginated } from "./base";

export type ApiUser = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    banned: boolean;
    emailVerified: boolean;
    phone: string | null;
    region: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ListUsersParams = {
    page?: string;
    limit?: string;
    search?: string;
    role?: "admin" | "user";
};

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user";
    phone?: string;
    region?: string;
};

export type UpdateUserPayload = {
    name: string;
    role?: "admin" | "user";
    banned: boolean;
    phone?: string;
    region?: string;
};

export const usersApi = {
    list: (params: ListUsersParams = {}) => request<Paginated<ApiUser>>(`/user${toQuery(params)}`),
    get: (id: string) => request<ApiUser>(`/user/${id}`),
    create: (payload: CreateUserPayload) =>
        request<ApiUser>(`/user`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateUserPayload) =>
        request<ApiUser>(`/user/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
    remove: (id: string) =>
        request<{ id: string }>(`/user/${id}`, { method: "DELETE" }),
};
