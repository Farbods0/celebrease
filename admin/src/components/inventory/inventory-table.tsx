import { StockAdjustForm } from "@/components/inventory/stock-adjust-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { formatItemStatus, formatKitTier, inventoryApi, type ApiItem } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, Boxes, Eye, Pencil, SlidersHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

function LowStockChip() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
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
    return tiers.map((t) => formatKitTier(t)).join(", ");
}

type InventoryTableProps = {
    items: ApiItem[];
    onView: (item: ApiItem) => void;
    onEdit: (item: ApiItem) => void;
};

function StockCell({ value, color }: { value: number | string | undefined; color?: string }) {
    const display = value ?? "—";
    return (
        <span className="font-mono text-sm font-medium" style={color ? { color } : undefined}>
            {display}
        </span>
    );
}

export function InventoryTable({ items, onView, onEdit }: InventoryTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [adjustingId, setAdjustingId] = useState<string | null>(null);

    const handleDelete = async (item: ApiItem) => {
        setRemovingId(item.id);
        try {
            await inventoryApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="hidden md:block overflow-x-auto overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide min-w-[200px]">Item</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Holiday</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Kit Type</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Total</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Avail.</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Reserved</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Shipped</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Cleaning</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide text-center">Repair</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <Boxes className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No inventory items yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Add items to track stock levels across your kits</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const lowStock = (item?.inventory?.availableQty ?? 0) <= item.lowStockThreshold && item.lowStockThreshold > 0;
                            return (
                                <Fragment key={item.id}>
                                <TableRow className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="capitalize font-medium">{item.name}</span>
                                            {lowStock && <LowStockChip />}
                                        </div>
                                        <span className="text-[11px] text-muted-foreground font-mono">{item.sku}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{holidayLabel(item)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{kitTierLabel(item)}</TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.totalQty} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.availableQty} color="oklch(0.55 0.17 150)" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.reservedQty} color="oklch(0.65 0.18 55)" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.shippedQty} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.cleaningQty} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockCell value={item?.inventory?.repairQty} color={item?.inventory?.repairQty ? "oklch(0.55 0.22 25)" : undefined} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={formatItemStatus(item.status)} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setAdjustingId(adjustingId === item.id ? null : item.id)}
                                                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                <SlidersHorizontal className="size-3" />
                                                Adjust Stock
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                <Pencil className="size-3" />
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onView(item)}
                                                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                <Eye className="size-3" />
                                                View
                                            </button>
                                            <TrashConfirm
                                                name={item.name}
                                                onConfirm={() => handleDelete(item)}
                                                disabled={removingId === item.id}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {adjustingId === item.id && (
                                    <TableRow>
                                        <TableCell colSpan={11} className="p-3 bg-muted/20">
                                            <StockAdjustForm
                                                scope="item"
                                                id={item.id}
                                                inventory={item.inventory ?? { totalQty: 0, availableQty: 0, reservedQty: 0, shippedQty: 0, cleaningQty: 0, repairQty: 0, lostQty: 0 }}
                                                onClose={() => setAdjustingId(null)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                                </Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
