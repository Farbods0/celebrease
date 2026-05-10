import type { ApiHoliday } from "@/lib/api";
import { cn } from "@/lib/utils";

type KitsHolidayListProps = {
    holidays: ApiHoliday[];
    isLoading: boolean;
    selectedHolidayId: string | null;
    onSelect: (id: string) => void;
    showHeading?: boolean;
};

export function KitsHolidayList({ holidays, isLoading, selectedHolidayId, onSelect, showHeading = true }: KitsHolidayListProps) {
    return (
        <div className="rounded-lg border p-4 w-full h-fit">
            {showHeading && <h2 className="font-medium mb-2">Select Holiday</h2>}

            {isLoading ? (
                <div className="space-y-1">
                    <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                </div>
            ) : holidays.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No holidays yet. Add one from the Holidays page.</p>
            ) : (
                <div className="space-y-1">
                    {holidays.map((holiday) => {
                        const active = holiday.id === selectedHolidayId;
                        return (
                            <button
                                key={holiday.id}
                                onClick={() => onSelect(holiday.id)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg transition-all",
                                    active ? "bg-primary/10 font-medium" : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {holiday.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function KitsSidebar(props: KitsHolidayListProps) {
    return (
        <aside className="hidden md:flex w-full max-w-80 p-6 overflow-y-auto">
            <KitsHolidayList {...props} />
        </aside>
    );
}
