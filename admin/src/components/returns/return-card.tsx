import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney, formatOrderStatus, formatTier, totalDeposit, type ApiOrder } from "@/lib/api";
import moment from "moment";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type ReturnCardProps = {
    item: ApiOrder;
    onView: (item: ApiOrder) => void;
};

export function ReturnCard({ item, onView }: ReturnCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <StatusBadge status={item.holiday.name} />
                <span className="text-sm text-muted-foreground">Order {item.orderNumber}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-medium">{item.user.name}</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Kit" value={formatTier(item.kit.tier)} />
                <Field
                    label="Requested"
                    value={item.returnRequestedAt ? moment(item.returnRequestedAt).format("MMM DD, YYYY") : "—"}
                />
                <Field label="Deposit Held" value={formatMoney(totalDeposit(item))} />
                <Field label="Status" value={<StatusBadge status={formatOrderStatus(item.status)} />} />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                Inspect
            </Button>
        </article>
    );
}
