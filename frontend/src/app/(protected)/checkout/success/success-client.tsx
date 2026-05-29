"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const timeline = [
    { icon: "✅", label: "Order Confirmed", date: "Today", done: true },
    { icon: "🧹", label: "Kit Being Prepared", date: "In 1–2 days", done: false },
    { icon: "📦", label: "Shipped to You", date: "In 3–5 days", done: false },
    { icon: "🎉", label: "Delivered & Enjoy!", date: "On your start date", done: false },
    { icon: "♻️", label: "Return Pickup", date: "On your end date", done: false },
    { icon: "💰", label: "Deposit Refunded", date: "Within 3 days", done: false },
];

export default function CheckoutSuccessClient() {
    return (
        <main className="mt-16 bg-muted">
            <div className="mx-auto max-w-2xl px-6 py-12 md:py-16 text-center">
                <div
                    className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full text-4xl"
                    style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                >
                    🎉
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    You&apos;re All Set!
                </h1>
                <p className="mt-3 text-base md:text-lg text-muted-foreground">
                    Your holiday kit rental is confirmed. Get ready to celebrate beautifully.
                </p>
                <div className="mt-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                    Payment confirmed — check your email for the receipt
                </div>

                {/* Timeline */}
                <div className="mt-10 rounded-2xl bg-white border border-border/60 p-6 md:p-8 text-left">
                    <h3 className="text-center text-base font-bold text-foreground mb-6">
                        What Happens Next
                    </h3>
                    <ol className="flex flex-col">
                        {timeline.map((step, i) => (
                            <li key={step.label} className="flex gap-4 items-start">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex size-9 items-center justify-center rounded-full text-base shrink-0 ${
                                            step.done
                                                ? "text-white"
                                                : "bg-white border-2 border-border/70"
                                        }`}
                                        style={
                                            step.done
                                                ? { background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }
                                                : undefined
                                        }
                                    >
                                        {step.icon}
                                    </div>
                                    {i < timeline.length - 1 && (
                                        <div className="my-1 w-0.5 h-7 bg-border/70" />
                                    )}
                                </div>
                                <div className="pt-1.5">
                                    <p
                                        className={`text-sm font-semibold ${
                                            step.done ? "text-primary" : "text-foreground/80"
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.date}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Info boxes */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                        <p className="text-xl mb-1.5">💚</p>
                        <p className="text-sm font-bold text-emerald-900">Deposit Protected</p>
                        <p className="text-xs text-emerald-800/80 mt-0.5">
                            Returned in full when items come back in good condition.
                        </p>
                    </div>
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                        <p className="text-xl mb-1.5">📧</p>
                        <p className="text-sm font-bold text-primary">Confirmation Sent</p>
                        <p className="text-xs text-primary/80 mt-0.5">
                            Check your email for full order details and tracking.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button
                        nativeButton={false}
                        variant="black"
                        className="rounded-full px-7 h-11 font-bold"
                        render={<Link href="/account">View My Account</Link>}
                    />
                    <Button
                        nativeButton={false}
                        variant="outline"
                        className="rounded-full px-7 h-11 font-semibold border-2 border-primary/40 text-primary hover:bg-primary/10"
                        render={<Link href="/catalog">Browse More Kits</Link>}
                    />
                </div>
            </div>
        </main>
    );
}
