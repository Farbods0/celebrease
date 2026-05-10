import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney, formatOrderStatus, formatTier, totalDeposit, type ApiOrder } from "@/lib/api";
import moment from "moment";

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
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Holiday</TableHead>
                        <TableHead>Kit</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deposit Held</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                                No active returns
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
                                <TableCell>{returnRequestedAt(item)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatOrderStatus(item.status)} />
                                </TableCell>
                                <TableCell>{formatMoney(totalDeposit(item))}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium hover:bg-border/60 transition-colors"
                                    >
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
