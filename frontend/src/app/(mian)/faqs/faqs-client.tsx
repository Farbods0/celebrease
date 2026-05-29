"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cancel01Icon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const FAQ_SECTIONS: { cat: string; items: { q: string; a: string }[] }[] = [
    {
        cat: "Getting Started",
        items: [
            {
                q: "How does CeleBrease work?",
                a: "Choose a holiday kit from our catalog, select your rental tier and duration, add it to your cart, and checkout. We deliver your beautifully curated kit, you celebrate, then we pick it up. Your deposit is refunded once items are returned in good condition.",
            },
            {
                q: "Do I need a subscription to rent a kit?",
                a: "No! You can rent individual kits without a subscription. However, subscribing unlocks holiday slots, discounts, and priority access — making it significantly more affordable if you celebrate multiple holidays per year.",
            },
            {
                q: "What areas do you currently deliver to?",
                a: "We currently serve the greater New York, Los Angeles, Chicago, and Miami metro areas. We're expanding rapidly — enter your ZIP code at checkout to confirm availability in your area.",
            },
        ],
    },
    {
        cat: "Kits & Tiers",
        items: [
            {
                q: "What is the difference between Starter, Premium, and Ultimate kits?",
                a: "Starter kits include the core décor essentials (15–20 pieces). Premium kits add upgraded focal pieces and more variety (25–35 pieces). Ultimate kits are our luxury tier with the most premium pieces and the highest impact (40–55 pieces). All tiers are curated by professional interior designers.",
            },
            {
                q: "Can I customize what's in my kit?",
                a: "All kits come with a professionally curated selection. You can add optional Add-Ons at checkout to expand your kit with additional themed pieces, props, or specialty items.",
            },
            {
                q: "Are the items cleaned before delivery?",
                a: "Absolutely. Every item is thoroughly inspected, cleaned, and repaired between rentals. We take hygiene and quality seriously — your kit arrives fresh and ready to display.",
            },
        ],
    },
    {
        cat: "Returns & Deposits",
        items: [
            {
                q: "How does the deposit work?",
                a: "A refundable deposit is charged at checkout alongside your rental fee. The deposit is fully refunded within 3–5 business days after we receive your kit back in good condition. Normal wear is expected; damage to items may result in partial or full deposit forfeiture.",
            },
            {
                q: "How do I return my kit?",
                a: "We schedule a free pickup from the same address we delivered to. You'll receive a return window reminder before your rental period ends. Simply re-pack the items in the provided storage packaging and leave it ready for collection.",
            },
            {
                q: "What happens if an item is damaged?",
                a: "Accidents happen! If an item is damaged, contact our support team immediately. Minor damage may be covered with no deposit impact. Significant or unreported damage may result in a partial deduction from your deposit. We always handle these cases fairly and transparently.",
            },
        ],
    },
    {
        cat: "Subscription",
        items: [
            {
                q: "Can I cancel my subscription?",
                a: "Yes. You can cancel anytime from your account settings. Your subscription remains active until the end of the current billing period. We don't believe in trapping subscribers — no cancellation fees.",
            },
            {
                q: "What happens to my holiday slots if I don't use them?",
                a: "Unused holiday slots expire at the end of your subscription year. We'll send you two reminders before they expire so you don't miss out. Slots cannot be transferred to the next year.",
            },
        ],
    },
];

export default function FAQsClient() {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return FAQ_SECTIONS;
        return FAQ_SECTIONS.map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term),
            ),
        })).filter((section) => section.items.length > 0);
    }, [search]);

    return (
        <>
            {/* --- HERO --- */}
            <section
                className="px-6 py-20 text-center"
                style={{ background: "linear-gradient(180deg, #F5EEFF 0%, #FFFFFF 100%)" }}
            >
                <div className="max-w-2xl mx-auto">
                    <span
                        className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full border mb-5"
                        style={{ background: "#F5EEFF", color: "#9B2FC9", borderColor: "#DDB8F0" }}
                    >
                        💬 Frequently Asked Questions
                    </span>
                    <h1
                        className="font-black leading-tight mb-3"
                        style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#111827" }}
                    >
                        Got Questions?{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #9B2FC9, #DC0075)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            We Have Answers.
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                        Everything you need to know about renting, returning, and celebrating with CeleBrease.
                    </p>

                    {/* Search input */}
                    <div className="relative max-w-md mx-auto">
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <HugeiconsIcon icon={Search} size={18} />
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions..."
                            className="w-full px-4 py-3.5 pl-11 pr-11 rounded-full text-sm outline-none bg-white border-1.5"
                            style={{
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderColor: "#DDB8F0",
                                boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
                            }}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-full bg-muted text-muted-foreground border-none cursor-pointer"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* --- FAQ CONTENT --- */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-3">🤷</div>
                            <h3 className="text-xl font-bold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-5">
                                Try different keywords or browse all categories below.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="font-semibold text-sm bg-transparent border-none cursor-pointer"
                                style={{ color: "#9B2FC9" }}
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        filtered.map((section) => (
                            <div key={section.cat} className="mb-10">
                                <h2
                                    className="text-xl font-extrabold mb-4 pb-3 border-b-2"
                                    style={{ color: "#111827", borderColor: "#F3F4F6" }}
                                >
                                    {section.cat}
                                </h2>
                                <Accordion>
                                    {section.items.map((item, i) => (
                                        <AccordionItem key={i} value={`${section.cat}-${i}`}>
                                            <AccordionTrigger>{item.q}</AccordionTrigger>
                                            <AccordionContent>{item.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))
                    )}

                    {/* Still have questions CTA */}
                    <div
                        className="rounded-3xl p-9 text-center mt-6"
                        style={{ background: "linear-gradient(135deg, #F5EEFF, #FCE7F3)" }}
                    >
                        <div className="text-4xl mb-3">💬</div>
                        <h3 className="font-extrabold text-xl mb-2" style={{ color: "#111827" }}>
                            Still have questions?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5">
                            Our support team is here to help. Reach out and we&apos;ll get back to you within a few hours.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link
                                href="/contact"
                                className="inline-block px-6 py-3 rounded-full font-bold text-sm text-white no-underline"
                                style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/subscription"
                                className="inline-block px-6 py-3 rounded-full font-semibold text-sm no-underline border-2"
                                style={{ color: "#9B2FC9", borderColor: "#DDB8F0" }}
                            >
                                View Plans
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
