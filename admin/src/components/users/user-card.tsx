import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ApiUser } from "@/lib/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

function getInitials(str: string) {
    return (str.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase();
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" });
function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return dateFormatter.format(d);
}

type UserCardProps = {
    item: ApiUser;
    onView: (item: ApiUser) => void;
    onEdit: (item: ApiUser) => void;
};

export function UserCard({ item, onView, onEdit }: UserCardProps) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
                <Avatar className="size-12">
                    <AvatarImage src={item.image ?? ""} alt={item.name} />
                    <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm">{item.email}</p>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Field label="Role" value={<span className="capitalize">{item.role}</span>} />
                <Field
                    label="Status"
                    value={
                        <span
                            className="rounded-md px-2 py-0.5 text-xs font-medium"
                            style={
                                item.emailVerified
                                    ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                                    : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                            }
                        >
                            {item.emailVerified ? "Active" : "Inactive"}
                        </span>
                    }
                />
                <Field label="Created" value={formatDate(item.createdAt)} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => onView(item)}>
                    View
                </Button>
                <Button size="sm" onClick={() => onEdit(item)}>
                    Edit
                </Button>
            </div>
        </article>
    );
}
