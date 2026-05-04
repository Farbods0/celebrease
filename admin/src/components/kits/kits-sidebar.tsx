import { cn, getHolidays } from "@/lib/utils";

export function KitsSidebar() {
    const { data: holidays, isLoading } = getHolidays();

    return (
        <aside className="hidden md:flex max-h-[calc(100vh-200px)] w-80 p-6 overflow-y-auto">
            <div className="rounded-lg border p-4 w-full h-fit">
                <h2 className="font-medium mb-2">Select Holiday</h2>

                {isLoading ? (
                    <div className="space-y-1">
                        <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                        <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                        <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-1">
                        {holidays.map((holiday, index) => (
                            <button
                                key={holiday.id}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg transition-all",
                                    index === 0 ? "bg-primary/10 font-medium" : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {holiday.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
