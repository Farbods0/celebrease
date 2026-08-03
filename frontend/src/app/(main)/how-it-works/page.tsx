import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaqAccordion } from "@/components/main/faq-accordion";
import { ApiHoliday, baseURL, getHolidays } from "@/lib/api";

const img = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${baseURL}${path}`;
    if (path.startsWith("/")) return path;
    return `${baseURL}/${path}`;
};

export const metadata: Metadata = { title: "How It Works, CeleBrease" };

const HIW_FAQS = [
    {
        q: "How does the rental period work?",
        a: "Rental periods are 30 or 60 days, depending on the kit tier. Your period starts when the kit is delivered, not when it ships. We email reminders 7 and 3 days before your return date so there are no surprises.",
    },
    {
        q: "What if something breaks?",
        a: "Accidents happen. Minor wear is covered automatically, no action needed. For major damage, our deposit protection covers up to 90% of replacement cost. You'll never owe more than your original deposit amount.",
    },
    {
        q: "How does the deposit refund work?",
        a: "Your deposit (typically $50) is held when you reserve a kit and refunded in full within five business days of returning it in good condition. Shipping is free both ways. You'll receive a confirmation email the moment we release it.",
    },
    {
        q: "Can I skip a holiday?",
        a: "Absolutely. Skip any holiday from your account dashboard up to 14 days before the rental starts. Skipped slots roll forward to next year, no slot is ever lost from your plan.",
    },
    {
        q: "Can I extend my rental?",
        a: "Yes. From your dashboard, extend by 7, 14, or 30 days at a prorated daily rate. Extensions must be requested at least 48 hours before the original return date to guarantee availability.",
    },
    {
        q: "What if I don't love the kit when it arrives?",
        a: "Contact us within 48 hours of delivery. We'll send a replacement, swap it for a different holiday kit, or credit your account, no questions asked. We want every holiday to feel right.",
    },
    {
        q: "Are kits child- and pet-safe?",
        a: "All kits use non-toxic finishes and are tested for durability. Fragile items are clearly labelled. For homes with small children or curious pets, use the \"Kid-Friendly\" filter when browsing, these kits contain no breakables.",
    },
    {
        q: "Do you offer gift subscriptions?",
        a: "Yes. Buy a 3-, 6-, or 12-month gift subscription from your account. The recipient chooses their own holidays, perfect for new homeowners, hosts, and grandparents who love a beautifully dressed home.",
    },
    {
        q: "What's the cancellation policy?",
        a: "Cancel a reservation up to 14 days before the rental start date for a full refund. Within 14 days, we credit your account for a future booking. Subscriptions can be cancelled anytime from your dashboard, no penalty, no fine print.",
    },
];

export default async function HowItWorksPage() {
    let holidays: ApiHoliday[] = [];
    try {
        const data = await getHolidays();
        holidays = data.items ?? [];
    } catch {
        holidays = [];
    }
    const img1 = { image: "/hiw-1.jpg" };
    const img2 = { image: "/hiw-2.jpg" };
    const img3 = { image: "/hiw-3.jpg" };
    const img4 = { image: "/hiw-4.jpg" };

    return (
        <div className="cb">
            {/* HERO-LITE */}
            <header style={{
                background: "radial-gradient(1100px 500px at 50% 0%, #FAEFFF 0%, #F6F1FB 55%, #fff 100%)",
                padding: "clamp(64px,8vw,100px) 24px clamp(48px,5vw,72px)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute",
                    width: 440,
                    height: 440,
                    right: -140,
                    top: -160,
                    background: "radial-gradient(circle, rgba(220,0,117,0.14), transparent 70%)",
                    filter: "blur(20px)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute",
                    width: 360,
                    height: 360,
                    left: -120,
                    bottom: -120,
                    background: "radial-gradient(circle, rgba(155,47,201,0.12), transparent 70%)",
                    filter: "blur(20px)",
                    pointerEvents: "none",
                }} />
                <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1px solid rgba(155,47,201,0.12)",
                        color: "var(--cb-purple)",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "7px 14px",
                        borderRadius: "9999px",
                        boxShadow: "0 1px 3px rgba(26,11,46,0.06)",
                        marginBottom: 22,
                    }}>
                        <span style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--cb-magenta)",
                            boxShadow: "0 0 0 4px rgba(220,0,117,0.15)",
                            display: "inline-block",
                        }} />
                        How It Works
                    </div>
                    <h1 style={{
                        fontSize: "clamp(2.4rem, 5.2vw, 3.9rem)",
                        lineHeight: 1.06,
                        fontWeight: 800,
                        marginBottom: 20,
                    }}>
                        Four steps from subscription<br />
                        to <span className="gradient-text">celebration.</span>
                    </h1>
                    <p style={{
                        fontSize: "clamp(17px,1.4vw,19px)",
                        color: "var(--cb-ink-muted)",
                        lineHeight: 1.65,
                        maxWidth: 620,
                        margin: "0 auto 32px",
                    }}>
                        Pick a plan, tell us your holidays, and we do the rest, from designer curation to doorstep pickup.
                        Decorate beautifully. Store nothing. Get your deposit back, every time.
                    </p>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                        flexWrap: "wrap",
                    }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--cb-ink-muted)", fontWeight: 500 }}>
                            Loved by 2,400+ families
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(155,47,201,0.12)", display: "inline-block" }} />
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--cb-ink-muted)", fontWeight: 500 }}>
                            Free shipping <strong style={{ color: "var(--cb-ink)" }}>both ways</strong>
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(155,47,201,0.12)", display: "inline-block" }} />
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--cb-ink-muted)", fontWeight: 500 }}>
                            Deposit <strong style={{ color: "var(--cb-ink)" }}>always refundable</strong>
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(155,47,201,0.12)", display: "inline-block" }} />
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--cb-ink-muted)", fontWeight: 500 }}>
                            Cancel <strong style={{ color: "var(--cb-ink)" }}>anytime</strong>
                        </span>
                    </div>
                </div>
            </header>

            {/* STEPS WALKTHROUGH */}
            <section style={{ background: "#fff", padding: "clamp(72px,7vw,104px) 24px" }}>
                <div className="cb-container">

                    {/* STEP 1 */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(40px,5vw,72px)",
                        alignItems: "center",
                        marginBottom: "clamp(64px,6vw,96px)",
                    }} className="hiw-step-row">
                        <div style={{ position: "relative" }}>
                            <div style={{
                                borderRadius: "var(--cb-r-lg)",
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                boxShadow: "var(--cb-shadow-md)",
                                background: "var(--cb-lavender)",
                            }}>
                                {img1 && (
                                    <Image
                                        src={img(img1.image)}
                                        alt="Selecting your holiday decorations"
                                        width={800} height={600}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                            <div style={{
                                position: "absolute",
                                bottom: -18,
                                left: 24,
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                border: "1px solid rgba(255,255,255,0.9)",
                                borderRadius: 18,
                                padding: "14px 20px",
                                boxShadow: "var(--cb-shadow-md)",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-h)",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 19,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 14px rgba(155,47,201,0.3)",
                                    flexShrink: 0,
                                }}>1</div>
                                <div style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.3 }}>
                                    <strong style={{ color: "var(--cb-ink)", display: "block", fontSize: 14, marginBottom: 1 }}>Pick your holidays</strong>
                                    Your slots, your traditions
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <span className="eyebrow">Step one</span>
                            <h2 style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 1.1, fontWeight: 700 }}>
                                Pick the holidays that matter to <span className="gradient-text">your home.</span>
                            </h2>
                            <p style={{ fontSize: "clamp(15.5px,1.2vw,17px)", color: "var(--cb-ink-muted)", lineHeight: 1.7 }}>
                                Choose a plan, then select the celebrations you want this year, across any tradition, faith, or season.
                                Mix Christmas with Diwali, Hanukkah with Halloween, or Eid with a birthday bash. Your slots roll over if life gets busy.
                            </p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    "19 curated holidays to choose from",
                                    "Starter: 3 slots · Premium: 6 slots · Ultimate: unlimited",
                                    "Unused slots never expire, they carry to next year",
                                    "Swap any slot from your account dashboard before it ships",
                                ].map((item) => (
                                    <li key={item} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        fontSize: 15,
                                        color: "var(--cb-ink-muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                            border: "1.5px solid rgba(155,47,201,0.12)",
                                            flexShrink: 0,
                                            marginTop: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--cb-purple)",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: 4 }}>
                                <Link href="/catalog" className="btn-out-grad" style={{ width: "fit-content", padding: "0 28px" }}>
                                    Browse holidays →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid rgba(155,47,201,0.12)", marginBottom: "clamp(64px,6vw,96px)" }} />

                    {/* STEP 2 */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(40px,5vw,72px)",
                        alignItems: "center",
                        marginBottom: "clamp(64px,6vw,96px)",
                    }} className="hiw-step-row">
                        <div style={{ display: "flex", flexDirection: "column", gap: 18, order: 2 }}>
                            <span className="eyebrow">Step two</span>
                            <h2 style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 1.1, fontWeight: 700 }}>
                                We hand-pick every piece. You just <span className="gradient-text">open the box.</span>
                            </h2>
                            <p style={{ fontSize: "clamp(15.5px,1.2vw,17px)", color: "var(--cb-ink-muted)", lineHeight: 1.7 }}>
                                Our in-house stylists, each with 5+ years of holiday design experience, assemble 10 to 25 décor pieces
                                for each holiday. Every item is professionally cleaned, inspected, and packed with a printed styling card
                                so you know exactly where each piece goes.
                            </p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    "Starter, Premium, or Ultimate kit tiers to match your space",
                                    "Styling card with room-by-room placement guide included",
                                    "Professionally cleaned and inspected before every rental",
                                    "Optional add ons (candles, table runners, scent kits) available",
                                ].map((item) => (
                                    <li key={item} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        fontSize: 15,
                                        color: "var(--cb-ink-muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                            border: "1.5px solid rgba(155,47,201,0.12)",
                                            flexShrink: 0,
                                            marginTop: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--cb-purple)",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ position: "relative", order: 1 }}>
                            <div style={{
                                borderRadius: "var(--cb-r-lg)",
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                boxShadow: "var(--cb-shadow-md)",
                            }}>
                                {img2 && (
                                    <Image
                                        src={img(img2.image)}
                                        alt="Curated holiday kit in a box"
                                        width={800} height={600}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                            <div style={{
                                position: "absolute",
                                bottom: -18,
                                left: 24,
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                border: "1px solid rgba(255,255,255,0.9)",
                                borderRadius: 18,
                                padding: "14px 20px",
                                boxShadow: "var(--cb-shadow-md)",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-h)",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 19,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 14px rgba(155,47,201,0.3)",
                                    flexShrink: 0,
                                }}>2</div>
                                <div style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.3 }}>
                                    <strong style={{ color: "var(--cb-ink)", display: "block", fontSize: 14, marginBottom: 1 }}>We curate your kit</strong>
                                    10-25 designer-picked pieces
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid rgba(155,47,201,0.12)", marginBottom: "clamp(64px,6vw,96px)" }} />

                    {/* STEP 3 */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(40px,5vw,72px)",
                        alignItems: "center",
                        marginBottom: "clamp(64px,6vw,96px)",
                    }} className="hiw-step-row">
                        <div style={{ position: "relative" }}>
                            <div style={{
                                borderRadius: "var(--cb-r-lg)",
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                boxShadow: "var(--cb-shadow-md)",
                            }}>
                                {img3 && (
                                    <Image
                                        src={img(img3.image)}
                                        alt="Decorated living room for a celebration"
                                        width={800} height={600}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                            <div style={{
                                position: "absolute",
                                bottom: -18,
                                left: 24,
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                border: "1px solid rgba(255,255,255,0.9)",
                                borderRadius: 18,
                                padding: "14px 20px",
                                boxShadow: "var(--cb-shadow-md)",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-h)",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 19,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 14px rgba(155,47,201,0.3)",
                                    flexShrink: 0,
                                }}>3</div>
                                <div style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.3 }}>
                                    <strong style={{ color: "var(--cb-ink)", display: "block", fontSize: 14, marginBottom: 1 }}>Decorate &amp; celebrate</strong>
                                    Under 30 minutes to style
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <span className="eyebrow">Step three</span>
                            <h2 style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 1.1, fontWeight: 700 }}>
                                Open the box. <span className="gradient-text">Host the holiday.</span>
                            </h2>
                            <p style={{ fontSize: "clamp(15.5px,1.2vw,17px)", color: "var(--cb-ink-muted)", lineHeight: 1.7 }}>
                                Your kit arrives fully staged and ready to place. Follow the styling card and most spaces are decorated
                                in under 30 minutes, no decorating skills required. Then celebrate. We&apos;ll handle the rest when you&apos;re done.
                            </p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    "Free standard shipping (2, 4 days) or express (1, 2 days)",
                                    "Kits arrive 5 days before your holiday for easy setup",
                                    "30 day and 60-day rental durations available",
                                    "Extend anytime from your dashboard, prorated daily rate",
                                ].map((item) => (
                                    <li key={item} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        fontSize: 15,
                                        color: "var(--cb-ink-muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                            border: "1.5px solid rgba(155,47,201,0.12)",
                                            flexShrink: 0,
                                            marginTop: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--cb-purple)",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid rgba(155,47,201,0.12)", marginBottom: "clamp(64px,6vw,96px)" }} />

                    {/* STEP 4 */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(40px,5vw,72px)",
                        alignItems: "center",
                    }} className="hiw-step-row">
                        <div style={{ display: "flex", flexDirection: "column", gap: 18, order: 2 }}>
                            <span className="eyebrow">Step four</span>
                            <h2 style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 1.1, fontWeight: 700 }}>
                                Return is effortless. Your deposit <span className="gradient-text">comes back.</span>
                            </h2>
                            <p style={{ fontSize: "clamp(15.5px,1.2vw,17px)", color: "var(--cb-ink-muted)", lineHeight: 1.7 }}>
                                We email a prepaid return label 3 days before your rental ends. Pack everything back in the original box,
                                leave it at your door, and we schedule a free pickup. Once we receive and inspect the kit, usually within
                                24 hours, your full deposit is on its way back to you.
                            </p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    "Prepaid return label emailed automatically, no printing needed",
                                    "Free doorstep pickup, no trips to a post office",
                                    "Inspection completed within 24 hours of receipt",
                                    "Full deposit refunded within 5 business days",
                                ].map((item) => (
                                    <li key={item} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        fontSize: 15,
                                        color: "var(--cb-ink-muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                            border: "1.5px solid rgba(155,47,201,0.12)",
                                            flexShrink: 0,
                                            marginTop: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--cb-purple)",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ position: "relative", order: 1 }}>
                            <div style={{
                                borderRadius: "var(--cb-r-lg)",
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                boxShadow: "var(--cb-shadow-md)",
                            }}>
                                {img4 && (
                                    <Image
                                        src={img(img4.image)}
                                        alt="Holiday kit packed and ready for return"
                                        width={800} height={600}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                            <div style={{
                                position: "absolute",
                                bottom: -18,
                                left: 24,
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                border: "1px solid rgba(255,255,255,0.9)",
                                borderRadius: 18,
                                padding: "14px 20px",
                                boxShadow: "var(--cb-shadow-md)",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    background: "var(--cb-gradient-h)",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 19,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 14px rgba(155,47,201,0.3)",
                                    flexShrink: 0,
                                }}>4</div>
                                <div style={{ fontSize: 13, color: "var(--cb-ink-muted)", lineHeight: 1.3 }}>
                                    <strong style={{ color: "var(--cb-ink)", display: "block", fontSize: 14, marginBottom: 1 }}>Send back, get refunded</strong>
                                    Deposit back in 5 days
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* DEPOSIT CALLOUT */}
            <section style={{ background: "var(--cb-lavender)", padding: "clamp(56px,5vw,72px) 24px" }}>
                <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hiw-deposit-inner">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <span className="eyebrow">Deposit explained</span>
                        <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1.12, fontWeight: 700 }}>
                            Your deposit is always<br /><span className="gradient-text">protected.</span>
                        </h2>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.7 }}>
                            We hold a refundable deposit, typically $50, when you reserve a kit. It isn&apos;t a charge; it&apos;s a trust
                            handshake. Return the kit in good condition and every cent comes back. Minor wear is covered automatically.
                            For accidents, our deposit protection covers up to 90% of replacement cost, you&apos;ll never owe more than
                            your deposit.
                        </p>
                    </div>
                    <div>
                        {[
                            { icon: "🔒", title: "Held at reservation", desc: "A $50 deposit is pre-authorized when you reserve. No charge until the kit ships." },
                            { icon: "📦", title: "Inspected on return", desc: "We inspect within 24 hours of receiving your kit. Detailed photos taken on every shipment." },
                            { icon: "💳", title: "Refunded in 5 days", desc: "Full deposit released within 5 business days. You'll get an email confirmation the moment it's sent." },
                            { icon: "🛡", title: "Accidents covered", desc: "Deposit protection covers up to 90% of replacement for accidental damage. You'll never owe more than you deposited." },
                        ].map((step, i) => (
                            <div key={step.title} style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 16,
                                padding: "20px 0",
                                borderBottom: i < 3 ? "1px solid rgba(155,47,201,0.12)" : "none",
                                paddingTop: i === 0 ? 0 : undefined,
                                paddingBottom: i === 3 ? 0 : undefined,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 14,
                                    background: "linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    flexShrink: 0,
                                    border: "1px solid rgba(155,47,201,0.12)",
                                }}>
                                    {step.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 3 }}>
                                        {step.title}
                                    </h4>
                                    <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SUSTAINABILITY STAT BAND */}
            <section
                style={{ background: "var(--cb-ink)", padding: "clamp(48px,5vw,64px) 24px" }}
                aria-label="CeleBrease sustainability and community statistics"
            >
                <div style={{
                    maxWidth: 1080,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 32,
                    textAlign: "center",
                }} className="hiw-stat-band-inner">
                    {[
                        { num: "78%", label: "Less holiday waste", sub: "vs. buying and storing decorations" },
                        { num: "2,400+", label: "Celebrations styled", sub: "across 40+ cities nationwide" },
                        { num: "100%", label: "Deposit returned", sub: "when kit is received in good condition" },
                    ].map((stat) => (
                        <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <span style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                                fontWeight: 800,
                                background: "var(--cb-gradient-h)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                lineHeight: 1,
                            }}>
                                {stat.num}
                            </span>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.45 }}>
                                <strong style={{ color: "#fff", display: "block" }}>{stat.label}</strong>
                                {stat.sub}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="cb-faq" id="faq">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Good to know</span>
                        <h2>You asked. We answered.</h2>
                        <p>Everything you need to know before your first kit arrives at the door.</p>
                    </div>
                    <FaqAccordion items={HIW_FAQS} />
                </div>
            </section>
        </div>
    );
}
