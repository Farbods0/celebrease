import { RouteSkeleton } from "@/components/main/route-skeleton";
import { KitsContent } from "@/components/kits/kits-content";
import { KitsForm } from "@/components/kits/kits-form";
import { KitsHolidayList, KitsSidebar } from "@/components/kits/kits-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { addOnsApi, holidaysApi, inventoryApi, kitsApi, settingsApi, type KitTier, type ApiKit } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Menu, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const KITS_PAGE_CSS = `
.kits-layout{display:grid;grid-template-columns:248px 1fr;gap:18px;align-items:start}
@media(max-width:900px){.kits-layout{grid-template-columns:1fr}}

/* tier toggle reuses .seg look but laid out separately */
.kits-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}

/* holiday rail */
.holiday-rail{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);overflow:hidden;position:sticky;top:84px}
.holiday-rail-head{padding:14px 16px;border-bottom:1px solid var(--line);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft)}
.holiday-rail-body{padding:8px}
.holiday-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 11px;border-radius:var(--radius-sm);color:var(--ink-muted);font-weight:500;font-size:13.5px;margin-bottom:2px;transition:background .15s,color .15s}
.holiday-item:hover{background:var(--bg);color:var(--ink)}
.holiday-item.on{background:linear-gradient(135deg,rgba(155,47,201,.10),rgba(220,0,117,.08));color:var(--brand-purple);font-weight:600}
.holiday-item .th{width:26px;height:26px;border-radius:7px;object-fit:cover;flex-shrink:0;background:var(--bg)}
.holiday-rail-empty{padding:18px 14px;font-size:13px;color:var(--ink-soft)}
.holiday-rail-skel{height:38px;border-radius:var(--radius-sm);background:var(--bg);margin-bottom:6px;animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* kit detail */
.kit-detail{display:flex;flex-direction:column;gap:18px;min-width:0}
.kit-detail-head{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px}
.kit-detail-head h2{font-size:22px;font-weight:700;letter-spacing:-.01em}
.kit-detail-head .sub{color:var(--ink-muted);font-size:13px;margin-top:5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.kit-detail-head .dot{color:var(--line-strong)}
.kit-detail-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}

.tier-badge{display:inline-flex;align-items:center;font-size:11px;font-weight:700;letter-spacing:.04em;padding:4px 10px;border-radius:20px}
.tier-starter{background:rgba(45,108,223,.14);color:#1A5CC0;border:1px solid rgba(45,108,223,.22)}
.tier-premium{background:rgba(155,47,201,.14);color:var(--brand-purple);border:1px solid rgba(155,47,201,.22)}
.tier-ultimate{background:var(--brand-gradient);color:#fff;box-shadow:0 2px 8px rgba(155,47,201,.35)}

.kit-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
@media(max-width:1100px){.kit-grid-2{grid-template-columns:1fr}}

/* prices block */
.kit-prices{display:flex;border:1px solid var(--line);border-radius:var(--radius-sm);overflow:hidden}
.kit-price-cell{flex:1;padding:12px 13px;text-align:center;border-right:1px solid var(--line)}
.kit-price-cell:last-child{border-right:none}
.kit-price-cell .dur{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:5px}
.kit-price-cell .price{font-size:18px;font-weight:800;color:var(--ink);letter-spacing:-.02em}
.kit-price-cell.deposit-cell{background:var(--bg)}
.kit-price-cell.deposit-cell .price{font-size:16px;color:var(--ink-muted)}

/* overview rows */
.ov-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;font-size:13.5px;border-top:1px solid var(--line)}
.ov-row:first-child{border-top:none}
.ov-row .k{color:var(--ink-muted)}
.ov-row .v{font-weight:600}
.ov-row .v.season{color:var(--brand-purple)}

.sub-head{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft);margin:18px 0 10px}

/* toggles */
.tog-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;font-size:13.5px}
.tog-row .k{color:var(--ink-muted)}

/* preview item rows */
.pv-row{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);background:var(--bg);border-radius:var(--radius-sm);padding:8px 12px 8px 8px}
.pv-row .l{display:flex;align-items:center;gap:8px;min-width:0}
.pv-row .nm{font-size:13.5px;font-weight:500;text-transform:capitalize;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pv-row .r{display:flex;align-items:center;gap:12px;flex-shrink:0}
.pv-row .sku{font-size:11.5px;color:var(--ink-soft)}
.pv-grip{display:flex;align-items:center;justify-content:center;border-radius:6px;padding:4px;color:var(--ink-soft);cursor:grab}
.pv-grip:hover{color:var(--ink);background:#fff}
.pv-grip:active{cursor:grabbing}

/* status pill (kit/item) */
.status-dot{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600}
.status-dot::before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor}
.sd-active{color:var(--green)} .sd-muted{color:var(--ink-soft)} .sd-amber{color:var(--amber)}

/* in-page table cells */
.it-cell{display:flex;align-items:center;gap:10px}
.it-cell .th{width:34px;height:34px;border-radius:8px;object-fit:cover;background:var(--bg);flex-shrink:0}
.it-cell .nm{font-weight:600;text-transform:capitalize}
.it-sku{font-family:ui-monospace,monospace;font-size:12.5px;color:var(--ink-muted)}

/* empty + table-wrap */
.panel-empty{padding:34px 16px;text-align:center;color:var(--ink-soft);font-size:13.5px}
.table-wrap{padding:6px 4px}

/* footer save chip */
.save-chip{align-self:flex-end;display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--green)}

.btn-danger{height:38px;padding:0 16px;border:1px solid var(--red-bg);background:var(--red-bg);color:var(--red);border-radius:10px;font-size:13.5px;font-weight:600;display:inline-flex;align-items:center;gap:7px}
.btn-danger:hover{filter:brightness(.97)}
.btn-outline{height:38px;padding:0 16px;border:1px solid var(--line);border-radius:10px;font-size:13.5px;font-weight:500;color:var(--ink-muted);display:inline-flex;align-items:center;gap:7px;background:#fff}
.btn-outline:hover{background:var(--bg);border-color:var(--line-strong);color:var(--ink)}
.btn-outline:disabled{opacity:.55;cursor:not-allowed}
.btn-soft{height:32px;padding:0 13px;border:1px solid var(--line);border-radius:8px;font-size:12.5px;font-weight:600;color:var(--ink);background:#fff;display:inline-flex;align-items:center;gap:6px}
.btn-soft:hover{background:var(--bg);border-color:var(--line-strong)}
`;

export const Route = createFileRoute("/__main/kits")({
    loader: async () => {
        const [holidays, kits, items, addOns, settings] = await Promise.all([
            holidaysApi.list({ addon: true }),
            kitsApi.listAll(),
            inventoryApi.listAll(),
            addOnsApi.listAll(),
            settingsApi.get().catch(() => ({ websiteUrl: "" })),
        ]);
        return { holidays: holidays.items, kits: kits.items, items: items.items, addOns: addOns.items, frontendUrl: settings.websiteUrl || "" };
    },
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const TIERS: { value: KitTier; label: string }[] = [
    { value: "Silver", label: "Silver Kit" },
    { value: "Gold", label: "Gold Kit" },
    { value: "Platinum", label: "Platinum Kit" },
];

function RouteComponent() {
    const { holidays, kits, items, addOns, frontendUrl } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedHolidayId, setSelectedHolidayId] = useState<string | null>(holidays[0]?.id ?? null);
    const [selectedTier, setSelectedTier] = useState<KitTier>("Silver");

    const handleSelectHolidayMobile = (id: string) => {
        setSelectedHolidayId(id);
        setSidebarOpen(false);
    };

    const selectedHoliday = useMemo(() => holidays.find((h) => h.id === selectedHolidayId) ?? null, [holidays, selectedHolidayId]);

    const selectedKit = useMemo(
        () => kits.find((k) => k.holidayId === selectedHolidayId && k.tier === selectedTier) ?? null,
        [kits, selectedHolidayId, selectedTier],
    );

    const tierStats = useMemo(() => {
        const compute = (tier: string) => {
            const list: ApiKit[] = kits.filter((k) => k.tier === (tier as KitTier));
            const count = list.length;
            const avgPrice = count
                ? list.reduce((sum, k) => sum + Number(k.price30Day || 0), 0) / count
                : 0;
            return { count, avgPrice };
        };
        return {
            STARTER: compute("Silver"),
            PREMIUM: compute("Gold"),
            ULTIMATE: compute("Platinum"),
        };
    }, [kits]);

    const totalKits = kits.length;
    const activeKits = kits.filter((k) => k.status === "ACTIVE").length;
    const avgAll = totalKits ? kits.reduce((s, k) => s + Number(k.price30Day || 0), 0) / totalKits : 0;

    return (
        <div className="content">
            <style>{KITS_PAGE_CSS}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Kits &amp; Pricing</h1>
                    <div className="sub">Manage curated decoration bundles across all holidays and tiers.</div>
                </div>
                <div className="kit-detail-actions">
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden" aria-label="Select holiday">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-4 w-[85vw] max-w-sm">
                            <SheetHeader className="p-0">
                                <SheetTitle>Select Holiday</SheetTitle>
                            </SheetHeader>
                            <KitsHolidayList
                                holidays={holidays}
                                isLoading={false}
                                selectedHolidayId={selectedHolidayId}
                                onSelect={handleSelectHolidayMobile}
                                showHeading={false}
                            />
                        </SheetContent>
                    </Sheet>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <button type="button" className="btn-grad" disabled={holidays.length === 0}>
                                <Plus className="size-4" />
                                <span className="hidden sm:inline">Add New Kit Tier</span>
                                <span className="sm:hidden">Add Kit</span>
                            </button>
                        </DialogTrigger>
                        {createOpen && (
                            <KitsForm
                                holidays={holidays}
                                defaultHolidayId={selectedHolidayId ?? undefined}
                                defaultTier={selectedTier}
                                onClose={() => setCreateOpen(false)}
                            />
                        )}
                    </Dialog>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total kits</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>🎁</span>
                    </div>
                    <div className="val">{totalKits}</div>
                    <span className="delta up"><span className="muted">across all holidays</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Active kits</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>✓</span>
                    </div>
                    <div className="val">{activeKits}</div>
                    <span className="delta up"><span className="muted">{totalKits ? `${Math.round((activeKits / totalKits) * 100)}% active rate` : "no kits yet"}</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Avg. 30-day price</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>＄</span>
                    </div>
                    <div className="val">${avgAll.toFixed(0)}</div>
                    <span className="delta up"><span className="muted">starter ${tierStats.STARTER.avgPrice.toFixed(0)} · premium ${tierStats.PREMIUM.avgPrice.toFixed(0)}</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Platinum Kits</span>
                        <span className="ic" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>👑</span>
                    </div>
                    <div className="val">{tierStats.ULTIMATE.count}</div>
                    <span className="delta up"><span className="muted">avg ${tierStats.ULTIMATE.avgPrice.toFixed(0)}</span></span>
                </div>
            </div>

            {/* Tier toggle */}
            <div className="kits-toolbar">
                <div className="seg">
                    {TIERS.map((tier) => (
                        <button
                            type="button"
                            key={tier.value}
                            onClick={() => setSelectedTier(tier.value)}
                            className={tier.value === selectedTier ? "on" : ""}
                        >
                            {tier.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Holiday rail + kit detail */}
            <div className="kits-layout">
                <KitsSidebar holidays={holidays} isLoading={false} selectedHolidayId={selectedHolidayId} onSelect={setSelectedHolidayId} />

                <KitsContent
                    kit={selectedKit}
                    holiday={selectedHoliday}
                    holidays={holidays}
                    items={items}
                    addOns={addOns}
                    selectedTier={selectedTier}
                    frontendUrl={frontendUrl}
                />
            </div>
        </div>
    );
}
