import { RouteSkeleton } from "@/components/main/route-skeleton";
import { PlanCard } from "@/components/plans/plan-card";
import { PlanForm } from "@/components/plans/plan-form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { plansApi, type ApiPlan } from "@/lib/api";
import { settingsApi } from "@/lib/api/settings";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/plans")({
    loader: async () => {
        const [plans, settings] = await Promise.all([
            plansApi.list(),
            settingsApi.get().catch(() => ({ yearlyDiscountPercent: 20 })),
        ]);
        return { items: plans.items, settings };
    },
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const PLAN_STYLES = `
.section-label{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);display:flex;align-items:center;gap:10px}
.section-label::after{content:'';flex:1;height:1px;background:var(--line)}

.plan-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.plan-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);overflow:hidden;display:flex;flex-direction:column}
.plan-card.featured{border-color:var(--brand-purple);box-shadow:0 0 0 2px rgba(155,47,201,.18),var(--shadow-sm)}

.plan-card-header{padding:20px 22px 16px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:6px;position:relative}
.plan-tier{display:flex;align-items:center;gap:10px}
.plan-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.plan-name{font-size:18px;font-weight:800;letter-spacing:-0.02em}
.plan-badge{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:20px}
.badge-pop{background:linear-gradient(135deg,rgba(155,47,201,.15),rgba(220,0,117,.12));color:var(--brand-purple)}
.badge-new{background:var(--green-bg);color:var(--green)}

.plan-price-row{display:flex;align-items:flex-end;gap:8px;margin-top:10px}
.plan-price{font-size:32px;font-weight:800;letter-spacing:-0.03em;color:var(--ink)}
.plan-price sup{font-size:18px;font-weight:700;vertical-align:super;margin-right:1px}
.plan-period{font-size:13px;color:var(--ink-muted);padding-bottom:4px}
.plan-yearly{font-size:12px;color:var(--green);font-weight:600;background:var(--green-bg);padding:2px 9px;border-radius:20px;margin-left:auto;align-self:center}

.plan-toggle{position:absolute;top:20px;right:22px;display:flex;align-items:center;gap:8px}
.toggle-switch{width:38px;height:22px;border-radius:11px;background:var(--brand-purple);position:relative;cursor:pointer;flex-shrink:0;transition:background .2s}
.toggle-switch.off{background:var(--line-strong)}
.toggle-switch:disabled{opacity:.6;cursor:default}
.toggle-switch::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s}
.toggle-switch:not(.off)::after{transform:translateX(16px)}
.toggle-lbl{font-size:12px;font-weight:600;color:var(--green)}
.toggle-lbl.off{color:var(--ink-soft)}

.plan-card-body{padding:20px 22px;display:flex;flex-direction:column;gap:14px;flex:1}
.plan-field{display:flex;flex-direction:column;gap:4px}
.plan-field label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-soft)}
.plan-field .field-row{display:flex;align-items:center;gap:8px}
.field-input{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:7px 12px;font-size:13.5px;font-family:'Inter',sans-serif;color:var(--ink);font-weight:600;width:100%;outline:none;transition:border .15s}
.field-input.mono{font-family:ui-monospace,monospace;font-size:12.5px;color:var(--ink-muted);font-weight:400}
.field-prefix{font-size:14px;font-weight:700;color:var(--ink-muted);flex-shrink:0}
.field-suffix{font-size:12px;color:var(--ink-soft);flex-shrink:0}

.plan-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}

.stripe-id{display:flex;align-items:center;gap:8px}
.stripe-id .field-input{flex:1}

.plan-perks{display:flex;flex-direction:column;gap:6px}
.perk{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-muted)}
.perk .dot{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.perk.yes .dot{background:var(--green-bg);color:var(--green)}
.perk.no .dot{background:var(--bg);color:var(--ink-soft)}

.plan-card-footer{padding:14px 22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:8px}
.btn-ghost{height:34px;padding:0 14px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid var(--line);color:var(--ink-muted);display:inline-flex;align-items:center;gap:6px;background:#fff;cursor:pointer}
.btn-ghost:hover{background:var(--bg);border-color:var(--line-strong);color:var(--ink)}
.plan-sub-count{font-size:12px;color:var(--ink-soft)}
.plan-sub-count strong{color:var(--ink);font-weight:700}

.plan-empty{text-align:center;color:var(--ink-soft);font-size:13.5px;padding:48px 0;grid-column:1/-1}

@media(max-width:1100px){.plan-cards{grid-template-columns:1fr}}
`;

const TIER_ORDER: Record<string, number> = { STARTER: 0, PREMIUM: 1, ULTIMATE: 2 };

function money(value: string | null) {
    if (!value) return ", ";
    const n = Number(value);
    if (Number.isNaN(n)) return ", ";
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function RouteComponent() {
    const data = Route.useLoaderData();
    const router = useRouter();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiPlan | null>(null);
    const [discountPct, setDiscountPct] = useState<number>(data.settings?.yearlyDiscountPercent ?? 20);
    const [savingDiscount, setSavingDiscount] = useState(false);

    const items = [...data.items].sort(
        (a, b) => (TIER_ORDER[a.code] ?? 99) - (TIER_ORDER[b.code] ?? 99) || a.sortOrder - b.sortOrder,
    );
    const existingCodes = data.items.map((p) => p.code);
    const canAddMore = existingCodes.length < 3;

    const saveDiscount = async () => {
        setSavingDiscount(true);
        try {
            await settingsApi.update({ yearlyDiscountPercent: discountPct });
            for (const item of items) {
                const m = Number(item.monthlyPrice);
                if (!Number.isNaN(m) && m > 0) {
                    const computedY = Math.round(m * 12 * (1 - (discountPct / 100)));
                    await plansApi.update(item.id, { yearlyPrice: computedY });
                }
            }
            toast.success(`Global ${discountPct}% discount applied & synced to all subscription plans!`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to sync discount");
        } finally {
            setSavingDiscount(false);
        }
    };

    return (
        <div className="content">
            <style>{PLAN_STYLES}</style>

            <div className="page-head">
                <div>
                    <h1>Subscription Plans</h1>
                    <div className="sub">Manage pricing, features, and Stripe configuration for the Starter, Premium, and Ultimate tiers.</div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="btn-grad" disabled={!canAddMore} style={!canAddMore ? { opacity: 0.5, cursor: "default" } : undefined}>
                            ＋ New plan
                        </button>
                    </DialogTrigger>
                    {createOpen && <PlanForm existingCodes={existingCodes} onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <div className="panel" style={{ marginBottom: 28, background: "var(--card)", border: "1px solid var(--brand-purple)", borderRadius: "var(--radius)", padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                            ⚡ Automated Yearly Discount Engine
                        </h3>
                        <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 4, maxWidth: 620 }}>
                            Power all annual pricing across the consumer site dynamically. Set one global discount percentage to automatically compute yearly costs from monthly base prices, zero hardcoding or manual math required.
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>Global Discount (%):</label>
                        <input
                            type="number"
                            value={discountPct}
                            min={0}
                            max={100}
                            onChange={(e) => setDiscountPct(Number(e.target.value))}
                            style={{ width: 76, padding: "8px 12px", borderRadius: 8, border: "2px solid var(--brand-purple)", fontWeight: 800, fontSize: 15, textAlign: "center" }}
                        />
                        <button type="button" className="btn-grad" onClick={saveDiscount} disabled={savingDiscount} style={{ cursor: "pointer", padding: "10px 18px", fontSize: 13.5 }}>
                            {savingDiscount ? "Syncing..." : "Apply & Sync Live"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-label">Plan configuration</div>

            <div className="plan-cards">
                {items.length === 0 ? (
                    <div className="plan-empty">No plans yet, add up to 3 subscription tiers.</div>
                ) : (
                    items.map((item) => <PlanCard key={item.id} item={item} discountPercent={discountPct} onEdit={setEditItem} />)
                )}
            </div>

            {items.length > 0 && (
                <>
                    <div className="section-label">Plan comparison matrix</div>

                    <div className="panel">
                        <div className="panel-head">
                            <h3>Feature matrix</h3>
                        </div>
                        <div className="panel-body" style={{ padding: "14px 4px" }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: 200 }}>Feature</th>
                                        {items.map((p) => (
                                            <th key={p.id}>
                                                {p.name}{" "}
                                                <span style={{ fontWeight: 400, color: "var(--ink-muted)", textTransform: "none", letterSpacing: 0 }}>, {money(p.monthlyPrice)}/mo
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Holiday slots / year</td>
                                        {items.map((p) => (
                                            <td key={p.id}>{p.holidaysPerYear}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Kit discount</td>
                                        {items.map((p) => (
                                            <td key={p.id}>{p.kitDiscount}%</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Add-on discount</td>
                                        {items.map((p) => (
                                            <td key={p.id} style={p.addOnDiscount === 0 ? { color: "var(--ink-soft)" } : undefined}>
                                                {p.addOnDiscount === 0 ? ", " : `${p.addOnDiscount}%`}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Yearly price (computed @ {discountPct}% off)</td>
                                        {items.map((p) => {
                                            const computed = Math.round(Number(p.monthlyPrice) * 12 * (1 - (discountPct / 100)));
                                            return <td key={p.id} className="amt">{money(String(computed))}</td>;
                                        })}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Features listed</td>
                                        {items.map((p) => (
                                            <td key={p.id}>{p.features.length}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600, color: "var(--ink-muted)" }}>Status</td>
                                        {items.map((p) => (
                                            <td key={p.id}>
                                                {p.isActive ? (
                                                    <span className="status st-deliv" style={{ fontSize: 11.5, padding: "3px 9px" }}>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="status st-pend" style={{ fontSize: 11.5, padding: "3px 9px" }}>
                                                        Hidden
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <PlanForm plan={editItem} existingCodes={existingCodes} onClose={() => setEditItem(null)} />}
            </Dialog>
        </div>
    );
}
