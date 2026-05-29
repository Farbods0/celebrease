import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseURL, type ApiReview } from "@/lib/api";
import { Star } from "lucide-react";

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
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                No reviews found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 shrink-0 rounded-md bg-white overflow-hidden">
                                            <img
                                                src={`${baseURL}${item.image}`}
                                                alt={item.name}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <RatingStars rating={item.rating} />
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground">{item.content}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.isActive ? "Active" : "Hidden"} />
                                </TableCell>
                                <TableCell>{formatDate(item.createdAt)}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(item)}
                                        className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Edit
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
