import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOnsApi, inventoryApi } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

type Inventory = {
    totalQty: number;
    availableQty: number;
    reservedQty: number;
    shippedQty: number;
    cleaningQty: number;
    repairQty: number;
    lostQty: number;
};

type StockAdjustFormProps = {
    scope: "item" | "addon";
    id: string;
    inventory: Inventory;
    onClose: () => void;
};

const FIELDS: { key: keyof Inventory; label: string; help?: string }[] = [
    { key: "totalQty", label: "Total Owned", help: "Master count, increase when buying new units" },
    { key: "availableQty", label: "Available" },
    { key: "reservedQty", label: "Reserved" },
    { key: "shippedQty", label: "Shipped" },
    { key: "cleaningQty", label: "In Cleaning" },
    { key: "repairQty", label: "In Repair" },
    { key: "lostQty", label: "Lost / Damaged" },
];

export function StockAdjustForm({ scope, id, inventory, onClose }: StockAdjustFormProps) {
    const router = useRouter();
    const [next, setNext] = useState<Inventory>(inventory);
    const [submitting, setSubmitting] = useState(false);

    const setQty = (key: keyof Inventory, val: string) => {
        const n = Number(val);
        if (Number.isNaN(n) || n < 0) return;
        setNext((prev) => ({ ...prev, [key]: n }));
    };

    const bucketSum =
        next.availableQty +
        next.reservedQty +
        next.shippedQty +
        next.cleaningQty +
        next.repairQty +
        next.lostQty;
    const bucketsExceedTotal = bucketSum > next.totalQty;

    const handleApply = async () => {
        if (bucketsExceedTotal) {
            toast.error(`Sum of buckets (${bucketSum}) exceeds total (${next.totalQty})`);
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                totalDelta: next.totalQty - inventory.totalQty,
                availableDelta: next.availableQty - inventory.availableQty,
                reservedDelta: next.reservedQty - inventory.reservedQty,
                shippedDelta: next.shippedQty - inventory.shippedQty,
                cleaningDelta: next.cleaningQty - inventory.cleaningQty,
                repairDelta: next.repairQty - inventory.repairQty,
                lostDelta: next.lostQty - inventory.lostQty,
            };

            const noChange = Object.values(payload).every((v) => v === 0);
            if (noChange) {
                toast.info("No changes to apply");
                onClose();
                return;
            }

            if (scope === "item") {
                await inventoryApi.adjustStock(id, payload);
            } else {
                await addOnsApi.adjustStock(id, payload);
            }
            toast.success("Stock adjusted");
            await router.invalidate();
            onClose();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to adjust stock");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold">Adjust Stock</p>
                    <p className="text-xs text-muted-foreground">Edit values directly. Total must &ge; sum of buckets.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {FIELDS.map((f) => (
                    <div key={f.key} className="space-y-1">
                        <Label htmlFor={`${id}-${f.key}`} className="text-xs text-muted-foreground">
                            {f.label}
                        </Label>
                        <Input
                            id={`${id}-${f.key}`}
                            type="number"
                            min={0}
                            value={next[f.key]}
                            onChange={(e) => setQty(f.key, e.target.value)}
                            className="h-8"
                        />
                    </div>
                ))}
            </div>
            {bucketsExceedTotal && (
                <p className="text-xs text-destructive">
                    Sum of buckets is {bucketSum}, exceeds total of {next.totalQty}.
                </p>
            )}
            <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button size="sm" onClick={handleApply} disabled={submitting || bucketsExceedTotal}>
                    {submitting ? "Saving..." : "Apply"}
                </Button>
            </div>
        </div>
    );
}
