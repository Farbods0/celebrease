import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "../components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

import type { KitItem } from "../data";
import { KIT_ITEMS } from "../data";

type RouteComponentProps = {
    items: KitItem[];
    onView: (item: KitItem) => void;
};

function RouteComponent({ items, onView }: RouteComponentProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>QTY</TableHead>
                        <TableHead>ITEM SKU</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.sku}>
                            <TableCell className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white"></div>
                                {item.name}
                            </TableCell>

                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell className="font-medium">{item.category}</TableCell>

                            <TableCell>
                                <StatusBadge status={item.status} />
                            </TableCell>

                            <TableCell className="space-x-2">
                                <button className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium">
                                    Trash
                                </button>

                                <button onClick={() => onView(item)} className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium">
                                    Edit
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// Route export
export const Route = createFileRoute("/pricing")({
    component: () => <RouteComponent items={KIT_ITEMS} onView={(item) => console.log(item)} />,
});
