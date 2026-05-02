import type { ApiHoliday } from "@/lib/api";

type HolidayCardProps = {
    item: ApiHoliday;
    onEdit: (item: ApiHoliday) => void;
    onDelete: (id: string) => void;
};

export function HolidayCard({ item, onEdit, onDelete }: HolidayCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-lg border p-4 bg-card text-card-foreground">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-none">{item.name}</h3>
                    </div>
                </div>
                <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                    style={
                        item.isActive
                            ? { backgroundColor: "oklch(0.93 0.08 150)", color: "oklch(0.4 0.14 150)" }
                            : { backgroundColor: "oklch(0.93 0.08 25)", color: "oklch(0.45 0.2 25)" }
                    }
                >
                    {item.isActive ? "Active" : "Hidden"}
                </span>
            </div>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-medium text-foreground">{item.category.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Order</span>
                    <span className="font-medium text-foreground">{item.sortOrder}</span>
                </div>
            </div>

            <div className="mt-1 flex items-center gap-2 pt-2 border-t">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="flex-1 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="flex-1 rounded-md bg-destructive/10 px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
