"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseURL, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { toNumber } from "@/lib/utils";
import { ArrowRight02Icon, Heart, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const CATEGORY_LABEL: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event Based",
};

const FILTERS: { label: string; value: "ALL" | HolidayCategory }[] = [
    { label: "All", value: "ALL" },
    { label: "Traditional", value: "TRADITIONAL" },
    { label: "Cultural", value: "CULTURAL" },
    { label: "Event Based", value: "EVENT_BASED" },
];

function tierPrice(holiday: ApiHoliday, tier: "STARTER" | "PREMIUM"): string {
    const kit = holiday.kits.find((k) => k.tier === tier);
    if (!kit) return "—";

    const price30 = toNumber(kit.price30Day);
    const price60 = toNumber(kit.price60Day);

    if (price30 !== null && price60 !== null) {
        const min = Math.min(price30, price60);
        const max = Math.max(price30, price60);
        return `$${min.toFixed(0)}-$${max.toFixed(0)}`;
    }

    if (price30 !== null) {
        return `$${price30.toFixed(0)}`;
    }

    if (price60 !== null) {
        return `$${price60.toFixed(0)}`;
    }

    return "—";
}

export function CatalogGrid({ holidays }: { holidays: ApiHoliday[] }) {
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
                        <div key={holiday.id} className="group border rounded-2xl overflow-hidden flex flex-col">
                            <div className="relative">
                                <img
                                    src={`${baseURL}${holiday.image}`}
                                    alt={holiday.name}
                                    crossOrigin="anonymous"
                                    className="h-64 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                                <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full text-sm font-medium">
                                    {CATEGORY_LABEL[holiday.category]}
                                </div>
                                <div className="absolute top-4 right-4 bg-white/30 text-white border backdrop-blur p-1.75 rounded-full cursor-pointer hover:scale-105 transition">
                                    <HugeiconsIcon size={20} icon={Heart} />
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl lg:text-2xl font-semibold">{holiday.name}</h3>
                                    {holiday.description && (
                                        <p className="text-base lg:text-lg text-muted-foreground line-clamp-2">{holiday.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Starter</p>
                                        <p className="text-base lg:text-lg font-semibold">{tierPrice(holiday, "STARTER")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Premium</p>
                                        <p className="text-base lg:text-lg font-semibold">{tierPrice(holiday, "PREMIUM")}</p>
                                    </div>
                                </div>

                                <Button
                                    render={
                                        <Link href={`/catalog/${holiday.id}`}>
                                            View Kits
                                            <HugeiconsIcon icon={ArrowRight02Icon} />
                                        </Link>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
