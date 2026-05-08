"use client";

import { HolidayCard } from "@/components/main/holiday-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getHolidays, type HolidayCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import HolidayFilter from "./holiday-filter";
import HolidayFilterSkeleton from "./holiday-filter-skeleton";

type HolidayGridProps = {
    searchParams: {
        category?: HolidayCategory | "";
        search?: string;
    };
};

export function HolidayGrid({ searchParams }: HolidayGridProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["holidays"],
        queryFn: () => getHolidays(),
    });

    const filtered = useMemo(() => {
        const q = searchParams.search?.trim().toLowerCase() || "";
        const category = searchParams.category || "";

        return (
            data?.items?.filter((h) => {
                if (category !== "" && h.category !== category) return false;
                if (q && !h.name.toLowerCase().includes(q)) return false;
                return true;
            }) || []
        );
    }, [data, searchParams]);

    return (
        <div className="container mx-auto p-6 py-8 md:py-10 lg:py-12 flex flex-col gap-6 lg:gap-8">
            <Suspense fallback={<HolidayFilterSkeleton />}>
                <HolidayFilter {...searchParams} />
            </Suspense>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, index) => (
                        <Skeleton key={index} className="aspect-3/5 rounded-2xl" />
                    ))}
                </div>
            ) : isError ? (
                <p className="text-center text-destructive py-16">Something went wrong. Please try again later.</p>
            ) : filtered.length === 0 ? (
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
