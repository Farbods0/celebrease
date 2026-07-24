import { orderStatusPill } from "@/lib/admin-status";
import {
    baseURL,
    formatDuration,
    formatMoney,
    formatTier,
    type ApiOrder,
} from "@/lib/api";

type OrderCardProps = {
    item: ApiOrder;
    onView: (item: ApiOrder) => void;
};

export function OrderCard({ item, onView }: OrderCardProps) {
    const pill = orderStatusPill(item.status);
    return (
        <article
            style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                background: "var(--card)",
                padding: 14,
                boxShadow: "var(--shadow-xs)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span className="oid">{item.orderNumber}</span>
                <span className={`status ${pill.cls}`}>{pill.label}</span>
            </div>
            <div className="tbl-kit" style={{ marginTop: 12 }}>
                <img src={`${baseURL}${item.holiday.image}`} alt="" />
                <div>
                    <div className="kit-name">{item.holiday.name}</div>
                    <div className="kit-tier">{formatTier(item.kit.tier)} · {formatDuration(item.duration)}</div>
                </div>
            </div>
            <div
                style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{item.user.name}</div>
                    <div className="amt" style={{ fontSize: 15 }}>{formatMoney(item.total)}</div>
                </div>
                <button type="button" className="btn-outline" onClick={() => onView(item)}>
                    👁 View
                </button>
            </div>
        </article>
    );
}
