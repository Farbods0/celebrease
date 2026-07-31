import {
    formatDate,
    formatStatus,
    type ApiSubscription,
} from "@/lib/api";

const STATUS_PILL: Record<ApiSubscription["status"], string> = {
    ACTIVE: "st-active",
    PAUSED: "st-paused",
    CANCELLED: "st-cancelled",
    EXPIRED: "st-cancelled",
};

function planBadgeClass(name: string) {
    const n = name.toLowerCase();
    if (n.includes("ultimate")) return "plan-ultimate";
    if (n.includes("premium")) return "plan-premium";
    return "plan-starter";
}

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

function SlotsCell({ subscription }: { subscription: ApiSubscription }) {
    const totalSlots = subscription.plan.holidaysPerYear;
    const used = subscription.holidaySlots.filter(
        (s) => s.status === "RETURNED" || s.status === "SKIPPED" || s.status === "SHIPPED" || s.status === "SELECTED"
    );
    const usedCount = used.length;
    const pct = totalSlots > 0 ? Math.round((usedCount / totalSlots) * 100) : 0;

    // Assigned holidays (chips). No image field on the API, so render initial-thumbs.
    const assigned = subscription.holidaySlots.filter((s) => s.holiday).slice(0, 3);
    const extra = subscription.holidaySlots.filter((s) => s.holiday).length - assigned.length;
    const dimmed = subscription.status === "CANCELLED";

    return (
        <div className="slots-wrap">
            {assigned.length > 0 && (
                <div className="holiday-chips">
                    {assigned.map((s) => (
                        <div
                            className="holiday-more"
                            key={s.id}
                            title={s.holiday?.name ?? ""}
                            style={dimmed ? { opacity: 0.5 } : undefined}
                        >
                            {initials(s.holiday?.name)}
                        </div>
                    ))}
                    {extra > 0 && <div className="holiday-more">+{extra}</div>}
                </div>
            )}
            <div>
                <div className="slots-bar">
                    <div
                        className="slots-bar-fill"
                        style={{ width: `${pct}%`, ...(dimmed ? { background: "#D9C8E8" } : {}) }}
                    />
                </div>
                <div className="slots-text" style={dimmed ? { color: "var(--ink-soft)" } : undefined}>
                    <span className="used" style={dimmed ? { color: "var(--ink-soft)" } : undefined}>{usedCount}</span>
                    <span className="total">/{totalSlots} used</span>
                </div>
            </div>
        </div>
    );
}

type SubscriptionTableProps = {
    items: ApiSubscription[];
    onView: (item: ApiSubscription) => void;
};

export function SubscriptionTable({ items, onView }: SubscriptionTableProps) {
    return (
        <div className="panel hidden-mobile">
            <div className="tbl-wrap" style={{ padding: "14px 4px 4px" }}>
                {items.length === 0 ? (
                    <div style={{ padding: "48px 0", textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5 }}>
                        No subscriptions found, try adjusting your search or filters.
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: 20 }}>Customer</th>
                                <th>Plan</th>
                                <th>Billing</th>
                                <th>Holidays</th>
                                <th>Status</th>
                                <th>Renews</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const cancelled = item.status === "CANCELLED";
                                const yearly = item.billingCycle === "YEARLY";
                                return (
                                    <tr key={item.id}>
                                        <td style={{ paddingLeft: 20 }}>
                                            <div className="cust">
                                                <div
                                                    className="av"
                                                    style={cancelled ? { background: "#EDE4F5", color: "var(--ink-soft)" } : undefined}
                                                >
                                                    {initials(item.user.name)}
                                                </div>
                                                <div>
                                                    <div className="nm" style={cancelled ? { color: "var(--ink-muted)" } : undefined}>
                                                        {item.user.name}
                                                    </div>
                                                    <div className="em">{item.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`plan-badge ${planBadgeClass(item.plan.name)}`}
                                                style={cancelled ? { opacity: 0.6 } : undefined}
                                            >
                                                {item.plan.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`billing-chip ${yearly ? "billing-yearly" : "billing-monthly"}`}
                                                style={cancelled ? { opacity: 0.6 } : undefined}
                                            >
                                                {yearly ? "Yearly" : "Monthly"}
                                            </span>
                                        </td>
                                        <td>
                                            <SlotsCell subscription={item} />
                                        </td>
                                        <td>
                                            <span className={`status ${STATUS_PILL[item.status]}`}>{formatStatus(item.status)}</span>
                                        </td>
                                        <td>
                                            <span
                                                className="renews"
                                                style={cancelled ? { color: "var(--red)" } : undefined}
                                            >
                                                {cancelled && item.cancelledAt
                                                    ? `Ended ${formatDate(item.cancelledAt)}`
                                                    : item.status === "PAUSED"
                                                        ? "Paused"
                                                        : formatDate(item.nextBillingAt)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="row-actions">
                                                <button
                                                    type="button"
                                                    className="row-btn"
                                                    title="View subscription"
                                                    onClick={() => onView(item)}
                                                >
                                                    👁
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
