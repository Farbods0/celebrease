/**
 * Returns the correct API base URL depending on the execution environment.
 *
 * - Server Components (Node.js): must use an absolute URL, so we use the Railway backend directly.
 * - Client Components (browser): use "" (empty string) so requests go through the Next.js
 *   proxy rewrites defined in next.config.ts (/api/v1/* → Railway, /api/auth/* → Railway),
 *   making cookies same-site and reliable across all browsers.
 */
export function getBaseURL(): string {
    if (typeof window === "undefined") {
        // Server-side: use absolute URL to Railway backend
        return (
            process.env.NEXT_PUBLIC_APP_SERVER ||
            "https://celebrease-backend-production-4778.up.railway.app"
        );
    }
    // Client-side: empty string = same-origin, goes through Next.js proxy
    return "";
}

/**
 * Build a URL string that works on both server and client.
 * On server uses absolute Railway URL; on client uses relative path via proxy.
 */
export function apiURL(path: string, params?: Record<string, string | number | undefined>): string {
    const base = getBaseURL();
    const fullPath = `${base}${path}`;

    if (!params) return fullPath;

    // Build query string, skip undefined values
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");

    return qs ? `${fullPath}?${qs}` : fullPath;
}

export const apiPrefix = "/api/v1";

export function resolveImageUrl(path?: string | null): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return path; // Serve statically from frontend (Netlify)
    return path.startsWith("/") ? path : `/${path}`;
}

export async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // not JSON
    }
    return `${fallback}: ${res.statusText}`;
}
