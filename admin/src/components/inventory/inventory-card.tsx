import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/data";
import { AlertTriangle } from "lucide-react";
import { HolidayBadge } from "./holiday-badge";

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" | "status" }) {
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

export function InventoryCard({ item }: { item: InventoryItem }) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 flex-wrap">
                <HolidayBadge holiday={item.holiday} />
                {item.lowStock && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.95_0.06_60)] px-1.5 py-0.5 text-[10px] font-medium text-[oklch(0.5_0.17_60)]">
                        <AlertTriangle className="size-3" />
                        Low stock
                    </span>
                )}
            </div>

            <h3 className="mt-1.5 text-lg font-medium">{item.name}</h3>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Kit Type" value={item.kitType} />
                <Field label="Total Qty" value={item.totalQty} />
                <Field label="Available" value={item.available} tone="available" />
                <Field label="Reserved" value={item.reserved} tone="reserved" />
                <Field label="Shipped" value={item.shipped} />
                <Field label="Cleaning" value={item.cleaning} />
                <Field label="Repair" value={item.repair} tone="repair" />
                <Field
                    label="Status"
                    value={
                        <span
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                            style={{
                                backgroundColor: "oklch(0.93 0.08 150)",
                                color: "oklch(0.4 0.14 150)",
                            }}
                        >
                            {item.status}
                        </span>
                    }
                />
            </div>

            <Button size="sm" className="mt-4 w-full bg-muted text-foreground [a]:hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
