"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

type Step = {
    emoji: string;
    title: string;
    description: string;
};

const steps: Step[] = [
    {
        emoji: "🗓️",
        title: "Choose Your Holidays",
        description:
            "Pick from 13+ holidays across traditional, cultural, and event-based celebrations. No commitment required.",
    },
    {
        emoji: "🛒",
        title: "Pick Your Kit Tier",
        description:
            "Choose Starter, Premium, or Ultimate. Each tier is curated by interior designers with more pieces and premium quality.",
    },
    {
        emoji: "📅",
        title: "Select Your Dates",
        description:
            "Choose when you want delivery. We schedule pickup at the end of your rental period — 30 or 60 days.",
    },
    {
        emoji: "🚚",
        title: "We Deliver, You Unbox",
        description:
            "Your kit arrives cleaned, packaged, and ready. Setup takes under 20 minutes and looks incredible.",
    },
    {
        emoji: "🎉",
        title: "Celebrate",
        description:
            "Enjoy your beautifully decorated space for the full rental period. We send return reminders so you never forget.",
    },
    {
        emoji: "♻️",
        title: "We Pick Up and Refund",
        description:
            "We collect everything at your door. Your full deposit is refunded within 3 days once items pass inspection.",
    },
];

const benefits = [
    {
        emoji: "🎨",
        title: "Designer Curated",
        description:
            "Every kit is assembled and reviewed by professional interior designers for maximum visual impact.",
    },
    {
        emoji: "✨",
        title: "Always Fresh",
        description:
            "Every item is cleaned to hotel standards before it ships. You receive perfection every time.",
    },
    {
        emoji: "💚",
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
];

export default function HowItWorksClient() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <main className="bg-white">
            {/* Hero */}
            <section
                className="text-center px-6 pt-14 pb-8"
                style={{ background: "linear-gradient(160deg, #F5EEFF 0%, #fff 60%)" }}
            >
                <h1 className="mx-auto max-w-2xl text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    Celebrating Has Never Been{" "}
                    <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                    >
                        This Simple
                    </span>
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
                                    <span className="text-4xl">{step.emoji}</span>
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
                        Why CeleBrease?
                    </h2>
                    <p className="mt-3 text-center text-base md:text-lg text-muted-foreground">
                        The smarter way to celebrate every occasion beautifully.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {benefits.map((b) => (
                            <div
                                key={b.title}
                                className="rounded-2xl bg-white border border-border/60 p-7 shadow-sm"
                            >
                                <div className="text-4xl mb-3">{b.emoji}</div>
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
                        render={<Link href="/catalog">Browse Kits</Link>}
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
