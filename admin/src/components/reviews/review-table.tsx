import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, reviewsApi, type ApiReview } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ReviewTableProps = {
    items: ApiReview[];
    onEdit: (item: ApiReview) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return ", ";
    return dateFormatter.format(d);
}

const AV_TONES = ["", "magenta", "green", "blue", "amber"];

function initials(name: string) {
    return (name.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

function Stars({ rating }: { rating: number }) {
    const full = Math.max(0, Math.min(5, Math.round(rating)));
    const tone = rating >= 4 ? undefined : rating >= 3 ? "var(--amber)" : "var(--red)";
    return (
        <div className="stars" aria-label={`${full} stars`} style={tone ? { color: tone } : undefined}>
            {"★".repeat(full)}
            {"☆".repeat(5 - full)}
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

    if (items.length === 0) {
        return (
            <div className="panel">
                <div className="panel-body" style={{ padding: "48px 0", textAlign: "center", color: "var(--ink-soft)" }}>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>⭐</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>No reviews found</div>
                    <div style={{ fontSize: 12.5, marginTop: 4 }}>Customer reviews will appear here once submitted.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            {items.map((item, idx) => {
                const tone = AV_TONES[idx % AV_TONES.length];
                const busy = togglingId === item.id;
                return (
                    <div className="rv-card" key={item.id} style={item.isActive ? { opacity: 0.92 } : { opacity: 0.6, borderStyle: "dashed" }}>
                        <div className="rv-left">
                            <div className={`rv-av${tone ? ` ${tone}` : ""}`}>{initials(item.name)}</div>
                        </div>

                        <div className="rv-body">
                            <div className="rv-meta-row">
                                <span className="rv-name">{item.name}</span>
                                {item.image ? (
                                    <span className="rv-kit">
                                        <img loading="lazy" decoding="async" className="kit-thumb" src={resolveImageUrl(item.image)} alt="" />
                                    </span>
                                ) : null}
                                <span className="rv-date">{formatDate(item.createdAt)}</span>
                            </div>
                            <Stars rating={item.rating} />
                            <p className="rv-text">{item.content}</p>
                        </div>

                        <div className="rv-actions">
                            <span className={`rv-status ${item.isActive ? "rv-st-approved" : "rv-st-hidden"}`}>
                                {item.isActive ? "Approved" : "Hidden"}
                            </span>
                            <div className="rv-btn-row">
                                {item.isActive ? (
                                    <button
                                        type="button"
                                        className="rv-btn rv-btn-hide"
                                        onClick={() => handleToggleStatus(item, false)}
                                        disabled={busy}
                                        aria-label="Hide review"
                                    >
                                        Hide
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rv-btn rv-btn-approve"
                                        onClick={() => handleToggleStatus(item, true)}
                                        disabled={busy}
                                        aria-label="Approve review"
                                    >
                                        <Check className="size-3.5" /> Approve
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="rv-btn rv-btn-hide"
                                    onClick={() => onEdit(item)}
                                    aria-label="Edit review"
                                >
                                    <Pencil className="size-3.5" /> Edit
                                </button>
                                <TrashConfirm
                                    name={item.name}
                                    onConfirm={() => handleDelete(item)}
                                    disabled={removingId === item.id}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
