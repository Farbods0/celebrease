import { Input } from "@/components/ui/input";
import { HolidayCategory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const FILTERS: { label: string; value: HolidayCategory | "" }[] = [
    { label: "All", value: "" },
    { label: "Traditional", value: "TRADITIONAL" },
    { label: "Cultural", value: "CULTURAL" },
    { label: "Event Based", value: "EVENT_BASED" },
];

export default function HolidayFilterSkeleton() {
    return (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">All Celebrations</h2>
                <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={cn(
                                "px-4 py-1.5 lg:px-5 lg:py-2 rounded-full whitespace-nowrap transition-colors",
                                item.value === "" ? "bg-white shadow-lg" : "",
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative">
                <Input className="pl-9.5 lg:pl-11 rounded-full" placeholder="Search any kit" />
                <div className="absolute top-1/2 left-3 lg:left-4 -translate-y-1/2">
                    <HugeiconsIcon size={20} icon={Search} />
                </div>
            </div>
        </div>
    );
}
