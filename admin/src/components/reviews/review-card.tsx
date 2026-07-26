import { baseURL, type ApiReview } from "@/lib/api";

type ReviewCardProps = {
    item: ApiReview;
    onEdit: (item: ApiReview) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

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

export function ReviewCard({ item, onEdit }: ReviewCardProps) {
    return (
        <div className="rv-card" style={item.isActive ? undefined : { opacity: 0.6, borderStyle: "dashed" }}>
            <div className="rv-left">
                <div className="rv-av">{initials(item.name)}</div>
            </div>
            <div className="rv-body">
                <div className="rv-meta-row">
                    <span className="rv-name">{item.name}</span>
                    {item.image ? (
                        <span className="rv-kit">
                            <img loading="lazy" decoding="async" className="kit-thumb" src={`${baseURL}${item.image}`} alt="" />
                        </span>
                    ) : null}
                    <span className="rv-date">{dateFormatter.format(new Date(item.createdAt))}</span>
                </div>
                <Stars rating={item.rating} />
                <p className="rv-text">{item.content}</p>
            </div>
            <div className="rv-actions">
                <span className={`rv-status ${item.isActive ? "rv-st-approved" : "rv-st-hidden"}`}>
                    {item.isActive ? "Approved" : "Hidden"}
                </span>
                <div className="rv-btn-row">
                    <button type="button" className="rv-btn rv-btn-hide" onClick={() => onEdit(item)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
