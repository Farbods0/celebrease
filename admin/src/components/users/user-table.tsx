import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiUser } from "@/lib/api";

type UserTableProps = {
    items: ApiUser[];
    onEdit: (item: ApiUser) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" });

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return dateFormatter.format(d);
}

export function UserTable({ items, onEdit }: UserTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.email}</TableCell>
                                <TableCell className="font-medium capitalize">{item.role}</TableCell>
                                <TableCell>
                                    <span
                                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                                        style={
                                            item.isBan
                                                ? { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                                                : { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                        }
                                    >
                                        {item.isBan ? "Banned" : "Active"}
                                    </span>
                                </TableCell>
                                <TableCell>{formatDate(item.createdAt)}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(item)}
                                        className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Edit
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
