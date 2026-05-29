import { Progress } from "@/components/ui/progress";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatItemStatus, type ApiItem } from "@/lib/api";

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

export default function InventoryView({ item }: { item: ApiItem }) {
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="capitalize">{item.name}</SheetTitle>
            </SheetHeader>
            <section className="px-5">
                <h3 className="text-sm uppercase font-medium mb-2.5">Inventory</h3>
                <div className="space-y-2">
                    {[
                        { label: "Available", count: item?.inventory?.availableQty ?? 0, color: "Available" as const },
                        { label: "Reserved", count: item?.inventory?.reservedQty ?? 0, color: "Reserved" as const },
                        { label: "Shipped", count: item?.inventory?.shippedQty ?? 0, color: "Shipped" as const },
                        { label: "In Cleaning", count: item?.inventory?.cleaningQty ?? 0, color: "Cleaning" as const },
                        { label: "In Repair", count: item?.inventory?.repairQty ?? 0, color: "Repair" as const },
                    ].map((row) => (
                        <div key={row.label} className="grid grid-cols-[80px_1fr_24px] items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground">{row.label}</p>
                            <Progress status={row.color} value={pct(row.count, row.count)} />
                            <p className="text-sm text-muted-foreground text-right">{row.count}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="px-5">
                <h3 className="text-sm uppercase font-medium mb-2.5">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="SKU" value={item.sku} />
                    <Field label="Category" value={item.category ?? "—"} />
                    <Field label="Cost per unit" value={fmtMoney(item.costPerUnit)} />
                    <Field label="Total Qty" value={item?.inventory?.totalQty ?? "N/A"} />
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
        </SheetContent>
    );
}
