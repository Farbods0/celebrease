import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Subscription } from "@/data";

type SubscriptionTableProps = {
    items: Subscription[];
    onView: (item: Subscription) => void;
};

export function SubscriptionTable({ items, onView }: SubscriptionTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sub #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Current Holiday</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Next Action</TableHead>
                        <TableHead>Renewal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell className="font-medium text-muted-foreground">{item.subId}</TableCell>
                                <TableCell className="font-medium">{item.customer}</TableCell>
                                <TableCell>{item.plan}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.currentHoliday} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">{item.stage}</TableCell>
                                <TableCell>{item.nextAction}</TableCell>
                                <TableCell>{item.renewal}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
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
