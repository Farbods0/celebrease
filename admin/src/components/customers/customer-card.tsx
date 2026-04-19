import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type CustomerCardProps = {
    item: Customer;
    onView: (item: Customer) => void;
};

export function CustomerCard({ item, onView }: CustomerCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
                <Avatar className="size-12">
                    <AvatarImage src="/avatars/john-doe.jpg" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm">{item.email}</p>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Orders" value={item.orders} />
                <Field label="On-Time Returns" value={item.onTimeReturns} />
                <Field label="Deposits Held" value={item.depositsHeld} />
                <Field label="Region" value={item.region} />
                <Field
                    label="Subscription"
                    value={
                        <span
                            className="rounded-md px-2 py-0.5 text-xs font-medium"
                            style={
                                item.subscription
                                    ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                    : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                            }
                        >
                            {item.subscription ? "Yes" : "No"}
                        </span>
                    }
                />
            </div>
            <Button size="sm" onClick={() => onView(item)} className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80">
                View
            </Button>
        </article>
    );
}
