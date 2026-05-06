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

type OrderTableProps = {
    items: ApiOrder[];
    onView: (item: ApiOrder) => void;
};

export function OrderTable({ items, onView }: OrderTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Holiday</TableHead>
                        <TableHead>Kit Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Add-Ons</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ship Date</TableHead>
                        <TableHead>Deposit</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center text-sm text-muted-foreground py-10">
                                No orders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-muted-foreground">{item.orderNumber}</TableCell>
                                <TableCell className="font-medium">{item.user.name}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.holiday.name} />
                                </TableCell>
                                <TableCell>{formatTier(item.kit.tier)}</TableCell>
                                <TableCell>{formatDuration(item.duration)}</TableCell>
                                <TableCell className="text-muted-foreground">{formatAddOnsSummary(item)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatOrderStatus(item.status)} />
                                </TableCell>
                                <TableCell>{formatShipDate(item)}</TableCell>
                                <TableCell>{formatMoney(totalDeposit(item))}</TableCell>
                                <TableCell className="font-medium">{formatMoney(item.total)}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium hover:bg-border/60 transition-colors"
                                    >
                                        View
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
