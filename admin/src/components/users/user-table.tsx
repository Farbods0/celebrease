import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import type { ApiUser } from "@/lib/api";
import { Pencil, ShieldCheck, ShieldX, ShieldUser } from "lucide-react";

type UserTableProps = {
    items: ApiUser[];
    onEdit: (item: ApiUser) => void;
    onDelete?: (item: ApiUser) => void;
    currentUserId?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" });

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return dateFormatter.format(d);
}

const ROLE_STYLES: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    superadmin: "bg-amber-50 text-amber-700",
    user: "bg-muted text-muted-foreground",
};

export function UserTable({ items, onEdit, onDelete, currentUserId }: UserTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Name</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Email</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Role</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Verified</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Joined</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <ShieldUser className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No users found</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Admin and user accounts will appear here</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[item.role] ?? "bg-muted text-muted-foreground"}`}>
                                        {item.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {item.emailVerified ? (
                                        <ShieldCheck className="size-4 text-emerald-600" />
                                    ) : (
                                        <ShieldX className="size-4 text-muted-foreground" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                                        style={
                                            item.banned
                                                ? { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                                                : { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                        }
                                    >
                                        {item.banned ? "Banned" : "Active"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            aria-label={`Edit ${item.name}`}
                                            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            <Pencil className="size-3" />
                                            Edit
                                        </button>
                                        {onDelete && item.id !== currentUserId && item.role !== "superadmin" && (
                                            <TrashConfirm
                                                name={item.name}
                                                title="Delete user?"
                                                description="This will permanently delete user"
                                                onConfirm={() => onDelete(item)}
                                            />
                                        )}
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
