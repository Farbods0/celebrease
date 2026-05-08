"use client";

import { Input } from "@/components/ui/input";
import { HolidayCategory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const FILTERS: { label: string; value: HolidayCategory | "" }[] = [
    { label: "All", value: "" },
    { label: "Traditional", value: "TRADITIONAL" },
    { label: "Cultural", value: "CULTURAL" },
    { label: "Event Based", value: "EVENT_BASED" },
];

export default function HolidayFilter({ category = "", search = "" }: { category?: HolidayCategory | ""; search?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [localSearch, setLocalSearch] = useState(search);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const deleteQueryString = useCallback(
        (name: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);
            return params.toString();
        },
        [searchParams],
    );

    // Sync local search when the prop changes (e.g. browser back/forward)
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    // Debounced search param update
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (!localSearch) {
                router.push(`${pathname}?${deleteQueryString("search")}`, { scroll: false });
            } else {
                router.push(`${pathname}?${createQueryString("search", localSearch)}`, { scroll: false });
            }
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [localSearch, createQueryString, deleteQueryString, pathname, router]);

    return (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">All Celebrations</h2>
                <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                                if (item.value === "") {
                                    router.push(`${pathname}?${deleteQueryString("category")}`, { scroll: false });
                                } else {
                                    router.push(`${pathname}?${createQueryString("category", item.value)}`, { scroll: false });
                                }
                            }}
                            className={cn(
                                "px-4 py-1.5 lg:px-5 lg:py-2 rounded-full whitespace-nowrap transition-colors",
                                category === item.value ? "bg-white shadow-lg" : "",
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative">
                <Input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-9.5 lg:pl-11 rounded-full"
                    placeholder="Search any kit"
                />
                <div className="absolute top-1/2 left-3 lg:left-4 -translate-y-1/2">
                    <HugeiconsIcon size={20} icon={Search} />
                </div>
            </div>
        </div>
    );
}
