"use client";

import { useState } from "react";
import { FaqAccordion, FaqItem } from "@/components/main/faq-accordion";
import Link from "next/link";

const CATEGORIES = [
    { key: "all", label: "All Questions" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "kits", label: "Kits & Rentals" },
    { key: "deposits", label: "Deposits & Returns" },
    { key: "shipping", label: "Shipping" },
    { key: "account", label: "Account" },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];

const FAQ_GROUPS: { cat: Exclude<CatKey, "all">; icon: string; title: string; items: FaqItem[] }[] = [
    {
        cat: "subscriptions",
        icon: "🎟",
        title: "Subscriptions",
        items: [
            { q: "What does a CeleBrease subscription include?", a: "Your subscription grants you a set number of holiday slots per year, 3 slots on Starter, 6 on Premium, and unlimited on Ultimate. Each slot lets you rent one curated kit for one holiday. Your plan also includes free shipping both ways, a refundable deposit on every kit, and access to seasonal add-on extras." },
            { q: "Can I switch plans after I subscribe?", a: "Yes. You can upgrade or downgrade your plan at any time from your account dashboard. Upgrades take effect immediately and you'll be prorated for the difference. Downgrades apply at the start of your next billing cycle. Any unused holiday slots from your current plan carry forward when you upgrade." },
            { q: "How does billing work, monthly vs. yearly?", a: "You choose at checkout. Monthly billing charges each month and can be cancelled with 30 days notice. Yearly billing is charged once annually and saves you up to 20%. Yearly subscribers also get priority kit selection for high-demand holidays like Christmas and Diwali before monthly subscribers." },
            { q: "What happens to unused holiday slots at year-end?", a: "Unused slots never expire. They roll forward automatically into your next subscription year. If you cancel your subscription, you have 90 days to use any banked slots before they expire." },
            { q: "Can I cancel my subscription?", a: "Absolutely, no penalties, no fine print. Cancel anytime from your account dashboard. Monthly plans deactivate at the end of your current billing period. Yearly plans are non-refundable once billed, but you retain full access and all holiday slots for the remainder of the year." },
            { q: "Do you offer gift subscriptions?", a: "Yes. Purchase a 3-, 6-, or 12-month gift subscription from your account or the checkout page. The recipient gets a personalized email with instructions to activate their plan, they pick their own holidays and kit tiers. Gift subscriptions are perfect for new homeowners, hosts, and anyone who loves a beautifully dressed home." },
        ],
    },
    {
        cat: "kits",
        icon: "🎁",
        title: "Kits & Rentals",
        items: [
            { q: "What's inside a CeleBrease kit?", a: "Each kit contains 10, 25 hand-selected décor pieces curated by our in-house design team for one specific holiday. You'll also find a styling card with room-by-room placement guidance and a pre-paid return shipping label. Starter kits focus on signature pieces; Premium and Ultimate kits add statement lighting, textiles, and seasonal accents." },
            { q: "How long is the rental period?", a: "Rental periods are 30 or 60 days depending on the kit tier you choose. Your rental period starts on the delivery date, not the ship date. We send reminder emails 7 days and 3 days before your return date so there are never any surprises." },
            { q: "Can I extend my rental?", a: "Yes. From your account dashboard, you can extend by 7, 14, or 30 days at a prorated daily rate based on your kit's original rental price. Extensions must be requested at least 48 hours before your original return date to guarantee availability. Extensions are billed immediately on confirmation." },
            { q: "What if I don't love the kit when it arrives?", a: "Contact us within 48 hours of delivery. We'll send a swap for a different holiday kit, issue a full account credit, or, in rare cases, arrange a replacement if stock is available. We want every holiday to feel exactly right." },
            { q: "Can I skip a holiday I already reserved?", a: "Yes. You can skip any upcoming holiday from your account dashboard up to 14 days before the rental start date. The slot rolls forward to next year, no holiday is ever lost from your plan. Within 14 days of the start date, skipping is possible but the slot will be used." },
            { q: "Are kits child- and pet-safe?", a: "All kits use non-toxic finishes and materials tested for durability. Fragile or small items are clearly labelled in the packing list. For homes with small children or curious pets, use the \"Kid-Friendly\" filter in the catalog, these kits exclude breakables and use soft, durable materials throughout." },
        ],
    },
    {
        cat: "deposits",
        icon: "💳",
        title: "Deposits & Returns",
        items: [
            { q: "How much is the deposit and when is it charged?", a: "The deposit amount varies by kit tier, typically $40 for Starter, $65 for Premium, and $90 for Ultimate. It is charged at checkout when you reserve your kit, separate from your rental fee. The deposit is held securely and refunded in full once we receive your kit back in good condition." },
            { q: "How and when do I get my deposit back?", a: "We inspect the kit within 24 hours of receiving it. If everything looks good, your deposit is released within 5 business days to the original payment method. You'll receive an email confirmation the moment we initiate the refund. Normal wear and tear is always covered, only deliberate or severe damage affects your refund." },
            { q: "What counts as normal wear vs. damage?", a: "Normal wear includes minor scuffs, light dust, and small scratches consistent with careful home use, fully covered, no deduction. Damage includes broken pieces, missing items, staining from spills, or fire/heat damage. We photograph every kit before and after each rental so assessments are always fair and documented." },
            { q: "What if something breaks during my rental?", a: "Accidents happen. Our deposit protection covers up to 90% of the replacement cost for accidental damage. You will never owe more than your original deposit amount. Report any breakage before returning the kit using the \"Report Damage\" button in your account, early reporting typically results in a higher refund." },
            { q: "How do I return my kit?", a: "Simply repack the kit using the original packaging and boxes (which are designed for safe reuse), attach the pre-paid return label included in your shipment, and drop it off at any UPS or FedEx location, or schedule a free doorstep pickup from your account dashboard. That's it." },
            { q: "What if I return the kit late?", a: "Late returns accrue a daily overdue fee at the prorated rate of your kit rental. We send 3 reminder emails before your return date. If life gets complicated, contact us, we are always willing to grant a short grace period when you reach out in advance." },
        ],
    },
    {
        cat: "shipping",
        icon: "🚚",
        title: "Shipping",
        items: [
            { q: "Is shipping really free?", a: "Yes, standard shipping both ways is free on every kit rental, regardless of plan tier or location. Your kit ships in a branded, reusable protective box. A pre-paid return label is always included inside. We currently ship to all 48 contiguous U.S. states." },
            { q: "How fast will my kit arrive?", a: "Standard delivery takes 3, 5 business days. If you want it faster, Express shipping ($15 upgrade) delivers in 1, 2 business days. For time-sensitive holidays, we recommend booking your kit at least 10 days before the holiday to allow buffer time. You'll get a tracking link the moment your kit ships." },
            { q: "Can I change my delivery address after booking?", a: "Yes, as long as your kit has not yet shipped. Go to your account dashboard, find the active order, and update the delivery address. Once the kit ships, address changes must be handled directly through the carrier using the tracking number we provide." },
            { q: "What if my kit arrives damaged in transit?", a: "Take photos immediately and contact us within 48 hours of delivery. We will ship a replacement kit at no charge and arrange collection of the damaged shipment, you will not be charged for any transit damage or asked to return items that arrived broken." },
            { q: "Do you ship to Alaska, Hawaii, or internationally?", a: "Not yet. We currently serve the 48 contiguous U.S. states. Alaska, Hawaii, U.S. territories, and international addresses are not available at this time. We are actively working to expand coverage, join the waitlist on our contact page to be notified when your region opens." },
        ],
    },
    {
        cat: "account",
        icon: "👤",
        title: "Account",
        items: [
            { q: "How do I create a CeleBrease account?", a: "Head to the Sign Up page and create an account using your email or Google. Once your email is verified, you can browse kits, choose a subscription plan, and book your first holiday. The whole setup takes under 3 minutes." },
            { q: "Can I have multiple addresses on my account?", a: "Yes. You can save multiple delivery addresses in your account settings, useful for sending kits to a second home, a family member, or a vacation rental. Select the address you want at checkout. Each kit can ship to a different address." },
            { q: "How do I update my payment method?", a: "Go to Account → Billing in your dashboard. You can add, remove, or set a default card at any time. Changes take effect immediately for new purchases. Subscriptions will use the updated card at the next billing date." },
            { q: "Where can I see my order history and active rentals?", a: "Your full order history, current active rentals, return deadlines, and deposit statuses are all in your account under the Orders tab. You can also request extensions, initiate returns, or report issues directly from each order detail page." },
            { q: "How do I change which holidays are in my plan?", a: "From Account → Subscription, you'll see your current holiday slots. Any slot marked as Pending (not yet reserved or shipped) can be reassigned to a different holiday with a single click. Slots that have already shipped or are actively rented cannot be changed until that rental is completed and returned." },
            { q: "How do I delete my account?", a: "You can request account deletion from Account → Settings → Privacy. Accounts can only be deleted once all active rentals are returned and any outstanding deposits or balances are resolved. After deletion, your data is removed from our systems within 30 days in accordance with our privacy policy." },
        ],
    },
];

export default function FaqsClient() {
    const [active, setActive] = useState<CatKey>("all");

    const visibleGroups =
        active === "all" ? FAQ_GROUPS : FAQ_GROUPS.filter((g) => g.cat === active);

    return (
        <div className="cb">
            {/* ===== HERO-LITE ===== */}
            <header
                style={{
                    background:
                        "radial-gradient(1100px 500px at 50% 0%, #FAEFFF 0%, #F6F1FB 55%, #fff 100%)",
                    padding: "clamp(64px,8vw,100px) 24px clamp(48px,5vw,72px)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* glow blobs */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 440,
                        height: 440,
                        right: -140,
                        top: -160,
                        background: "radial-gradient(circle, rgba(220,0,117,0.14), transparent 70%)",
                        filter: "blur(20px)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 360,
                        height: 360,
                        left: -120,
                        bottom: -120,
                        background: "radial-gradient(circle, rgba(155,47,201,0.12), transparent 70%)",
                        filter: "blur(20px)",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
                    {/* eyebrow pill */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            color: "var(--cb-purple)",
                            fontSize: 12.5,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "7px 14px",
                            borderRadius: "var(--cb-r-pill)",
                            boxShadow: "var(--cb-shadow-xs)",
                            marginBottom: 22,
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
                        />
                        Help Center
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(2.4rem,5.2vw,3.9rem)",
                            lineHeight: 1.06,
                            fontWeight: 800,
                            marginBottom: 20,
                        }}
                    >
                        Your questions,{" "}
                        <span className="gradient-text">answered.</span>
                    </h1>

                    <p
                        style={{
                            fontSize: "clamp(17px,1.4vw,19px)",
                            color: "var(--cb-ink-muted)",
                            lineHeight: 1.65,
                            maxWidth: 580,
                            margin: "0 auto",
                        }}
                    >
                        Everything you need to know about renting, returning, billing, and
                        celebrating, before your first kit even ships.
                    </p>
                </div>
            </header>

            {/* ===== CATEGORY FILTER ===== */}
            <nav
                aria-label="FAQ categories"
                style={{ background: "#fff", padding: "36px 24px 0" }}
            >
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <div
                        role="list"
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            paddingBottom: 4,
                        }}
                    >
                        {CATEGORIES.map((cat) => {
                            const isActive = active === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    role="listitem"
                                    aria-pressed={isActive}
                                    onClick={() => setActive(cat.key)}
                                    style={{
                                        height: 40,
                                        padding: "0 20px",
                                        borderRadius: "var(--cb-r-pill)",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: isActive ? "#fff" : "var(--cb-ink-muted)",
                                        background: isActive ? "var(--cb-gradient-h)" : "var(--cb-lavender)",
                                        border: "1.5px solid transparent",
                                        boxShadow: isActive ? "0 4px 14px rgba(155,47,201,0.28)" : "none",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        transition: "all .2s",
                                    }}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ===== FAQ GROUPS ===== */}
            <main
                id="faq-main"
                style={{
                    background: "#fff",
                    padding: "clamp(48px,5vw,72px) 24px clamp(56px,6vw,88px)",
                }}
            >
                {visibleGroups.map((group) => (
                    <section
                        key={group.cat}
                        aria-labelledby={`cat-${group.cat}`}
                        style={{ maxWidth: 760, margin: "0 auto 56px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                marginBottom: 24,
                            }}
                        >
                            <div
                                aria-hidden="true"
                                style={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 14,
                                    background: "var(--cb-gradient-soft)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                    flexShrink: 0,
                                    border: "1px solid var(--cb-line)",
                                }}
                            >
                                {group.icon}
                            </div>
                            <h2
                                id={`cat-${group.cat}`}
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    color: "var(--cb-ink)",
                                }}
                            >
                                {group.title}
                            </h2>
                        </div>
                        <FaqAccordion items={group.items} />
                    </section>
                ))}
            </main>

            {/* ===== CONTACT CTA BAND ===== */}
            <section
                aria-labelledby="contact-heading"
                style={{
                    background: "var(--cb-lavender)",
                    padding: "clamp(56px,6vw,80px) 24px",
                }}
            >
                <div className="faq-contact-inner">
                    {/* Copy */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <span className="eyebrow">Still have questions?</span>
                        <h2
                            id="contact-heading"
                            style={{
                                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                                lineHeight: 1.12,
                                fontWeight: 700,
                            }}
                        >
                            We&apos;re here to help, always.
                        </h2>
                        <p
                            style={{
                                color: "var(--cb-ink-muted)",
                                fontSize: 16,
                                lineHeight: 1.7,
                            }}
                        >
                            Our customer experience team responds within 2 hours during
                            business hours. For urgent rental or return issues, live chat is
                            available 7 days a week.
                        </p>
                        <div style={{ marginTop: 4, display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <Link
                                href="/contact"
                                className="btn-fill-grad"
                                style={{ width: "fit-content", padding: "0 28px" }}
                            >
                                Send a Message
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="btn-out-grad"
                                style={{ width: "fit-content", padding: "0 28px" }}
                            >
                                How It Works →
                            </Link>
                        </div>
                    </div>

                    {/* Contact options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            {
                                icon: "✉",
                                title: "Email Support",
                                body: "Detailed questions, billing issues, or damage reports",
                                link: { href: "mailto:hello@celebrease.com", label: "hello@celebrease.com" },
                            },
                            {
                                icon: "💬",
                                title: "Live Chat",
                                body: "Available Mon, Sun, 9 am, 9 pm ET, fastest response",
                                link: { href: "/contact", label: "Open live chat →" },
                            },
                            {
                                icon: "📦",
                                title: "Return Help",
                                body: "Print a new label, schedule pickup, or report transit damage",
                                link: { href: "/account", label: "Go to your account →" },
                            },
                        ].map((opt) => (
                            <div
                                key={opt.title}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 16,
                                    background: "#fff",
                                    border: "1px solid var(--cb-line)",
                                    borderRadius: "var(--cb-r-card)",
                                    padding: 20,
                                    boxShadow: "var(--cb-shadow-xs)",
                                }}
                            >
                                <div
                                    aria-hidden="true"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 14,
                                        background: "var(--cb-gradient-soft)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        flexShrink: 0,
                                        border: "1px solid var(--cb-line)",
                                    }}
                                >
                                    {opt.icon}
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            fontFamily: "inherit",
                                            fontSize: 15,
                                            fontWeight: 700,
                                            color: "var(--cb-ink)",
                                            marginBottom: 3,
                                        }}
                                    >
                                        {opt.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: 13.5,
                                            color: "var(--cb-ink-muted)",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {opt.body}
                                    </p>
                                    <Link
                                        href={opt.link.href}
                                        style={{
                                            color: "var(--cb-purple)",
                                            fontWeight: 600,
                                            fontSize: 14,
                                            display: "inline-block",
                                            marginTop: 4,
                                        }}
                                    >
                                        {opt.link.label}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
