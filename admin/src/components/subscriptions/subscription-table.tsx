import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    formatDate,
    formatPlanLabel,
    formatStatus,
    formatSubId,
    getCurrentHolidayName,
    getNextActionLabel,
    getStageLabel,
    type ApiSubscription,
} from "@/lib/api";

type SubscriptionTableProps = {
    items: ApiSubscription[];
    onView: (item: ApiSubscription) => void;
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
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                                No subscriptions found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-muted-foreground">{formatSubId(item.id)}</TableCell>
                                <TableCell className="font-medium">{item.user.name}</TableCell>
                                <TableCell>{formatPlanLabel(item)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={getCurrentHolidayName(item)} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">{getStageLabel(item)}</TableCell>
                                <TableCell>{getNextActionLabel(item)}</TableCell>
                                <TableCell>{formatDate(item.nextBillingAt)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatStatus(item.status)} />
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
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
