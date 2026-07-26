import { RouteSkeleton } from "@/components/main/route-skeleton";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewTable } from "@/components/reviews/review-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { reviewsApi, type ApiReview } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import * as z from "zod";

const searchSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
});

export const Route = createFileRoute("/__main/reviews")({
    validateSearch: searchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => reviewsApi.list(deps),
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

type StatusFilter = "all" | "approved" | "hidden";
type StarFilter = "all" | "5" | "4" | "3" | "low";
type SortKey = "newest" | "oldest" | "lowest" | "highest";

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiReview | null>(null);

    const [status, setStatus] = useState<StatusFilter>("all");
    const [stars, setStars] = useState<StarFilter>("all");
    const [sort, setSort] = useState<SortKey>("newest");

    const items = data.items;

    // ── Live-derived metrics (no fabricated fields) ──
    const total = data.total ?? items.length;
    const approvedCount = items.filter((r) => r.isActive).length;
    const hiddenCount = items.filter((r) => !r.isActive).length;
    const avg = items.length ? items.reduce((s, r) => s + r.rating, 0) / items.length : 0;

    const dist = useMemo(() => {
        const buckets = [0, 0, 0, 0, 0]; // index 0 => 1★ … index 4 => 5★
        for (const r of items) {
            const k = Math.max(1, Math.min(5, Math.round(r.rating)));
            buckets[k - 1] += 1;
        }
        return buckets;
    }, [items]);
    const distMax = Math.max(1, ...dist);

    const filtered = useMemo(() => {
        let list = items.slice();
        if (status === "approved") list = list.filter((r) => r.isActive);
        else if (status === "hidden") list = list.filter((r) => !r.isActive);

        if (stars === "5") list = list.filter((r) => r.rating === 5);
        else if (stars === "4") list = list.filter((r) => r.rating === 4);
        else if (stars === "3") list = list.filter((r) => r.rating === 3);
        else if (stars === "low") list = list.filter((r) => r.rating <= 2);

        list.sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "lowest":
                    return a.rating - b.rating;
                case "highest":
                    return b.rating - a.rating;
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
        return list;
    }, [items, status, stars, sort]);

    return (
        <div className="content">
            <style>{`
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.filter-group{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;gap:2px}
.filter-group button{font-family:inherit;cursor:pointer;border:none;background:none;font-size:13px;font-weight:500;color:var(--ink-muted);padding:6px 14px;border-radius:7px;white-space:nowrap;display:flex;align-items:center;gap:6px}
.filter-group button.on{background:var(--brand-gradient);color:#fff;font-weight:600}
.filter-group button .cnt{background:rgba(255,255,255,.25);font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px}
.filter-group button:not(.on) .cnt{background:var(--red);color:#fff}
.filter-group button:not(.on) .cnt.ok{background:var(--green)}
.filter-group button:not(.on) .cnt.neutral{background:var(--ink-soft)}
.star-filter{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;gap:2px}
.star-filter button{font-family:inherit;cursor:pointer;border:none;background:none;font-size:12.5px;font-weight:500;color:var(--ink-muted);padding:6px 11px;border-radius:7px;white-space:nowrap}
.star-filter button.on{background:var(--amber-bg);color:var(--amber);font-weight:700}
.toolbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.sort-sel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 12px;font-family:inherit;font-size:13px;color:var(--ink-muted);font-weight:500;cursor:pointer;outline:none}
.reviews-list{display:flex;flex-direction:column;gap:14px}
.rv-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);padding:20px 22px;display:flex;gap:18px;transition:box-shadow .15s}
.rv-card:hover{box-shadow:var(--shadow-sm)}
.rv-left{display:flex;flex-direction:column;align-items:center;gap:8px;flex-shrink:0;width:64px}
.rv-av{width:44px;height:44px;border-radius:50%;background:#EDE4F5;color:var(--brand-purple);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0}
.rv-av.magenta{background:linear-gradient(135deg,rgba(220,0,117,.12),rgba(155,47,201,.10));color:var(--brand-magenta)}
.rv-av.green{background:var(--green-bg);color:var(--green)}
.rv-av.blue{background:var(--blue-bg);color:var(--blue)}
.rv-av.amber{background:var(--amber-bg);color:var(--amber)}
.rv-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.rv-meta-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.rv-name{font-weight:700;font-size:14px}
.rv-kit{font-size:12.5px;color:var(--ink-muted);display:flex;align-items:center;gap:6px}
.rv-kit .kit-thumb{width:22px;height:22px;border-radius:6px;object-fit:cover;flex-shrink:0;display:block}
.rv-date{font-size:12px;color:var(--ink-soft);margin-left:auto}
.stars{display:flex;align-items:center;gap:2px;font-size:14px;color:var(--amber)}
.rv-text{font-size:13.5px;color:var(--ink);line-height:1.6;margin-top:2px}
.rv-actions{display:flex;flex-direction:column;gap:8px;flex-shrink:0;align-items:flex-end;justify-content:space-between}
.rv-status{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap}
.rv-status::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor}
.rv-st-approved{color:var(--green);background:var(--green-bg)}
.rv-st-hidden{color:var(--ink-soft);background:#F0EBF5}
.rv-btn-row{display:flex;gap:7px;align-items:center}
.rv-btn{font-family:inherit;cursor:pointer;border:none;height:32px;padding:0 13px;border-radius:8px;font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:background .15s,color .15s,opacity .15s}
.rv-btn:disabled{opacity:.5;cursor:not-allowed}
.rv-btn-approve{background:var(--green-bg);color:var(--green);border:1px solid rgba(31,157,107,.2)}
.rv-btn-approve:hover{background:#D0F0E5}
.rv-btn-hide{background:var(--bg);color:var(--ink-muted);border:1px solid var(--line)}
.rv-btn-hide:hover{background:var(--line)}
.avg-block{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 20px 0 4px;border-right:1px solid var(--line);margin-right:16px}
.avg-num{font-size:42px;font-weight:800;letter-spacing:-0.03em;background:var(--brand-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.avg-stars{font-size:18px;letter-spacing:1px;margin-top:4px;color:var(--amber)}
.avg-total{font-size:12px;color:var(--ink-soft);font-weight:500}
.rating-dist{display:flex;flex-direction:column;gap:7px}
.rd-row{display:flex;align-items:center;gap:10px;font-size:12.5px}
.rd-label{width:16px;text-align:right;color:var(--ink-muted);font-weight:500;font-size:13px}
.rd-track{flex:1;height:7px;border-radius:4px;background:var(--bg);overflow:hidden}
.rd-fill{height:100%;background:var(--brand-gradient);border-radius:4px}
.rd-count{width:24px;text-align:right;color:var(--ink-soft);font-size:12px;font-weight:600}
@media(max-width:1100px){
  .rv-card{flex-direction:column}
  .rv-left{flex-direction:row;width:auto;justify-content:flex-start}
  .rv-actions{flex-direction:row;align-items:center}
  .toolbar{gap:8px}
  .toolbar-right{margin-left:0}
}
            `}</style>

            {/* PAGE HEAD */}
            <div className="page-head">
                <div>
                    <h1>Reviews</h1>
                    <div className="sub">Moderate customer feedback — approve, hide, or remove before it goes live.</div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="btn-grad">
                            <Plus className="size-4" />
                            <span>Add review</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <ReviewForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total reviews</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>⭐</span>
                    </div>
                    <div className="val">{total.toLocaleString()}</div>
                    <span className="delta up"><span className="muted">{items.length} on this page</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Average rating</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>★</span>
                    </div>
                    <div className="val">{avg ? avg.toFixed(1) : "—"}</div>
                    <span className="delta up"><span className="muted">across {items.length} reviews</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Approved</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>✓</span>
                    </div>
                    <div className="val">{approvedCount}</div>
                    <span className="delta up"><span className="muted">visible to customers</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Hidden</span>
                        <span className="ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>🚩</span>
                    </div>
                    <div className="val">{hiddenCount}</div>
                    <span className="delta down"><span className="muted">{hiddenCount > 0 ? "needs review" : "all clear"}</span></span>
                </div>
            </div>

            {/* RATING OVERVIEW */}
            <div className="panel">
                <div className="panel-head">
                    <h3>Rating overview — this page</h3>
                </div>
                <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 0, padding: "20px 24px" }}>
                    <div className="avg-block">
                        <div className="avg-num">{avg ? avg.toFixed(1) : "0.0"}</div>
                        <div className="avg-stars">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
                        <div className="avg-total">{items.length} reviews</div>
                    </div>
                    <div className="rating-dist" style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = dist[star - 1];
                            const pct = Math.round((count / distMax) * 100);
                            return (
                                <div className="rd-row" key={star}>
                                    <span className="rd-label">{star}</span>
                                    <div className="rd-track"><div className="rd-fill" style={{ width: `${pct}%` }} /></div>
                                    <span className="rd-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="filter-group">
                    <button className={status === "all" ? "on" : ""} onClick={() => setStatus("all")}>
                        All <span className="cnt neutral">{items.length}</span>
                    </button>
                    <button className={status === "approved" ? "on" : ""} onClick={() => setStatus("approved")}>
                        Approved <span className="cnt ok">{approvedCount}</span>
                    </button>
                    <button className={status === "hidden" ? "on" : ""} onClick={() => setStatus("hidden")}>
                        Hidden <span className="cnt neutral">{hiddenCount}</span>
                    </button>
                </div>
                <div className="star-filter">
                    <button className={stars === "all" ? "on" : ""} onClick={() => setStars("all")}>All stars</button>
                    <button className={stars === "5" ? "on" : ""} onClick={() => setStars("5")}>★★★★★</button>
                    <button className={stars === "4" ? "on" : ""} onClick={() => setStars("4")}>★★★★</button>
                    <button className={stars === "3" ? "on" : ""} onClick={() => setStars("3")}>★★★</button>
                    <button className={stars === "low" ? "on" : ""} onClick={() => setStars("low")}>≤ ★★</button>
                </div>
                <div className="toolbar-right">
                    <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="lowest">Lowest rated first</option>
                        <option value="highest">Highest rated first</option>
                    </select>
                </div>
            </div>

            {/* REVIEW CARDS */}
            <ReviewTable items={filtered} onEdit={setEditItem} />

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <ReviewForm review={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </div>
    );
}
