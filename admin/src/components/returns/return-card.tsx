import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Return } from "@/data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type ReturnCardProps = {
    item: Return;
    onView: (item: Return) => void;
};

export function ReturnCard({ item, onView }: ReturnCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <StatusBadge status={item.kit} />
                <span className="text-sm text-muted-foreground">{item.returnId}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-medium">
                {item.customerName} - {item.orderId}
            </h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Kit Type" value={item.kit} />
                <Field label="Due Date" value={item.dueDate} />
                <Field label="Deposit" value={item.deposit} />
                <Field label="Damage" value={item.damage ? "Yes" : "No"} />
                <Field label="Status" value={<StatusBadge status={item.status} />} />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
