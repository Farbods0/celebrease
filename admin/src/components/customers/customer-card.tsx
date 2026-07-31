import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDeposit, formatOnTimeReturns, getInitials, type ApiCustomer } from "@/lib/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type CustomerCardProps = {
    item: ApiCustomer;
    onView: (item: ApiCustomer) => void;
};

export function CustomerCard({ item, onView }: CustomerCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
                <Avatar className="size-12">
                    <AvatarImage src={item.image ?? undefined} alt={item.name} />
                    <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm">{item.email}</p>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Orders" value={item.orderCount} />
                <Field label="On-Time Returns" value={formatOnTimeReturns(item.completedCount, item.orderCount)} />
                <Field label="Deposits Held" value={formatDeposit(item.depositsHeld)} />
                <Field label="Region" value={item.region ?? ", "} />
                <Field
                    label="Subscription"
                    value={<StatusBadge status={item.hasActiveSubscription ? "Active" : "Hidden"} />}
                />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
