import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    formatAddOnsSummary,
    formatDuration,
    formatMoney,
    formatOrderStatus,
    formatShipDate,
    formatTier,
    totalDeposit,
    type ApiOrder,
} from "@/lib/api";
import { Eye, ShoppingBag } from "lucide-react";

type OrderTableProps = {
    items: ApiOrder[];
    onView: (item: ApiOrder) => void;
};

export function OrderTable({ items, onView }: OrderTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Order #</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Customer</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Holiday</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Kit</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Duration</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Add-Ons</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Ship Date</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Deposit</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Total</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <ShoppingBag className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No orders yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Orders will appear here once customers check out</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{item.orderNumber}</TableCell>
                                <TableCell className="font-medium">{item.user.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.holiday.name}</TableCell>
                                <TableCell className="text-sm">{formatTier(item.kit.tier)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDuration(item.duration)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatAddOnsSummary(item)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatOrderStatus(item.status)} />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatShipDate(item)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatMoney(totalDeposit(item))}</TableCell>
                                <TableCell className="font-semibold">{formatMoney(item.total)}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="inline-flex items-center justify-center size-7 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                        title="View order"
                                    >
                                        <Eye className="size-3.5" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
