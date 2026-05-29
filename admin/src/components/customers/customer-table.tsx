import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDeposit, formatOnTimeReturns, type ApiCustomer } from "@/lib/api";

type CustomerTableProps = {
    items: ApiCustomer[];
    onView: (item: ApiCustomer) => void;
};

export function CustomerTable({ items, onView }: CustomerTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>On-Time Returns</TableHead>
                        <TableHead>Deposits Held</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                                No customers found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.email}</TableCell>
                                <TableCell className="font-medium">{item.orderCount}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.hasActiveSubscription ? "Yes" : "No"} />
                                </TableCell>
                                <TableCell>{formatOnTimeReturns(item.completedCount, item.orderCount)}</TableCell>
                                <TableCell>{formatDeposit(item.depositsHeld)}</TableCell>
                                <TableCell>{item.region ?? "—"}</TableCell>
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
