import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { baseURL, type ApiReview } from "@/lib/api";
import { Star } from "lucide-react";
import moment from "moment";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4" fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} />
            ))}
        </div>
    );
}

type ReviewCardProps = {
    item: ApiReview;
    onEdit: (item: ApiReview) => void;
};

export function ReviewCard({ item, onEdit }: ReviewCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
                <div className="size-10 shrink-0 rounded-md bg-muted overflow-hidden">
                    <img
                        src={`${baseURL}${item.image}`}
                        alt={item.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <RatingStars rating={item.rating} />
                </div>
            </div>
            <p className="mt-3 text-sm line-clamp-3">{item.content}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Status" value={<StatusBadge status={item.isActive ? "Active" : "Hidden"} />} />
                <Field label="Created" value={moment(item.createdAt).format("MMM DD, YYYY")} />
            </div>
            <Button size="sm" onClick={() => onEdit(item)} className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20">
                Edit
            </Button>
        </article>
    );
}
