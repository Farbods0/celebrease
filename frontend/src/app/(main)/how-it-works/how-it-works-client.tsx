"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

type Step = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const steps: Step[] = [
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        title: "Choose Your Holidays",
        description: "Pick from 13+ holidays, no commitment required.",
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
        ),
        title: "Pick Your Kit Tier",
        description: "Choose Starter, Premium, or Ultimate, each designer-curated for maximum visual impact.",
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        title: "Select Your Dates",
        description: "Schedule delivery and we handle pickup at the end of your 30 or 60 day rental.",
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
        ),
        title: "We Deliver, You Unbox",
        description: "Your kit arrives cleaned and packaged, setup takes under 20 minutes.",
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
            </svg>
        ),
        title: "Celebrate",
        description: "Enjoy your beautifully decorated space, we send return reminders so you never forget.",
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9B2FC9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <polyline points="23 20 23 14 17 14"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
        ),
        title: "We Pick Up and Refund",
        description: "We collect at your door and return your full deposit within 3 days.",
    },
];

const benefits = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5"/>
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5"/>
            </svg>
        ),
        title: "Designer Curated",
        description:
            "Every kit is assembled and reviewed by professional interior designers for maximum visual impact.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        title: "Always Fresh",
        description:
            "Every item is cleaned to hotel standards before it ships. You receive perfection every time.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
        ),
        title: "Sustainable Choice",
        description:
            "Renting means one kit serves dozens of families instead of ending up in landfill after one use.",
    },
];

const faqs: Array<{ q: string; a: string }> = [
    {
        q: "Do I need a subscription?",
        a: "No! You can rent kits one-off. A subscription saves you up to 20% and gives you dedicated holiday slots each year.",
    },
    {
        q: "What if something breaks?",
        a: "Accidents happen. Minor wear is expected and covered. For significant damage, a partial deposit may be retained.",
    },
    {
        q: "Can I change my kit mid-rental?",
        a: "Contact our support team and we'll do our best to swap or supplement your kit.",
    },
    {
        q: "When does my deposit get refunded?",
        a: "Within 3 business days of our return inspection. Once we verify all items are in good condition, the deposit is returned to your original payment method.",
    },
    {
        q: "How long is the rental period?",
        a: "You choose, 30 days or 60 days. The 60-day option is great for extended celebrations or holidays with a longer decorating season.",
    },
    {
        q: "Do you deliver everywhere?",
        a: "We currently deliver across the continental US. Free delivery and free pickup are included with every rental.",
    },
    {
        q: "Can I skip a holiday on my subscription?",
        a: "Yes. You can pause or skip a holiday slot from your account dashboard at any time before your delivery window is confirmed.",
    },
    {
        q: "How are items cleaned between rentals?",
        a: "Every item is professionally cleaned and sanitized to hotel-grade standards between every rental. We inspect each piece before packaging.",
    },
];

export default function HowItWorksClient() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <main className="bg-white">
            {/* Hero */}
            <section
                className="text-center px-6 pb-12"
                style={{ background: "linear-gradient(160deg, #F5EEFF 0%, #fff 60%)" }}
            >
                <div className="h-20" />{/* navbar spacer */}
                <h1 className="mx-auto max-w-2xl text-4xl md:text-5xl font-extrabold tracking-tight">
                    <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                    >
                        Celebrating Beautifully
                    </span>
                    <span className="text-foreground"> Has Never Been Simpler</span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base md:text-lg text-muted-foreground">
                    We handle everything from delivery to pickup. You just enjoy the celebration.
                </p>
            </section>

            {/* 6-Step Process */}
            <section className="mx-auto max-w-4xl px-6 py-10 md:py-12">
                <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    How It Works
                </h2>

                <div className="mt-12 space-y-10 md:space-y-14">
                    {steps.map((step, index) => {
                        const reverse = index % 2 === 1;
                        return (
                            <div
                                key={step.title}
                                className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                                    reverse ? "md:flex-row-reverse" : ""
                                }`}
                            >
                                <div
                                    className="shrink-0 flex flex-col items-center justify-center gap-1 size-28 rounded-3xl shadow-md"
                                    style={{
                                        background: "linear-gradient(135deg, #F5F3FF, #F5EEFF)",
                                    }}
                                >
                                    {step.icon}
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                                        Step {index + 1}
                                    </span>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Why CeleBrease Benefits */}
            <section
                className="px-6 py-16 md:py-20"
                style={{ background: "linear-gradient(160deg, #F5EEFF 0%, #fff 60%)" }}
            >
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        Why Rent, Not Buy?
                    </h2>
                    <p className="mt-3 text-center text-base md:text-lg text-muted-foreground">
                        Beautiful décor without the clutter, cost, or environmental guilt.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {benefits.map((b) => (
                            <div
                                key={b.title}
                                className="rounded-2xl bg-white border border-border/60 p-7 shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}>{b.icon}</div>
                                <h3 className="text-lg font-extrabold text-foreground mb-2">{b.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="mx-auto max-w-2xl px-6 py-16 md:py-20">
                <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-10">
                    Quick Answers
                </h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => {
                        const open = openFaq === i;
                        return (
                            <div
                                key={faq.q}
                                className="rounded-2xl border-2 border-border/60 overflow-hidden bg-white"
                            >
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    onClick={() => setOpenFaq(open ? null : i)}
                                    className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-base font-bold text-foreground transition-colors ${
                                        open ? "bg-muted/60" : "bg-white hover:bg-muted/40"
                                    }`}
                                >
                                    <span>{faq.q}</span>
                                    <span
                                        className="text-2xl shrink-0 text-primary transition-transform"
                                        style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}
                                        aria-hidden
                                    >
                                        +
                                    </span>
                                </button>
                                {open && (
                                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed bg-muted/40">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="px-6 py-20 text-center"
                style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
            >
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    Ready to Get Started?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-base md:text-lg text-white/85">
                    Browse our kits or choose a subscription plan and start celebrating beautifully.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <Button
                        nativeButton={false}
                        className="bg-white text-primary hover:bg-white/90 font-extrabold rounded-full px-8 py-3 h-auto text-base"
                        render={<Link href="/shop-kits">Browse Kits</Link>}
                    />
                    <Button
                        nativeButton={false}
                        variant="outline"
                        className="bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:text-white font-bold rounded-full px-8 py-3 h-auto text-base"
                        render={<Link href="/subscription">View Subscription Plans</Link>}
                    />
                </div>
            </section>
        </main>
    );
}
