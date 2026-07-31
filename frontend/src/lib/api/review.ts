import { apiPrefix, apiURL, readError } from "./base";



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
