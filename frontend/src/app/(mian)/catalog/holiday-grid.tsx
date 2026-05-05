"use client";

import { HolidayCard } from "@/components/main/holiday-card";
import { Input } from "@/components/ui/input";
import { type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

const FILTERS: { label: string; value: "ALL" | HolidayCategory }[] = [
    { label: "All", value: "ALL" },
    { label: "Traditional", value: "TRADITIONAL" },
    { label: "Cultural", value: "CULTURAL" },
    { label: "Event Based", value: "EVENT_BASED" },
];

export function HolidayGrid({ holidays }: { holidays: ApiHoliday[] }) {
    const [category, setCategory] = useState<"ALL" | HolidayCategory>("ALL");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return holidays.filter((h) => {
            if (category !== "ALL" && h.category !== category) return false;
            if (q && !h.name.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [holidays, category, search]);

    return (
        <div className="container mx-auto p-6 py-8 md:py-10 lg:py-12 flex flex-col gap-6 lg:gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">All Celebrations</h2>
                    <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                        {FILTERS.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setCategory(item.value)}
                                className={`px-4 py-1.5 lg:px-5 lg:py-2 rounded-full whitespace-nowrap transition-colors ${
                                    category === item.value ? "bg-white shadow-lg" : ""
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9.5 lg:pl-11 rounded-full"
                        placeholder="Search any kit"
                    />
                    <div className="absolute top-1/2 left-3 lg:left-4 -translate-y-1/2">
                        <HugeiconsIcon size={20} icon={Search} />
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-16">No celebrations match your filters.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((holiday) => (
                        <HolidayCard key={holiday.id} holiday={holiday} />
                    ))}
                </div>
            )}
        </div>
    );
}
