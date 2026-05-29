import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { formatKitTier, holidaysApi, kitsApi, type ApiAddOn, type ApiHolidayWithAddOns, type ApiItem, type ApiKit, type KitTier } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { Eye, Plus, Save, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KitsAddItemDialog } from "./kits-add-item-dialog";
import { KitsAddonTable } from "./kits-addon-table";
import { KitsForm } from "./kits-form";
import { KitsItemTable } from "./kits-item-table";
import { KitsPreviewItems } from "./kits-preview-items";

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
    if (!start || !end) return "—";
    const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
};

const STATUS_LABEL: Record<ApiKit["status"], string> = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    HIDDEN: "Hidden",
    LOW_STOCK: "Low Stock",
};

const STATUS_COLOR: Record<ApiKit["status"], string> = {
    DRAFT: "text-muted-foreground",
    ACTIVE: "text-[#008b3f]",
    HIDDEN: "text-muted-foreground",
    LOW_STOCK: "text-amber-500",
};

export function KitsContent({ kit, holiday, holidays, items, addOns, selectedTier, frontendUrl }: KitsContentProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [savingToggles, setSavingToggles] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [deletingKit, setDeletingKit] = useState(false);
    const [addTarget, setAddTarget] = useState<AddTarget | null>(null);

    if (!holiday) {
        return <main className="w-full p-10 text-center text-muted-foreground">Select a holiday from the sidebar to view its kits.</main>;
    }

    if (!kit) {
        return (
            <>
                <main className="w-full p-10 flex flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-xl font-semibold">
                        No {formatKitTier(selectedTier)} kit for {holiday.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Create a {selectedTier.toLowerCase()} kit for this holiday to start managing its pricing, items, and add-ons.
                    </p>
                    <Button onClick={() => setEditOpen(true)}>
                        <Plus className="size-4" />
                        Create {formatKitTier(selectedTier)} Kit
                    </Button>
                </main>
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

    const overviewRows = [
        { label: "Kit SKU", value: kit.sku },
        { label: "Kit Tier", value: `${formatKitTier(kit.tier)} Kit` },
        { label: "Holiday", value: holiday.name },
        { label: "Status", value: STATUS_LABEL[kit.status], valueClass: STATUS_COLOR[kit.status] },
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
            <main className="w-full flex flex-col gap-6 p-6 overflow-y-auto">
                {/* Kit header with action buttons */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-2xl font-semibold">
                            {holiday.name} – {formatKitTier(kit.tier)} Kit
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Last saved: {new Date(kit.updatedAt).toLocaleString()}
                            <span className="text-foreground/20 mx-2">•</span>
                            30-Day: {fmtMoney(kit.price30Day)}
                            <span className="text-foreground/20 mx-2">•</span>
                            60-Day: {fmtMoney(kit.price60Day)}
                            <span className="text-foreground/20 mx-2">•</span>
                            Deposit: {fmtMoney(kit.deposit)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {frontendUrl ? (
                            <a
                                href={`${frontendUrl}/catalog/${holiday.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Eye className="size-4" />
                                Preview PDP
                            </a>
                        ) : (
                            <Button variant="ghost" size="sm" disabled title="Set website URL in Settings to enable preview">
                                <Eye className="size-4" />
                                Preview PDP
                            </Button>
                        )}
                        <Button size="sm" onClick={() => setEditOpen(true)}>
                            <SquarePen className="size-4" />
                            Edit Kit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={deletingKit}>
                                    <Trash2 className="size-4" />
                                    Delete Kit
                                </Button>
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Kit Overview */}
                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Kit Overview</h3>
                        </div>
                        <div className="p-5 flex flex-col">
                            <div className="flex flex-col">
                                {overviewRows.map((row, idx) => (
                                    <div
                                        key={row.label}
                                        className={cn("flex items-center justify-between py-2.5 text-sm", idx > 0 && "border-t")}
                                    >
                                        <span className="text-muted-foreground capitalize">{row.label}</span>
                                        <span className={cn("font-medium", row.valueClass)}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Rental Pricing */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-medium">Rental Pricing</h4>
                                <div className="rounded-lg bg-black/2 shadow-sm">
                                    <div className="grid grid-cols-3 gap-4 px-3.5 py-2.5 text-xs uppercase text-muted-foreground">
                                        <div>Rental Duration</div>
                                        <div>Price</div>
                                        <div>Deposit</div>
                                    </div>
                                    <div className="px-3.5 pb-3.5 pt-1 flex flex-col gap-3">
                                        {[
                                            { duration: "30", price: fmtMoney(kit.price30Day), deposit: fmtMoney(kit.deposit) },
                                            { duration: "60", price: fmtMoney(kit.price60Day), deposit: fmtMoney(kit.deposit) },
                                        ].map((row) => (
                                            <div key={row.duration} className="grid grid-cols-3 gap-4 items-center text-xs">
                                                <div className="flex items-center justify-between rounded-md border h-7.5 px-2.5 font-medium">
                                                    <span>{row.duration}</span>
                                                    <span className="opacity-40">Days</span>
                                                </div>
                                                <div className="flex items-center rounded-md border h-7.5 px-2.5 font-medium">
                                                    {row.price}
                                                </div>
                                                <div className="flex items-center rounded-md border h-7.5 px-2.5 font-medium">
                                                    {row.deposit}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Toggles */}
                            <div className="mt-4 flex flex-col gap-3">
                                <h4 className="font-medium">Admin Toggles</h4>
                                <div className="flex flex-col gap-3">
                                    {toggles.map((toggle) => (
                                        <div key={toggle.key} className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-muted-foreground">{toggle.label}</span>
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
                    </div>

                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">PDP Preview Items</h3>
                            <Button variant="black" size="sm" onClick={() => setAddTarget("preview-item")}>
                                <Plus className="size-4" />
                                Add item
                            </Button>
                        </div>
                        <div className="p-5 flex flex-col gap-2.5">
                            <p className="text-xs text-muted-foreground capitalize">
                                Items shown on customer-facing PDP preview. Drag to reorder.
                            </p>
                            {items.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No preview items yet.</p>
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
                <div className="rounded-xl border bg-white overflow-hidden">
                    <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Full Kit Contents</h3>
                        <Button variant="black" size="sm" onClick={() => setAddTarget("kit-item")}>
                            <Plus className="size-4" />
                            Add item
                        </Button>
                    </div>
                    <div className="p-5">
                        {kit.items.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-6 text-center">
                                No items added yet — click &apos;Add Item&apos; to include decoration pieces in this kit.
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
                <div className="rounded-xl border bg-white overflow-hidden">
                    <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Holiday-Specific Add-Ons</h3>
                        <Button variant="black" size="sm" onClick={() => setAddTarget("holiday-addon")}>
                            <Plus className="size-4" />
                            Add item
                        </Button>
                    </div>
                    <div className="p-5">
                        {holiday.addOns.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-6 text-center">
                                No add-ons linked — use the Add Add-On button to associate extras with this holiday.
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

                <div className="pt-2 self-end">
                    <Button variant="ghost" size="sm" className="text-[#008b3f] hover:text-[#008b3f]" disabled>
                        <Save className="size-4" />
                        All changes saved
                    </Button>
                </div>
            </main>

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
