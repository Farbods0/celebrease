import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApiInventoryItem } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

const STATUS_LABEL: Record<ApiInventoryItem["status"], string> = {
    ACTIVE: "Active",
    LOW_STOCK: "Low Stock",
    RETIRED: "Retired",
};

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
    item: ApiInventoryItem;
    onView: (item: ApiInventoryItem) => void;
};

function holidayLabel(item: ApiInventoryItem): string {
    const names = Array.from(new Set(item.kitItems.map((ki) => ki.kit.holiday.name)));
    if (names.length === 0) return "—";
    if (names.length === 1) return names[0];
    return `${names[0]} +${names.length - 1}`;
}

function kitTierLabel(item: ApiInventoryItem): string {
    const tiers = Array.from(new Set(item.kitItems.map((ki) => ki.kit.tier)));
    if (tiers.length === 0) return "—";
    return tiers.map((t) => (t === "STARTER" ? "Starter" : "Premium")).join(", ");
}

export function InventoryCard({ item, onView }: InventoryCardProps) {
    const lowStock = item.units.available <= item.lowStockThreshold && item.lowStockThreshold > 0;
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
                <Field label="Total Qty" value={item.totalQty} />
                <Field label="Available" value={item.units.available} tone="available" />
                <Field label="Reserved" value={item.units.reserved} tone="reserved" />
                <Field label="Shipped" value={item.units.shipped} />
                <Field label="Cleaning" value={item.units.cleaning} />
                <Field label="Repair" value={item.units.repair} tone="repair" />
                <Field label="Status" value={<StatusBadge status={STATUS_LABEL[item.status]} />} />
            </div>

            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground [a]:hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
