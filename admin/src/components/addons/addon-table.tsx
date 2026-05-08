import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseURL, type ApiAddOn } from "@/lib/api";

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : "—";
};

type AddOnTableProps = {
    items: ApiAddOn[];
    onEdit: (item: ApiAddOn) => void;
};

export function AddOnTable({ items, onEdit }: AddOnTableProps) {
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
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                                No add-ons yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="flex items-center gap-2">
                                    <div className="size-8 shrink-0 rounded-md bg-white overflow-hidden">
                                        <img
                                            src={`${baseURL}${item.image}`}
                                            alt={item.name}
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                    {item.name}
                                </TableCell>
                                <TableCell>{fmtMoney(item.price)}</TableCell>
                                <TableCell>{fmtMoney(item.deposit)}</TableCell>
                                <TableCell className="font-medium">{item?.inventory?.availableQty ?? "N/A"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.holidays.length === 0 ? (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        ) : (
                                            item.holidays.map(({ holiday }) => <StatusBadge key={holiday.id} status={holiday.name} />)
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={item.isActive ? "Active" : "Hidden"} />
                                </TableCell>
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
