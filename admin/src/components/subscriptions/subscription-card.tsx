import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatDate,
    formatPlanLabel,
    formatStatus,
    formatSubId,
    getCurrentHolidayName,
    getNextActionLabel,
    getStageLabel,
    type ApiSubscription,
} from "@/lib/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type SubscriptionCardProps = {
    item: ApiSubscription;
    onView: (item: ApiSubscription) => void;
};

export function SubscriptionCard({ item, onView }: SubscriptionCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <StatusBadge status={formatStatus(item.status)} />
                <span className="text-sm text-muted-foreground">{formatSubId(item.id)}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-medium">{item.user.name}</h3>
            <p className="text-sm">{formatPlanLabel(item)}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Current Holiday" value={getCurrentHolidayName(item)} />
                <Field label="Stage" value={getStageLabel(item)} />
                <Field label="Next Action" value={getNextActionLabel(item)} />
                <Field label="Renewal" value={formatDate(item.nextBillingAt)} />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
