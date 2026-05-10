import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, type ApiHolidayWithAddOns } from "@/lib/api";

type KitsAddonTableProps = {
    items: ApiHolidayWithAddOns["addOns"];
    onRemove: (addOn: ApiHolidayWithAddOns["addOns"][number]["addOn"]) => void;
    removing?: boolean;
};

export function KitsAddonTable({ items, onRemove, removing }: KitsAddonTableProps) {
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
                        <TableRow key={addon.addOn.id}>
                            <TableCell className="flex items-center gap-2">
                                <div className="size-8 shrink-0 rounded-md bg-white overflow-hidden">
                                    <img
                                        src={`${baseURL}${addon.addOn.image}`}
                                        alt={addon.addOn.name}
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                {addon.addOn.name}
                            </TableCell>
                            <TableCell>{addon.addOn.price}</TableCell>
                            <TableCell>{addon.addOn.deposit}</TableCell>
                            <TableCell>{addon.addOn.inventory?.availableQty ?? "N/A"}</TableCell>
                            <TableCell>
                                <StatusBadge status={addon.addOn.isActive ? "Active" : "Hidden"} />
                            </TableCell>
                            <TableCell>
                                <TrashConfirm
                                    name={addon.addOn.name}
                                    title="Remove add-on?"
                                    description="Are you sure you want to remove"
                                    onConfirm={() => onRemove(addon.addOn)}
                                    disabled={removing}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
