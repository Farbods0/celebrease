import { RouteSkeleton } from "@/components/main/route-skeleton";
import { ReturnCard } from "@/components/returns/return-card";
import { ReturnTable } from "@/components/returns/return-table";
import { ReturnView } from "@/components/returns/return-view";
import { Dialog } from "@/components/ui/dialog";
import { formatMoney, ordersApi, totalDeposit, type ApiOrder, type OrderStatus } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/returns")({
    loader: () => ordersApi.list({ filter: "returns" }),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

type ReturnTab = "awaiting" | "inspecting";

const AWAITING_STATUSES: OrderStatus[] = ["RETURN_REQUESTED", "RETURN_IN_TRANSIT"];
const INSPECTING_STATUSES: OrderStatus[] = ["RETURN_RECEIVED", "INSPECTED"];

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiOrder | null>(null);
    const [tab, setTab] = useState<ReturnTab>("awaiting");

    const items = data.items;

    const awaiting = useMemo(() => items.filter((o) => AWAITING_STATUSES.includes(o.status)), [items]);
    const inspecting = useMemo(() => items.filter((o) => INSPECTING_STATUSES.includes(o.status)), [items]);

    const visible = tab === "awaiting" ? awaiting : inspecting;

    const depositsHeld = useMemo(
        () => items.reduce((sum, o) => sum + totalDeposit(o), 0),
        [items],
    );

    function handleUpdated(updated: ApiOrder) {
        const stillReturning =
            updated.status === "RETURN_REQUESTED" ||
            updated.status === "RETURN_IN_TRANSIT" ||
            updated.status === "RETURN_RECEIVED" ||
            updated.status === "INSPECTED";

        setData((prev) => ({
            ...prev,
            items: stillReturning
                ? prev.items.map((o) => (o.id === updated.id ? updated : o))
                : prev.items.filter((o) => o.id !== updated.id),
        }));

        if (stillReturning) {
            setSelectedItem(updated);
        } else {
            setSelectedItem(null);
        }
    }

    return (
        <div className="content">
            <style>{`
.tabs{display:flex;gap:0;border-bottom:2px solid var(--line)}
.tab-btn{font-size:13.5px;font-weight:600;color:var(--ink-muted);padding:11px 20px;border-bottom:2px solid transparent;margin-bottom:-2px;display:flex;align-items:center;gap:7px;transition:color .15s,border-color .15s;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer}
.tab-btn:hover{color:var(--ink)}
.tab-btn.on{color:var(--brand-purple);border-bottom-color:var(--brand-purple)}
.tab-count{font-size:11px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--bg)}
.tab-btn.on .tab-count{background:linear-gradient(135deg,rgba(155,47,201,.12),rgba(220,0,117,.08));color:var(--brand-purple)}
.tab-count.red{background:var(--red-bg);color:var(--red)}

.ret-table thead th{padding:0 14px 11px}
.ret-table tbody td{padding:14px 14px;border-top:1px solid var(--line);vertical-align:middle}
.ret-table tbody tr:hover{background:#FDFAFF}

.kit-cell{display:flex;align-items:center;gap:11px}
.kit-cell img{width:40px;height:40px;border-radius:9px;object-fit:cover;border:1px solid var(--line)}
.kit-cell .kn{font-weight:600;font-size:13.5px}
.kit-cell .ks{font-size:11.5px;color:var(--ink-soft)}

.dep-cell{display:flex;flex-direction:column;gap:3px}
.dep-full{font-size:15px;font-weight:800;color:var(--ink)}
.dep-sub{font-size:11.5px;color:var(--ink-soft)}

.act-btns{display:flex;flex-direction:column;gap:6px;min-width:150px}
.btn-inspect{background:var(--brand-gradient);color:#fff;font-size:12.5px;font-weight:700;padding:7px 12px;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;box-shadow:var(--shadow-xs)}
.btn-inspect:hover{opacity:.93}

.ret-date{font-size:13px;color:var(--ink-muted)}
.ret-date b{color:var(--ink);font-weight:600}

.callout{display:flex;align-items:center;gap:12px;background:#FFF8FF;border:1px solid #EDD6F9;border-radius:var(--radius-sm);padding:13px 18px;font-size:13.5px}
.callout .ic{font-size:20px;flex-shrink:0}
.callout strong{font-weight:700;color:var(--brand-purple)}
.callout .sep{color:var(--line-strong);margin:0 6px}

.wf-hint{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-soft);padding:8px 14px 12px 14px;background:var(--bg);border-top:1px solid var(--line)}
.wf-hint b{color:var(--ink-muted)}

.ret-empty{padding:48px 0;text-align:center;color:var(--ink-soft);font-size:13.5px}

@media(max-width:1100px){
  .ret-table thead{display:none}
  .ret-table tbody td{display:block;padding:6px 14px}
  .ret-table tbody tr{display:block;padding:12px 0;border-top:2px solid var(--line)}
  .act-btns{flex-direction:row;flex-wrap:wrap}
}
            `}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Returns &amp; Deposit Adjudication</h1>
                    <div className="sub">Inspect returned kits, assess condition, and decide deposit refunds.</div>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Awaiting inspection</span>
                        <span className="ic" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>📥</span>
                    </div>
                    <div className="val">{awaiting.length}</div>
                    <span className="delta up"><span className="muted">In return pipeline</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Deposits held</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>💰</span>
                    </div>
                    <div className="val">{formatMoney(depositsHeld)}</div>
                    <span className="delta up"><span className="muted">across {items.length} open {items.length === 1 ? "case" : "cases"}</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Under inspection</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>⏱</span>
                    </div>
                    <div className="val">{inspecting.length}</div>
                    <span className="delta up"><span className="muted">Received &amp; reviewing</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Open return cases</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>↩️</span>
                    </div>
                    <div className="val">{items.length}</div>
                    <span className="delta up"><span className="muted">{items.length > 0 ? "Need review" : "All clear"}</span></span>
                </div>
            </div>

            {/* Main returns panel */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <div className="panel">
                    <div className="panel-head" style={{ flexWrap: "wrap", gap: 12 }}>
                        <h3>Returns Queue</h3>
                        <div className="tabs" style={{ borderBottom: "none" }}>
                            <button
                                className={`tab-btn${tab === "awaiting" ? " on" : ""}`}
                                onClick={() => setTab("awaiting")}
                            >
                                Awaiting <span className={`tab-count${awaiting.length > 0 ? " red" : ""}`}>{awaiting.length}</span>
                            </button>
                            <button
                                className={`tab-btn${tab === "inspecting" ? " on" : ""}`}
                                onClick={() => setTab("inspecting")}
                            >
                                Inspecting <span className="tab-count">{inspecting.length}</span>
                            </button>
                        </div>
                    </div>

                    <div className="wf-hint">
                        <b>Workflow:</b> &nbsp;Receive kit → inspect condition → grade items → approve full refund or deduct &amp; refund → mark resolved.
                    </div>

                    {/* Desktop table */}
                    <ReturnTable items={visible} onView={setSelectedItem} />

                    {/* Mobile cards */}
                    <div className="space-y-4 md:hidden" style={{ padding: "0 14px 14px" }}>
                        {visible.length === 0 ? (
                            <p className="ret-empty">No returns in this stage</p>
                        ) : (
                            visible.map((item) => <ReturnCard key={item.id} item={item} onView={setSelectedItem} />)
                        )}
                    </div>
                </div>

                {selectedItem && <ReturnView item={selectedItem} onUpdated={handleUpdated} />}
            </Dialog>
        </div>
    );
}
