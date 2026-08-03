"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { baseURL, getHolidays, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useLovesStore } from "@/lib/loves-store";
import { toNumber, slugify } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense, useState } from "react";
import { CatalogFilter, type SortValue } from "./catalog-filter";

const CATEGORY_LABEL: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event-Based",
};

const CATEGORY_CLS: Record<HolidayCategory, string> = {
    TRADITIONAL: "",
    CULTURAL: "cultural",
    EVENT_BASED: "event",
};

function HolidayGridContent({ initialData }: { initialData?: any }) {
    const searchParams = useSearchParams();
    
    // Use local state for instant UI updates, initialize from URL
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search")?.trim().toLowerCase() || "");
    const [sort, setSort] = useState<SortValue>((searchParams.get("sort") as SortValue) || "popular");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["holidays"],
        queryFn: () => getHolidays(),
        initialData: initialData,
    });

    const allHolidays: ApiHoliday[] = useMemo(() => data?.items ?? [], [data]);

    const filtered = useMemo(() => {
        let list = allHolidays.filter((h) => {
            if (category !== "" && h.category !== category) return false;
            if (searchQuery && !h.name.toLowerCase().includes(searchQuery)) return false;
            return true;
        });

        if (sort === "az") {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "price-asc") {
            list = [...list].sort((a, b) => {
                const pa = lowestPrice(a.kits) ?? Infinity;
                const pb = lowestPrice(b.kits) ?? Infinity;
                return pa - pb;
            });
        } else if (sort === "price-desc") {
            list = [...list].sort((a, b) => {
                const pa = lowestPrice(a.kits) ?? -Infinity;
                const pb = lowestPrice(b.kits) ?? -Infinity;
                return pb - pa;
            });
        }

        return list;
    }, [allHolidays, category, searchQuery, sort]);

    // Pass the local state and setters to CatalogFilter
    return (
        <>
            <CatalogFilter
                category={category as HolidayCategory | ""}
                setCategory={setCategory}
                search={searchQuery}
                setSearchQuery={setSearchQuery}
                sort={sort}
                setSort={setSort}
                visibleCount={filtered.length}
            />

            <section
                className="catalog-section"
                style={{ padding: "clamp(40px,5vw,56px) 24px clamp(72px,8vw,96px)" }}
                aria-label="Holiday catalog"
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    {isLoading ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "24px",
                            }}
                            className="catalog-skeleton-grid"
                        >
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="rounded-[22px]" style={{ aspectRatio: "4/5" }} />
                            ))}
                        </div>
                    ) : isError ? (
                        <p style={{ textAlign: "center", color: "#ef4444", padding: "64px 0" }}>
                            Something went wrong. Please try again later.
                        </p>
                    ) : filtered.length === 0 ? (
                        <div
                            style={{ textAlign: "center", padding: "72px 24px" }}
                            role="status"
                            aria-live="polite"
                        >
                            <h3
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "1.6rem",
                                    marginBottom: "12px",
                                    color: "var(--cb-ink)",
                                }}
                            >
                                No holidays found
                            </h3>
                            <p style={{ color: "var(--cb-ink-muted)", fontSize: "16px" }}>
                                Try a different search term or category filter.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="cb-catalog-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "24px",
                            }}
                        >
                            {filtered.map((holiday, i) => (
                                <CatalogCard key={holiday.id} holiday={holiday} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <style>{`
                @media (max-width: 980px) {
                    .cb-catalog-grid, .catalog-skeleton-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 20px !important;
                    }
                }
                @media (max-width: 720px) {
                    .cb-catalog-grid, .catalog-skeleton-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 16px !important;
                    }
                }
                @media (max-width: 375px) {
                    .cb-catalog-grid, .catalog-skeleton-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
}

export function HolidayGrid({ initialData }: { initialData?: any }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HolidayGridContent initialData={initialData} />
        </Suspense>
    );
}

function lowestPrice(kits: ApiHoliday["kits"]): number | null {
    if (!kits || kits.length === 0) return null;
    return kits.reduce<number | null>((min, k) => {
        const p = toNumber(k.price30Day);
        if (p === null) return min;
        return min === null ? p : Math.min(min, p);
    }, null);
}

function CatalogCard({ holiday, index }: { holiday: ApiHoliday; index?: number }) {
    const { data: session } = auth.useSession();
    const router = useRouter();
    const loved = useLovesStore((s) => s.loved.has(holiday.id));
    const toggle = useLovesStore((s) => s.toggle);

    const onToggleLove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session?.user) {
            router.push("/signin");
            return;
        }
        toggle(holiday.id);
    };

    const price = lowestPrice(holiday.kits);
    const catCls = CATEGORY_CLS[holiday.category];
    const catLabel = CATEGORY_LABEL[holiday.category];

    return (
        <Link href={`/catalog/${slugify(holiday.name)}`} prefetch={true} className="cb-holiday-card">
            <Image
                src={holiday.image?.startsWith("http") ? holiday.image : holiday.image?.startsWith("/") ? holiday.image : `${baseURL}/${holiday.image}`}
                alt={`${holiday.name}, holiday décor kit`}
                fill style={{ objectFit: "cover" }}
                unoptimized={Boolean(holiday.image)}
                sizes="(max-width: 720px) 100vw, (max-width: 980px) 33vw, 25vw"
                priority={typeof index === 'number' && index < 8}
            />
            <div className="scrim" />
            <span className={`cb-cat-badge${catCls ? ` ${catCls}` : ""}`}>{catLabel}</span>
            <button
                type="button"
                className="cb-heart-btn"
                aria-label={loved ? `Saved ${holiday.name} to wishlist` : `Save ${holiday.name} to wishlist`}
                onClick={onToggleLove}
                style={{ color: loved ? "#DC0075" : undefined }}
            >
                {loved ? "♥" : "♡"}
            </button>
            <div className="meta">
                <div className="name">{holiday.name}</div>
                <div className="price">
                    {price !== null ? `From $${price.toFixed(0)} · 30 day rental` : "Coming soon"}
                </div>
            </div>
        </Link>
    );
}
