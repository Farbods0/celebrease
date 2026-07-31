"use client";

import Link from "next/link";

export default function CheckoutCancelClient() {
    return (
        <div className="cb">
            <style>{`
                @keyframes cc-float-in {
                    0%   { transform: translateY(18px) scale(0.92); opacity: 0; }
                    70%  { transform: translateY(-4px) scale(1.03); opacity: 1; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes cc-gentle-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.28), 0 20px 56px rgba(217,119,6,0.18); }
                    50%       { box-shadow: 0 0 0 14px rgba(217,119,6,0), 0 20px 56px rgba(217,119,6,0.18); }
                }
                .cc-icon-wrap {
                    margin: 0 auto 36px;
                    width: 112px;
                    height: 112px;
                    animation: cc-float-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                .cc-icon-circle {
                    width: 112px;
                    height: 112px;
                    border-radius: 50%;
                    background: #FEF3C7;
                    border: 2.5px solid #FDE68A;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: cc-gentle-pulse 2.4s 0.7s ease-in-out infinite;
                }
                .cc-eyebrow-amber {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1px solid rgba(217,119,6,0.22);
                    color: #D97706;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    padding: 6px 14px;
                    border-radius: var(--cb-r-pill);
                    box-shadow: var(--cb-shadow-xs);
                    margin-bottom: 22px;
                }
                .cc-eyebrow-amber .dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #D97706;
                    box-shadow: 0 0 0 4px rgba(217,119,6,0.18);
                    flex-shrink: 0;
                }
                .cc-cart-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: #FEF3C7;
                    border: 1.5px solid rgba(217,119,6,0.18);
                    color: #D97706;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 10px 22px;
                    border-radius: var(--cb-r-pill);
                    letter-spacing: 0.03em;
                    margin-bottom: 40px;
                }
                .cc-btn-outline-ink {
                    background: #fff;
                    color: var(--cb-ink);
                    font-size: 16px;
                    font-weight: 600;
                    padding: 0 32px;
                    height: 56px;
                    border-radius: var(--cb-r-pill);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: 1.5px solid rgba(26,11,46,0.16);
                    transition: all .2s;
                    white-space: nowrap;
                    text-decoration: none;
                }
                .cc-btn-outline-ink:hover {
                    background: var(--cb-lavender);
                    border-color: var(--cb-purple);
                    color: var(--cb-purple);
                    transform: translateY(-2px);
                    box-shadow: var(--cb-shadow-sm);
                }
                .cc-reassure-card {
                    background: #fff;
                    border: 1px solid var(--cb-line);
                    border-radius: var(--cb-r-card);
                    padding: 26px 22px;
                    box-shadow: var(--cb-shadow-xs);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;
                    transition: transform .22s, box-shadow .22s;
                }
                .cc-reassure-card:hover { transform: translateY(-4px); box-shadow: var(--cb-shadow-md); }
                .cc-card-ic {
                    width: 46px;
                    height: 46px;
                    border-radius: 14px;
                    background: var(--cb-gradient-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    flex-shrink: 0;
                }
                @media (max-width: 700px) {
                    .cc-cards-row { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 480px) {
                    .cc-ctas { flex-direction: column !important; align-items: center !important; }
                    .cc-ctas a { width: 100%; max-width: 340px; justify-content: center; }
                }
            `}</style>

            {/* ===== CANCEL HERO ===== */}
            <section
                aria-labelledby="cancel-heading"
                style={{
                    background: "radial-gradient(1100px 520px at 50% -5%, #FFFBEB 0%, #FFF8F0 45%, #fff 100%)",
                    padding: "clamp(72px,8vw,112px) 24px clamp(64px,7vw,96px)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* amber glow blob */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 520,
                        height: 520,
                        left: "50%",
                        top: -240,
                        transform: "translateX(-50%)",
                        background: "radial-gradient(circle, rgba(217,119,6,0.10), transparent 70%)",
                        filter: "blur(22px)",
                        pointerEvents: "none",
                    }}
                />

                <div className="cc-icon-wrap" aria-hidden="true">
                    <div className="cc-icon-circle">
                        <svg
                            width="52"
                            height="52"
                            viewBox="0 0 52 52"
                            fill="none"
                            aria-hidden="true"
                            focusable="false"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="26" cy="26" r="22" stroke="#D97706" strokeWidth="3" fill="none" />
                            <rect x="23.5" y="14" width="5" height="16" rx="2.5" fill="#D97706" />
                            <rect x="23.5" y="34" width="5" height="5" rx="2.5" fill="#D97706" />
                        </svg>
                    </div>
                </div>

                <div className="cc-eyebrow-amber">
                    <span className="dot" aria-hidden="true" />
                    Payment not completed
                </div>

                <h1
                    id="cancel-heading"
                    style={{
                        fontSize: "clamp(2.2rem,5vw,3.6rem)",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        marginBottom: 18,
                        color: "var(--cb-ink)",
                    }}
                >
                    Your payment was cancelled
                </h1>

                <p
                    style={{
                        fontSize: "clamp(16px,1.45vw,18.5px)",
                        color: "var(--cb-ink-muted)",
                        lineHeight: 1.7,
                        maxWidth: 500,
                        margin: "0 auto 36px",
                    }}
                >
                    No worries, nothing was charged to your card. Your cart is saved exactly as you left it,
                    so you can pick up right where you stopped.
                </p>

                <div className="cc-cart-pill" role="status" aria-live="polite" aria-label="Cart status">
                    <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
                        🛍
                    </span>
                    Your cart is saved and ready
                </div>

                <div
                    className="cc-ctas"
                    style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
                >
                    <Link
                        href="/checkout"
                        className="btn-primary"
                        aria-label="Return to checkout and complete your order"
                    >
                        Return to Checkout →
                    </Link>
                    <Link
                        href="/cart"
                        className="cc-btn-outline-ink"
                        aria-label="Go back to your cart to review items"
                    >
                        Back to Cart
                    </Link>
                </div>
            </section>

            {/* ===== REASSURANCE CARDS ===== */}
            <section
                aria-labelledby="reassure-heading"
                style={{ background: "var(--cb-lavender)", padding: "clamp(56px,6vw,80px) 24px" }}
            >
                <div style={{ maxWidth: 820, margin: "0 auto" }}>
                    <div className="sec-head" style={{ marginBottom: 40 }}>
                        <span className="eyebrow">You&apos;re in good hands</span>
                        <h2 id="reassure-heading">Nothing to worry about</h2>
                        <p>We want every celebration to go smoothly, from booking to return.</p>
                    </div>

                    <div
                        className="cc-cards-row"
                        role="list"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}
                    >
                        <div className="cc-reassure-card" role="listitem">
                            <div className="cc-card-ic" aria-hidden="true">🔒</div>
                            <h4 style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "var(--cb-ink)" }}>
                                No charges made
                            </h4>
                            <p style={{ fontSize: 13.5, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                Your payment was cancelled before any amount was processed. Your card has not been
                                charged, not even a pending hold.
                            </p>
                        </div>

                        <div className="cc-reassure-card" role="listitem">
                            <div className="cc-card-ic" aria-hidden="true">🛍</div>
                            <h4 style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "var(--cb-ink)" }}>
                                Cart is still saved
                            </h4>
                            <p style={{ fontSize: 13.5, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                Your kits, add ons, and selections are saved. Return to checkout whenever you&apos;re
                                ready, no need to start over.
                            </p>
                        </div>

                        <div className="cc-reassure-card" role="listitem">
                            <div className="cc-card-ic" aria-hidden="true">💬</div>
                            <h4 style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "var(--cb-ink)" }}>
                                Need help?
                            </h4>
                            <p style={{ fontSize: 13.5, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                If something went wrong during checkout, our team is here.{" "}
                                <Link
                                    href="/contact"
                                    style={{ color: "var(--cb-purple)", fontWeight: 600 }}
                                >
                                    Contact support →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BROWSE / CTA ===== */}
            <section
                style={{ background: "#fff", padding: "clamp(56px,6vw,80px) 24px", textAlign: "center" }}
            >
                <div className="cb-container">
                    <div className="sec-head" style={{ marginBottom: 32 }}>
                        <span className="eyebrow">While you&apos;re here</span>
                        <h2>Keep exploring the catalog</h2>
                        <p>Every season, beautifully dressed. Discover what&apos;s available on your plan.</p>
                    </div>

                    <div
                        style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
                    >
                        <Link
                            href="/catalog"
                            className="btn-primary"
                            aria-label="Browse the holiday catalog"
                        >
                            Browse Catalog
                        </Link>
                        <Link
                            href="/subscription"
                            className="cc-btn-outline-ink"
                            aria-label="View subscription plans"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
