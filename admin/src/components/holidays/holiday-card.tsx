import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { baseURL, type ApiHoliday } from "@/lib/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

type HolidayCardProps = {
    item: ApiHoliday;
    onEdit: (item: ApiHoliday) => void;
};

export function HolidayCard({ item, onEdit }: HolidayCardProps) {
    return (
        <div className="flex flex-col rounded-lg border p-4 bg-card text-card-foreground">
            <div className="flex items-center justify-between gap-4">
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
                <StatusBadge status={item.isActive ? "Active" : "Hidden"} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <Field label="Category" value={item.category.replace("_", " ")} />
                <Field label="Order" value={item.sortOrder} />
            </div>

            <Button size="sm" onClick={() => onEdit(item)} className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20">
                Edit
            </Button>
        </div>
    );
}
