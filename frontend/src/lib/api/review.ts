import { apiPrefix, apiURL } from "./base";

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        if (body && typeof body.message === "string") return body.message;
    } catch {
        // not JSON
    }
    return `${fallback}: ${res.statusText}`;
}

export type ApiReview = {
    id: string;
    name: string;
    image: string | null;
    rating: number;
    content: string;
    createdAt: string;
};

export async function getActiveReviews(): Promise<{ items: ApiReview[] }> {
    const res = await fetch(apiURL(`${apiPrefix}/review/active`), { next: { revalidate: 3600 } });

    if (!res.ok) {
        throw new Error(await readError(res, "Failed to get reviews"));
    }

    const data = await res.json();
    return data;
}
