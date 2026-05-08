import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApiPlan } from "@/lib/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

function formatMoney(value: string | null) {
    if (!value) return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return `$${n.toFixed(2)}`;
}

type PlanCardProps = {
    item: ApiPlan;
    onEdit: (item: ApiPlan) => void;
};

export function PlanCard({ item, onEdit }: PlanCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{item.code}</p>
                </div>
                <StatusBadge status={item.isActive ? "Active" : "Hidden"} />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Monthly" value={formatMoney(item.monthlyPrice)} />
                <Field label="Yearly" value={formatMoney(item.yearlyPrice)} />
                <Field label="Holidays/Yr" value={item.holidaysPerYear} />
                <Field label="Features" value={item.features.length} />
            </div>
            <Button size="sm" onClick={() => onEdit(item)} className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20">
                Edit
            </Button>
        </article>
    );
}
