import { RouteSkeleton } from "@/components/main/route-skeleton";
import { CustomerCard } from "@/components/customers/customer-card";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerView } from "@/components/customers/customer-view";
import { Dialog } from "@/components/ui/dialog";
import { customersApi, type ApiCustomer } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/customers")({
    loader: () => customersApi.list(),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const PAGE_CSS = `
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.toolbar-search{display:flex;align-items:center;gap:9px;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 13px;color:var(--ink-soft);font-size:13px;min-width:260px}
.toolbar-search input{border:none;background:none;outline:none;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink)}
.filter-select{appearance:none;-webkit-appearance:none;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 32px 8px 13px;font-family:inherit;font-size:13.5px;color:var(--ink);cursor:pointer;outline:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239385A6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center}
.filter-select:focus{border-color:var(--brand-purple);box-shadow:0 0 0 3px rgba(155,47,201,.10)}
.toolbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.result-count{font-size:12.5px;color:var(--ink-soft)}
.btn-outline{height:38px;padding:0 15px;border-radius:10px;border:1px solid var(--line);font-size:13px;font-weight:600;color:var(--ink-muted);background:#fff;display:inline-flex;align-items:center;gap:7px}
.btn-outline:hover{background:var(--bg);border-color:var(--line-strong)}
.cust .av-lg{width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0}
.cust .av-init{width:36px;height:36px;border-radius:50%;background:#EDE4F5;color:var(--brand-purple);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0}
.st-active{color:var(--green);background:var(--green-bg)}
.st-banned{color:var(--red);background:var(--red-bg)}
.actions{display:flex;align-items:center;gap:6px}
.act-btn{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-muted);border:1px solid var(--line);background:#fff;cursor:pointer}
.act-btn:hover{background:var(--bg);color:var(--ink)}
.act-btn.danger:hover{background:var(--red-bg);border-color:var(--red);color:var(--red)}
.region{display:inline-flex;align-items:center;gap:6px;font-size:13px}
.region-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
`;

function RouteComponent() {
    const data = Route.useLoaderData();
    const [selectedItem, setSelectedItem] = useState<ApiCustomer | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const items = data.items;

    const filtered = useMemo(() => {
        let result = items;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== "All") {
            if (statusFilter === "Active") {
                result = result.filter((c) => c.hasActiveSubscription);
            } else {
                result = result.filter((c) => !c.hasActiveSubscription);
            }
        }
        return result;
    }, [items, searchQuery, statusFilter]);

    // KPIs from live data
    const totalCustomers = items.length;
    const activeCustomers = items.filter((c) => c.hasActiveSubscription).length;
    const bannedCustomers = items.filter((c) => c.banned).length;
    const totalDeposits = items.reduce((sum, c) => sum + (c.depositsHeld ?? 0), 0);
    const avgDeposit = totalCustomers > 0 ? Math.round(totalDeposits / totalCustomers) : 0;
    const activePct = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;

    return (
        <div className="content">
            <style>{PAGE_CSS}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Customers</h1>
                    <div className="sub">All registered subscribers and one-time renters across every region.</div>
                </div>
                <div className="seg">
                    <button className={statusFilter === "All" ? "on" : ""} onClick={() => setStatusFilter("All")}>All</button>
                    <button className={statusFilter === "Active" ? "on" : ""} onClick={() => setStatusFilter("Active")}>Active</button>
                    <button className={statusFilter === "Inactive" ? "on" : ""} onClick={() => setStatusFilter("Inactive")}>Inactive</button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total customers</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>👤</span>
                    </div>
                    <div className="val">{totalCustomers.toLocaleString()}</div>
                    <span className="delta up"><span className="muted">All registered accounts</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Active subscribers</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>🔁</span>
                    </div>
                    <div className="val">{activeCustomers.toLocaleString()}</div>
                    <span className="delta up"><span className="muted">{activePct}% of total</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Avg. deposit held</span>
                        <span className="ic" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>＄</span>
                    </div>
                    <div className="val">${avgDeposit.toLocaleString()}</div>
                    <span className="delta up"><span className="muted">${totalDeposits.toLocaleString()} total</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Banned accounts</span>
                        <span className="ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>🚫</span>
                    </div>
                    <div className="val">{bannedCustomers.toLocaleString()}</div>
                    <span className={`delta ${bannedCustomers > 0 ? "down" : "up"}`}>
                        <span className="muted">{bannedCustomers > 0 ? "Needs review" : "All clear"}</span>
                    </span>
                </div>
            </div>

            {/* Customer table panel */}
            <div className="panel">
                <div className="panel-head">
                    <h3>
                        All customers
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 8 }}>
                            {totalCustomers.toLocaleString()}
                        </span>
                    </h3>
                </div>

                {/* Toolbar */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", background: "#FDFCFE" }}>
                    <div className="toolbar">
                        <div className="toolbar-search">
                            <span>⌕</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search name, email, or customer ID…"
                            />
                        </div>
                        <select
                            className="filter-select"
                            aria-label="Filter by status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="toolbar-right">
                            <span className="result-count">{filtered.length.toLocaleString()} customers</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <CustomerTable items={filtered} onView={setSelectedItem} />

                    <div role="table" aria-label="Customers list (mobile)" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }} className="md:hidden">
                        {filtered.length === 0 ? (
                            <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--ink-soft)", padding: "40px 0" }}>
                                No customers found
                            </p>
                        ) : (
                            filtered.map((item) => <CustomerCard key={item.id} item={item} onView={setSelectedItem} />)
                        )}
                    </div>

                    {selectedItem && <CustomerView item={selectedItem} />}
                </Dialog>
            </div>
        </div>
    );
}
