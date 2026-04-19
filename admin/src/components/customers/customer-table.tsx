import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Customer } from "@/data";

type CustomerTableProps = {
    items: Customer[];
    onView: (item: Customer) => void;
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
                    {items.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.email}</TableCell>
                            <TableCell className="font-medium">{item.orders}</TableCell>
                            <TableCell>
                                <span
                                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                                    style={
                                        item.subscription
                                            ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                            : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                                    }
                                >
                                    {item.subscription ? "Yes" : "No"}
                                </span>
                            </TableCell>
                            <TableCell>{item.onTimeReturns}</TableCell>
                            <TableCell>{item.depositsHeld}</TableCell>
                            <TableCell>{item.region}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
