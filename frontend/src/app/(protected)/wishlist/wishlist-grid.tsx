"use client";

import { HolidayCard } from "@/components/main/holiday-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyWishlist, type ApiHoliday } from "@/lib/api";
import { useLovesStore } from "@/lib/loves-store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

export function WishlistGrid() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["wishlist"],
        queryFn: () => getMyWishlist(),
    });

    const loved = useLovesStore((s) => s.loved);
    const hydrated = useLovesStore((s) => s.hydrated);
    const [items, setItems] = useState<ApiHoliday[]>([]);

    useEffect(() => {
        if (data?.items) setItems(data.items);
    }, [data?.items]);

    useEffect(() => {
        if (!hydrated) return;
        setItems((prev) => prev.filter((h) => loved.has(h.id)));
    }, [loved, hydrated]);

    return (
        <div className="container mx-auto p-6 py-8 md:py-10 lg:py-12 flex flex-col gap-6 lg:gap-8">
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                        <Skeleton key={index} className="aspect-3/5 rounded-2xl" />
                    ))}
                </div>
            ) : isError ? (
                <p className="text-center text-destructive py-16">Something went wrong. Please try again later.</p>
            ) : !items.length ? (
                <div className="text-center py-16 flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">Your wishlist is empty. Start exploring to save your favorites.</p>
                    <Link href="/catalog">
                        <Button>Browse Catalog</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((holiday) => (
                        <HolidayCard key={holiday.id} holiday={holiday} />
                    ))}
                </div>
            )}
        </div>
    );
}
