import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AddOn } from "@/data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type AddOnCardProps = {
    item: AddOn;
    onView: (item: AddOn) => void;
};

export function AddOnCard({ item, onView }: AddOnCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted"></div>
                <h3 className="text-lg font-medium">{item.name}</h3>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Price" value={item.price} />
                <Field label="Deposit" value={item.deposit} />
                <Field label="Inventory" value={item.inventory} />
                <Field label="Status" value={<StatusBadge status={item.status} />} />
                <Field
                    label="Holidays Mapped"
                    value={
                        <div className="flex flex-wrap gap-1">
                            {item.holidaysMapped.map((h) => (
                                <StatusBadge key={h} status={h} />
                            ))}
                        </div>
                    }
                />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
