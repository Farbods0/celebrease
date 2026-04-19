import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AddOn } from "@/data";

type AddOnTableProps = {
    items: AddOn[];
    onView: (item: AddOn) => void;
};

export function AddOnTable({ items, onView }: AddOnTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Deposit</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Holidays Mapped</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        return (
                            <TableRow key={item.name}>
                                <TableCell className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white"></div>
                                    {item.name}
                                </TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.deposit}</TableCell>
                                <TableCell className="font-medium">{item.inventory}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.holidaysMapped.map((h) => (
                                            <StatusBadge key={h} status={h} />
                                        ))}
                                    </div>
                                </TableCell>
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
