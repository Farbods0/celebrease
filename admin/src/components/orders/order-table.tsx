import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "@/data";

type OrderTableProps = {
    items: Order[];
    onView: (item: Order) => void;
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
                    {items.map((item, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell className="font-medium text-muted-foreground">{item.orderId}</TableCell>
                                <TableCell className="font-medium">{item.customer}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.holiday} />
                                </TableCell>
                                <TableCell>{item.kitType}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell className="text-muted-foreground">{item.addOns}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell>{item.shipDate}</TableCell>
                                <TableCell>{item.deposit}</TableCell>
                                <TableCell className="font-medium">{item.total}</TableCell>
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
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
