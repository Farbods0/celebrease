import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatItemStatus, formatKitTier, type ApiItem } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" }) {
    let valueColor: string | undefined;
    if (tone === "available") valueColor = "oklch(0.55 0.17 150)";
    if (tone === "reserved") valueColor = "oklch(0.65 0.18 55)";
    if (tone === "repair") valueColor = "oklch(0.55 0.22 25)";

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium" style={valueColor ? { color: valueColor } : undefined}>
                {value}
            </span>
        </div>
    );
}

type InventoryCardProps = {
    item: ApiItem;
    onView: (item: ApiItem) => void;
    onEdit: (item: ApiItem) => void;
};

function holidayLabel(item: ApiItem): string {
    const names = Array.from(new Set(item.kitItems.map((ki) => ki.kit.holiday.name)));
    if (names.length === 0) return "—";
    if (names.length === 1) return names[0];
    return `${names[0]} +${names.length - 1}`;
}

function kitTierLabel(item: ApiItem): string {
    const tiers = Array.from(new Set(item.kitItems.map((ki) => ki.kit.tier)));
    if (tiers.length === 0) return "—";
    return tiers.map((t) => formatKitTier(t)).join(", ");
}

export function InventoryCard({ item, onView, onEdit }: InventoryCardProps) {
    const lowStock = (item?.inventory?.availableQty ?? 0) <= item.lowStockThreshold && item.lowStockThreshold > 0;
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={holidayLabel(item)} />
                {lowStock && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.95_0.06_60)] px-1.5 py-0.5 text-[10px] font-medium text-[oklch(0.5_0.17_60)]">
                        <AlertTriangle className="size-3" />
                        Low stock
                    </span>
                )}
            </div>

            <h3 className="mt-1.5 text-lg font-medium capitalize">{item.name}</h3>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Kit Type" value={kitTierLabel(item)} />
                <Field label="Total Qty" value={item?.inventory?.totalQty ?? "N/A"} />
                <Field label="Available" value={item?.inventory?.availableQty ?? "N/A"} tone="available" />
                <Field label="Reserved" value={item?.inventory?.reservedQty ?? "N/A"} tone="reserved" />
                <Field label="Shipped" value={item?.inventory?.shippedQty ?? "N/A"} />
                <Field label="Cleaning" value={item?.inventory?.cleaningQty ?? "N/A"} />
                <Field label="Repair" value={item?.inventory?.repairQty ?? "N/A"} tone="repair" />
                <Field label="Status" value={<StatusBadge status={formatItemStatus(item.status)} />} />
            </div>

            <div className="mt-4 flex gap-3">
                <Button size="sm" onClick={() => onEdit(item)} className="w-full bg-primary/10 text-primary hover:bg-primary/20">
                    Edit
                </Button>
                <Button size="sm" onClick={() => onView(item)} className="w-full bg-muted text-foreground [a]:hover:bg-muted/80">
                    View
                </Button>
            </div>
        </article>
    );
}
