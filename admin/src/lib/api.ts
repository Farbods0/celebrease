const baseURL = import.meta.env.VITE_APP_SERVER as string;
const apiPrefix = "/api/v1";

export type ApiUser = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    isBan: boolean;
    phone: string | null;
    region: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Paginated<T> = {
    items: T[];
    total: number;
};

export type ListUsersParams = {
    page?: string;
    limit?: string;
    search?: string;
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
    isBan: boolean;
    phone?: string;
    region?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseURL}${apiPrefix}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

function toQuery(params: Record<string, string | number | boolean | undefined>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === "") continue;
        usp.set(k, String(v));
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
}

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
};
