import { orderStatusPill } from "@/lib/admin-status";
import { baseURL, formatDuration, formatMoney, formatTier, totalDeposit, type ApiOrder } from "@/lib/api";
import moment from "moment";

type ReturnCardProps = {
    item: ApiOrder;
    onView: (item: ApiOrder) => void;
};

const img = resolveImageUrl;

export function ReturnCard({ item, onView }: ReturnCardProps) {
    const pill = orderStatusPill(item.status);
    const returnedAt = item.returnReceivedAt ?? item.returnRequestedAt;

    return (
        <article className="panel" style={{ padding: 16 }}>
            <div className="kit-cell">
                <img loading="lazy" decoding="async" src={img(item.holiday.image)} alt="" />
                <div style={{ flex: 1 }}>
                    <div className="kn">{item.holiday.name} · {formatTier(item.kit.tier)}</div>
                    <div className="ks">{formatDuration(item.duration)} rental · {item.kit.sku}</div>
                </div>
                <span className={`status ${pill.cls}`}>{pill.label}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <div className="ret-date">
                    <span className="oid">{item.orderNumber}</span>
                    <br />
                    {returnedAt ? moment(returnedAt).format("MMM D, YYYY") : ", "}
                </div>
                <div className="dep-cell" style={{ alignItems: "flex-end" }}>
                    <span className="dep-full">{formatMoney(totalDeposit(item))}</span>
                    <span className="dep-sub">Deposit held</span>
                </div>
            </div>

            <button type="button" className="btn-inspect" onClick={() => onView(item)} style={{ width: "100%", marginTop: 14 }}>
                ✓ Inspect &amp; resolve
            </button>
        </article>
    );
}
