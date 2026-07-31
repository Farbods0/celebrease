import { RouteSkeleton } from "@/components/main/route-skeleton";
import { AddOnCard } from "@/components/addons/addon-card";
import { AddonForm } from "@/components/addons/addon-form";
import { AddOnTable } from "@/components/addons/addon-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { addOnsApi, type ApiAddOn } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/addons")({
    loader: () => addOnsApi.listAll(),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

type StatusFilter = "all" | "active" | "inactive";
type SortKey = "name" | "price-asc" | "price-desc" | "recent";
type ViewMode = "grid" | "table";

function RouteComponent() {
    const { items } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<ApiAddOn | null>(null);
    const [status, setStatus] = useState<StatusFilter>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("name");
    const [view, setView] = useState<ViewMode>("grid");

    const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);
    const inactiveCount = items.length - activeCount;
    const holidaysMapped = useMemo(
        () => items.reduce((sum, i) => sum + i.holidays.length, 0),
        [items],
    );
    const totalDeposit = useMemo(
        () => items.reduce((sum, i) => sum + (Number(i.deposit) || 0), 0),
        [items],
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = items.filter((i) => {
            if (status === "active" && !i.isActive) return false;
            if (status === "inactive" && i.isActive) return false;
            if (!q) return true;
            return (
                i.name.toLowerCase().includes(q) ||
                (i.sku ?? "").toLowerCase().includes(q) ||
                i.holidays.some(({ holiday }) => holiday.name.toLowerCase().includes(q))
            );
        });
        const sorted = [...filtered];
        switch (sort) {
            case "price-asc":
                sorted.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case "price-desc":
                sorted.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case "recent":
                sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
                break;
            default:
                sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        return sorted;
    }, [items, status, query, sort]);

    return (
        <div className="content">
            <style>{`
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.filter-seg{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;gap:0}
.filter-seg button{font-size:13px;font-weight:500;color:var(--ink-muted);padding:6px 14px;border-radius:7px;white-space:nowrap}
.filter-seg button.on{background:var(--brand-gradient);color:#fff;font-weight:600}
.search-sm{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 13px;font-size:13px;color:var(--ink-soft)}
.search-sm input{border:none;background:none;outline:none;font-family:inherit;font-size:13px;color:var(--ink);width:200px}
.sort-select{background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 32px 7px 13px;font-family:inherit;font-size:13px;color:var(--ink);appearance:none;-webkit-appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239385A6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
.sort-select:focus{outline:none;border-color:var(--brand-purple)}
.ml-auto{margin-left:auto}

.addon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.addon-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .18s,transform .18s}
.addon-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.addon-card.inactive{opacity:.72}
.addon-img-wrap{position:relative;height:168px;overflow:hidden;background:var(--bg)}
.addon-img-wrap img{width:100%;height:100%;object-fit:cover;display:block}
.addon-card.inactive .addon-img-wrap{filter:grayscale(.3)}
.addon-img-wrap .holiday-tag{position:absolute;top:10px;left:10px;background:rgba(255,255,255,.92);backdrop-filter:blur(6px);border:1px solid var(--line);font-size:11.5px;font-weight:600;color:var(--ink-muted);padding:3px 9px;border-radius:20px}
.addon-body{padding:16px 18px 14px;flex:1;display:flex;flex-direction:column;gap:10px}
.addon-name{font-size:15px;font-weight:700;color:var(--ink);line-height:1.3}
.addon-desc{font-size:12.5px;color:var(--ink-muted);line-height:1.55;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.addon-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.addon-price{font-size:17px;font-weight:800;color:var(--ink);letter-spacing:-0.01em}
.addon-price .per{font-size:11.5px;font-weight:400;color:var(--ink-soft);margin-left:1px}
.kit-count{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--ink-muted);background:var(--bg);border:1px solid var(--line);padding:3px 9px;border-radius:20px;font-weight:500}
.addon-foot{border-top:1px solid var(--line);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.toggle-wrap{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:500;color:var(--ink-muted)}
.toggle{position:relative;width:38px;height:22px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-slider{position:absolute;inset:0;background:#D8D0E4;border-radius:11px;cursor:pointer;transition:background .2s}
.toggle-slider::before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle input:checked + .toggle-slider{background:var(--green)}
.toggle input:checked + .toggle-slider::before{transform:translateX(16px)}
.toggle input:disabled + .toggle-slider{opacity:.6;cursor:default}
.toggle-label.on{color:var(--green);font-weight:600}
.toggle-label.off{color:var(--ink-soft)}
.addon-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.btn-sm{font-size:12.5px;font-weight:600;padding:0 13px;height:32px;border-radius:8px;display:inline-flex;align-items:center;gap:5px;transition:background .15s,opacity .15s}
.btn-outline{border:1px solid var(--line);color:var(--ink-muted);background:#fff}
.btn-outline:hover{border-color:var(--brand-purple);color:var(--brand-purple);background:#faf7fd}
.btn-danger-ghost{border:1px solid var(--red-bg);color:var(--red);background:#fff}
.btn-danger-ghost:hover{background:var(--red-bg)}

.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:64px 24px;color:var(--ink-muted);text-align:center}
.empty .ico{font-size:44px;opacity:.4}
.empty p{font-size:14px;max-width:300px}

.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.stat-chip{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-sm);padding:16px 18px;box-shadow:var(--shadow-xs);display:flex;align-items:center;gap:14px}
.stat-chip .sc-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.stat-chip .sc-val{font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--ink)}
.stat-chip .sc-lbl{font-size:12px;color:var(--ink-muted);margin-top:1px}

@media(max-width:1100px){.stats-row{grid-template-columns:repeat(2,1fr)}.addon-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}}
@media(max-width:700px){.addon-grid{grid-template-columns:1fr}.stats-row{grid-template-columns:repeat(2,1fr)}.toolbar{flex-direction:column;align-items:flex-start}.search-sm input{width:140px}}
`}</style>

            {/* PAGE HEADER */}
            <div className="page-head">
                <div>
                    <h1>Add-ons</h1>
                    <div className="sub">Manage optional extras customers can attach to any kit rental.</div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <button className="btn-grad">＋ Add add-on</button>
                    </DialogTrigger>
                    {createOpen && <AddonForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            {/* STATS ROW */}
            <div className="stats-row">
                <div className="stat-chip">
                    <div className="sc-icon" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>✨</div>
                    <div>
                        <div className="sc-val">{items.length}</div>
                        <div className="sc-lbl">Total add-ons</div>
                    </div>
                </div>
                <div className="stat-chip">
                    <div className="sc-icon" style={{ background: "var(--green-bg)", color: "var(--green)" }}>✅</div>
                    <div>
                        <div className="sc-val">{activeCount}</div>
                        <div className="sc-lbl">Active</div>
                    </div>
                </div>
                <div className="stat-chip">
                    <div className="sc-icon" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>🔗</div>
                    <div>
                        <div className="sc-val">{holidaysMapped}</div>
                        <div className="sc-lbl">Holiday mappings</div>
                    </div>
                </div>
                <div className="stat-chip">
                    <div className="sc-icon" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>＄</div>
                    <div>
                        <div className="sc-val">${totalDeposit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="sc-lbl">Deposits held</div>
                    </div>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="filter-seg">
                    <button className={status === "all" ? "on" : ""} onClick={() => setStatus("all")}>All ({items.length})</button>
                    <button className={status === "active" ? "on" : ""} onClick={() => setStatus("active")}>Active ({activeCount})</button>
                    <button className={status === "inactive" ? "on" : ""} onClick={() => setStatus("inactive")}>Inactive ({inactiveCount})</button>
                </div>
                <div className="search-sm">
                    <span>⌕</span>
                    <input
                        placeholder="Filter add-ons…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                    <option value="name">Sort: A, Z</option>
                    <option value="price-asc">Sort: Price low→high</option>
                    <option value="price-desc">Sort: Price high→low</option>
                    <option value="recent">Sort: Recently added</option>
                </select>
                <div className="filter-seg ml-auto">
                    <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>Grid</button>
                    <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}>Table</button>
                </div>
            </div>

            {/* CONTENT */}
            {visible.length === 0 ? (
                <div className="empty">
                    <div className="ico">✨</div>
                    <p>
                        {items.length === 0
                            ? "No add-ons yet. Create your first optional extra customers can attach to a kit rental."
                            : "No add-ons match your filters."}
                    </p>
                </div>
            ) : view === "grid" ? (
                <div className="addon-grid">
                    {visible.map((item) => (
                        <AddOnCard key={item.id} item={item} onEdit={setEditing} />
                    ))}
                </div>
            ) : (
                <AddOnTable items={visible} onEdit={setEditing} />
            )}

            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                {editing && <AddonForm item={editing} onClose={() => setEditing(null)} />}
            </Dialog>
        </div>
    );
}
