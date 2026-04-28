import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/data";

type UserTableProps = {
    items: User[];
    onView: (item: User) => void;
};

export function UserTable({ items, onView }: UserTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.email}</TableCell>
                            <TableCell className="font-medium">{item.role}</TableCell>
                            <TableCell>
                                <span
                                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                                    style={
                                        item.status === "Active"
                                            ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                            : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                                    }
                                >
                                    {item.status}
                                </span>
                            </TableCell>
                            <TableCell>{item.lastLogin}</TableCell>
                            <TableCell>{item.createdAt}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
