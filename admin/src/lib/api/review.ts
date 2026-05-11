import { request, toQuery, type Paginated } from "./base";

export type ApiReview = {
    id: string;
    name: string;
    image: string | null;
    rating: number;
    content: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type ListReviewsParams = {
    page?: string;
    limit?: string;
    search?: string;
};

export type CreateReviewPayload = {
    name: string;
    image?: string | null;
    rating: number;
    content: string;
    isActive?: boolean;
};

export type UpdateReviewPayload = {
    name?: string;
    image?: string | null;
    rating?: number;
    content?: string;
    isActive?: boolean;
};

export const reviewsApi = {
    list: (params: ListReviewsParams = {}) => request<Paginated<ApiReview>>(`/review${toQuery(params)}`),
    create: (payload: CreateReviewPayload) =>
        request<ApiReview>(`/review`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    update: (id: string, payload: UpdateReviewPayload) =>
        request<ApiReview>(`/review/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};
