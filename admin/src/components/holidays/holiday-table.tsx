import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, holidaysApi, type ApiHoliday } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Layers, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type HolidayTableProps = {
    items: ApiHoliday[];
    onEdit: (item: ApiHoliday) => void;
};

export function HolidayTable({ items, onEdit }: HolidayTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleActive = async (item: ApiHoliday) => {
        setTogglingId(item.id);
        try {
            await holidaysApi.update(item.id, { isActive: !item.isActive });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiHoliday) => {
        setRemovingId(item.id);
        try {
            await holidaysApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/40">
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Name</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Category</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Sort Order</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Kits</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <Layers className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No holidays found</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Add a holiday to get started</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 shrink-0 rounded-lg bg-muted overflow-hidden ring-1 ring-border/50">
                                            <img
                                                src={`${baseURL}${item.image}`}
                                                alt={item.name}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground capitalize">{item.category.replace(/_/g, " ").toLowerCase()}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-mono text-muted-foreground">{item.sortOrder}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">{item.kits?.length ?? 0}</span>
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={item.isActive}
                                        disabled={togglingId === item.id}
                                        onCheckedChange={() => handleToggleActive(item)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="inline-flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            className="inline-flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>
                                        <TrashConfirm
                                            name={item.name}
                                            onConfirm={() => handleDelete(item)}
                                            disabled={removingId === item.id}
                                        />
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
