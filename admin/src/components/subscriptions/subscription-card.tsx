import {
    formatDate,
    formatStatus,
    getCurrentHolidayName,
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
    if (n.includes("Platinum")) return "plan-ultimate";
    if (n.includes("Gold")) return "plan-premium";
    return "plan-starter";
}

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

type SubscriptionCardProps = {
    item: ApiSubscription;
    onView: (item: ApiSubscription) => void;
};

export function SubscriptionCard({ item, onView }: SubscriptionCardProps) {
    const totalSlots = item.plan.holidaysPerYear;
    const usedCount = item.holidaySlots.filter(
        (s) => s.status === "RETURNED" || s.status === "SKIPPED" || s.status === "SHIPPED" || s.status === "SELECTED"
    ).length;
    const pct = totalSlots > 0 ? Math.round((usedCount / totalSlots) * 100) : 0;
    const yearly = item.billingCycle === "YEARLY";

    return (
        <button type="button" onClick={() => onView(item)} className="sub-mcard">
            <div className="sub-mcard-top">
                <div className="cust">
                    <div className="av">{initials(item.user.name)}</div>
                    <div>
                        <div className="nm">{item.user.name}</div>
                        <div className="em">{item.user.email}</div>
                    </div>
                </div>
                <span className={`status ${STATUS_PILL[item.status]}`}>{formatStatus(item.status)}</span>
            </div>
            <div className="sub-mcard-badges">
                <span className={`plan-badge ${planBadgeClass(item.plan.name)}`}>{item.plan.name}</span>
                <span className={`billing-chip ${yearly ? "billing-yearly" : "billing-monthly"}`}>
                    {yearly ? "Yearly" : "Monthly"}
                </span>
            </div>
            <div className="slots-bar">
                <div className="slots-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="sub-mcard-meta">
                <span className="slots-text">
                    <span className="used">{usedCount}</span>
                    <span className="total">/{totalSlots} used</span>
                </span>
                <span className="renews">{getCurrentHolidayName(item)} · {formatDate(item.nextBillingAt)}</span>
            </div>
        </button>
    );
}
