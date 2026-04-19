import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Return } from "@/data";

type ReturnTableProps = {
    items: Return[];
    onView: (item: Return) => void;
};

export function ReturnTable({ items, onView }: ReturnTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Return ID</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Holiday</TableHead>
                        <TableHead>Kit</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deposit</TableHead>
                        <TableHead>Damage</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell className="font-medium text-muted-foreground">{item.returnId}</TableCell>
                                <TableCell className="text-muted-foreground">{item.orderId}</TableCell>
                                <TableCell className="font-medium">{item.customer}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.holiday} />
                                </TableCell>
                                <TableCell>{item.kit}</TableCell>
                                <TableCell>{item.dueDate}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell>{item.deposit}</TableCell>
                                <TableCell>{item.damage ? "Yes" : "No"}</TableCell>
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
