import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { formatKitTier, holidaysApi, kitsApi, type ApiAddOn, type ApiHolidayWithAddOns, type ApiItem, type ApiKit, type KitTier } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KitsAddItemDialog } from "./kits-add-item-dialog";
import { KitsAddonTable } from "./kits-addon-table";
import { KitsForm } from "./kits-form";
import { KitsItemTable } from "./kits-item-table";
import { KitsPreviewItems } from "./kits-preview-items";

const TIER_BADGE_CLASS: Record<KitTier, string> = {
    STARTER: "tier-badge tier-starter",
    PREMIUM: "tier-badge tier-premium",
    ULTIMATE: "tier-badge tier-ultimate",
};

const STATUS_DOT_CLASS: Record<ApiKit["status"], string> = {
    DRAFT: "status-dot sd-muted",
    ACTIVE: "status-dot sd-active",
    HIDDEN: "status-dot sd-muted",
    LOW_STOCK: "status-dot sd-amber",
};

type AddTarget = "kit-item" | "preview-item" | "holiday-addon";

type KitsContentProps = {
    kit: ApiKit | null;
    holiday: ApiHolidayWithAddOns | null;
    holidays: ApiHolidayWithAddOns[];
    items: ApiItem[];
    addOns: ApiAddOn[];
    selectedTier: KitTier;
    frontendUrl?: string;
};

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(0)}` : "$0";
};

const fmtDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return ", ";
    const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)}, ${fmt(end)}`;
};

const STATUS_LABEL: Record<ApiKit["status"], string> = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    HIDDEN: "Hidden",
    LOW_STOCK: "Low Stock",
};

export function KitsContent({ kit, holiday, holidays, items, addOns, selectedTier, frontendUrl }: KitsContentProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [savingToggles, setSavingToggles] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [deletingKit, setDeletingKit] = useState(false);
    const [addTarget, setAddTarget] = useState<AddTarget | null>(null);

    if (!holiday) {
        return (
            <div className="panel kit-detail">
                <div className="panel-empty">Select a holiday from the rail to view its kits.</div>
            </div>
        );
    }

    if (!kit) {
        return (
            <>
                <div className="panel kit-detail">
                    <div className="panel-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "64px 20px" }}>
                        <div style={{ fontSize: 40, opacity: 0.4 }}>🎁</div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
                            No {formatKitTier(selectedTier)} kit for {holiday.name}
                        </h2>
                        <p style={{ maxWidth: 340 }}>
                            Create a {selectedTier.toLowerCase()} kit for this holiday to start managing its pricing, items, and add-ons.
                        </p>
                        <button type="button" className="btn-grad" onClick={() => setEditOpen(true)}>
                            <Plus className="size-4" />
                            Create {formatKitTier(selectedTier)} Kit
                        </button>
                    </div>
                </div>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    {editOpen && (
                        <KitsForm
                            holidays={holidays}
                            defaultHolidayId={holiday.id}
                            defaultTier={selectedTier}
                            onClose={() => setEditOpen(false)}
                        />
                    )}
                </Dialog>
            </>
        );
    }

    const handleDeleteKit = async () => {
        if (deletingKit || !kit) return;
        setDeletingKit(true);
        try {
            await kitsApi.remove(kit.id);
            toast.success(`${formatKitTier(kit.tier)} kit deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete kit");
        } finally {
            setDeletingKit(false);
        }
    };

    const handleToggle = async (field: "visibleOnPdp" | "alwaysVisible" | "addOnsEnabled" | "limitInventory", value: boolean) => {
        if (savingToggles) return;
        setSavingToggles(true);
        try {
            await kitsApi.update(kit.id, { [field]: value });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setSavingToggles(false);
        }
    };

    const handleRemovePreviewItem = async (itemId: string, name: string) => {
        if (removing) return;
        setRemoving(true);
        try {
            await kitsApi.removePreviewItem(kit.id, itemId);
            toast.success(`Removed "${name}" from preview`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to remove preview item");
        } finally {
            setRemoving(false);
        }
    };

    const handleRemoveKitItem = async (itemId: string, name: string) => {
        if (removing) return;
        setRemoving(true);
        try {
            await kitsApi.removeItem(kit.id, itemId);
            toast.success(`Removed "${name}" from kit`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to remove item");
        } finally {
            setRemoving(false);
        }
    };

    const handleRemoveHolidayAddOn = async (addOnId: string, name: string) => {
        if (removing) return;
        setRemoving(true);
        try {
            await holidaysApi.removeAddOn(holiday.id, addOnId);
            toast.success(`Unlinked "${name}" from ${holiday.name}`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to remove add-on");
        } finally {
            setRemoving(false);
        }
    };

    const overviewRows: { label: string; value: string; dotClass?: string; valueClass?: string }[] = [
        { label: "Kit SKU", value: kit.sku },
        { label: "Kit Tier", value: `${formatKitTier(kit.tier)} Kit` },
        { label: "Holiday", value: holiday.name },
        { label: "Status", value: STATUS_LABEL[kit.status], dotClass: STATUS_DOT_CLASS[kit.status] },
        { label: "Seasonal Visibility", value: fmtDateRange(kit.seasonStart, kit.seasonEnd), valueClass: "text-primary" },
    ];

    const toggles = [
        { key: "visibleOnPdp" as const, label: "Kit Visible on PDP", checked: kit.visibleOnPdp },
        { key: "alwaysVisible" as const, label: "Always Visible", checked: kit.alwaysVisible },
        { key: "addOnsEnabled" as const, label: "Add-Ons Enabled", checked: kit.addOnsEnabled },
        { key: "limitInventory" as const, label: "Limit Kit Inventory", checked: kit.limitInventory },
    ];

    return (
        <>
            <div className="kit-detail">
                {/* Kit header with action buttons */}
                <div className="kit-detail-head">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h2>{holiday.name}, {formatKitTier(kit.tier)} Kit</h2>
                            <span className={TIER_BADGE_CLASS[kit.tier]}>{formatKitTier(kit.tier)}</span>
                        </div>
                        <div className="sub">
                            <span className={STATUS_DOT_CLASS[kit.status]}>{STATUS_LABEL[kit.status]}</span>
                            <span className="dot">•</span>
                            <span>30-Day {fmtMoney(kit.price30Day)}</span>
                            <span className="dot">•</span>
                            <span>60-Day {fmtMoney(kit.price60Day)}</span>
                            <span className="dot">•</span>
                            <span>Deposit {fmtMoney(kit.deposit)}</span>
                        </div>
                    </div>
                    <div className="kit-detail-actions">
                        {frontendUrl ? (
                            <a
                                href={`${frontendUrl}/catalog/${holiday.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                <Eye className="size-4" />
                                Preview PDP
                            </a>
                        ) : (
                            <button type="button" className="btn-outline" disabled title="Set website URL in Settings to enable preview">
                                <Eye className="size-4" />
                                Preview PDP
                            </button>
                        )}
                        <button type="button" className="btn-grad" onClick={() => setEditOpen(true)}>
                            <SquarePen className="size-4" />
                            Edit Kit
                        </button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button type="button" className="btn-danger" disabled={deletingKit}>
                                    <Trash2 className="size-4" />
                                    Delete Kit
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {formatKitTier(kit.tier)} Kit?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the {formatKitTier(kit.tier)} kit for {holiday.name}. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteKit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {deletingKit ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Two column layout: Kit Overview + PDP Preview Items */}
                <div className="kit-grid-2">
                    {/* Kit Overview */}
                    <div className="panel">
                        <div className="panel-head">
                            <h3>Kit Overview</h3>
                        </div>
                        <div className="panel-body">
                            <div>
                                {overviewRows.map((row) => (
                                    <div key={row.label} className="ov-row">
                                        <span className="k">{row.label}</span>
                                        <span className={`v${row.valueClass === "text-primary" ? " season" : ""}`}>
                                            {row.dotClass ? <span className={row.dotClass}>{row.value}</span> : row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Rental Pricing */}
                            <div className="sub-head">Rental Pricing</div>
                            <div className="kit-prices">
                                <div className="kit-price-cell">
                                    <div className="dur">30 days</div>
                                    <div className="price">{fmtMoney(kit.price30Day)}</div>
                                </div>
                                <div className="kit-price-cell">
                                    <div className="dur">60 days</div>
                                    <div className="price">{fmtMoney(kit.price60Day)}</div>
                                </div>
                                <div className="kit-price-cell deposit-cell">
                                    <div className="dur">Deposit</div>
                                    <div className="price">{fmtMoney(kit.deposit)}</div>
                                </div>
                            </div>

                            {/* Admin Toggles */}
                            <div className="sub-head">Admin Toggles</div>
                            <div>
                                {toggles.map((toggle) => (
                                    <div key={toggle.key} className="tog-row">
                                        <span className="k">{toggle.label}</span>
                                        <Switch
                                            checked={toggle.checked}
                                            disabled={savingToggles}
                                            onCheckedChange={(v) => handleToggle(toggle.key, v)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-head">
                            <h3>PDP Preview Items</h3>
                            <button type="button" className="btn-soft" onClick={() => setAddTarget("preview-item")}>
                                <Plus className="size-4" />
                                Add item
                            </button>
                        </div>
                        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                                Items shown on customer-facing PDP preview. Drag to reorder.
                            </p>
                            {kit.previewItems.length === 0 ? (
                                <p className="panel-empty">No preview items yet.</p>
                            ) : (
                                <KitsPreviewItems
                                    kitId={kit.id}
                                    items={kit.previewItems}
                                    onRemove={(item) => handleRemovePreviewItem(item.id, item.name)}
                                    removing={removing}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Kit Contents */}
                <div className="panel">
                    <div className="panel-head">
                        <h3>Full Kit Contents</h3>
                        <button type="button" className="btn-soft" onClick={() => setAddTarget("kit-item")}>
                            <Plus className="size-4" />
                            Add item
                        </button>
                    </div>
                    <div className="panel-body table-wrap">
                        {kit.items.length === 0 ? (
                            <p className="panel-empty">
                                No items added yet, click &apos;Add item&apos; to include decoration pieces in this kit.
                            </p>
                        ) : (
                            <KitsItemTable
                                items={kit.items}
                                onRemove={(item) => handleRemoveKitItem(item.id, item.name)}
                                removing={removing}
                            />
                        )}
                    </div>
                </div>

                {/* Holiday-Specific Add-Ons */}
                <div className="panel">
                    <div className="panel-head">
                        <h3>Holiday-Specific Add-Ons</h3>
                        <button type="button" className="btn-soft" onClick={() => setAddTarget("holiday-addon")}>
                            <Plus className="size-4" />
                            Add item
                        </button>
                    </div>
                    <div className="panel-body table-wrap">
                        {holiday.addOns.length === 0 ? (
                            <p className="panel-empty">
                                No add-ons linked, use the Add item button to associate extras with this holiday.
                            </p>
                        ) : (
                            <KitsAddonTable
                                items={holiday.addOns}
                                onRemove={(addOn) => handleRemoveHolidayAddOn(addOn.id, addOn.name)}
                                removing={removing}
                            />
                        )}
                    </div>
                </div>

                <div className="save-chip">✓ All changes saved</div>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                {editOpen && <KitsForm kit={kit} holidays={holidays} onClose={() => setEditOpen(false)} />}
            </Dialog>

            <Dialog open={addTarget !== null} onOpenChange={(open) => !open && setAddTarget(null)}>
                {addTarget === "kit-item" && (
                    <KitsAddItemDialog
                        title="Add Item to Kit"
                        options={items.map((i) => ({ id: i.id, label: i.name, sublabel: i.sku }))}
                        excludeIds={kit.items.map((ki) => ki.item.id)}
                        withQty
                        submitLabel="Add to kit"
                        onSubmit={async ({ id, qty }) => {
                            await kitsApi.addItem(kit.id, { itemId: id, qty });
                            toast.success("Item added to kit");
                            await router.invalidate();
                        }}
                        onClose={() => setAddTarget(null)}
                    />
                )}
                {addTarget === "preview-item" && (
                    <KitsAddItemDialog
                        title="Add PDP Preview Item"
                        options={items.map((i) => ({ id: i.id, label: i.name, sublabel: i.sku }))}
                        excludeIds={kit.previewItems.map((pi) => pi.item.id)}
                        submitLabel="Add to preview"
                        onSubmit={async ({ id }) => {
                            await kitsApi.addPreviewItem(kit.id, { itemId: id });
                            toast.success("Preview item added");
                            await router.invalidate();
                        }}
                        onClose={() => setAddTarget(null)}
                    />
                )}
                {addTarget === "holiday-addon" && (
                    <KitsAddItemDialog
                        title={`Add Add-On to ${holiday.name}`}
                        options={addOns.map((a) => ({ id: a.id, label: a.name, sublabel: a.sku ?? undefined }))}
                        excludeIds={holiday.addOns.map((h) => h.addOn.id)}
                        submitLabel="Link add-on"
                        onSubmit={async ({ id }) => {
                            await holidaysApi.addAddOn(holiday.id, { addOnId: id });
                            toast.success("Add-on linked");
                            await router.invalidate();
                        }}
                        onClose={() => setAddTarget(null)}
                    />
                )}
            </Dialog>
        </>
    );
}
