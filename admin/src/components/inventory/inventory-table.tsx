import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InventoryItem } from "@/data";
import { AlertTriangle } from "lucide-react";
import { HolidayBadge } from "./holiday-badge";

function LowStockChip() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.95_0.06_60)] px-2 py-0.5 text-xs font-medium text-[oklch(0.5_0.17_60)]">
            <AlertTriangle className="size-3" />
            Low stock
        </span>
    );
}

function StatusBadge({ status }: { status: InventoryItem["status"] }) {
    if (status === "Active") {
        return (
            <span
                className="rounded-md px-2 py-0.5 text-xs font-medium"
                style={{
                    backgroundColor: "oklch(0.93 0.08 150)",
                    color: "oklch(0.4 0.14 150)",
                }}
            >
                Active
            </span>
        );
    }
    return <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{status}</span>;
}

export function InventoryTable({ items }: { items: InventoryItem[] }) {
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
                    {items.map((item) => (
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span>{item.name}</span>
                                    {item.lowStock && <LowStockChip />}
                                </div>
                            </TableCell>
                            <TableCell>
                                <HolidayBadge holiday={item.holiday} />
                            </TableCell>
                            <TableCell>{item.kitType}</TableCell>
                            <TableCell className="font-medium">{item.totalQty}</TableCell>
                            <TableCell className="font-medium" style={{ color: "oklch(0.55 0.17 150)" }}>
                                {item.available}
                            </TableCell>
                            <TableCell className="font-medium" style={{ color: "oklch(0.65 0.18 55)" }}>
                                {item.reserved}
                            </TableCell>
                            <TableCell className="font-medium">{item.shipped}</TableCell>
                            <TableCell className="font-medium">{item.cleaning}</TableCell>
                            <TableCell className="font-medium" style={{ color: "oklch(0.55 0.22 25)" }}>
                                {item.repair}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell>
                                <button type="button" className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium">
                                    View
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
