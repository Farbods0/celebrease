import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { plansApi, type ApiPlan } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { BadgeCheck, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

const TIER_STYLES: Record<string, string> = {
    STARTER: "bg-slate-100 text-slate-700",
    PREMIUM: "bg-primary/10 text-primary",
    ULTIMATE: "bg-amber-50 text-amber-700",
};

export function PlanTable({ items, onEdit }: PlanTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleActive = async (item: ApiPlan, isActive: boolean) => {
        setTogglingId(item.id);
        try {
            await plansApi.update(item.id, { isActive });
            toast.success(isActive ? `${item.name} activated` : `${item.name} deactivated`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiPlan) => {
        setRemovingId(item.id);
        try {
            await plansApi.remove(item.id);
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
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Plan</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Monthly</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Yearly</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Holidays / Yr</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Kit Disc.</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Add-On Disc.</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Features</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/70 uppercase text-[11px] tracking-wide">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                                        <BadgeCheck className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No plans yet</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Add up to 3 subscription tiers</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TIER_STYLES[item.code] ?? "bg-muted text-muted-foreground"}`}>
                                            {item.code}
                                        </span>
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-sm">{formatMoney(item.monthlyPrice)}<span className="text-xs text-muted-foreground font-normal">/mo</span></TableCell>
                                <TableCell className="font-semibold text-sm">{formatMoney(item.yearlyPrice)}<span className="text-xs text-muted-foreground font-normal">/yr</span></TableCell>
                                <TableCell className="text-sm font-mono font-medium">{item.holidaysPerYear}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.kitDiscount}%</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.addOnDiscount}%</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.features.length} items</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={item.isActive}
                                            disabled={togglingId === item.id}
                                            onCheckedChange={(v) => handleToggleActive(item, v)}
                                        />
                                        <span className="text-xs text-muted-foreground">{item.isActive ? "Active" : "Hidden"}</span>
                                    </div>
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
