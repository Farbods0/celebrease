import { StockAdjustForm } from "@/components/inventory/stock-adjust-form";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { addOnsApi, baseURL, type ApiAddOn } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Pencil, Puzzle, SlidersHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : "—";
};

type AddOnTableProps = {
    items: ApiAddOn[];
    onEdit: (item: ApiAddOn) => void;
};

export function AddOnTable({ items, onEdit }: AddOnTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [adjustingId, setAdjustingId] = useState<string | null>(null);

    const handleToggleActive = async (item: ApiAddOn) => {
        setTogglingId(item.id);
        try {
            await addOnsApi.update(item.id, { isActive: !item.isActive });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiAddOn) => {
        setRemovingId(item.id);
        try {
            await addOnsApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Item</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Price</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Deposit</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">In Stock</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Holidays</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide w-32">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <Puzzle className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No add-ons yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Add-ons will appear here once created</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <Fragment key={item.id}>
                                <TableRow className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 shrink-0 rounded-lg bg-muted overflow-hidden ring-1 ring-border/50">
                                                <img
                                                    src={`${baseURL}${item.image}`}
                                                    alt={item.name}
                                                    crossOrigin="anonymous"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold">{fmtMoney(item.price)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{fmtMoney(item.deposit)}</TableCell>
                                    <TableCell className="font-mono text-sm font-medium">{item?.inventory?.availableQty ?? "—"}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {item.holidays.length === 0 ? (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            ) : (
                                                item.holidays.map(({ holiday }) => (
                                                    <span key={holiday.id} className="text-xs bg-muted rounded-md px-2 py-0.5 text-muted-foreground">{holiday.name}</span>
                                                ))
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.isActive}
                                            disabled={togglingId === item.id}
                                            onCheckedChange={() => handleToggleActive(item)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setAdjustingId(adjustingId === item.id ? null : item.id)}
                                                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                                            >
                                                <SlidersHorizontal className="size-3.5" />
                                                Adjust Stock
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                className="inline-flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="size-3.5" />
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
                                        <TableCell colSpan={7} className="p-3 bg-muted/20">
                                            <StockAdjustForm
                                                scope="addon"
                                                id={item.id}
                                                inventory={item.inventory ?? { totalQty: 0, availableQty: 0, reservedQty: 0, shippedQty: 0, cleaningQty: 0, repairQty: 0, lostQty: 0 }}
                                                onClose={() => setAdjustingId(null)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
