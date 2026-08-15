"use client";

import { Button } from "@/components/ui/button";
import { baseURL, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useLovesStore } from "@/lib/loves-store";
import { cn, toNumber, slugify } from "@/lib/utils";
import { ArrowRight02Icon, Heart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORY_LABEL: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event Based",
};

function tierPrice(holiday: ApiHoliday, tier: "Silver" | "Gold"): string {
    const kit = holiday.kits.find((k) => k.tier === tier);
    if (!kit) return ", ";

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

    return ", ";
}

export function HolidayCard({ holiday, index }: { holiday: ApiHoliday; index?: number }) {
    const { data } = auth.useSession();
    const router = useRouter();
    const loved = useLovesStore((s) => s.loved.has(holiday.id));
    const toggle = useLovesStore((s) => s.toggle);

    const onToggleLove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!data?.user) {
            router.push("/signin");
            return;
        }
        toggle(holiday.id);
    };

    return (
        <Link href={`/shop-kits/${slugify(holiday.name)}`} className="group border rounded-2xl overflow-hidden flex flex-col">
            <div className="relative h-64 w-full">
                <Image 
                    src={holiday.image?.includes("/uploads/") ? holiday.image.substring(holiday.image.indexOf("/uploads/")) : holiday.image?.startsWith("http") ? holiday.image : holiday.image?.startsWith("/") ? holiday.image : `${baseURL}/${holiday.image}`}
                    alt={holiday.name}
                    fill
                    unoptimized={Boolean(holiday.image)}
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 33vw"
                    priority={typeof index === 'number' && index < 6}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full text-sm font-medium">
                    {CATEGORY_LABEL[holiday.category]}
                </div>
                <button
                    type="button"
                    onClick={onToggleLove}
                    aria-label={loved ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={loved}
                    className={cn(
                        "absolute top-4 right-4 border backdrop-blur p-1.75 rounded-full cursor-pointer hover:scale-105 transition",
                        loved ? "bg-rose-500 text-white border-rose-500" : "bg-white/30 text-white",
                    )}
                >
                    <HugeiconsIcon size={20} icon={Heart} fill={loved ? "currentColor" : "none"} />
                </button>
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
                        <p className="text-sm text-muted-foreground">Silver</p>
                        <p className="text-base lg:text-lg font-semibold">{tierPrice(holiday, "Silver")}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Gold</p>
                        <p className="text-base lg:text-lg font-semibold">{tierPrice(holiday, "Gold")}</p>
                    </div>
                </div>

                <Button>
                    View Kits
                    <HugeiconsIcon icon={ArrowRight02Icon} />
                </Button>
            </div>
        </Link>
    );
}
