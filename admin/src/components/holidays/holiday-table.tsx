import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseURL, type ApiHoliday } from "@/lib/api";

type HolidayTableProps = {
    items: ApiHoliday[];
    onEdit: (item: ApiHoliday) => void;
    onDelete: (id: string) => void;
};

export function HolidayTable({ items, onEdit, onDelete }: HolidayTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                No holidays found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 shrink-0 rounded-md bg-muted">
                                            <img
                                                src={`${baseURL}${item.image}`}
                                                alt={item.name}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>{item.category.replace("_", " ")}</TableCell>
                                <TableCell>{item.sortOrder}</TableCell>
                                <TableCell>
                                    <span
                                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                                        style={
                                            item.isActive
                                                ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                                : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                                        }
                                    >
                                        {item.isActive ? "Active" : "Hidden"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item.id)}
                                            className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
