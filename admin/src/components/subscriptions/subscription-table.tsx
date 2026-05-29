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
import { CreditCard, Eye } from "lucide-react";

type SubscriptionTableProps = {
    items: ApiSubscription[];
    onView: (item: ApiSubscription) => void;
};

export function SubscriptionTable({ items, onView }: SubscriptionTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Sub #</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Customer</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Plan</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Current Holiday</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Stage</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Next Action</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Renewal</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <CreditCard className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No subscriptions yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Subscriptions will appear here once customers sign up for a plan</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{formatSubId(item.id)}</TableCell>
                                <TableCell className="font-medium">{item.user.name}</TableCell>
                                <TableCell className="text-sm">{formatPlanLabel(item)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{getCurrentHolidayName(item)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{getStageLabel(item)}</TableCell>
                                <TableCell className="text-sm">{getNextActionLabel(item)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(item.nextBillingAt)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={formatStatus(item.status)} />
                                </TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Eye className="size-3" />
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
