import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ApiUser } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return dateFormatter.format(d);
}

function getInitials(str: string) {
    return (str.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase();
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || "—"}</span>
        </div>
    );
}

export function UserView({ item }: { item: ApiUser }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3">
                <Avatar className="size-14">
                    <AvatarImage src={item.image ?? ""} alt={item.name} />
                    <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Row label="Role" value={<span className="capitalize">{item.role}</span>} />
                <Row
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
                <Row label="Phone" value={item.phone} />
                <Row label="Region" value={item.region} />
                <Row label="Created" value={formatDate(item.createdAt)} />
                <Row label="Updated" value={formatDate(item.updatedAt)} />
            </div>
        </DialogContent>
    );
}
