import { StockAdjustForm } from "@/components/inventory/stock-adjust-form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { formatItemStatus, formatKitTier, inventoryApi, type ApiItem } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Sliders } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium wrap-break-word">{value}</span>
        </div>
    );
}

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : ", ";
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const pct = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

export default function InventoryView({ item, onEdit }: { item: ApiItem; onEdit?: (item: ApiItem) => void }) {
    const router = useRouter();
    const [adjustOpen, setAdjustOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const inv = item?.inventory;
    const totalQty = inv?.totalQty ?? 0;

    const handleDelete = async () => {
        setRemoving(true);
        try {
            await inventoryApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemoving(false);
        }
    };

    return (
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle className="capitalize">{item.name}</SheetTitle>
            </SheetHeader>

            <section className="px-5">
                <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm uppercase font-medium">Inventory</h3>
                    <Button size="xs" variant="outline" onClick={() => setAdjustOpen((v) => !v)}>
                        <Sliders className="size-3.5" />
                        {adjustOpen ? "Close" : "Adjust"}
                    </Button>
                </div>
                <div className="space-y-2">
                    {[
                        { label: "Available", count: inv?.availableQty ?? 0, color: "Available" as const },
                        { label: "Reserved", count: inv?.reservedQty ?? 0, color: "Reserved" as const },
                        { label: "Shipped", count: inv?.shippedQty ?? 0, color: "Shipped" as const },
                        { label: "In Cleaning", count: inv?.cleaningQty ?? 0, color: "Cleaning" as const },
                        { label: "In Repair", count: inv?.repairQty ?? 0, color: "Repair" as const },
                        { label: "Lost", count: inv?.lostQty ?? 0, color: "Repair" as const },
                    ].map((row) => (
                        <div key={row.label} className="grid grid-cols-[80px_1fr_24px] items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground">{row.label}</p>
                            <Progress status={row.color} value={pct(row.count, totalQty)} />
                            <p className="text-sm text-muted-foreground text-right">{row.count}</p>
                        </div>
                    ))}
                </div>
                {adjustOpen && (
                    <div className="mt-4">
                        <StockAdjustForm
                            scope="item"
                            id={item.id}
                            inventory={
                                inv ?? {
                                    totalQty: 0,
                                    availableQty: 0,
                                    reservedQty: 0,
                                    shippedQty: 0,
                                    cleaningQty: 0,
                                    repairQty: 0,
                                    lostQty: 0,
                                }
                            }
                            onClose={() => setAdjustOpen(false)}
                        />
                    </div>
                )}
            </section>

            <section className="px-5">
                <h3 className="text-sm uppercase font-medium mb-2.5">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="SKU" value={item.sku} />
                    <Field label="Category" value={item.category ?? ", "} />
                    <Field label="Cost per unit" value={fmtMoney(item.costPerUnit)} />
                    <Field label="Total Qty" value={totalQty} />
                    <Field label="Low-stock at" value={item.lowStockThreshold} />
                    <Field label="Status" value={<StatusBadge status={formatItemStatus(item.status)} />} />
                    <Field label="Vendor" value={item.vendorName} />
                    <Field label="Vendor email" value={item.vendorEmail} />
                    <Field label="Vendor phone" value={item.vendorPhone} />
                    <Field label="Added on" value={fmtDate(item.createdAt)} />
                    <Field label="Last updated" value={fmtDate(item.updatedAt)} />
                </div>
                {item.description && (
                    <div className="mt-3">
                        <Field label="Description" value={item.description} />
                    </div>
                )}
            </section>

            <section className="px-5">
                <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-sm uppercase font-medium">Kit Mapping</h3>
                </div>
                {item.kitItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Not mapped to any kit yet.</p>
                ) : (
                    <div className="space-y-2">
                        {item.kitItems.map((ki) => (
                            <div key={ki.kit.id} className="flex items-center justify-between border p-2 rounded-lg">
                                <p className="capitalize">
                                    {ki.kit.holiday.name} {formatKitTier(ki.kit.tier)} Kit
                                </p>
                                <p className="text-muted-foreground">
                                    {ki.qty} unit{ki.qty === 1 ? "" : "s"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="px-5 pb-5 flex justify-between gap-2">
                {onEdit && (
                    <Button variant="outline" onClick={() => onEdit(item)}>
                        Edit Item
                    </Button>
                )}
                <TrashConfirm name={item.name} onConfirm={handleDelete} disabled={removing} />
            </section>
        </SheetContent>
    );
}
