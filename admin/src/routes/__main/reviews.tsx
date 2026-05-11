import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewTable } from "@/components/reviews/review-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { reviewsApi, type ApiReview } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import * as z from "zod";

const searchSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
});

export const Route = createFileRoute("/__main/reviews")({
    validateSearch: searchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => reviewsApi.list(deps),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiReview | null>(null);
    const [viewItem, setViewItem] = useState<ApiReview | null>(null);

    const items = data.items;

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Reviews</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Manage customer reviews and ratings</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New Review</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <ReviewForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <ReviewTable items={items} onEdit={setEditItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No reviews found</p>
                    ) : (
                        items.map((item) => <ReviewCard key={item.id} item={item} onEdit={setEditItem} />)
                    )}
                </div>
            </Dialog>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <ReviewForm review={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
