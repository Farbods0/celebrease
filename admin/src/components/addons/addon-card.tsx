import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { baseURL, type ApiAddOn } from "@/lib/api";

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : "—";
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type AddOnCardProps = {
    item: ApiAddOn;
    onEdit: (item: ApiAddOn) => void;
};

export function AddOnCard({ item, onEdit }: AddOnCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
                <div className="size-10 shrink-0 rounded-md bg-muted overflow-hidden">
                    <img
                        src={`${baseURL}${item.image}`}
                        alt={item.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-sm leading-none">{item.name}</h3>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Price" value={fmtMoney(item.price)} />
                <Field label="Deposit" value={fmtMoney(item.deposit)} />
                <Field label="Inventory" value={item?.inventory?.availableQty ?? "N/A"} />
                <Field label="Status" value={<StatusBadge status={item.isActive ? "Active" : "Hidden"} />} />
                <Field
                    label="Holidays Mapped"
                    value={
                        item.holidays.length === 0 ? (
                            <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {item.holidays.map(({ holiday }) => (
                                    <StatusBadge key={holiday.id} status={holiday.name} />
                                ))}
                            </div>
                        )
                    }
                />
            </div>
            <Button size="sm" onClick={() => onEdit(item)} className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20">
                Edit
            </Button>
        </article>
    );
}
