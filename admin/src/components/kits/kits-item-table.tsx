import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseURL, type ApiKit } from "@/lib/api";

const STATUS_LABEL: Record<ApiKit["items"][number]["item"]["status"], string> = {
    ACTIVE: "Active",
    LOW_STOCK: "Low Stock",
    RETIRED: "Retired",
};

export function KitsItemTable({ items, onView }: { items: ApiKit["items"]; onView: (item: ApiKit["items"][number]["item"]) => void }) {
    return (
        <div className="overflow-hidden rounded-lg border">
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
                        <TableRow key={item.item.id}>
                            <TableCell className="flex items-center gap-2">
                                <div className="size-8 shrink-0 rounded-md bg-white overflow-hidden">
                                    <img
                                        src={`${baseURL}${item.item.image}`}
                                        alt={item.item.name}
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <span className="capitalize">{item.item.name}</span>
                            </TableCell>

                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{item.item.sku}</TableCell>
                            <TableCell className="font-medium">{item.item.category}</TableCell>

                            <TableCell>
                                <StatusBadge status={STATUS_LABEL[item.item.status]} />
                            </TableCell>

                            <TableCell className="space-x-2">
                                <button className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium">
                                    Trash
                                </button>

                                <button
                                    onClick={() => onView(item.item)}
                                    className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                >
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
