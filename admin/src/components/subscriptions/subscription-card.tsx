import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Subscription } from "@/data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type SubscriptionCardProps = {
    item: Subscription;
    onView: (item: Subscription) => void;
};

export function SubscriptionCard({ item, onView }: SubscriptionCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <StatusBadge status={item.status} />
                <span className="text-sm text-muted-foreground">{item.subId}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-medium">{item.customer}</h3>
            <p className="text-sm">{item.plan}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Current Holiday" value={item.currentHoliday} />
                <Field label="Stage" value={item.stage} />
                <Field label="Next Action" value={item.nextAction} />
                <Field label="Renewal" value={item.renewal} />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
