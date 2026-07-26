import { RouteSkeleton } from "@/components/main/route-skeleton";
import { HolidayCard } from "@/components/holidays/holiday-card";
import { HolidayForm } from "@/components/holidays/holiday-form";
import { HolidayTable } from "@/components/holidays/holiday-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { holidaysApi, type ApiHoliday } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/holidays")({
    loader: () => holidaysApi.listAll(),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const CATEGORY_TABS = [
    { value: "ALL", label: "All", cls: "" },
    { value: "TRADITIONAL", label: "Traditional", cls: "cat-trad" },
    { value: "CULTURAL", label: "Cultural", cls: "cat-cult" },
    { value: "EVENT_BASED", label: "Event-Based", cls: "cat-event" },
] as const;

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiHoliday | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    const allItems = data.items;

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((h) => h.name.toLowerCase().includes(q));
        }
        if (categoryFilter !== "ALL") {
            result = result.filter((h) => h.category === categoryFilter);
        }
        return result;
    }, [allItems, searchQuery, categoryFilter]);

    const kpis = useMemo(() => {
        const total = allItems.length;
        const active = allItems.filter((h) => h.isActive).length;
        const totalKits = allItems.reduce((sum, h) => sum + h.kits.length, 0);
        const inactive = total - active;
        return { total, active, totalKits, inactive };
    }, [allItems]);

    const counts = useMemo(() => {
        const by = (cat: string) => allItems.filter((h) => h.category === cat).length;
        return {
            all: allItems.length,
            trad: by("TRADITIONAL"),
            cult: by("CULTURAL"),
            event: by("EVENT_BASED"),
        };
    }, [allItems]);

    return (
        <div className="content">
            <style>{`
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.filter-pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1px solid var(--line);background:var(--card);color:var(--ink-muted);cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.pill:hover{background:var(--bg);color:var(--ink)}
.pill.on{background:var(--brand-gradient);color:#fff;border-color:transparent}
.pill.cat-trad.on{background:linear-gradient(135deg,#7B22A5,#B5005C);color:#fff;border-color:transparent}
.pill.cat-cult.on{background:linear-gradient(135deg,#1F6BD9,#0A9ABF);color:#fff;border-color:transparent}
.pill.cat-event.on{background:linear-gradient(135deg,#C47700,#D23B5A);color:#fff;border-color:transparent}
.toolbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.search-box{display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 13px;color:var(--ink-soft);font-size:13px;min-width:260px}
.search-box input{border:none;background:none;outline:none;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink)}
.cat-badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.02em}
.cat-badge.cat-trad{background:#F3E8FB;color:var(--brand-purple)}
.cat-badge.cat-cult{background:var(--blue-bg);color:var(--blue)}
.cat-badge.cat-event{background:var(--amber-bg);color:var(--amber)}
.hol-thumb{width:42px;height:42px;border-radius:10px;object-fit:cover;flex-shrink:0;border:1px solid var(--line)}
.hol-cell{display:flex;align-items:center;gap:12px}
.hol-cell .nm{font-weight:600;font-size:13.5px}
.hol-cell .slug{font-size:11.5px;color:var(--ink-soft);font-family:ui-monospace,monospace}
.kit-count{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;color:var(--ink-muted)}
.kit-count .n{font-size:14px;font-weight:700;color:var(--ink)}
.toggle{position:relative;display:inline-block;width:36px;height:20px}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-track{position:absolute;top:0;left:0;right:0;bottom:0;background:var(--line-strong);border-radius:10px;transition:background .2s;cursor:pointer}
.toggle input:checked + .toggle-track{background:var(--brand-gradient)}
.toggle input:disabled + .toggle-track{opacity:.55;cursor:not-allowed}
.toggle-thumb{position:absolute;top:3px;left:3px;width:14px;height:14px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.15);transition:transform .2s;pointer-events:none}
.toggle input:checked ~ .toggle-thumb{transform:translateX(16px)}
.act-btn{width:30px;height:30px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-muted);border:1px solid transparent;transition:background .15s,border-color .15s;cursor:pointer}
.act-btn:hover{background:var(--bg);border-color:var(--line)}
.act-btn:disabled{opacity:.4;cursor:not-allowed}
.kpis-sm{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.kpi-sm{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-sm);padding:16px 18px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow-xs)}
.kpi-sm .ic-sm{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.kpi-sm .lbl{font-size:12px;color:var(--ink-muted);font-weight:500}
.kpi-sm .val{font-size:22px;font-weight:800;letter-spacing:-0.02em;line-height:1.1}
.kpi-sm .sub-lbl{font-size:11px;color:var(--ink-soft);margin-top:2px}
.row-num{font-size:12px;color:var(--ink-soft);font-weight:500;width:28px;text-align:center}
@media(max-width:1100px){.kpis-sm{grid-template-columns:repeat(2,1fr)}.col-hide{display:none}}
            `}</style>

            {/* PAGE HEADER */}
            <div className="page-head">
                <div>
                    <h1>Holidays</h1>
                    <div className="sub">Manage occasions, categories, and kit availability across the catalog.</div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="btn-grad">＋ Add holiday</button>
                    </DialogTrigger>
                    {createOpen && <HolidayForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            {/* KPI STRIP */}
            <div className="kpis-sm">
                <div className="kpi-sm">
                    <div className="ic-sm" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>🎀</div>
                    <div>
                        <div className="lbl">Total holidays</div>
                        <div className="val">{kpis.total}</div>
                        <div className="sub-lbl">In catalog</div>
                    </div>
                </div>
                <div className="kpi-sm">
                    <div className="ic-sm" style={{ background: "var(--green-bg)", color: "var(--green)" }}>✅</div>
                    <div>
                        <div className="lbl">Active</div>
                        <div className="val">{kpis.active}</div>
                        <div className="sub-lbl">Bookable now</div>
                    </div>
                </div>
                <div className="kpi-sm">
                    <div className="ic-sm" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>🎁</div>
                    <div>
                        <div className="lbl">Total kits</div>
                        <div className="val">{kpis.totalKits}</div>
                        <div className="sub-lbl">Across all holidays</div>
                    </div>
                </div>
                <div className="kpi-sm">
                    <div className="ic-sm" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>○</div>
                    <div>
                        <div className="lbl">Inactive</div>
                        <div className="val">{kpis.inactive}</div>
                        <div className="sub-lbl">Hidden from catalog</div>
                    </div>
                </div>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="toolbar">
                <div className="filter-pills">
                    {CATEGORY_TABS.map((tab) => {
                        const count =
                            tab.value === "ALL"
                                ? counts.all
                                : tab.value === "TRADITIONAL"
                                  ? counts.trad
                                  : tab.value === "CULTURAL"
                                    ? counts.cult
                                    : counts.event;
                        const on = categoryFilter === tab.value;
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setCategoryFilter(tab.value)}
                                className={`pill ${tab.cls} ${on ? "on" : ""}`}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>
                <div className="toolbar-right">
                    <div className="search-box">
                        <span>⌕</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search holidays…"
                        />
                    </div>
                </div>
            </div>

            <HolidayTable items={filteredItems} onEdit={setEditItem} />

            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredItems.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No holidays found</p>
                ) : (
                    filteredItems.map((item) => <HolidayCard key={item.id} item={item} onEdit={setEditItem} />)
                )}
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <HolidayForm holiday={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </div>
    );
}
