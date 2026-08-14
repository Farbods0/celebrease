"use client";

import Link from "next/link";

const timeline = [
    { state: "done",     label: "Payment Confirmed",        sub: "Today" },
    { state: "done",     label: "Booking Secured",          sub: "Today" },
    { state: "active",   label: "Kit Being Prepared",       sub: "In 1, 2 days" },
    { state: "upcoming", label: "Shipped to You",           sub: "In 3, 5 days" },
    { state: "upcoming", label: "Delivered & Celebrate!", sub: "On your start date" },
    { state: "upcoming", label: "Free Pickup Scheduled",    sub: "On your end date" },
    { state: "upcoming", label: "Deposit Refunded",         sub: "Within 5 business days of return" },
];

const infoCards = [
    {
        ic: "📧",
        title: "Receipt Sent",
        body: "Check your inbox for your payment receipt, rental agreement, and prepaid return shipping label.",
    },
    {
        ic: "🛡",
        title: "Deposit Protected",
        body: "Your deposit is fully secured. Minor wear is never charged. Return in good condition, it’s yours back.",
    },
    {
        ic: "🚚",
        title: "Free Shipping Both Ways",
        body: "We deliver to your door and pick it up after the season. No labels to print, no trips to the post office.",
    },
];

export default function CheckoutSuccessClient() {
    return (
        <div className="cb">
            <style>{`
                @keyframes cb-pop-in {
                    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
                    60%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes cb-ring-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(155,47,201,0.4), 0 20px 60px rgba(220,0,117,0.18); }
                    70%  { box-shadow: 0 0 0 22px rgba(155,47,201,0), 0 20px 60px rgba(220,0,117,0.18); }
                    100% { box-shadow: 0 0 0 0 rgba(155,47,201,0), 0 20px 60px rgba(220,0,117,0.18); }
                }
                @keyframes cb-draw-check {
                    to { stroke-dashoffset: 0; }
                }
                .cb-oc-check-circle {
                    width: 108px; height: 108px; border-radius: 50%;
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    display: flex; align-items: center; justify-content: center;
                    animation: cb-pop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both,
                               cb-ring-pulse 1.4s 0.6s ease-out;
                }
                .cb-oc-check-path {
                    fill: none; stroke: #fff; stroke-width: 4.5;
                    stroke-linecap: round; stroke-linejoin: round;
                    stroke-dasharray: 60; stroke-dashoffset: 60;
                    animation: cb-draw-check 0.4s 0.45s ease-out forwards;
                }
                .cb-oc-body {
                    max-width: var(--cb-max);
                    margin: 0 auto;
                    padding: clamp(48px,6vw,80px) 24px clamp(64px,7vw,96px);
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 48px;
                    align-items: start;
                }
                .cb-oc-summary {
                    background: #fff;
                    border: 1px solid var(--cb-line);
                    border-radius: var(--cb-r-card);
                    box-shadow: var(--cb-shadow-md);
                    overflow: hidden;
                }
                .cb-oc-summary-header {
                    padding: 22px 28px 18px;
                    display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 1px solid var(--cb-line); flex-wrap: wrap; gap: 8px;
                }
                .cb-oc-summary-header h2 { font-size: 20px; font-weight: 700; }
                .cb-oc-status-badge {
                    background: linear-gradient(135deg, rgba(155,47,201,0.1), rgba(220,0,117,0.08));
                    color: var(--cb-purple); font-size: 12px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    padding: 5px 12px; border-radius: var(--cb-r-pill);
                    border: 1px solid rgba(155,47,201,0.2);
                }
                .cb-oc-line-items {
                    padding: 20px 28px; display: flex; flex-direction: column; gap: 12px;
                    border-bottom: 1px solid var(--cb-line);
                }
                .cb-oc-line { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; }
                .cb-oc-line .label { color: var(--cb-ink-muted); }
                .cb-oc-line .val { font-weight: 600; color: var(--cb-ink); }
                .cb-oc-line.deposit .val { color: var(--cb-purple); }
                .cb-oc-line.total { font-size: 16px; }
                .cb-oc-line.total .label { color: var(--cb-ink); font-weight: 600; }
                .cb-oc-line.total .val { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; }
                .cb-oc-refund-note {
                    padding: 16px 28px; background: var(--cb-gradient-soft);
                    display: flex; align-items: flex-start; gap: 12px;
                }
                .cb-oc-refund-note p { font-size: 13px; color: var(--cb-ink-muted); line-height: 1.5; }
                .cb-oc-refund-note strong { color: var(--cb-purple); }
                .cb-oc-ctas { padding: 24px 28px; display: flex; flex-direction: column; gap: 10px; }
                .cb-oc-btn-primary {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff; font-size: 15px; font-weight: 600;
                    padding: 0 28px; height: 52px; border-radius: var(--cb-r-pill);
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                    transition: transform .2s, box-shadow .2s;
                    box-shadow: 0 20px 60px rgba(220,0,117,0.18); width: 100%;
                }
                .cb-oc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 26px 64px rgba(220,0,117,0.28); }
                .cb-oc-btn-secondary {
                    background: rgba(255,255,255,0.7); color: var(--cb-purple);
                    font-size: 15px; font-weight: 600; padding: 0 28px; height: 52px;
                    border-radius: var(--cb-r-pill); display: inline-flex; align-items: center;
                    justify-content: center; gap: 8px; border: 1.5px solid rgba(155,47,201,0.3);
                    transition: all .2s; width: 100%;
                }
                .cb-oc-btn-secondary:hover { background: #fff; border-color: var(--cb-purple); transform: translateY(-2px); box-shadow: var(--cb-shadow-sm); }
                .cb-oc-sidebar { display: flex; flex-direction: column; gap: 28px; }
                .cb-oc-timeline-card {
                    background: #fff; border: 1px solid var(--cb-line);
                    border-radius: var(--cb-r-card); box-shadow: var(--cb-shadow-sm); overflow: hidden;
                }
                .cb-oc-timeline-head {
                    padding: 20px 24px 16px; border-bottom: 1px solid var(--cb-line);
                }
                .cb-oc-timeline-head h3 { font-size: 18px; font-weight: 700; }
                .cb-oc-timeline-head p { font-size: 13px; color: var(--cb-ink-muted); margin-top: 4px; }
                .cb-oc-timeline {
                    padding: 20px 24px 24px; position: relative; list-style: none; margin: 0;
                }
                .cb-oc-timeline::before {
                    content: ''; position: absolute; left: 38px; top: 28px; bottom: 28px; width: 2px;
                    background: linear-gradient(to bottom, #9B2FC9 0%, rgba(155,47,201,0.15) 40%, rgba(155,47,201,0.08) 100%);
                }
                .cb-oc-tl-item { display: flex; gap: 16px; align-items: flex-start; padding: 10px 0; }
                .cb-oc-tl-circle {
                    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700; z-index: 2; position: relative;
                }
                .cb-oc-tl-item.done .cb-oc-tl-circle {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff; box-shadow: 0 4px 12px rgba(155,47,201,0.3);
                }
                .cb-oc-tl-item.active .cb-oc-tl-circle {
                    background: #fff; border: 2px solid var(--cb-purple); color: var(--cb-purple);
                    box-shadow: 0 0 0 5px rgba(155,47,201,0.12);
                }
                .cb-oc-tl-item.upcoming .cb-oc-tl-circle {
                    background: #fff; border: 2px solid rgba(155,47,201,0.2); color: var(--cb-ink-soft);
                }
                .cb-oc-tl-content { padding-top: 3px; }
                .cb-oc-tl-content h4 {
                    font-family: 'Geist Sans', 'Inter', system-ui, sans-serif;
                    font-size: 14px; font-weight: 600; color: var(--cb-ink); margin-bottom: 2px;
                }
                .cb-oc-tl-item.upcoming .cb-oc-tl-content h4 { color: var(--cb-ink-muted); }
                .cb-oc-tl-content span { font-size: 12.5px; color: var(--cb-ink-soft); }
                .cb-oc-tl-item.done .cb-oc-tl-content span { color: var(--cb-purple); font-weight: 500; }
                .cb-oc-info-stack { display: flex; flex-direction: column; gap: 14px; }
                .cb-oc-info-card {
                    background: #fff; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card);
                    padding: 20px 22px; box-shadow: var(--cb-shadow-xs);
                    display: flex; gap: 14px; align-items: flex-start;
                }
                .cb-oc-info-ic {
                    width: 44px; height: 44px; border-radius: 14px;
                    background: var(--cb-gradient-soft);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 22px; flex-shrink: 0;
                }
                .cb-oc-info-text h4 {
                    font-family: 'Geist Sans', 'Inter', system-ui, sans-serif;
                    font-size: 14px; font-weight: 600; color: var(--cb-ink); margin-bottom: 3px;
                }
                .cb-oc-info-text p { font-size: 13px; color: var(--cb-ink-muted); line-height: 1.5; }
                @media (max-width: 980px) {
                    .cb-oc-body { grid-template-columns: 1fr; }
                    .cb-oc-sidebar { order: -1; }
                }
                @media (max-width: 600px) {
                    .cb-oc-summary-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            {/* ===== HERO SUCCESS BAND ===== */}
            <section
                aria-labelledby="success-heading"
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
                <div aria-hidden="true" style={{ margin: "0 auto 32px", width: 108, height: 108 }}>
                    <div className="cb-oc-check-circle">
                        <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
                            <path className="cb-oc-check-path" d="M12 27 l10 10 l18 -20" />
                        </svg>
                    </div>
                </div>

                {/* Eyebrow pill */}
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
                        aria-hidden="true"
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--cb-magenta)",
                            boxShadow: "0 0 0 4px rgba(220,0,117,0.15)",
                            display: "inline-block",
                            flexShrink: 0,
                        }}
                    />
                    Payment successful
                </div>

                <h1
                    id="success-heading"
                    style={{
                        fontSize: "clamp(2.2rem,5vw,3.4rem)",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        marginBottom: 16,
                        position: "relative",
                    }}
                >
                    Payment successful!<br />
                    <span className="gradient-text">Your celebration is booked!</span>
                </h1>

                <p
                    style={{
                        fontSize: "clamp(16px,1.4vw,18px)",
                        color: "var(--cb-ink-muted)",
                        lineHeight: 1.65,
                        maxWidth: 520,
                        margin: "0 auto 28px",
                        position: "relative",
                    }}
                >
                    Your payment was processed successfully. Your holiday kit is confirmed and queued for
                    preparation. A receipt and rental details have been sent to your email.
                </p>

                {/* Order pill */}
                <div
                    aria-label="Order confirmed"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        background: "var(--cb-gradient-soft)",
                        color: "var(--cb-purple)",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "10px 22px",
                        borderRadius: "var(--cb-r-pill)",
                        letterSpacing: "0.04em",
                        border: "1px solid rgba(155,47,201,0.18)",
                    }}
                >
                    Payment confirmed! Check your email for your receipt.
                </div>
            </section>

            {/* ===== BODY: SUMMARY + SIDEBAR ===== */}
            <div className="cb-oc-body">

                {/* LEFT: ORDER SUMMARY */}
                <main aria-label="Order summary">
                    <div className="cb-oc-summary">

                        <div className="cb-oc-summary-header">
                            <h2>Order Summary</h2>
                            <span className="cb-oc-status-badge">Payment Received</span>
                        </div>

                        {/* Line items */}
                        <div className="cb-oc-line-items" aria-label="Price breakdown">
                            <div className="cb-oc-line">
                                <span className="label">Kit rental</span>
                                <span className="val">Confirmed</span>
                            </div>
                            <div className="cb-oc-line">
                                <span className="label">Shipping (both ways)</span>
                                <span className="val">Included</span>
                            </div>
                            <div className="cb-oc-line deposit">
                                <span className="label">Refundable deposit</span>
                                <span className="val">Secured</span>
                            </div>
                            <div className="cb-oc-line total">
                                <span className="label">Status</span>
                                <span className="val">Paid</span>
                            </div>
                        </div>

                        {/* Refund note */}
                        <div className="cb-oc-refund-note" role="note" aria-label="Deposit information">
                            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, marginTop: 1 }} aria-hidden="true">&#128156;</span>
                            <p>
                                <strong>Your deposit is refunded in full</strong> within five business days of your
                                return, provided items arrive in good condition. Minor wear is always covered.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="cb-oc-ctas">
                            <Link href="/account" className="cb-oc-btn-primary" aria-label="View your order details">
                                View My Order &rarr;
                            </Link>
                            <Link href="/shop-kits" className="cb-oc-btn-secondary" aria-label="Browse more holiday kits">
                                Browse More Holidays
                            </Link>
                        </div>

                    </div>
                </main>

                {/* RIGHT: SIDEBAR */}
                <aside className="cb-oc-sidebar" aria-label="What happens next">

                    {/* Timeline card */}
                    <div className="cb-oc-timeline-card">
                        <div className="cb-oc-timeline-head">
                            <h3>What happens next</h3>
                            <p>Your kit journey, step by step</p>
                        </div>
                        <ol className="cb-oc-timeline" aria-label="Order timeline">
                            {timeline.map((step, i) => (
                                <li key={step.label} className={`cb-oc-tl-item ${step.state}`}>
                                    <div className="cb-oc-tl-circle" aria-hidden="true">
                                        {step.state === "done" ? "✓" : String(i + 1)}
                                    </div>
                                    <div className="cb-oc-tl-content">
                                        <h4>{step.label}</h4>
                                        <span>{step.sub}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Info cards */}
                    <div className="cb-oc-info-stack" aria-label="Booking details">
                        {infoCards.map((card) => (
                            <div key={card.title} className="cb-oc-info-card">
                                <div className="cb-oc-info-ic" aria-hidden="true">{card.ic}</div>
                                <div className="cb-oc-info-text">
                                    <h4>{card.title}</h4>
                                    <p>{card.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </aside>

            </div>

        </div>
    );
}
