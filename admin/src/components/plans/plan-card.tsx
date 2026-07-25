import { TrashConfirm } from "@/components/ui/trash-confirm";
import { plansApi, type ApiPlan } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

function formatMoney(value: string | null) {
    if (!value) return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const TIER_META: Record<string, { icon: string; iconBg: string; featured?: boolean; badgeCls?: string; badge?: string }> = {
    STARTER: { icon: "🌿", iconBg: "#EDE4F5" },
    PREMIUM: {
        icon: "🎀",
        iconBg: "linear-gradient(135deg,rgba(155,47,201,.15),rgba(220,0,117,.10))",
        featured: true,
        badge: "Most popular",
        badgeCls: "badge-pop",
    },
    ULTIMATE: { icon: "✨", iconBg: "linear-gradient(135deg,rgba(220,0,117,.12),rgba(155,47,201,.10))" },
};

function maskStripeId(id: string | null) {
    if (!id) return "—";
    if (id.length <= 12) return id;
    return `${id.slice(0, 10)}••••${id.slice(-2)}`;
}

type PlanCardProps = {
    item: ApiPlan;
    discountPercent?: number;
    onEdit: (item: ApiPlan) => void;
};

export function PlanCard({ item, discountPercent = 20, onEdit }: PlanCardProps) {
    const router = useRouter();
    const [toggling, setToggling] = useState(false);
    const [removing, setRemoving] = useState(false);

    const meta = TIER_META[item.code] ?? { icon: "🏷️", iconBg: "#EDE4F5" };

    const handleToggle = async () => {
        setToggling(true);
        const next = !item.isActive;
        try {
            await plansApi.update(item.id, { isActive: next });
            toast.success(next ? `${item.name} activated` : `${item.name} deactivated`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        setRemoving(true);
        try {
            await plansApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemoving(false);
        }
    };

    const priceGradient = item.code === "PREMIUM";

    return (
        <div className={`plan-card${meta.featured ? " featured" : ""}`}>
            <div
                className="plan-card-header"
                style={meta.featured ? { background: "linear-gradient(135deg,rgba(155,47,201,.04),rgba(220,0,117,.03))" } : undefined}
            >
                <div className="plan-tier">
                    <div className="plan-icon" style={{ background: meta.iconBg }}>{meta.icon}</div>
                    <span className="plan-name">{item.name}</span>
                    {meta.badge && <span className={`plan-badge ${meta.badgeCls}`}>{meta.badge}</span>}
                </div>
                <div className="plan-price-row">
                    <div
                        className="plan-price"
                        style={
                            priceGradient
                                ? {
                                      background: "var(--brand-gradient)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      backgroundClip: "text",
                                  }
                                : undefined
                        }
                    >
                        <sup>$</sup>
                        {item.monthlyPrice ? Math.round(Number(item.monthlyPrice)) : "—"}
                    </div>
                    <span className="plan-period">/ month</span>
                    {item.monthlyPrice && (
                        <span className="plan-yearly" title={`Computed dynamically at ${discountPercent}% discount`}>
                            {formatMoney(String(Math.round(Number(item.monthlyPrice) * 12 * (1 - discountPercent / 100))))} / yr
                        </span>
                    )}
                </div>
                <div className="plan-toggle">
                    <button
                        type="button"
                        className={`toggle-switch${item.isActive ? "" : " off"}`}
                        title={item.isActive ? "Plan is active" : "Plan is hidden"}
                        aria-label="Toggle plan visibility"
                        disabled={toggling}
                        onClick={handleToggle}
                    />
                    <span className={`toggle-lbl${item.isActive ? "" : " off"}`}>{item.isActive ? "Active" : "Hidden"}</span>
                </div>
            </div>

            <div className="plan-card-body">
                <div className="plan-field-grid">
                    <div className="plan-field">
                        <label>Monthly price</label>
                        <div className="field-row">
                            <span className="field-prefix">$</span>
                            <input className="field-input" readOnly value={item.monthlyPrice ? Number(item.monthlyPrice) : ""} />
                        </div>
                    </div>
                    <div className="plan-field">
                        <label style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Yearly price</span>
                            <span style={{ fontSize: 11, color: "var(--brand-purple)", fontWeight: 700 }}>⚡ Auto @ {discountPercent}% off</span>
                        </label>
                        <div className="field-row" style={{ background: "rgba(155,47,201,.03)", border: "1px dashed var(--brand-purple)" }}>
                            <span className="field-prefix">$</span>
                            <input
                                className="field-input"
                                readOnly
                                value={item.monthlyPrice ? Math.round(Number(item.monthlyPrice) * 12 * (1 - discountPercent / 100)) : ""}
                                style={{ background: "transparent", fontWeight: 700 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="plan-field-grid">
                    <div className="plan-field">
                        <label>Holidays / year</label>
                        <div className="field-row">
                            <input className="field-input" readOnly value={item.holidaysPerYear} />
                            <span className="field-suffix">slots</span>
                        </div>
                    </div>
                    <div className="plan-field">
                        <label>Kit discount</label>
                        <div className="field-row">
                            <input className="field-input" readOnly value={item.kitDiscount} />
                            <span className="field-suffix">%</span>
                        </div>
                    </div>
                </div>

                <div className="plan-field">
                    <label>Add-on discount</label>
                    <div className="field-row">
                        <input className="field-input" readOnly value={item.addOnDiscount} style={{ maxWidth: 100 }} />
                        <span className="field-suffix">{item.addOnDiscount > 0 ? "% off all add-ons" : `% — no add-on discount`}</span>
                    </div>
                </div>

                <div className="plan-field">
                    <label>Stripe Price ID — Monthly</label>
                    <div className="stripe-id">
                        <input className="field-input mono" readOnly value={maskStripeId(item.stripePriceMonthlyId)} />
                    </div>
                </div>

                <div className="plan-field">
                    <label>Stripe Price ID — Yearly</label>
                    <div className="stripe-id">
                        <input className="field-input mono" readOnly value={maskStripeId(item.stripePriceYearlyId)} />
                    </div>
                </div>

                {item.features.length > 0 && (
                    <div className="plan-perks">
                        {item.features.map((f) => (
                            <div className="perk yes" key={f.id}>
                                <span className="dot">✓</span>
                                {f.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="plan-card-footer">
                <span className="plan-sub-count">
                    <strong>{item.features.length}</strong> features
                </span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button type="button" className="btn-ghost" onClick={() => onEdit(item)}>
                        Edit
                    </button>
                    <TrashConfirm name={item.name} onConfirm={handleDelete} disabled={removing} />
                </div>
            </div>
        </div>
    );
}
