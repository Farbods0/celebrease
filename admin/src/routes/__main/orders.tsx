import { RouteSkeleton } from "@/components/main/route-skeleton";
import { OrderCard } from "@/components/orders/order-card";
import { OrderTable } from "@/components/orders/order-table";
import { OrderView } from "@/components/orders/order-view";
import { Dialog } from "@/components/ui/dialog";
import { ordersApi, type ApiOrder, type ListOrdersParams } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const searchSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(20),
    search: z.string().optional(),
    filter: z.enum(["all", "active", "returns", "completed"]).optional().default("all"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const Route = createFileRoute("/__main/orders")({
    validateSearch: searchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => {
        const params: ListOrdersParams = { page: deps.page, limit: deps.limit };
        if (deps.search) params.search = deps.search;
        if (deps.filter && deps.filter !== "all") params.filter = deps.filter as "active" | "returns";
        if (deps.startDate) params.startDate = deps.startDate;
        if (deps.endDate) params.endDate = deps.endDate;
        return ordersApi.list(params);
    },
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const FILTER_TABS: { label: string; value: "all" | "active" | "returns" | "completed" }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Returns", value: "returns" },
    { label: "Completed", value: "completed" },
];

const PAGE_STYLE = `
/* KPI strip override — 5 columns for orders metrics */
.kpis-5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.kpis-5 .kpi .val{font-size:24px}

/* Status filter tabs */
.filter-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.filter-tabs{display:flex;gap:2px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;overflow-x:auto}
.filter-tabs button{white-space:nowrap;font-size:13px;font-weight:500;color:var(--ink-muted);padding:6px 14px;border-radius:7px;display:inline-flex;align-items:center;gap:6px;transition:background .15s,color .15s;border:none;background:none;cursor:pointer;font-family:inherit}
.filter-tabs button.on{background:var(--brand-gradient);color:#fff;font-weight:600}
.filter-tabs button .cnt{font-size:11px;font-weight:700;background:rgba(255,255,255,.25);border-radius:6px;padding:0 6px;height:17px;line-height:17px}
.filter-tabs button:not(.on) .cnt{background:var(--line);color:var(--ink-muted)}

/* Filter controls row */
.controls-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.search-inline{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 13px;color:var(--ink-soft);font-size:13px;min-width:260px;flex:1;max-width:380px}
.search-inline input{border:none;background:none;outline:none;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink)}
.filter-select{appearance:none;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239385A6' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 12px center;border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 34px 8px 13px;font-family:inherit;font-size:13px;color:var(--ink);cursor:pointer}
.filter-select:focus{outline:none;border-color:var(--brand-purple)}
.date-inline{appearance:none;background:#fff;border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 12px;font-family:inherit;font-size:13px;color:var(--ink);cursor:pointer}
.date-inline:focus{outline:none;border-color:var(--brand-purple)}
.btn-outline{height:38px;padding:0 16px;border-radius:var(--radius-sm);border:1px solid var(--line);background:#fff;color:var(--ink-muted);font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-family:inherit}
.btn-outline:hover{border-color:var(--brand-purple);color:var(--brand-purple)}

/* Table enhancements */
.tbl-wrap{overflow-x:auto}
.tbl-kit{display:flex;align-items:center;gap:10px}
.tbl-kit img{width:34px;height:34px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid var(--line)}
.tbl-kit .kit-name{font-weight:600;font-size:13px;line-height:1.3}
.tbl-kit .kit-tier{font-size:11.5px;color:var(--ink-soft)}
.tbl-dur{font-size:13px;color:var(--ink-muted);font-weight:500;white-space:nowrap}
.tbl-date{font-size:13px;color:var(--ink-muted);white-space:nowrap}

/* Action menu */
.row-actions{display:flex;align-items:center;gap:6px}
.act-btn{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;border:1px solid var(--line);background:#fff;color:var(--ink-muted);transition:background .12s,color .12s;cursor:pointer}
.act-btn:hover{background:var(--bg);color:var(--brand-purple);border-color:var(--brand-purple)}

/* Panel head toolbar */
.panel-head-toolbar{display:flex;align-items:center;gap:10px}

/* Empty state */
.orders-empty{padding:56px 0;text-align:center;color:var(--ink-soft);font-size:13.5px}

@media(max-width:1100px){
  .kpis-5{grid-template-columns:repeat(3,1fr)}
  .filter-tabs{flex-wrap:wrap}
}
@media(max-width:760px){
  .kpis-5{grid-template-columns:repeat(2,1fr)}
  .controls-row{flex-direction:column;align-items:stretch}
  .search-inline{max-width:100%}
}
`;

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const { page, search: searchParam, filter, startDate, endDate } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiOrder | null>(null);
    const [searchInput, setSearchInput] = useState(searchParam ?? "");

    if (initialData !== data && initialData.items !== data.items) {
        setData(initialData);
    }

    const items = data.items;
    const totalPages = Math.max(1, Math.ceil(data.total / 20));

    function handleOrderUpdated(updated: ApiOrder) {
        setData((prev) => ({
            ...prev,
            items: prev.items.map((o) => (o.id === updated.id ? updated : o)),
        }));
        setSelectedItem(updated);
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ search: { page: 1, search: searchInput || undefined, filter } });
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        navigate({ search: { page: 1, search: searchParam, filter: newFilter } });
    };

    const handlePageChange = (newPage: number) => {
        navigate({ search: { page: newPage, search: searchParam, filter } });
    };

    // KPI values computed from live data (current page slice for status counts).
    const totalOrders = data.total;
    const pendingCount = items.filter((o) => o.status === "PENDING" || o.status === "RESERVED").length;
    const inTransitCount = items.filter((o) => o.status === "SHIPPED").length;
    const deliveredCount = items.filter((o) => o.status === "DELIVERED").length;
    const returnCount = items.filter(
        (o) => o.status === "RETURN_REQUESTED" || o.status === "RETURN_IN_TRANSIT",
    ).length;

    const today = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const start = data.total > 0 ? (page - 1) * 20 + 1 : 0;
    const end = Math.min(page * 20, data.total);
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    return (
        <div className="content">
            <style>{PAGE_STYLE}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Orders</h1>
                    <div className="sub">All rental orders across every customer and holiday — {today}</div>
                </div>
                <button type="button" className="btn-grad" onClick={() => toast.success("Export started")}>
                    ⬇ Export CSV
                </button>
            </div>

            {/* KPI strip */}
            <div className="kpis-5">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total orders</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>🧾</span>
                    </div>
                    <div className="val">{totalOrders}</div>
                    <span className="delta up"><span className="muted">All time</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Pending</span>
                        <span className="ic" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>⏳</span>
                    </div>
                    <div className="val">{pendingCount}</div>
                    <span className="delta up" style={{ color: "var(--amber)" }}>Awaiting fulfillment</span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">In transit</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>🚚</span>
                    </div>
                    <div className="val">{inTransitCount}</div>
                    <span className="delta up"><span className="muted">Shipped</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Return requests</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>↩️</span>
                    </div>
                    <div className="val">{returnCount}</div>
                    <span className="delta down"><span className="muted">Needs action</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Delivered</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>📬</span>
                    </div>
                    <div className="val">{deliveredCount}</div>
                    <span className="delta up"><span className="muted">Out on rental</span></span>
                </div>
            </div>

            {/* Orders table panel */}
            <div className="panel">
                <div className="panel-head">
                    <h3>All orders</h3>
                    <div className="panel-head-toolbar">
                        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{items.length} on this page</span>
                    </div>
                </div>

                {/* Filter bar */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--line)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        background: "#fff",
                    }}
                >
                    <div className="filter-tabs" role="tablist" aria-label="Order status filter">
                        {FILTER_TABS.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                role="tab"
                                aria-selected={filter === t.value}
                                className={filter === t.value ? "on" : ""}
                                onClick={() => handleFilterChange(t.value)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="controls-row">
                        <form onSubmit={handleSearchSubmit} className="search-inline" role="search">
                            <span>⌕</span>
                            <input
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Order #, customer name, email…"
                                aria-label="Filter orders"
                            />
                        </form>
                        <input
                            type="date"
                            className="date-inline"
                            value={startDate ?? ""}
                            onChange={(e) =>
                                navigate({ search: (prev) => ({ ...prev, startDate: e.target.value || undefined, page: undefined }) })
                            }
                            aria-label="Start date"
                        />
                        <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>to</span>
                        <input
                            type="date"
                            className="date-inline"
                            value={endDate ?? ""}
                            onChange={(e) =>
                                navigate({ search: (prev) => ({ ...prev, endDate: e.target.value || undefined, page: undefined }) })
                            }
                            aria-label="End date"
                        />
                        {(startDate || endDate) && (
                            <button
                                type="button"
                                className="btn-outline"
                                onClick={() => navigate({ search: (prev) => ({ ...prev, startDate: undefined, endDate: undefined }) })}
                            >
                                Clear dates
                            </button>
                        )}
                    </div>
                </div>

                {/* Table + mobile cards */}
                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <OrderTable items={items} onView={setSelectedItem} />

                    <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px" }}>
                        {items.length === 0 ? (
                            <p className="orders-empty">No orders found.</p>
                        ) : (
                            items.map((item) => <OrderCard key={item.id} item={item} onView={setSelectedItem} />)
                        )}
                    </div>

                    {selectedItem && <OrderView item={selectedItem} onUpdated={handleOrderUpdated} />}
                </Dialog>

                {/* Pagination */}
                {data.total > 0 && (
                    <div className="pagination" role="navigation" aria-label="Pagination">
                        <div className="pag-info">
                            Showing <b>{start}–{end}</b> of <b>{data.total}</b> orders
                        </div>
                        <div className="pag-btns">
                            <button
                                type="button"
                                className="pag-btn nav"
                                aria-label="Previous page"
                                disabled={page <= 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                ←
                            </button>
                            {pageNumbers.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`pag-btn${page === p ? " active" : ""}`}
                                    aria-current={page === p ? "page" : undefined}
                                    onClick={() => handlePageChange(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="pag-btn nav"
                                aria-label="Next page"
                                disabled={page >= totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
