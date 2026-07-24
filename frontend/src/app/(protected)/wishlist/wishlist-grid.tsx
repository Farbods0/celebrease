"use client";

import { baseURL, getMyWishlist, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { useLovesStore } from "@/lib/loves-store";
import { toNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

function lowestPrice(kits: ApiHoliday["kits"]): number | null {
    if (!kits || kits.length === 0) return null;
    return (kits ?? []).reduce<number | null>((min, k) => {
        const p = toNumber(k.price30Day);
        if (p === null) return min;
        return min === null ? p : Math.min(min, p);
    }, null);
}

function totalItems(kits: ApiHoliday["kits"]): number {
    return (kits ?? []).reduce((sum, k) => {
        return sum + (k.items ?? []).reduce((s, i) => s + (i.qty ?? 0), 0);
    }, 0);
}

export function WishlistGrid() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["wishlist"],
        queryFn: () => getMyWishlist(),
    });

    const loved = useLovesStore((s) => s.loved);
    const toggle = useLovesStore((s) => s.toggle);
    const hydrated = useLovesStore((s) => s.hydrated);
    const [items, setItems] = useState<ApiHoliday[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (data?.items) setItems(data.items);
    }, [data?.items]);

    useEffect(() => {
        if (!hydrated) return;
        setItems((prev) => prev.filter((h) => loved.has(h.id)));
    }, [loved, hydrated]);

    const count = items.length;

    const handleRemove = (e: React.MouseEvent, holidayId: string) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(holidayId);
    };

    const handleAddToCart = (e: React.MouseEvent, holiday: ApiHoliday) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/catalog/${holiday.id}`);
    };

    if (isLoading) {
        return (
            <section
                className="wishlist-section"
                style={{ padding: "clamp(40px,5vw,56px) 24px clamp(64px,7vw,88px)" }}
                aria-label="Your saved holiday kits"
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    <div className="wishlist-grid-inner">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    aspectRatio: "4/5",
                                    borderRadius: "var(--cb-r-card)",
                                    background: "var(--cb-lavender)",
                                    animation: "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section style={{ padding: "clamp(40px,5vw,56px) 24px clamp(64px,7vw,88px)" }}>
                <p style={{ textAlign: "center", color: "#ef4444", padding: "64px 0" }}>
                    Something went wrong. Please try again later.
                </p>
            </section>
        );
    }

    return (
        <>
            <section
                className="wishlist-section"
                style={{ padding: "clamp(40px,5vw,56px) 24px clamp(64px,7vw,88px)" }}
                aria-label="Your saved holiday kits"
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    {count > 0 && (
                        <div className="wishlist-toolbar-row">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span
                                    style={{
                                        fontSize: "15px",
                                        color: "var(--cb-ink-muted)",
                                        fontWeight: 500,
                                    }}
                                >
                                    <strong style={{ color: "var(--cb-ink)" }}>{count}</strong> kits saved
                                </span>
                            </div>
                            <button
                                className="btn-clear-all"
                                aria-label="Remove all kits from wishlist"
                                onClick={(e) => {
                                    e.preventDefault();
                                    items.forEach((h) => {
                                        if (loved.has(h.id)) toggle(h.id);
                                    });
                                }}
                            >
                                Remove all
                            </button>
                        </div>
                    )}

                    {count > 0 ? (
                        <div className="wishlist-grid-inner">
                            {items.map((holiday) => {
                                const price = lowestPrice(holiday.kits);
                                const pieces = totalItems(holiday.kits);
                                const catCls = CATEGORY_CLS[holiday.category] ?? "";
                                const catLabel = CATEGORY_LABEL[holiday.category] ?? holiday.category;

                                return (
                                    <Link
                                        key={holiday.id}
                                        href={`/catalog/${holiday.id}`}
                                        className="cb-holiday-card"
                                        aria-label={`View ${holiday.name} kits`}
                                    >
                                        <img
                                            src={
                                                holiday.image?.startsWith("http")
                                                    ? holiday.image
                                                    : holiday.image?.startsWith("/uploads")
                                                    ? `${baseURL}${holiday.image}`
                                                    : holiday.image?.startsWith("/")
                                                    ? holiday.image
                                                    : `${baseURL}/${holiday.image}`
                                            }
                                            alt={`${holiday.name} — holiday decor kit`}
                                        />
                                        <div className="scrim" />
                                        <span className={`cb-cat-badge${catCls ? ` ${catCls}` : ""}`}>
                                            {catLabel}
                                        </span>
                                        <button
                                            type="button"
                                            className="cb-heart-btn"
                                            aria-label={`Remove ${holiday.name} from wishlist`}
                                            onClick={(e) => handleRemove(e, holiday.id)}
                                            style={{ color: "var(--cb-magenta)" }}
                                        >
                                            &#9829;
                                        </button>
                                        <button
                                            type="button"
                                            className="wl-cart-btn"
                                            aria-label={`View ${holiday.name} kits`}
                                            onClick={(e) => handleAddToCart(e, holiday)}
                                        >
                                            <span aria-hidden="true">&#128717;</span> View kits
                                        </button>
                                        <div className="meta">
                                            <div className="name">{holiday.name}</div>
                                            <div className="price">
                                                {price !== null
                                                    ? `From $${price.toFixed(0)}${pieces > 0 ? ` · ${pieces} pieces` : ""}`
                                                    : "Coming soon"}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "72px 24px" }}
                            role="status"
                            aria-live="polite"
                        >
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-soft)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "36px",
                                    margin: "0 auto 24px",
                                }}
                                aria-hidden="true"
                            >
                                &#9825;
                            </div>
                            <h3
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "1.6rem",
                                    marginBottom: "10px",
                                    color: "var(--cb-ink)",
                                }}
                            >
                                Your wishlist is empty
                            </h3>
                            <p
                                style={{
                                    color: "var(--cb-ink-muted)",
                                    fontSize: "16px",
                                    lineHeight: 1.65,
                                    maxWidth: "360px",
                                    margin: "0 auto 28px",
                                }}
                            >
                                You&apos;ve removed all saved kits. Head back to the catalog to discover new holidays to celebrate.
                            </p>
                            <Link href="/catalog" className="btn-primary">
                                Browse holidays
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* EMPTY STATE CARD (shown when count === 0) */}
            {count === 0 && (
                <section
                    style={{
                        padding: "clamp(40px,5vw,56px) 24px",
                        background: "var(--cb-lavender)",
                    }}
                    aria-label="Empty wishlist"
                >
                    <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                        <div
                            style={{
                                maxWidth: "460px",
                                margin: "0 auto",
                                textAlign: "center",
                                padding: "56px 32px 64px",
                                background: "#fff",
                                borderRadius: "var(--cb-r-lg)",
                                border: "1px solid var(--cb-line)",
                                boxShadow: "var(--cb-shadow-sm)",
                            }}
                            role="region"
                            aria-label="Empty wishlist state"
                        >
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-soft)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "36px",
                                    margin: "0 auto 24px",
                                }}
                                aria-hidden="true"
                            >
                                &#9825;
                            </div>
                            <h3
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "1.6rem",
                                    fontWeight: 700,
                                    marginBottom: "10px",
                                    color: "var(--cb-ink)",
                                }}
                            >
                                Nothing saved yet
                            </h3>
                            <p
                                style={{
                                    color: "var(--cb-ink-muted)",
                                    fontSize: "16px",
                                    lineHeight: 1.65,
                                    marginBottom: "28px",
                                    maxWidth: "340px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                Tap the heart on any holiday kit to save it here. We&apos;ll keep your list warm until you&apos;re ready to celebrate.
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Link href="/catalog" className="btn-primary" style={{ height: "52px", fontSize: "16px" }}>
                                    Browse holidays &#8594;
                                </Link>
                                <Link href="/subscription" className="btn-secondary" style={{ height: "52px", fontSize: "15px" }}>
                                    View plans
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* BROWSE MORE CTA */}
            <section style={{ padding: "clamp(56px,6vw,80px) 24px" }} aria-label="Browse more holidays">
                <div
                    style={{
                        maxWidth: "1080px",
                        margin: "0 auto",
                        background: "var(--cb-gradient)",
                        borderRadius: "var(--cb-r-lg)",
                        padding: "clamp(40px,5vw,64px) clamp(32px,5vw,64px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "32px",
                        color: "#fff",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "var(--cb-shadow-glow)",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "380px",
                            height: "380px",
                            right: "-100px",
                            bottom: "-160px",
                            background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />
                    <div style={{ position: "relative" }}>
                        <h2
                            style={{
                                color: "#fff",
                                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                                fontFamily: "'Playfair Display', Georgia, serif",
                                marginBottom: "8px",
                            }}
                        >
                            Browse more holidays
                        </h2>
                        <p
                            style={{
                                color: "rgba(255,255,255,0.88)",
                                fontSize: "16px",
                                maxWidth: "440px",
                                lineHeight: 1.6,
                            }}
                        >
                            19 curated kits across traditional, cultural, and event-based celebrations — find the next holiday you want to dress your home for.
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        aria-label="Browse all holidays in the catalog"
                        style={{
                            position: "relative",
                            flexShrink: 0,
                            background: "#fff",
                            color: "var(--cb-purple)",
                            fontSize: "15px",
                            fontWeight: 700,
                            height: "52px",
                            padding: "0 32px",
                            borderRadius: "var(--cb-r-pill)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "transform .2s, box-shadow .2s",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                        }}
                        className="browse-cta-btn"
                    >
                        Explore the catalog &#8594;
                    </Link>
                </div>
            </section>

            <style>{`
                .wishlist-grid-inner {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                }
                .wishlist-toolbar-row {
                    max-width: var(--cb-max);
                    margin: 0 auto 36px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .btn-clear-all {
                    height: 38px;
                    padding: 0 18px;
                    border-radius: var(--cb-r-pill);
                    border: 1.5px solid rgba(220,0,117,0.25);
                    color: var(--cb-magenta);
                    font-size: 13.5px;
                    font-weight: 600;
                    background: #fff;
                    cursor: pointer;
                    transition: all .2s;
                    font-family: inherit;
                }
                .btn-clear-all:hover {
                    background: rgba(220,0,117,0.06);
                    border-color: var(--cb-magenta);
                }
                .wl-cart-btn {
                    position: absolute;
                    left: 18px;
                    right: 18px;
                    bottom: 56px;
                    z-index: 4;
                    height: 42px;
                    border-radius: var(--cb-r-pill);
                    background: rgba(255,255,255,0.18);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1.5px solid rgba(255,255,255,0.55);
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    opacity: 0;
                    transform: translateY(8px);
                    transition: opacity .25s, transform .25s, background .2s;
                    pointer-events: none;
                    cursor: pointer;
                    font-family: inherit;
                }
                .cb-holiday-card:hover .wl-cart-btn,
                .cb-holiday-card:focus-within .wl-cart-btn {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
                .wl-cart-btn:hover { background: rgba(255,255,255,0.32); }
                .browse-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.22) !important; }
                @media (max-width: 980px) {
                    .wishlist-grid-inner { grid-template-columns: repeat(3, 1fr); gap: 20px; }
                }
                @media (max-width: 720px) {
                    .wishlist-grid-inner { grid-template-columns: repeat(2, 1fr); gap: 16px; }
                    .wl-cart-btn { opacity: 1; transform: translateY(0); pointer-events: auto; }
                }
                @media (max-width: 480px) {
                    .wishlist-grid-inner { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                }
                @media (max-width: 375px) {
                    .wishlist-grid-inner { grid-template-columns: 1fr; }
                }
            `}</style>
        </>
    );
}
