"use client";

import {
    addToCart,
    ApiHolidayAddOn,
    ApiHolidayDetail,
    ApiHolidayKit,
    ApiSubscription,
    assignMyHolidaySlot,
    baseURL,
    getMySubscription,
    HolidayCategory,
    KitTier,
} from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { useLovesStore } from "@/lib/loves-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

/* ---- helpers ---------------------------------------------------------------- */

const CATEGORY_LABEL: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event",
};

const CATEGORY_CLS: Record<HolidayCategory, string> = {
    TRADITIONAL: "",
    CULTURAL: "cultural",
    EVENT_BASED: "event",
};

const TIER_LABEL: Record<KitTier, string> = {
    STARTER: "Starter",
    PREMIUM: "Premium",
    ULTIMATE: "Ultimate",
};

const TIER_ORDER: KitTier[] = ["STARTER", "PREMIUM", "ULTIMATE"];

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function addDaysIso(start: string, days: number): string {
    if (!start) return "";
    const d = new Date(`${start}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

const img = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${baseURL}${path}`;
    return path.startsWith("/") ? path : `${baseURL}/${path}`;
};

/* ---- prop types ------------------------------------------------------------- */

type HolidayDetailsProps = {
    holiday: ApiHolidayDetail;
    kits: ApiHolidayKit[];
    addOns: ApiHolidayAddOn[];
};

/* ============================================================================ */
/* HolidayDetails, main client component                                        */
/* ============================================================================ */

export function HolidayDetails({ holiday, kits, addOns = [] }: HolidayDetailsProps) {
    // sort kits in STARTER → PREMIUM → ULTIMATE order
    const sortedKits = [...kits].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
    );

    const defaultKit = sortedKits.find((k) => k.tier === "PREMIUM") ?? sortedKits[0] ?? null;

    const [selectedKitId, setSelectedKitId] = useState<string | null>(defaultKit?.id ?? null);
    const [duration, setDuration] = useState<30 | 60>(30);
    const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
    const [quickViewId, setQuickViewId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>(todayIso());
    const [activeThumb, setActiveThumb] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const { data: session } = auth.useSession();
    const router = useRouter();
    const loved = useLovesStore((s) => s.loved.has(holiday.id));
    const toggleLove = useLovesStore((s) => s.toggle);

    const [subscription, setSubscription] = useState<ApiSubscription | null>(null);

    useEffect(() => {
        if (session?.user) {
            getMySubscription().then(setSubscription).catch(() => {});
        }
    }, [session?.user]);

    const onToggleLove = () => {
        if (!session?.user) {
            router.push("/signin");
            return;
        }
        toggleLove(holiday.id);
    };

    /* ---- derived state ------------------------------------------------------ */

    const selectedKit = sortedKits.find((k) => k.id === selectedKitId) ?? null;
    const price30 = selectedKit ? Number(selectedKit.price30Day) : 0;
    const price60 = selectedKit ? Number(selectedKit.price60Day) : 0;
    const kitDeposit = selectedKit ? Number(selectedKit.deposit) : 0;

    const currentPrice = duration === 30 ? price30 : price60;
    const endDate = addDaysIso(startDate, duration);

    const addonTotal = [...selectedAddons].reduce((sum, id) => {
        const a = addOns.find((x) => x.addOn.id === id);
        return sum + (a ? Number(a.addOn.price) : 0);
    }, 0);
    const addOnDeposit = [...selectedAddons].reduce((sum, id) => {
        const a = addOns.find((x) => x.addOn.id === id);
        return sum + (a ? Number(a.addOn.deposit) : 0);
    }, 0);

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const quickViewAddOn = addOns.find((x) => x.addOn.id === quickViewId) ?? null;

    /* ---- gallery images ----------------------------------------------------- */

    const galleryImages: { src: string; alt: string }[] =
        selectedKit?.images && selectedKit.images.length > 0
            ? selectedKit.images.map((image, i) => ({
                  src: img(image),
                  alt: `${holiday.name} - ${selectedKit.tier} Image ${i + 1}`,
              }))
            : [
                  { src: img(holiday.image), alt: holiday.name },
                  ...(selectedKit?.previewItems?.slice(0, 4).map((p) => ({
                      src: img(p.item.image),
                      alt: p.item.name,
                  })) ?? []),
              ];

    const mainImage = galleryImages[activeThumb] ?? galleryImages[0];

    /* ---- add to cart / assign slot ------------------------------------------ */

    const pendingSlots = subscription?.holidaySlots?.filter(s => s.status === "PENDING") ?? [];
    const canAssign = pendingSlots.length > 0;

    const handleAction = async () => {
        if (!session?.user) {
            router.push("/signin");
            return;
        }
        if (!selectedKit) {
            toast.error("Select a kit first");
            return;
        }
        if (!startDate || !endDate) {
            toast.error("Pick a valid start date");
            return;
        }
        
        setSubmitting(true);
        try {
            if (canAssign) {
                // Assign to first pending slot
                const slotToAssign = pendingSlots[0];
                await assignMyHolidaySlot(slotToAssign.id, holiday.id);
                toast.success(`Assigned to your subscription (Slot ${slotToAssign.slotNumber})!`);
                router.push("/account/subscription");
            } else {
                // Normal cart flow
                await addToCart({
                    holidayId: holiday.id,
                    kitId: selectedKit.id,
                    duration: duration === 60 ? "SIXTY_DAY" : "THIRTY_DAY",
                    startDate,
                    endDate,
                    addOns: [...selectedAddons].map((addOnId) => ({ addOnId, qty: 1 })),
                });
                toast.success("Added to cart!");
                router.push("/cart");
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Action failed");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---- included pieces list ---------------------------------------------- */

    const pieces = selectedKit?.items ?? [];

    /* ---- render ------------------------------------------------------------- */

    const catCls = CATEGORY_CLS[holiday.category] ?? "";
    const catLabel = CATEGORY_LABEL[holiday.category] ?? "Holiday";

    // For the 60-day option: show savings % if > 0
    const savings60Pct =
        price30 > 0 && price60 > 0 && price60 < price30 * 2
            ? Math.round((1 - price60 / (price30 * 2)) * 100)
            : 0;

    return (
        <>
            {/* BREADCRUMB */}
            <nav
                aria-label="Breadcrumb"
                style={{
                    maxWidth: "var(--cb-max)",
                    margin: "0 auto",
                    padding: "22px 24px 0",
                    fontSize: 13,
                    color: "var(--cb-ink-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap" as const,
                }}
            >
                <a href="/" style={{ color: "var(--cb-purple)", fontWeight: 500 }}>Home</a>
                <span style={{ color: "var(--cb-ink-soft)" }}>/</span>
                <a href="/catalog" style={{ color: "var(--cb-purple)", fontWeight: 500 }}>Catalog</a>
                <span style={{ color: "var(--cb-ink-soft)" }}>/</span>
                <span aria-current="page">{holiday.name}</span>
            </nav>

            {/* TWO-COLUMN KIT DETAIL */}
            <div className="cb-kit-page">

                {/* ---- LEFT: Gallery ----------------------------------------- */}
                <div className="cb-kit-left">
                    <div className="cb-gallery">
                        <div className="cb-gallery-main">
                            {galleryImages.map((g, i) => (
                                <Image 
                                    key={i}
                                    src={g.src} 
                                    alt={g.alt} 
                                    priority={true}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    width={800} 
                                    height={800} 
                                    className="object-cover w-full h-full" 
                                    style={{ display: i === activeThumb ? "block" : "none" }}
                                />
                            ))}
                        </div>
                        {/* Thumbs */}
                        <div className="cb-gallery-thumbs" role="list" aria-label="Kit photo gallery">
                            {galleryImages.map((g, i) => (
                                <button
                                    key={i}
                                    role="listitem"
                                    type="button"
                                    className={`cb-gallery-thumb${activeThumb === i ? " active" : ""}`}
                                    onClick={() => setActiveThumb(i)}
                                    aria-label={`View ${g.alt}`}
                                >
                                    <Image src={g.src} alt="" width={300} height={300} sizes="(max-width: 768px) 25vw, 15vw" className="object-cover w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---- RIGHT: Product panel ----------------------------------- */}
                <aside className="cb-kit-right" aria-label="Kit details and booking">

                    {/* Meta / rating */}
                    <div className="cb-kit-meta-top">
                        <div className="cb-kit-rating" aria-label="Rated 4.9 out of 5">
                            <span className="stars" aria-hidden="true">★★★★★</span>
                            <span><strong>4.9</strong></span>
                            <span className="count">(127 reviews)</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <h1 className="cb-kit-title-h1">
                                {holiday.name} {selectedKit ? TIER_LABEL[selectedKit.tier] : ""} Kit
                            </h1>
                            {/* Wishlist heart */}
                            <button
                                type="button"
                                onClick={onToggleLove}
                                aria-pressed={loved}
                                className="cb-kit-wish-icon"
                                aria-label={loved ? "Remove from wishlist" : "Save to wishlist"}
                            >
                                {loved ? "♥" : "♡"}
                            </button>
                        </div>
                        {holiday.description && (
                            <p className="cb-kit-short-desc">{holiday.description}</p>
                        )}
                        {!holiday.description && (
                            <p className="cb-kit-short-desc">
                                Designer curated {holiday.name} décor kit, styled pieces, delivered to your door, picked up when the season ends. Decorate beautifully, store nothing.
                            </p>
                        )}
                        <span className={`cb-cat-badge ${catCls}`} style={{ position: "static", display: "inline-block", marginBottom: 4 }}>
                            {catLabel}
                        </span>
                    </div>

                    {/* Tier Selector */}
                    {sortedKits.length > 0 && (
                        <div className="cb-tier-selector" role="group" aria-labelledby="tier-label">
                            <div className="cb-tier-selector-label" id="tier-label">Choose a tier</div>
                            <div className="cb-tier-options">
                                {sortedKits.map((k) => {
                                    const isSelected = selectedKitId === k.id;
                                    const isPopular = k.tier === "PREMIUM";
                                    return (
                                        <button
                                            key={k.id}
                                            type="button"
                                            className={`cb-tier-card${isSelected ? " selected" : ""}`}
                                            onClick={() => {
                                                setSelectedKitId(k.id);
                                                setActiveThumb(0);
                                            }}
                                            role="radio"
                                            aria-checked={isSelected}
                                            aria-label={`${TIER_LABEL[k.tier]} tier, from $${Number(k.price30Day)}`}
                                        >
                                            {isPopular && (
                                                <span className="cb-tier-badge-pill">★ Most loved</span>
                                            )}
                                            <div className="cb-tier-name">{TIER_LABEL[k.tier]}</div>
                                            <div className="cb-tier-price">${Number(k.price30Day)}</div>
                                            <div className="cb-tier-sub">From / 30 days</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Duration Toggle */}
                    <div className="cb-duration-toggle" role="group" aria-labelledby="dur-label">
                        <div className="cb-duration-label" id="dur-label">Rental duration</div>
                        <div className="cb-dur-options">
                            <button
                                type="button"
                                className={`cb-dur-opt${duration === 30 ? " selected" : ""}`}
                                onClick={() => setDuration(30)}
                                role="radio"
                                aria-checked={duration === 30}
                                aria-label="30 day rental"
                            >
                                <div className="cb-dur-days">30 days</div>
                                <div className="cb-dur-price">${price30}</div>
                            </button>
                            <button
                                type="button"
                                className={`cb-dur-opt${duration === 60 ? " selected" : ""}`}
                                onClick={() => setDuration(60)}
                                role="radio"
                                aria-checked={duration === 60}
                                aria-label={`60-day rental${savings60Pct > 0 ? `, save ${savings60Pct}%` : ""}`}
                            >
                                <div className="cb-dur-days">60 days</div>
                                <div className="cb-dur-price">${price60}</div>
                                {savings60Pct > 0 && (
                                    <div className="cb-dur-save">Save {savings60Pct}%</div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Price + Deposit */}
                    <div className="cb-price-row" aria-live="polite" aria-label="Current price">
                        <span className="cb-price-main">${currentPrice + addonTotal}</span>
                        <span className="cb-price-period">/ rental period</span>
                    </div>
                    <div className="cb-deposit-line">
                        <span className="cb-badge-green">Fully refundable</span>
                        <span>+ ${kitDeposit + addOnDeposit} deposit returned when you send it back</span>
                    </div>

                    {/* Date picker (compact) */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--cb-ink-muted)", marginBottom: 8 }}>
                            Start date
                        </div>
                        <input
                            type="date"
                            value={startDate}
                            min={todayIso()}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                width: "100%",
                                height: 44,
                                padding: "0 14px",
                                borderRadius: 12,
                                border: "1.5px solid var(--cb-line)",
                                fontSize: 15,
                                fontFamily: "inherit",
                                color: "var(--cb-ink)",
                                background: "#fff",
                            }}
                        />
                    </div>

                    {/* CTA Buttons */}
                    <div className="cb-cta-group">
                        {subscription ? (
                            canAssign ? (
                                <button
                                    type="button"
                                    className="cb-btn-cart"
                                    onClick={handleAction}
                                    disabled={submitting || !selectedKit}
                                    style={{ background: "linear-gradient(to right, #15803D, #16A34A)", boxShadow: "0 4px 16px rgba(21,128,61,0.2)" }}
                                >
                                    {submitting ? "Assigning…" : `Assign to Holiday Slot (Slot ${pendingSlots[0].slotNumber})`}
                                </button>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                                    <button
                                        type="button"
                                        className="cb-btn-cart"
                                        onClick={handleAction}
                                        disabled={submitting || !selectedKit}
                                    >
                                        {submitting ? "Adding…" : `Add to Cart A La Carte, $${currentPrice + addonTotal}`}
                                    </button>
                                    <p style={{ fontSize: 13, color: "#92400E", textAlign: "center", fontWeight: 500, backgroundColor: "#FEF3C7", padding: "6px 12px", borderRadius: 8 }}>
                                        All your subscription slots for this year are full.
                                    </p>
                                </div>
                            )
                        ) : (
                            <button
                                type="button"
                                className="cb-btn-cart"
                                onClick={handleAction}
                                disabled={submitting || !selectedKit}
                            >
                                {submitting ? "Adding…" : `Add to Cart, $${currentPrice + addonTotal}`}
                            </button>
                        )}
                        <button
                            type="button"
                            className={`cb-btn-wishlist${loved ? " active" : ""}`}
                            onClick={onToggleLove}
                            aria-pressed={loved}
                        >
                            {loved ? "♥" : "♡"} {loved ? "Saved to Wishlist" : "Save to Wishlist"}
                        </button>
                    </div>

                    {/* Trust strip */}
                    <div className="cb-trust-strip" role="list" aria-label="Trust guarantees">
                        <div className="cb-trust-item" role="listitem">
                            <span className="ti-icon" aria-hidden="true">📦</span>
                            <span className="ti-label">Free shipping</span>
                            both ways
                        </div>
                        <div className="cb-trust-item" role="listitem">
                            <span className="ti-icon" aria-hidden="true">🚪</span>
                            <span className="ti-label">Doorstep pickup</span>
                            when done
                        </div>
                        <div className="cb-trust-item" role="listitem">
                            <span className="ti-icon" aria-hidden="true">💜</span>
                            <span className="ti-label">Deposit back</span>
                            in 5 days
                        </div>
                    </div>

                </aside>
            </div>

            {/* ---- BELOW-FOLD ------------------------------------------------ */}
            <div className="cb-kit-below">

                {/* What is Included */}
                {pieces.length > 0 && (
                    <section className="cb-included-section" aria-labelledby="included-heading">
                        <div className="cb-sec-label">What&apos;s inside</div>
                        <h2 id="included-heading">
                            {pieces.reduce((s, p) => s + p.qty, 0)} hand-picked pieces, styled and ready
                        </h2>
                        <div className="cb-pieces-grid" role="list" aria-label="Included decoration pieces">
                            {pieces.map(({ item, qty }) => (
                                <div key={item.id} className="cb-piece-card" role="listitem">
                                    <div className="cb-piece-thumb">
                                        <Image src={img(item.image)} alt={item.name} width={400} height={400} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover w-full h-full" />
                                    </div>
                                    <div className="cb-piece-info">
                                        <div className="cb-piece-name">{item.name}</div>
                                        <div className="cb-piece-qty">{qty} pc{qty !== 1 ? "s" : ""} · {item.category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Add Ons */}
                {addOns.length > 0 && (
                    <section className="cb-addons-section" aria-labelledby="addons-heading">
                        <div className="cb-sec-label">Elevate your kit</div>
                        <h2 id="addons-heading">Optional add ons</h2>
                        <div className="cb-addons-grid" role="group" aria-label="Optional add ons">
                            {addOns.map(({ addOn }) => {
                                const checked = selectedAddons.has(addOn.id);
                                const deposit = Number(addOn.deposit);
                                return (
                                    <article key={addOn.id} className={`cb-addon-tile${checked ? " checked" : ""}`}>
                                        <button
                                            type="button"
                                            className="cb-addon-media"
                                            onClick={() => setQuickViewId(addOn.id)}
                                            aria-label={`View details for ${addOn.name}`}
                                        >
                                            {img(addOn.image) ? (
                                                <Image src={img(addOn.image)} alt={addOn.name} width={400} height={400} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="cb-addon-media-ph" aria-hidden="true">🎁</span>
                                            )}
                                            {checked && <span className="cb-addon-tick" aria-hidden="true">✓</span>}
                                            <span className="cb-addon-view" aria-hidden="true">View details</span>
                                        </button>
                                        <div className="cb-addon-info">
                                            <div className="cb-addon-line">
                                                <h3 className="cb-addon-name">{addOn.name}</h3>
                                                <span className="cb-addon-price">+${Number(addOn.price)}</span>
                                            </div>
                                            {addOn.description && (
                                                <p className="cb-addon-desc">{addOn.description}</p>
                                            )}
                                            <div className="cb-addon-foot">
                                                <span className={`cb-addon-deposit${deposit > 0 ? "" : " none"}`}>
                                                    {deposit > 0 ? `$${deposit} deposit · refundable` : "No deposit"}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`cb-addon-add${checked ? " on" : ""}`}
                                                    onClick={() => toggleAddon(addOn.id)}
                                                    aria-pressed={checked}
                                                    aria-label={`${checked ? "Remove" : "Add"} ${addOn.name}`}
                                                >
                                                    {checked ? "✓ Added" : "+ Add"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Add on quick-view modal */}
                <Dialog
                    open={quickViewId !== null}
                    onOpenChange={(open) => {
                        if (!open) setQuickViewId(null);
                    }}
                >
                    <DialogContent className="cb-addon-modal p-0 gap-0 sm:max-w-[440px] overflow-hidden">
                        {quickViewAddOn && (
                            <div className="cb-qv">
                                <div className="cb-qv-media">
                                    {img(quickViewAddOn.addOn.image) ? (
                                        <Image src={img(quickViewAddOn.addOn.image)} alt={quickViewAddOn.addOn.name} width={400} height={400} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover w-full h-full" />
                                    ) : (
                                        <span className="cb-addon-media-ph" aria-hidden="true">🎁</span>
                                    )}
                                </div>
                                <div className="cb-qv-body">
                                    <DialogTitle className="cb-qv-title">{quickViewAddOn.addOn.name}</DialogTitle>
                                    <DialogDescription className="cb-qv-desc">
                                        {quickViewAddOn.addOn.description ?? "A premium finishing touch for your celebration."}
                                    </DialogDescription>
                                    <div className="cb-qv-pricing">
                                        <div className="cb-qv-prow">
                                            <span className="cb-qv-k">Rental price</span>
                                            <span className="cb-qv-v">+${Number(quickViewAddOn.addOn.price)}</span>
                                        </div>
                                        {Number(quickViewAddOn.addOn.deposit) > 0 && (
                                            <div className="cb-qv-prow">
                                                <span className="cb-qv-k">Refundable deposit</span>
                                                <span className="cb-qv-v">${Number(quickViewAddOn.addOn.deposit)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className={`cb-qv-add${selectedAddons.has(quickViewAddOn.addOn.id) ? " on" : ""}`}
                                        onClick={() => toggleAddon(quickViewAddOn.addOn.id)}
                                    >
                                        {selectedAddons.has(quickViewAddOn.addOn.id) ? "✓ Added to your kit" : "+ Add to kit"}
                                    </button>
                                    {Number(quickViewAddOn.addOn.deposit) > 0 && (
                                        <p className="cb-qv-note">
                                            Your ${Number(quickViewAddOn.addOn.deposit)} deposit is returned when the item comes back in good condition.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Subscription Upsell Band */}
                <section aria-label="Subscription offer">
                    <div className="cb-upsell-band">
                        <div className="cb-upsell-copy">
                            <div className="cb-upsell-eyebrow">Save up to 30% per kit</div>
                            <h2>Celebrate every holiday for one monthly price</h2>
                            <p>CeleBrease members get priority access, free add ons every season, and never pay per kit shipping. Join over 2,400 families who decorate without the clutter.</p>
                            <div className="cb-upsell-perks">
                                <div className="cb-upsell-perk">6 holidays / year</div>
                                <div className="cb-upsell-perk">Free two way shipping</div>
                                <div className="cb-upsell-perk">Full deposit protection</div>
                                <div className="cb-upsell-perk">Cancel anytime</div>
                            </div>
                        </div>
                        <div className="cb-upsell-actions">
                            <a href="/subscription" className="cb-btn-upsell-primary">See Membership Plans</a>
                            <a href="/how-it-works" className="cb-btn-upsell-ghost">Learn how it works</a>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}
