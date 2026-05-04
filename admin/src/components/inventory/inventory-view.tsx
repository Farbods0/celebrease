import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { inventoryApi, type ApiInventoryItem } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<ApiInventoryItem["status"], string> = {
    ACTIVE: "Active",
    LOW_STOCK: "Low Stock",
    RETIRED: "Retired",
};

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
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : "—";
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const pct = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

type InventoryViewProps = {
    item: ApiInventoryItem;
    onEdit: () => void;
    onDeleted: () => void;
};

export default function InventoryView({ item, onEdit, onDeleted }: InventoryViewProps) {
    const router = useRouter();
    const total = Math.max(item.totalQty, item.units.totalUnits);

    const handleDelete = async () => {
        if (!window.confirm(`Delete inventory item "${item.name}"? This cannot be undone.`)) return;
        try {
            await inventoryApi.remove(item.id);
            toast.success("Inventory item deleted");
            await router.invalidate();
            onDeleted();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Something went wrong");
        }
    };

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                    <DialogTitle className="capitalize">{item.name}</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={onEdit}>
                            <Pencil className="size-3.5" />
                            Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
                            <Trash2 className="size-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </DialogHeader>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Inventory</h3>
                <div className="space-y-2">
                    {[
                        { label: "Available", count: item.units.available, color: "Available" as const },
                        { label: "Reserved", count: item.units.reserved, color: "Reserved" as const },
                        { label: "Shipped", count: item.units.shipped, color: "Shipped" as const },
                        { label: "In Cleaning", count: item.units.cleaning, color: "Cleaning" as const },
                        { label: "In Repair", count: item.units.repair, color: "Repair" as const },
                    ].map((row) => (
                        <div key={row.label} className="grid grid-cols-[80px_1fr_24px] items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground">{row.label}</p>
                            <Progress status={row.color} value={pct(row.count, total)} />
                            <p className="text-sm text-muted-foreground text-right">{row.count}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="SKU" value={item.sku} />
                    <Field label="Category" value={item.category ?? "—"} />
                    <Field label="Cost per unit" value={fmtMoney(item.costPerUnit)} />
                    <Field label="Total Qty" value={item.totalQty} />
                    <Field label="Low-stock at" value={item.lowStockThreshold} />
                    <Field label="Status" value={<StatusBadge status={STATUS_LABEL[item.status]} />} />
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

            <section>
                <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-sm uppercase font-medium">Kit Mapping</h3>
                </div>
                {item.kitItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Not mapped to any kit yet.</p>
                ) : (
                    <div className="space-y-2">
                        {item.kitItems.map((ki) => (
                            <div key={ki.id} className="flex items-center justify-between border p-2 rounded-lg">
                                <p className="capitalize">
                                    {ki.kit.holiday.name} {ki.kit.tier === "STARTER" ? "Starter" : "Premium"} Kit
                                </p>
                                <p className="text-muted-foreground">
                                    {ki.qty} unit{ki.qty === 1 ? "" : "s"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </DialogContent>
    );
}
