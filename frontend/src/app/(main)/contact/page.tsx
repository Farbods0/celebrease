import { FaqAccordion } from "@/components/main/faq-accordion";
import { ContactForm } from "./contact-form";

const CONTACT_FAQS = [
    {
        q: "How quickly will I hear back?",
        a: "Our support team replies within 4 hours on weekdays and within 8 hours on weekends. For urgent kit issues (delivery, damage) we prioritize same-hour callbacks.",
    },
    {
        q: "How do I return a kit?",
        a: "Use your account dashboard to request a pickup. We'll email you a prepaid label and arrange doorstep collection within two business days. Your deposit is refunded within five days of our inspection.",
    },
    {
        q: "Something arrived damaged, what now?",
        a: "Take a photo and contact us within 48 hours of delivery. We'll send a replacement piece, swap your kit for another holiday, or credit your account, whichever works best for you.",
    },
    {
        q: "Can I change my subscription plan?",
        a: "Absolutely. Log into your account and visit the Subscription tab to upgrade, downgrade, or cancel anytime. Changes take effect at your next billing cycle. Need help? We're happy to assist here too.",
    },
];

export default function ContactPage() {
    return (
        <div className="cb">
            {/* HERO */}
            <section
                className="contact-hero"
                style={{
                    background: "radial-gradient(1100px 500px at 50% 0%, #FAEFFF 0%, var(--cb-lavender) 55%, #fff 100%)",
                    paddingBlock: "clamp(56px,7vw,96px)",
                    paddingInline: 24,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* decorative glow */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 480,
                        height: 480,
                        right: -160,
                        top: -180,
                        background: "radial-gradient(circle, rgba(220,0,117,0.14), transparent 70%)",
                        filter: "blur(24px)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "relative",
                        maxWidth: 680,
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <span className="eyebrow">Contact &amp; Support</span>
                    <h1 style={{ fontSize: "clamp(2.6rem, 5.4vw, 4rem)", lineHeight: 1.06, fontWeight: 800 }}>
                        We&apos;d love to <span className="gradient-text">hear from you.</span>
                    </h1>
                    <p style={{ color: "var(--cb-ink-muted)", fontSize: "clamp(16px, 1.4vw, 18px)", lineHeight: 1.65, maxWidth: 540 }}>
                        Questions about a kit, a return, a partnership, or just want to say hello? Our team responds within hours, not days.
                    </p>
                </div>
            </section>

            {/* TWO-COLUMN BODY */}
            <div
                style={{
                    padding: "clamp(56px,6vw,80px) 24px clamp(64px,7vw,96px)",
                }}
            >
                <div
                    style={{
                        maxWidth: "var(--cb-max)",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(32px, 4vw, 64px)",
                        alignItems: "start",
                    }}
                    className="contact-body-inner"
                >
                    {/* LEFT, form (client component) */}
                    <ContactForm />

                    {/* RIGHT, info + FAQ */}
                    <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Info top card */}
                        <div
                            style={{
                                background: "var(--cb-lavender)",
                                borderRadius: "var(--cb-r-card)",
                                padding: "clamp(24px, 3vw, 36px)",
                            }}
                        >
                            <h2 style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", marginBottom: 8 }}>Reach us directly</h2>
                            <p style={{ color: "var(--cb-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                                We&apos;re a small, passionate team, every message is read by a real person who cares about your celebration.
                            </p>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 14,
                                }}
                                className="info-cards"
                            >
                                {/* Card: Email */}
                                <div className="info-card" style={{ background: "#fff", border: "1px solid var(--cb-line)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "var(--cb-shadow-xs)" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cb-gradient-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }} aria-hidden="true">📧</div>
                                    <div>
                                        <h4 style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 3 }}>Email support</h4>
                                        <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>
                                            <a href="mailto:support@celebrease.com" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>support@celebrease.com</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Card: Response time */}
                                <div className="info-card" style={{ background: "#fff", border: "1px solid var(--cb-line)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "var(--cb-shadow-xs)" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cb-gradient-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }} aria-hidden="true">⚡</div>
                                    <div>
                                        <h4 style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 3 }}>Response time</h4>
                                        <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>Usually within 4 hours, 7 days a week</p>
                                    </div>
                                </div>

                                {/* Card: Support hours */}
                                <div className="info-card" style={{ background: "#fff", border: "1px solid var(--cb-line)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "var(--cb-shadow-xs)" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cb-gradient-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }} aria-hidden="true">🕐</div>
                                    <div>
                                        <h4 style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 3 }}>Support hours</h4>
                                        <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>
                                            Mon, Fri 8 am, 8 pm ET<br />Sat, Sun 10 am, 6 pm ET
                                        </p>
                                    </div>
                                </div>

                                {/* Card: Partnerships */}
                                <div className="info-card" style={{ background: "#fff", border: "1px solid var(--cb-line)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "var(--cb-shadow-xs)" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cb-gradient-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }} aria-hidden="true">🤝</div>
                                    <div>
                                        <h4 style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 3 }}>Partnerships &amp; press</h4>
                                        <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.5 }}>
                                            <a href="mailto:hello@celebrease.com" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>hello@celebrease.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social pills */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                padding: "20px 24px",
                                background: "var(--cb-gradient-soft)",
                                borderRadius: 16,
                                flexWrap: "wrap",
                            }}
                        >
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)", whiteSpace: "nowrap" }}>Follow along</span>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <a
                                    href="#"
                                    aria-label="Follow CeleBrease on Instagram"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid var(--cb-line)", borderRadius: "var(--cb-r-pill)", padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "var(--cb-ink)", boxShadow: "var(--cb-shadow-xs)" }}
                                >
                                    📷 Instagram
                                </a>
                                <a
                                    href="#"
                                    aria-label="Follow CeleBrease on TikTok"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid var(--cb-line)", borderRadius: "var(--cb-r-pill)", padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "var(--cb-ink)", boxShadow: "var(--cb-shadow-xs)" }}
                                >
                                    ♪ TikTok
                                </a>
                                <a
                                    href="#"
                                    aria-label="Follow CeleBrease on Facebook"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid var(--cb-line)", borderRadius: "var(--cb-r-pill)", padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "var(--cb-ink)", boxShadow: "var(--cb-shadow-xs)" }}
                                >
                                    f Facebook
                                </a>
                            </div>
                        </div>

                        {/* FAQ lite */}
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid var(--cb-line)",
                                borderRadius: "var(--cb-r-card)",
                                padding: "clamp(22px, 3vw, 34px)",
                                boxShadow: "var(--cb-shadow-xs)",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
                                <span className="eyebrow">Quick answers</span>
                                <h3 style={{ fontSize: "1.25rem" }}>Common questions</h3>
                                <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                    Check below for instant answers, or send us a note above.
                                </p>
                            </div>
                            <FaqAccordion items={CONTACT_FAQS} />
                        </div>
                    </div>
                    {/* /right column */}
                </div>
            </div>
        </div>
    );
}
