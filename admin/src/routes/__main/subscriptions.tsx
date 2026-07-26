import { RouteSkeleton } from "@/components/main/route-skeleton";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { SubscriptionView } from "@/components/subscriptions/subscription-view";
import { Dialog } from "@/components/ui/dialog";
import { subscriptionsApi, type ApiSubscription, type SubscriptionStatus } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/subscriptions")({
    loader: () => subscriptionsApi.list(),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const TABS: { value: SubscriptionStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "PAUSED", label: "Paused" },
    { value: "CANCELLED", label: "Cancelled" },
];

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiSubscription | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "ALL">("ALL");

    const filteredItems = useMemo(() => {
        let result = data.items;
        if (statusFilter !== "ALL") {
            result = result.filter((s) => s.status === statusFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.user.name.toLowerCase().includes(q) ||
                    s.plan.name.toLowerCase().includes(q) ||
                    s.user.email.toLowerCase().includes(q)
            );
        }
        return result;
    }, [data.items, searchQuery, statusFilter]);

    const handleUpdated = (next: ApiSubscription) => {
        setData((prev) => ({
            ...prev,
            items: prev.items.map((s) => (s.id === next.id ? next : s)),
        }));
        setSelectedItem(next);
    };

    // KPI / tab counts (all from live data)
    const total = data.items.length;
    const activeCount = data.items.filter((s) => s.status === "ACTIVE").length;
    const pausedCount = data.items.filter((s) => s.status === "PAUSED").length;
    const cancelledCount = data.items.filter((s) => s.status === "CANCELLED").length;
    const churnRate = total > 0 ? ((cancelledCount / total) * 100).toFixed(1) : "0.0";

    const tabCounts: Record<SubscriptionStatus | "ALL", number> = {
        ALL: total,
        ACTIVE: activeCount,
        PAUSED: pausedCount,
        CANCELLED: cancelledCount,
        EXPIRED: data.items.filter((s) => s.status === "EXPIRED").length,
    };

    return (
        <div className="content">
            <style>{`
.filter-search{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 14px;font-size:13.5px;color:var(--ink-soft);flex:1;max-width:340px}
.filter-search input{border:none;background:none;outline:none;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink)}
.tab-group{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;gap:1px}
.tab-group button{font-size:13px;font-weight:500;color:var(--ink-muted);padding:7px 16px;border-radius:7px;display:inline-flex;align-items:center;gap:7px;transition:background .15s,color .15s;white-space:nowrap}
.tab-group button.on{background:var(--brand-gradient);color:#fff;font-weight:600}
.tab-group button.on .tab-count{background:rgba(255,255,255,.28);color:#fff}
.tab-count{background:var(--bg);color:var(--ink-soft);font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;min-width:24px;text-align:center}
.plan-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.02em}
.plan-starter{background:#EDE4F5;color:var(--brand-purple)}
.plan-premium{background:linear-gradient(135deg,rgba(155,47,201,.14),rgba(220,0,117,.10));color:#8B1AB5;border:1px solid rgba(155,47,201,.2)}
.plan-ultimate{background:var(--brand-gradient);color:#fff;box-shadow:0 2px 8px rgba(155,47,201,.25)}
.st-active{color:var(--green);background:var(--green-bg)}
.st-paused{color:var(--amber);background:var(--amber-bg)}
.st-cancelled{color:var(--red);background:var(--red-bg)}
.slots-wrap{display:flex;align-items:center;gap:8px}
.slots-bar{width:64px;height:6px;border-radius:3px;background:var(--line);overflow:hidden;flex-shrink:0}
.slots-bar-fill{height:100%;border-radius:3px;background:var(--brand-gradient)}
.slots-text{font-size:12.5px;font-weight:600;white-space:nowrap}
.slots-text .used{color:var(--brand-purple)}
.slots-text .total{color:var(--ink-soft);font-weight:400}
.billing-chip{font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:6px;text-transform:uppercase;letter-spacing:.05em}
.billing-monthly{background:var(--blue-bg);color:var(--blue)}
.billing-yearly{background:#F3E8FB;color:var(--brand-purple)}
.renews{font-size:12.5px;color:var(--ink-muted)}
.row-actions{display:flex;align-items:center;gap:6px;opacity:0;transition:opacity .15s}
tbody tr:hover .row-actions{opacity:1}
.row-btn{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;border:1px solid var(--line);background:#fff;color:var(--ink-muted)}
.row-btn:hover{background:var(--bg);color:var(--ink);border-color:var(--line-strong)}
.holiday-chips{display:flex;align-items:center}
.holiday-more{width:22px;height:22px;border-radius:6px;background:var(--brand-gradient);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:-4px;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.12);flex-shrink:0}
.holiday-more:first-child{margin-left:0}
.tbl-wrap{overflow-x:auto}
.btn-outline{background:#fff;color:var(--ink-muted);font-weight:500;font-size:13px;padding:0 14px;height:38px;border-radius:10px;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line)}
.btn-outline:hover{background:var(--bg);color:var(--ink)}
.sub-mcard{width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:var(--shadow-xs)}
.sub-mcard-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.sub-mcard-badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sub-mcard .slots-bar{width:100%}
.sub-mcard-meta{display:flex;align-items:center;justify-content:space-between;gap:10px}
.hidden-mobile{display:block}
.show-mobile{display:none}
@media(max-width:760px){.hidden-mobile{display:none}.show-mobile{display:flex}.row-actions{opacity:1}}
`}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Subscriptions</h1>
                    <div className="sub">
                        {total} total {total === 1 ? "subscription" : "subscriptions"} · {activeCount} active · {churnRate}% churn
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Active subscriptions</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>🔁</span>
                    </div>
                    <div className="val">{activeCount}</div>
                    <span className="delta up"><span className="muted">Currently billing</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total subscriptions</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>👥</span>
                    </div>
                    <div className="val">{total}</div>
                    <span className="delta up"><span className="muted">All time</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Paused</span>
                        <span className="ic" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>⏸</span>
                    </div>
                    <div className="val">{pausedCount}</div>
                    <span className="delta up"><span className="muted">{pausedCount > 0 ? "Temporarily on hold" : "None paused"}</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Churn (cancelled)</span>
                        <span className="ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>✕</span>
                    </div>
                    <div className="val">{cancelledCount}</div>
                    <span className="delta down"><span className="muted">{churnRate}% churn rate</span></span>
                </div>
            </div>

            {/* Filter bar + table */}
            <div className="panel">
                <div className="panel-head" style={{ flexWrap: "wrap", gap: 12, paddingBottom: 14 }}>
                    <h3>All subscriptions</h3>
                </div>

                {/* Tabs + search */}
                <div
                    style={{
                        padding: "14px 20px 0",
                        borderBottom: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                        paddingBottom: 14,
                    }}
                >
                    <div className="tab-group">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                className={statusFilter === tab.value ? "on" : ""}
                                onClick={() => setStatusFilter(tab.value)}
                            >
                                {tab.label} <span className="tab-count">{tabCounts[tab.value]}</span>
                            </button>
                        ))}
                    </div>
                    <div className="filter-search" style={{ marginLeft: "auto", maxWidth: 280 }}>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>⌕</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search name or email…"
                        />
                    </div>
                </div>

                {/* Table + mobile cards */}
                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <SubscriptionTable items={filteredItems} onView={setSelectedItem} />

                    <div className="show-mobile" style={{ flexDirection: "column", gap: 12, padding: "14px 16px" }}>
                        {filteredItems.length === 0 ? (
                            <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5, padding: "24px 0" }}>
                                No subscriptions found
                            </p>
                        ) : (
                            filteredItems.map((item) => (
                                <SubscriptionCard key={item.id} item={item} onView={setSelectedItem} />
                            ))
                        )}
                    </div>

                    {selectedItem && <SubscriptionView item={selectedItem} onUpdated={handleUpdated} />}
                </Dialog>

                {/* Footer count */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        borderTop: "1px solid var(--line)",
                    }}
                >
                    <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                        Showing {filteredItems.length} of {total} {total === 1 ? "subscription" : "subscriptions"}
                    </span>
                </div>
            </div>
        </div>
    );
}
