export const baseURL = import.meta.env.DEV
    ? ((import.meta.env.VITE_APP_SERVER as string) || "https://celebrease-backend-production-4778.up.railway.app")
    : "https://celebrease-backend-production-4778.up.railway.app";
export const apiPrefix = "/api/v1";

export type Paginated<T> = {
    items: T[];
    total: number;
};

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

export function resolveImageUrl(url?: string | null): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === "") continue;
        usp.set(k, String(v));
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
}


