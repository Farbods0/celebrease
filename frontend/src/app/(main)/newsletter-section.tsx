"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type EmailState = "idle" | "success" | "error";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [emailState, setEmailState] = useState<EmailState>("idle");

    const handleSubscribe = () => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
            setEmailState("error");
            return;
        }
        // TODO: wire to POST /api/newsletter/subscribe
        setEmailState("success");
    };

    return (
        <section className="bg-linear-to-r from-primary to-secondary py-14 md:py-16 lg:py-20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold">Join The Celebration Club</h3>
                    <p className="text-white/80 text-sm md:text-base max-w-md">
                        Be the first to discover new holidays, decor kits, and subscriber rewards.
                    </p>
                </div>
                <div className="w-full md:w-auto min-w-[320px]">
                    <div className="flex rounded-full overflow-hidden shadow-lg">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailState("idle");
                            }}
                            placeholder="Enter your email address"
                            className="flex-1 rounded-none rounded-l-full border-0 focus-visible:ring-0 h-12"
                        />
                        <Button
                            type="button"
                            onClick={handleSubscribe}
                            className="rounded-none rounded-r-full h-12 px-6 bg-white text-primary hover:bg-white/90 font-bold"
                        >
                            Subscribe
                        </Button>
                    </div>
                    {emailState === "error" && (
                        <p className="text-red-200 text-xs mt-2">Please enter a valid email address.</p>
                    )}
                    {emailState === "success" && (
                        <p className="text-green-200 text-xs mt-2">You&apos;re subscribed! Welcome to the club.</p>
                    )}
                    <p className="text-white/50 text-xs mt-2">
                        By subscribing you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </section>
    );
}
