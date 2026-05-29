import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney, formatOrderStatus, formatTier, totalDeposit, type ApiOrder } from "@/lib/api";
import moment from "moment";
import { ClipboardCheck, RotateCcw } from "lucide-react";

type ReturnTableProps = {
    items: ApiOrder[];
    onView: (item: ApiOrder) => void;
};

function returnRequestedAt(order: ApiOrder) {
    if (!order.returnRequestedAt) return "—";
    return moment(order.returnRequestedAt).format("MMM DD, YYYY");
}

export function ReturnTable({ items, onView }: ReturnTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Order #</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Customer</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Holiday</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Kit</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Requested</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Deposit Held</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <RotateCcw className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No active returns</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Return requests will appear here when customers initiate them</p>
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
                                <TableCell className="text-sm text-muted-foreground">{returnRequestedAt(item)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatOrderStatus(item.status)} />
                                </TableCell>
                                <TableCell className="font-semibold">{formatMoney(totalDeposit(item))}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <ClipboardCheck className="size-3" />
                                        Inspect
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
