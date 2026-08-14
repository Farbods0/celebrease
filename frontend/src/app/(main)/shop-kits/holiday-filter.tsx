"use client";

import { Input } from "@/components/ui/input";
import { HolidayCategory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

    const filterRowRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
    const [pill, setPill] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const [pillReady, setPillReady] = useState(false);

    useLayoutEffect(() => {
        const updatePill = () => {
            const btn = buttonRefs.current.get(category);
            const container = filterRowRef.current;
            if (!btn || !container) return;
            const b = btn.getBoundingClientRect();
            const c = container.getBoundingClientRect();
            setPill({ x: b.left - c.left, y: b.top - c.top, width: b.width, height: b.height });
            setPillReady(true);
        };
        updatePill();
        window.addEventListener("resize", updatePill);
        return () => window.removeEventListener("resize", updatePill);
    }, [category]);

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
                <div ref={filterRowRef} className="relative p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                    <span
                        aria-hidden
                        className={cn(
                            "absolute top-0 left-0 bg-white shadow-lg rounded-full pointer-events-none",
                            pillReady ? "opacity-100" : "opacity-0",
                            pillReady && "transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        )}
                        style={{
                            transform: `translate(${pill.x}px, ${pill.y}px)`,
                            width: pill.width,
                            height: pill.height,
                        }}
                    />
                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            ref={(el) => {
                                buttonRefs.current.set(item.value, el);
                            }}
                            type="button"
                            onClick={() => {
                                if (item.value === "") {
                                    router.push(`${pathname}?${deleteQueryString("category")}`, { scroll: false });
                                } else {
                                    router.push(`${pathname}?${createQueryString("category", item.value)}`, { scroll: false });
                                }
                            }}
                            className={cn(
                                "relative z-10 px-4 py-1.5 lg:px-5 lg:py-2 rounded-full whitespace-nowrap transition-colors duration-200 active:scale-95 transition-transform",
                                category === item.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
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
