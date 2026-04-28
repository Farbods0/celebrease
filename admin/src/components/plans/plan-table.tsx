import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiPlan } from "@/lib/api";

type PlanTableProps = {
    items: ApiPlan[];
    onEdit: (item: ApiPlan) => void;
};

function formatMoney(value: string | null) {
    if (!value) return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return `$${n.toFixed(2)}`;
}

export function PlanTable({ items, onEdit }: PlanTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Monthly</TableHead>
                        <TableHead>Yearly</TableHead>
                        <TableHead>Holidays/Yr</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                                No plans found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs">{item.code}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{formatMoney(item.monthlyPrice)}</TableCell>
                                <TableCell>{formatMoney(item.yearlyPrice)}</TableCell>
                                <TableCell>{item.holidaysPerYear}</TableCell>
                                <TableCell className="text-muted-foreground">{item.features.length}</TableCell>
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
