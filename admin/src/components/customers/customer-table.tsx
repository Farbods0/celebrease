import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDeposit, formatOnTimeReturns, type ApiCustomer } from "@/lib/api";
import { Eye, Users } from "lucide-react";

type CustomerTableProps = {
    items: ApiCustomer[];
    onView: (item: ApiCustomer) => void;
};

export function CustomerTable({ items, onView }: CustomerTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Customer</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Email</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Orders</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Subscription</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">On-Time Returns</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Deposits Held</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Region</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <Users className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No customers yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Customers will appear here once they create an account</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.email}</TableCell>
                                <TableCell className="font-mono text-sm font-medium">{item.orderCount}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.hasActiveSubscription ? "Active" : "No"} />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatOnTimeReturns(item.completedCount, item.orderCount)}</TableCell>
                                <TableCell className="text-sm font-medium">{formatDeposit(item.depositsHeld)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.region ?? "—"}</TableCell>
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
