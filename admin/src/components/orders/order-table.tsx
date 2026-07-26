import { orderStatusPill } from "@/lib/admin-status";
import {
    baseURL,
    formatDuration,
    formatMoney,
    formatTier,
    type ApiOrder,
} from "@/lib/api";

type OrderTableProps = {
    items: ApiOrder[];
    onView: (item: ApiOrder) => void;
};

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

export function OrderTable({ items, onView }: OrderTableProps) {
    return (
        <div className="tbl-wrap hidden md:block">
            <table aria-label="Orders list">
                <thead>
                    <tr>
                        <th style={{ paddingLeft: 20 }}>Order #</th>
                        <th>Customer</th>
                        <th>Kit &amp; Tier</th>
                        <th>Duration</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Ordered</th>
                        <th style={{ textAlign: "right", paddingRight: 20 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={8} style={{ padding: "56px 0", textAlign: "center", color: "var(--ink-soft)" }}>
                                <div style={{ fontSize: 26, marginBottom: 8 }}>🔍</div>
                                <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>No results found</div>
                                <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters.</div>
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const pill = orderStatusPill(item.status);
                            return (
                                <tr key={item.id}>
                                    <td style={{ paddingLeft: 20 }}>
                                        <span className="oid">{item.orderNumber}</span>
                                    </td>
                                    <td>
                                        <div className="cust">
                                            <div className="av">{initials(item.user.name)}</div>
                                            <div>
                                                <div className="nm">{item.user.name}</div>
                                                <div className="em">{item.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tbl-kit">
                                            <img loading="lazy" decoding="async" src={`${baseURL}${item.holiday.image}`} alt="" />
                                            <div>
                                                <div className="kit-name">{item.holiday.name}</div>
                                                <div className="kit-tier">{formatTier(item.kit.tier)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tbl-dur">{formatDuration(item.duration)}</span>
                                    </td>
                                    <td>
                                        <span className="amt">{formatMoney(item.total)}</span>
                                    </td>
                                    <td>
                                        <span className={`status ${pill.cls}`}>{pill.label}</span>
                                    </td>
                                    <td>
                                        <span className="tbl-date">
                                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", paddingRight: 20 }}>
                                        <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                                            <button
                                                type="button"
                                                className="act-btn"
                                                title="View order"
                                                aria-label={`View order ${item.orderNumber}`}
                                                onClick={() => onView(item)}
                                            >
                                                👁
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
