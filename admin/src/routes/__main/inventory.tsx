import { RouteSkeleton } from "@/components/main/route-skeleton";
import { InventoryCard } from "@/components/inventory/inventory-card";
import { initialFilterState, InventoryFilters, type InventoryFilterState } from "@/components/inventory/inventory-filters";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { InventoryTable } from "@/components/inventory/inventory-table";
import InventoryView from "@/components/inventory/inventory-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { inventoryApi, type ApiItem, type ItemStatus } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/inventory")({
    loader: () => inventoryApi.listAll(),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const PAGE_CSS = `
.inv-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.inv-search{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 13px;color:var(--ink-soft);font-size:13px;flex:1;max-width:380px}
.inv-search input{border:none;background:none;outline:none;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink)}
.filter-btn{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:var(--ink-muted);padding:0 14px;height:38px;border-radius:10px;border:1px solid var(--line);background:#fff;cursor:pointer;transition:background .15s,color .15s}
.filter-btn:hover{background:var(--bg);color:var(--ink)}
.filter-btn.on{background:var(--red-bg);color:var(--red);border-color:#F5C6D0;font-weight:600}
.filter-btn .badge-dot{width:8px;height:8px;border-radius:50%;background:var(--red);margin-left:2px}
.holiday-filter{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hf-chip{font-size:12px;font-weight:500;padding:5px 12px;border-radius:20px;border:1px solid var(--line);background:#fff;color:var(--ink-muted);cursor:pointer;transition:all .15s}
.hf-chip:hover{border-color:var(--brand-purple);color:var(--brand-purple)}
.hf-chip.on{background:linear-gradient(135deg,rgba(155,47,201,.12),rgba(220,0,117,.08));color:var(--brand-purple);border-color:rgba(155,47,201,.3);font-weight:600}
.item-cell{display:flex;align-items:center;gap:12px}
.item-thumb{width:38px;height:38px;border-radius:9px;object-fit:cover;flex-shrink:0;border:1px solid var(--line)}
.item-name{font-weight:600;font-size:13.5px;color:var(--ink)}
.item-sku{font-family:ui-monospace,monospace;font-size:11px;color:var(--ink-soft)}
.item-tier{display:inline-block;font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:5px;text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
.tier-starter{background:#EDE4F5;color:#7A22A8}
.tier-premium{background:linear-gradient(135deg,rgba(155,47,201,.13),rgba(220,0,117,.10));color:var(--brand-purple)}
.tier-ultimate{background:var(--brand-gradient);color:#fff}
.qty-chips{display:flex;gap:6px;flex-wrap:nowrap}
.qchip{display:inline-flex;flex-direction:column;align-items:center;min-width:42px;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:700;line-height:1.2}
.qchip .qlbl{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;opacity:.75;margin-top:1px}
.qchip-avail{background:var(--green-bg);color:var(--green)}
.qchip-res{background:var(--blue-bg);color:var(--blue)}
.qchip-ship{background:#EAF1FD;color:#1A5CBF}
.qchip-clean{background:var(--amber-bg);color:var(--amber)}
.st-good{color:var(--green);background:var(--green-bg)}
.st-low{color:var(--amber);background:var(--amber-bg)}
.st-critical{color:var(--red);background:var(--red-bg)}
.st-oos{color:var(--ink-soft);background:#F0EBF8}
tbody tr.row-low{background:#FFFBF0}
tbody tr.row-low:hover{background:#FFF6E0}
tbody tr.row-crit{background:#FEF4F6}
tbody tr.row-crit:hover{background:#FDE8EE}
.util-bar{width:72px;height:5px;border-radius:3px;background:var(--line-strong);overflow:hidden;margin-top:4px}
.util-bar i{display:block;height:100%;border-radius:3px}
.util-bar.good i{background:var(--green)}
.util-bar.med i{background:var(--amber)}
.util-bar.high i{background:var(--red)}
.row-actions{display:flex;align-items:center;gap:6px;opacity:0;transition:opacity .15s}
tbody tr:hover .row-actions{opacity:1}
.row-actions:focus-within{opacity:1}
.ra-btn{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-muted);border:1px solid var(--line);background:#fff;cursor:pointer}
.ra-btn:hover{background:var(--bg);color:var(--ink)}
@media(max-width:1100px){.qty-chips{flex-wrap:wrap}.util-bar{display:none}}
@media(max-width:700px){.inv-toolbar{flex-direction:column;align-items:stretch}.inv-search{max-width:100%}}
`;

function RouteComponent() {
    const { items } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);
    const [editing, setEditing] = useState<ApiItem | null>(null);
    const [filters, setFilters] = useState<InventoryFilterState>(initialFilterState);

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const it of items) if (it.category) set.add(it.category);
        return [...set].sort();
    }, [items]);

    // Unique holidays present across all items (drives the holiday filter chips).
    const holidays = useMemo(() => {
        const map = new Map<string, string>();
        for (const it of items) {
            for (const ki of it.kitItems) {
                if (!map.has(ki.kit.holidayId)) map.set(ki.kit.holidayId, ki.kit.holiday.name);
            }
        }
        return [...map.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    }, [items]);

    const filtered = useMemo(() => {
        const search = filters.search.trim().toLowerCase();
        return items.filter((item) => {
            if (search && !item.name.toLowerCase().includes(search) && !item.sku.toLowerCase().includes(search)) {
                return false;
            }
            if (filters.holidayId !== "all") {
                const inHoliday = item.kitItems.some((ki) => ki.kit.holidayId === filters.holidayId);
                if (!inHoliday) return false;
            }
            if (!filters.tiers.has("ALL")) {
                const tiers = new Set(item.kitItems.map((ki) => ki.kit.tier));
                const ok = [...filters.tiers].some((t) => t !== "ALL" && tiers.has(t));
                if (!ok) return false;
            }
            if (filters.statuses.size > 0 && !filters.statuses.has(item.status)) {
                return false;
            }
            if (filters.category !== "all" && item.category !== filters.category) {
                return false;
            }
            if (filters.lowStockOnly) {
                const lowStock = (item.inventory?.availableQty ?? 0) <= item.lowStockThreshold && item.lowStockThreshold > 0;
                if (!lowStock) return false;
            }
            return true;
        });
    }, [items, filters]);

    // Compute KPIs from live data.
    const totalItems = items.length;
    const lowStockItems = items.filter(
        (i) => i.inventory && i.inventory.availableQty <= (i.lowStockThreshold || 5) && i.lowStockThreshold > 0
    ).length;
    const totalAvailable = items.reduce((sum, i) => sum + (i.inventory?.availableQty ?? 0), 0);
    const totalOut = items.reduce((sum, i) => sum + (i.inventory?.shippedQty ?? 0) + (i.inventory?.reservedQty ?? 0), 0);

    // Segment maps to the existing `statuses` filter set.
    const seg: "all" | "active" | "archived" = filters.statuses.has("HIDDEN")
        ? "archived"
        : filters.statuses.has("ACTIVE")
          ? "active"
          : "all";
    const setSeg = (next: "all" | "active" | "archived") => {
        const statuses = new Set<ItemStatus>();
        if (next === "active") statuses.add("ACTIVE");
        else if (next === "archived") statuses.add("HIDDEN");
        setFilters({ ...filters, statuses });
    };

    return (
        <div className="content">
            <style>{PAGE_CSS}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Inventory</h1>
                    <div className="sub">
                        Track stock levels, reservations, and in-transit items across all holiday kits.
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                        type="button"
                        className={`filter-btn ${filters.lowStockOnly ? "on" : ""}`}
                        onClick={() => setFilters({ ...filters, lowStockOnly: !filters.lowStockOnly })}
                    >
                        <span>⚠</span> Low stock only
                        {filters.lowStockOnly && <span className="badge-dot" />}
                    </button>
                    <div className="seg">
                        <button className={seg === "all" ? "on" : ""} onClick={() => setSeg("all")}>
                            All
                        </button>
                        <button className={seg === "active" ? "on" : ""} onClick={() => setSeg("active")}>
                            Active
                        </button>
                        <button className={seg === "archived" ? "on" : ""} onClick={() => setSeg("archived")}>
                            Archived
                        </button>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <button type="button" className="btn-grad">
                                <Plus className="size-4" />
                                Add item
                            </button>
                        </DialogTrigger>
                        {createOpen && <InventoryForm onClose={() => setCreateOpen(false)} />}
                    </Dialog>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total items tracked</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>
                            📦
                        </span>
                    </div>
                    <div className="val">{totalItems.toLocaleString()}</div>
                    <span className="delta up">
                        <span className="muted">{filtered.length} matching filters</span>
                    </span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Available units</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                            ✓
                        </span>
                    </div>
                    <div className="val">{totalAvailable.toLocaleString()}</div>
                    <span className="delta up">
                        <span className="muted">in stock</span>
                    </span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Out on rental</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>
                            🚚
                        </span>
                    </div>
                    <div className="val">{totalOut.toLocaleString()}</div>
                    <span className="delta up">
                        <span className="muted">reserved + shipped</span>
                    </span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Low stock</span>
                        <span className="ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                            ⚠
                        </span>
                    </div>
                    <div className="val">{lowStockItems.toLocaleString()}</div>
                    <span className={lowStockItems > 0 ? "delta down" : "delta up"}>
                        <span className="muted">{lowStockItems > 0 ? "need restock" : "all clear"}</span>
                    </span>
                </div>
            </div>

            {/* Toolbar: search + holiday chips */}
            <div className="inv-toolbar">
                <div className="inv-search">
                    <span>⌕</span>
                    <input
                        placeholder="Filter by item name or SKU…"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="holiday-filter">
                    <button
                        type="button"
                        className={`hf-chip ${filters.holidayId === "all" ? "on" : ""}`}
                        onClick={() => setFilters({ ...filters, holidayId: "all" })}
                    >
                        All holidays
                    </button>
                    {holidays.map((h) => (
                        <button
                            type="button"
                            key={h.id}
                            className={`hf-chip ${filters.holidayId === h.id ? "on" : ""}`}
                            onClick={() => setFilters({ ...filters, holidayId: h.id })}
                        >
                            {h.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full bg-card rounded-[10px]">
                            <SlidersHorizontal className="size-4" />
                            All Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs">
                        <DialogHeader>
                            <DialogTitle>All Filters</DialogTitle>
                        </DialogHeader>
                        <InventoryFilters categories={categories} state={filters} onChange={setFilters} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table / Cards */}
            <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <InventoryTable
                    items={filtered}
                    onView={setSelectedItem}
                    onEdit={(item) => {
                        setEditing(item);
                        setSelectedItem(null);
                    }}
                />

                <div className="space-y-4 md:hidden">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No inventory items found.</p>
                    ) : (
                        filtered.map((item) => (
                            <InventoryCard
                                key={item.id}
                                item={item}
                                onView={setSelectedItem}
                                onEdit={(item) => {
                                    setEditing(item);
                                    setSelectedItem(null);
                                }}
                            />
                        ))
                    )}
                </div>

                {selectedItem ? (
                    <InventoryView
                        item={selectedItem}
                        onEdit={(item) => {
                            setEditing(item);
                            setSelectedItem(null);
                        }}
                    />
                ) : null}
            </Sheet>

            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                {editing && <InventoryForm item={editing} onClose={() => setEditing(null)} />}
            </Dialog>
        </div>
    );
}
