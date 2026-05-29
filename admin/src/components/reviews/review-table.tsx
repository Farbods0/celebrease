import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, reviewsApi, type ApiReview } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Check, MessageSquare, Pencil, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ReviewTableProps = {
    items: ApiReview[];
    onEdit: (item: ApiReview) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" });

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return dateFormatter.format(d);
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5" fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} />
            ))}
        </div>
    );
}

export function ReviewTable({ items, onEdit }: ReviewTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleStatus = async (item: ApiReview, isActive: boolean) => {
        setTogglingId(item.id);
        try {
            await reviewsApi.update(item.id, { isActive });
            toast.success(isActive ? "Review approved" : "Review hidden");
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update review");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiReview) => {
        setRemovingId(item.id);
        try {
            await reviewsApi.remove(item.id);
            toast.success(`Review by ${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Reviewer</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Rating</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Content</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Date</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <MessageSquare className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No reviews yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Customer reviews will appear here once submitted</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 shrink-0 rounded-lg bg-muted overflow-hidden ring-1 ring-border/50">
                                            <img
                                                src={`${baseURL}${item.image}`}
                                                alt={item.name}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <RatingStars rating={item.rating} />
                                        <span className="text-xs text-muted-foreground font-medium">{item.rating}/5</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <p className="text-sm text-muted-foreground truncate">{item.content}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="inline-flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(item, true)}
                                            disabled={togglingId === item.id || item.isActive}
                                            className={`inline-flex items-center justify-center size-7 rounded-md transition-colors ${
                                                item.isActive
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                                            } disabled:opacity-50`}
                                            title="Approve"
                                        >
                                            <Check className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(item, false)}
                                            disabled={togglingId === item.id || !item.isActive}
                                            className={`inline-flex items-center justify-center size-7 rounded-md transition-colors ${
                                                !item.isActive
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-700"
                                            } disabled:opacity-50`}
                                            title="Hide"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="inline-flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            className="inline-flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>
                                        <TrashConfirm
                                            name={item.name}
                                            onConfirm={() => handleDelete(item)}
                                            disabled={removingId === item.id}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
