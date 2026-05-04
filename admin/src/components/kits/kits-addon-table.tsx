import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AddOn } from "@/data";

export function KitsAddonTable({ items }: { items: AddOn[]; onView: (item: AddOn) => void }) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Add-On</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Deposit</TableHead>
                        <TableHead>Inv</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((addon) => (
                        <TableRow key={addon.name}>
                            <TableCell className="capitalize">{addon.name}</TableCell>
                            <TableCell>{addon.price}</TableCell>
                            <TableCell>{addon.deposit}</TableCell>
                            <TableCell>{addon.inv}</TableCell>
                            <TableCell>
                                <StatusBadge status={addon.status} />
                            </TableCell>
                            <TableCell className="space-x-2">
                                <button className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium">
                                    Trash
                                </button>
                                <button className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium">Edit</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
