import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatItemStatus, type ApiItem } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

function LowStockChip() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.95_0.06_60)] px-2 py-0.5 text-xs font-medium text-[oklch(0.5_0.17_60)]">
            <AlertTriangle className="size-3" />
            Low stock
        </span>
    );
}

function holidayLabel(item: ApiItem): string {
    const names = Array.from(new Set(item.kitItems.map((ki) => ki.kit.holiday.name)));
    if (names.length === 0) return "—";
    if (names.length === 1) return names[0];
    return `${names[0]} +${names.length - 1}`;
}

function kitTierLabel(item: ApiItem): string {
    const tiers = Array.from(new Set(item.kitItems.map((ki) => ki.kit.tier)));
    if (tiers.length === 0) return "—";
    return tiers.map((t) => (t === "STARTER" ? "Starter" : "Premium")).join(", ");
}

type InventoryTableProps = {
    items: ApiItem[];
    onView: (item: ApiItem) => void;
    onEdit: (item: ApiItem) => void;
};

export function InventoryTable({ items, onView, onEdit }: InventoryTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Holiday</TableHead>
                        <TableHead>Kit Type</TableHead>
                        <TableHead>Total Qty</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Reserved</TableHead>
                        <TableHead>Shipped</TableHead>
                        <TableHead>Cleaning</TableHead>
                        <TableHead>Repair</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center text-muted-foreground py-10">
                                No inventory items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const lowStock = item.totalQty <= item.lowStockThreshold && item.lowStockThreshold > 0;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="capitalize">{item.name}</span>
                                            {lowStock && <LowStockChip />}
                                        </div>
                                    </TableCell>
                                    <TableCell>{holidayLabel(item)}</TableCell>
                                    <TableCell>{kitTierLabel(item)}</TableCell>
                                    <TableCell className="font-medium">{item.totalQty}</TableCell>
                                    <TableCell className="font-medium" style={{ color: "oklch(0.55 0.17 150)" }}>
                                        {item.totalQty}
                                    </TableCell>
                                    <TableCell className="font-medium" style={{ color: "oklch(0.65 0.18 55)" }}>
                                        N/A
                                    </TableCell>
                                    <TableCell className="font-medium">N/A</TableCell>
                                    <TableCell className="font-medium">N/A</TableCell>
                                    <TableCell className="font-medium" style={{ color: "oklch(0.55 0.22 25)" }}>
                                        N/A
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={formatItemStatus(item.status)} />
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onView(item)}
                                            className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium"
                                        >
                                            View
                                        </button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
