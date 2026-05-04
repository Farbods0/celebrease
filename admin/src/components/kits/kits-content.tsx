import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { kitsApi, type ApiHoliday, type ApiKit } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { Eye, Plus, Save, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KitsForm } from "./kits-form";

type KitsContentProps = {
    kit: ApiKit | null;
    holiday: ApiHoliday | null;
    holidays: ApiHoliday[];
    selectedTier: "STARTER" | "PREMIUM";
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

export function KitsContent({ kit, holiday, holidays, selectedTier }: KitsContentProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [savingToggles, setSavingToggles] = useState(false);

    if (!holiday) {
        return <main className="w-full p-10 text-center text-muted-foreground">Select a holiday from the sidebar to view its kits.</main>;
    }

    if (!kit) {
        return (
            <>
                <main className="w-full p-10 flex flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-xl font-semibold">
                        No {selectedTier === "STARTER" ? "Starter" : "Premium"} kit for {holiday.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Create a {selectedTier.toLowerCase()} kit for this holiday to start managing its pricing, items, and add-ons.
                    </p>
                    <Button onClick={() => setEditOpen(true)}>
                        <Plus className="size-4" />
                        Create {selectedTier === "STARTER" ? "Starter" : "Premium"} Kit
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

    const handleDelete = async () => {
        if (!window.confirm("Delete this kit? Items, preview items, and add-on links will be removed.")) return;
        try {
            await kitsApi.remove(kit.id);
            toast.success("Kit deleted");
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Something went wrong");
        }
    };

    const overviewRows = [
        { label: "Kit SKU", value: kit.sku },
        { label: "Kit Tier", value: kit.tier === "STARTER" ? "Starter Kit" : "Premium Kit" },
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
                            {holiday.name} – {kit.tier === "STARTER" ? "Starter" : "Premium"} Kit
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
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                        <Button variant="ghost" size="sm" disabled>
                            <Eye className="size-4" />
                            Preview PDP
                        </Button>
                        <Button size="sm" onClick={() => setEditOpen(true)}>
                            <SquarePen className="size-4" />
                            Edit Kit
                        </Button>
                    </div>
                </div>

                {/* Two column layout: Kit Overview + PDP Preview Items */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Kit Overview */}
                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="h-14 px-5 bg-black/4 border-b">
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
                                                <div className="flex items-center justify-center rounded-md border h-7.5 px-2.5 font-medium">
                                                    {row.price}
                                                </div>
                                                <div className="flex items-center justify-center rounded-md border h-7.5 px-2.5 font-medium">
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

                    {/* PDP Preview Items */}
                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">PDP Preview Items</h3>
                            <Button variant="black" size="sm" disabled>
                                <Plus className="size-4" />
                                Add item
                            </Button>
                        </div>
                        <div className="p-5 flex flex-col gap-2.5">
                            <p className="text-xs text-muted-foreground capitalize">Items shown on customer-facing PDP preview</p>
                            {kit.previewItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No preview items yet.</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {kit.previewItems.map((pi) => (
                                        <div
                                            key={pi.id}
                                            className="flex h-11.5 items-center justify-between rounded-lg border bg-muted/40 pl-3 pr-4 py-2.5"
                                        >
                                            <span className="text-sm capitalize">{pi.item.name}</span>
                                            <span className="text-xs text-muted-foreground">{pi.item.sku}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Kit Contents */}
                <div className="rounded-xl border bg-white overflow-hidden">
                    <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Full Kit Contents</h3>
                        <Button variant="black" size="sm" disabled>
                            <Plus className="size-4" />
                            Add item
                        </Button>
                    </div>
                    <div className="p-5">
                        {kit.items.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-6 text-center">
                                No items linked yet. Inventory items will be wired up once the inventory module ships.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border divide-y">
                                {kit.items.map((ki) => (
                                    <div key={ki.id} className="flex items-center justify-between px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 shrink-0 rounded-md bg-muted" />
                                            <span className="capitalize">{ki.item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                            <span>Qty {ki.qty}</span>
                                            <span>{ki.item.sku}</span>
                                            <StatusBadge status={ki.item.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Holiday-Specific Add-Ons */}
                <div className="rounded-xl border bg-white overflow-hidden">
                    <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Holiday-Specific Add-Ons</h3>
                        <Button variant="black" size="sm" disabled>
                            <Plus className="size-4" />
                            Add item
                        </Button>
                    </div>
                    {/* <div className="p-5">
                        {kit.allowedAddOns.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-6 text-center">
                                No add-ons linked yet. Add-ons will be wired up once the add-ons module ships.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border divide-y">
                                {kit.allowedAddOns.map(({ addOn }) => (
                                    <div key={addOn.id} className="flex items-center justify-between px-4 py-3 text-sm">
                                        <span className="capitalize">{addOn.name}</span>
                                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                            <span>{fmtMoney(addOn.price)}</span>
                                            <span>Inv {addOn.inventory}</span>
                                            <StatusBadge status={addOn.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
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
        </>
    );
}
