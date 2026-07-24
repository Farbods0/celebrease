"use client";

import { HolidayCategory } from "@/lib/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const FILTERS: { label: string; value: HolidayCategory | "" }[] = [
    { label: "All", value: "" },
    { label: "Traditional", value: "TRADITIONAL" },
    { label: "Cultural", value: "CULTURAL" },
    { label: "Event-Based", value: "EVENT_BASED" },
];

export type SortValue = "popular" | "az" | "price-asc" | "price-desc";

type CatalogFilterProps = {
    category: HolidayCategory | "";
    search: string;
    sort: SortValue;
    visibleCount: number;
};

export function CatalogFilter({ category, search, sort, visibleCount }: CatalogFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const update = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "" || value === "popular") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            const qs = params.toString();
            startTransition(() => {
                router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
            });
        },
        [searchParams, router, pathname],
    );

    return (
        <div
            className="cb-filter-bar"
            style={{
                position: "sticky",
                top: "69px",
                zIndex: 50,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "saturate(180%) blur(14px)",
                WebkitBackdropFilter: "saturate(180%) blur(14px)",
                borderBottom: "1px solid var(--cb-line)",
            }}
            role="search"
            aria-label="Filter holidays"
        >
            <div
                style={{
                    maxWidth: "var(--cb-max)",
                    margin: "0 auto",
                    padding: "13px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                }}
            >
                {/* Category pills */}
                <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}
                    role="group"
                    aria-label="Filter by category"
                >
                    {FILTERS.map((f) => {
                        const isActive = category === f.value;
                        return (
                            <button
                                key={f.value}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => update("category", f.value)}
                                style={{
                                    padding: "9px 18px",
                                    borderRadius: "var(--cb-r-pill)",
                                    border: isActive ? "1.5px solid transparent" : "1.5px solid var(--cb-line)",
                                    background: isActive ? "var(--cb-gradient-h)" : "#fff",
                                    color: isActive ? "#fff" : "var(--cb-ink-muted)",
                                    fontSize: "14px",
                                    fontWeight: isActive ? 600 : 500,
                                    cursor: "pointer",
                                    lineHeight: 1,
                                    boxShadow: isActive ? "0 4px 12px rgba(155,47,201,0.25)" : "none",
                                    transition: "all .2s",
                                    fontFamily: "inherit",
                                }}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search input */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "14px",
                            color: "var(--cb-ink-soft)",
                            pointerEvents: "none",
                        }}
                    >
                        ⌕
                    </span>
                    <input
                        type="search"
                        defaultValue={search}
                        placeholder="Search holidays…"
                        aria-label="Search holidays"
                        onChange={(e) => update("search", e.target.value)}
                        style={{
                            height: "40px",
                            padding: "0 16px 0 38px",
                            borderRadius: "var(--cb-r-pill)",
                            border: "1.5px solid var(--cb-line)",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            color: "var(--cb-ink)",
                            background: "#fff",
                            width: "200px",
                            outline: "none",
                        }}
                    />
                </div>

                {/* Sort select */}
                <select
                    value={sort}
                    onChange={(e) => update("sort", e.target.value)}
                    aria-label="Sort holidays"
                    style={{
                        height: "40px",
                        padding: "0 32px 0 16px",
                        borderRadius: "var(--cb-r-pill)",
                        border: "1.5px solid var(--cb-line)",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        color: "var(--cb-ink)",
                        background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238979A0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 12px center",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                    }}
                >
                    <option value="popular">Most popular</option>
                    <option value="az">A – Z</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                </select>
            </div>

            {/* Showing count row */}
            <div
                style={{
                    maxWidth: "var(--cb-max)",
                    margin: "0 auto",
                    padding: "0 24px 10px",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                        fontWeight: 700,
                        color: "var(--cb-ink)",
                    }}
                >
                    {category === ""
                        ? "All holidays"
                        : category === "TRADITIONAL"
                          ? "Traditional holidays"
                          : category === "CULTURAL"
                            ? "Cultural holidays"
                            : "Event-based holidays"}
                </h2>
                <span
                    aria-live="polite"
                    style={{
                        fontSize: "14px",
                        color: "var(--cb-ink-soft)",
                        fontWeight: 500,
                    }}
                >
                    Showing {visibleCount} {visibleCount === 1 ? "holiday" : "holidays"}
                </span>
            </div>
        </div>
    );
}
