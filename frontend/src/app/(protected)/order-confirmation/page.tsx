"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const timeline = [
    { label: "Order Confirmed", date: "Today", status: "done" as const },
    { label: "Kit Being Prepared", date: "In 1-2 days", status: "active" as const },
    { label: "Shipped to You", date: "In 3-5 days", status: "upcoming" as const },
    { label: "Delivered & Celebrate!", date: "On your start date", status: "upcoming" as const },
    { label: "Free Pickup Scheduled", date: "On your end date", status: "upcoming" as const },
    { label: "Deposit Refunded", date: "Within 5 business days of return", status: "upcoming" as const },
];

const timelineIcon = (status: "done" | "active" | "upcoming", idx: number) => {
    if (status === "done") return "✓";
    if (idx === 5) return "♥";
    return String(idx + 1);
};

export default function OrderConfirmationPage() {
    const [orderNumber] = useState(() => `CB-${Math.floor(100000 + Math.random() * 900000)}`);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="cb">
            <style>{`
                @keyframes oc-pop-in {
                    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
                    60%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes oc-ring-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(155,47,201,0.4), var(--cb-shadow-glow); }
                    70%  { box-shadow: 0 0 0 22px rgba(155,47,201,0), var(--cb-shadow-glow); }
                    100% { box-shadow: 0 0 0 0 rgba(155,47,201,0), var(--cb-shadow-glow); }
                }
                @keyframes oc-draw-check {
                    to { stroke-dashoffset: 0; }
                }
                .oc-check-circle {
                    width: 108px;
                    height: 108px;
                    border-radius: 50%;
                    background: var(--cb-gradient-h);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--cb-shadow-glow);
                    position: relative;
                }
                .oc-check-circle.animated {
                    animation: oc-pop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both,
                               oc-ring-pulse 1.4s 0.6s ease-out;
                }
                .oc-check-path {
                    fill: none;
                    stroke: #fff;
                    stroke-width: 4.5;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                }
                .oc-check-path.animated {
                    animation: oc-draw-check 0.4s 0.45s ease-out forwards;
                }
                .oc-tl-item-done .oc-tl-circle {
                    background: var(--cb-gradient-h);
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(155,47,201,0.3);
                }
                .oc-tl-item-active .oc-tl-circle {
                    background: #fff;
                    border: 2px solid var(--cb-purple);
                    color: var(--cb-purple);
                    box-shadow: 0 0 0 5px rgba(155,47,201,0.12);
                }
                .oc-tl-item-upcoming .oc-tl-circle {
                    background: #fff;
                    border: 2px solid rgba(155,47,201,0.2);
                    color: var(--cb-ink-soft);
                }
                .oc-summary-btn-primary {
                    background: var(--cb-gradient-h);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 0 28px;
                    height: 52px;
                    border-radius: var(--cb-r-pill);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform .2s, box-shadow .2s;
                    box-shadow: var(--cb-shadow-glow);
                    width: 100%;
                }
                .oc-summary-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 26px 64px rgba(220,0,117,0.28); }
                .oc-summary-btn-secondary {
                    background: rgba(255,255,255,0.7);
                    color: var(--cb-purple);
                    font-size: 15px;
                    font-weight: 600;
                    padding: 0 28px;
                    height: 52px;
                    border-radius: var(--cb-r-pill);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border: 1.5px solid rgba(155,47,201,0.3);
                    transition: all .2s;
                    width: 100%;
                }
                .oc-summary-btn-secondary:hover { background: #fff; border-color: var(--cb-purple); transform: translateY(-2px); box-shadow: var(--cb-shadow-sm); }
                @media (max-width: 980px) {
                    .oc-body-grid { grid-template-columns: 1fr !important; }
                    .oc-sidebar { order: -1; }
                }
                @media (max-width: 600px) {
                    .oc-kit-row-inner { flex-wrap: wrap !important; }
                    .oc-kit-price-val { font-size: 22px !important; }
                }
            `}</style>

            {/* ===== HERO SUCCESS STATE ===== */}
            <section
                aria-labelledby="confirm-heading"
                style={{
                    background: "radial-gradient(1100px 500px at 50% -10%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
                    padding: "clamp(56px,7vw,96px) 24px clamp(48px,5vw,72px)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* glow blob */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 480,
                        height: 480,
                        left: "50%",
                        top: -200,
                        transform: "translateX(-50%)",
                        background: "radial-gradient(circle, rgba(220,0,117,0.12), transparent 70%)",
                        filter: "blur(20px)",
                        pointerEvents: "none",
                    }}
                />

                {/* Animated checkmark */}
                <div
                    aria-hidden="true"
                    style={{ margin: "0 auto 32px", width: 108, height: 108 }}
                >
                    <div className={`oc-check-circle${mounted ? " animated" : ""}`}>
                        <svg
                            width="52"
                            height="52"
                            viewBox="0 0 52 52"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                className={`oc-check-path${mounted ? " animated" : ""}`}
                                d="M12 27 l10 10 l18 -20"
                            />
                        </svg>
                    </div>
                </div>

                {/* eyebrow pill */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1px solid var(--cb-line)",
                        color: "var(--cb-purple)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "6px 14px",
                        borderRadius: "var(--cb-r-pill)",
                        boxShadow: "var(--cb-shadow-xs)",
                        marginBottom: 20,
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--cb-magenta)",
                            boxShadow: "0 0 0 4px rgba(220,0,117,0.15)",
                            display: "inline-block",
                        }}
                        aria-hidden="true"
                    />
                    Booking confirmed
                </div>

                <h1
                    id="confirm-heading"
                    style={{
                        fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        marginBottom: 16,
                    }}
                >
                    Thank you! Your<br />
                    <span className="gradient-text">celebration is booked!</span>
                </h1>

                <p
                    style={{
                        fontSize: "clamp(16px, 1.4vw, 18px)",
                        color: "var(--cb-ink-muted)",
                        lineHeight: 1.65,
                        maxWidth: 520,
                        margin: "0 auto 28px",
                    }}
                >
                    Your holiday kit is confirmed and queued for preparation. You&apos;ll receive a
                    shipping notification with tracking details by email.
                </p>

                {/* order number pill */}
                <div
                    aria-label="Order number"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                        color: "var(--cb-purple)",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "10px 22px",
                        borderRadius: "var(--cb-r-pill)",
                        letterSpacing: "0.04em",
                        border: "1px solid rgba(155,47,201,0.18)",
                    }}
                >
                    Order{" "}
                    <span style={{ color: "var(--cb-magenta)" }}>{orderNumber}</span>
                </div>
            </section>

            {/* ===== BODY: SUMMARY + SIDEBAR ===== */}
            <div
                className="oc-body-grid"
                style={{
                    maxWidth: "var(--cb-max)",
                    margin: "0 auto",
                    padding: "clamp(48px,6vw,80px) 24px clamp(64px,7vw,96px)",
                    display: "grid",
                    gridTemplateColumns: "1fr 380px",
                    gap: 48,
                    alignItems: "start",
                }}
            >

                {/* LEFT: ORDER SUMMARY CARD */}
                <main aria-label="Order summary">
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            borderRadius: "var(--cb-r-card)",
                            boxShadow: "var(--cb-shadow-md)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                padding: "22px 28px 18px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "1px solid var(--cb-line)",
                                flexWrap: "wrap",
                                gap: 8,
                            }}
                        >
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Order Summary</h2>
                            <span
                                style={{
                                    background: "linear-gradient(135deg, rgba(155,47,201,0.1), rgba(220,0,117,0.08))",
                                    color: "var(--cb-purple)",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    padding: "5px 12px",
                                    borderRadius: "var(--cb-r-pill)",
                                    border: "1px solid rgba(155,47,201,0.2)",
                                }}
                            >
                                Confirmed
                            </span>
                        </div>

                        {/* Kit row placeholder, no real kit data on this page */}
                        <div
                            className="oc-kit-row-inner"
                            style={{
                                padding: "24px 28px",
                                display: "flex",
                                gap: 18,
                                alignItems: "flex-start",
                                borderBottom: "1px solid var(--cb-line)",
                            }}
                        >
                            {/* Kit placeholder icon when no image */}
                            <div
                                aria-hidden="true"
                                style={{
                                    width: 88,
                                    height: 88,
                                    borderRadius: 16,
                                    flexShrink: 0,
                                    background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 36,
                                    boxShadow: "var(--cb-shadow-sm)",
                                }}
                            >
                                &#127873;
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "var(--cb-magenta)",
                                        marginBottom: 4,
                                    }}
                                >
                                    Holiday Kit &middot; Rental
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "var(--cb-ink)",
                                        marginBottom: 6,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Your Holiday Collection
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "var(--cb-ink-muted)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <span>&#128197; Your rental period begins on your chosen date</span>
                                    <span>&#128230; Curated décor pieces, fully styled</span>
                                    <span>&#128205; Shipping details confirmed by email</span>
                                </div>
                            </div>
                        </div>

                        {/* Line items */}
                        <div
                            aria-label="Price breakdown"
                            style={{
                                padding: "20px 28px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                borderBottom: "1px solid var(--cb-line)",
                            }}
                        >
                            {[
                                { label: "Kit rental", val: "Confirmed", muted: false },
                                { label: "Shipping (both ways)", val: "Free", muted: false },
                                { label: "Tax (8%)", val: "Included", muted: false },
                                { label: "Refundable deposit", val: "Protected", highlight: true },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "baseline",
                                        fontSize: 14,
                                    }}
                                >
                                    <span style={{ color: "var(--cb-ink-muted)" }}>{row.label}</span>
                                    <span
                                        style={{
                                            fontWeight: 600,
                                            color: row.highlight ? "var(--cb-purple)" : "var(--cb-ink)",
                                        }}
                                    >
                                        {row.val}
                                    </span>
                                </div>
                            ))}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                    fontSize: 16,
                                    borderTop: "1px solid var(--cb-line)",
                                    paddingTop: 12,
                                    marginTop: 4,
                                }}
                            >
                                <span style={{ fontWeight: 600, color: "var(--cb-ink)" }}>Payment collected</span>
                                <span
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "var(--cb-ink)",
                                    }}
                                >
                                    &#10003; Charged
                                </span>
                            </div>
                        </div>

                        {/* Refund note */}
                        <div
                            role="note"
                            aria-label="Deposit information"
                            style={{
                                padding: "16px 28px",
                                background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                            }}
                        >
                            <span aria-hidden="true" style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, marginTop: 1 }}>
                                &#128156;
                            </span>
                            <p style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>
                                <strong style={{ color: "var(--cb-purple)" }}>Deposit refunded in full</strong>{" "}
                                within five business days of your return, provided items arrive in good
                                condition. Minor wear is always covered.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                            <Link href="/account" className="oc-summary-btn-primary" aria-label="Track your order status">
                                Track My Order &rarr;
                            </Link>
                            <Link href="/catalog" className="oc-summary-btn-secondary" aria-label="Browse more holiday kits">
                                Browse More Holidays
                            </Link>
                        </div>
                    </div>
                </main>

                {/* RIGHT: SIDEBAR */}
                <aside className="oc-sidebar" aria-label="What happens next" style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                    {/* Timeline card */}
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            borderRadius: "var(--cb-r-card)",
                            boxShadow: "var(--cb-shadow-sm)",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--cb-line)" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>What happens next</h3>
                            <p style={{ fontSize: 13, color: "var(--cb-ink-muted)", marginTop: 4 }}>
                                Your kit journey, step by step
                            </p>
                        </div>

                        <ol
                            aria-label="Order timeline"
                            style={{
                                padding: "20px 24px 24px",
                                position: "relative",
                                listStyle: "none",
                                margin: 0,
                            }}
                        >
                            {/* vertical line */}
                            <li
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    left: 38,
                                    top: 28,
                                    bottom: 28,
                                    width: 2,
                                    background: "linear-gradient(to bottom, #9B2FC9 0%, rgba(155,47,201,0.15) 40%, rgba(155,47,201,0.08) 100%)",
                                    pointerEvents: "none",
                                }}
                            />
                            {timeline.map((step, i) => (
                                <li
                                    key={step.label}
                                    className={`oc-tl-item-${step.status}`}
                                    style={{
                                        display: "flex",
                                        gap: 16,
                                        alignItems: "flex-start",
                                        padding: "10px 0",
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        className="oc-tl-circle"
                                        aria-hidden="true"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            zIndex: 2,
                                            position: "relative",
                                        }}
                                    >
                                        {timelineIcon(step.status, i)}
                                    </div>
                                    <div style={{ paddingTop: 3 }}>
                                        <h4
                                            style={{
                                                fontFamily: "inherit",
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: step.status === "upcoming" ? "var(--cb-ink-muted)" : "var(--cb-ink)",
                                                marginBottom: 2,
                                            }}
                                        >
                                            {step.label}
                                        </h4>
                                        <span
                                            style={{
                                                fontSize: 12.5,
                                                color: step.status === "done" ? "var(--cb-purple)" : "var(--cb-ink-soft)",
                                                fontWeight: step.status === "done" ? 500 : 400,
                                            }}
                                        >
                                            {step.date}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Info cards */}
                    <div aria-label="Booking details" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                            {
                                icon: "&#128231;",
                                title: "Confirmation Sent",
                                body: "Check your inbox for order details, your rental agreement, and the prepaid return label.",
                            },
                            {
                                icon: "&#128737;",
                                title: "Deposit Protected",
                                body: "Your deposit is fully covered. Minor wear is never charged. Return in good condition and it's yours back.",
                            },
                            {
                                icon: "&#128666;",
                                title: "Free Shipping Both Ways",
                                body: "We deliver to your door and pick it up after the season. No labels to print, no trips to the post office.",
                            },
                        ].map((card) => (
                            <div
                                key={card.title}
                                style={{
                                    background: "#fff",
                                    border: "1px solid var(--cb-line)",
                                    borderRadius: "var(--cb-r-card)",
                                    padding: "20px 22px",
                                    boxShadow: "var(--cb-shadow-xs)",
                                    display: "flex",
                                    gap: 14,
                                    alignItems: "flex-start",
                                }}
                            >
                                <div
                                    aria-hidden="true"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 14,
                                        background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 22,
                                        flexShrink: 0,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: card.icon }}
                                />
                                <div>
                                    <h4
                                        style={{
                                            fontFamily: "inherit",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "var(--cb-ink)",
                                            marginBottom: 3,
                                        }}
                                    >
                                        {card.title}
                                    </h4>
                                    <p style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>
                                        {card.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* ===== PLANS UPSELL ===== */}
            <section
                aria-labelledby="plans-heading"
                style={{ background: "#fff", padding: "clamp(64px,7vw,96px) 24px" }}
            >
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Membership</span>
                        <h2 id="plans-heading">Unlock more celebrations</h2>
                        <p>Switch or cancel anytime. Every plan includes free two way shipping and full deposit protection.</p>
                    </div>
                    <div className="cb-pricing-grid">
                        {[
                            {
                                tier: "Starter",
                                price: "$49",
                                count: "3 holidays per year",
                                feat: "Designer curated starter kits with full deposit protection and free shipping both ways.",
                                elevated: false,
                            },
                            {
                                tier: "Premium",
                                price: "$79",
                                count: "6 holidays per year",
                                feat: "Premium kits, priority shipping, and free add ons worth up to $25 every season.",
                                elevated: true,
                                ribbon: "&#9733; Most loved",
                            },
                            {
                                tier: "Ultimate",
                                price: "$119",
                                count: "Unlimited holidays",
                                feat: "Every kit tier, a dedicated stylist, and first access to limited seasonal drops.",
                                elevated: false,
                            },
                        ].map((plan) => (
                            <div
                                key={plan.tier}
                                className={`cb-plan-card${plan.elevated ? " elevated" : ""}`}
                            >
                                {plan.ribbon && (
                                    <span
                                        className="cb-plan-ribbon"
                                        aria-label="Most popular plan"
                                        dangerouslySetInnerHTML={{ __html: plan.ribbon }}
                                    />
                                )}
                                <span className="cb-plan-tier">{plan.tier}</span>
                                <div className="cb-plan-price">
                                    {plan.price}<span className="small">/mo</span>
                                </div>
                                <p className="cb-plan-count">{plan.count}</p>
                                <p className="cb-plan-feat">{plan.feat}</p>
                                <Link
                                    href="/subscription"
                                    className={plan.elevated ? "btn-fill-grad" : "btn-out-grad"}
                                >
                                    Choose {plan.tier}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: "center" }}>
                        <Link href="/subscription" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>
                            Compare all plans in detail &rarr;
                        </Link>
                    </p>
                </div>
            </section>

        </div>
    );
}
