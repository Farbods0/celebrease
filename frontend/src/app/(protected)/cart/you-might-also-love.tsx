"use client";

import { HolidayCard } from "@/components/main/holiday-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getHolidaysByLoves } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function YouMightAlsoLove({ excludeIds = [] }: { excludeIds?: string[] }) {
    const { data, isLoading } = useQuery({
        queryKey: ["holidays", "loves"],
        queryFn: () => getHolidaysByLoves(),
    });

    if (isLoading) {
        return (
            <section className="mt-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">You Might Also Love</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="aspect-3/5 rounded-2xl" />
                    ))}
                </div>
            </section>
        );
    }

    const items = (data?.items ?? []).filter((h) => !excludeIds.includes(h.id)).slice(0, 4);
    if (items.length === 0) return null;

    return (
        <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">You Might Also Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((holiday) => (
                    <HolidayCard key={holiday.id} holiday={holiday} />
                ))}
            </div>
        </section>
    );
}
