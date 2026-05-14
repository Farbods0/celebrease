"use client";

import { GiftCard } from "@/components/icons";
import { subscribeNewsletter } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CallToAction() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);

        try {
            await subscribeNewsletter({ email });
            setEmail("");
            toast.success("Thanks for subscribing. Check your inbox for updates.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to subscribe. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section
            style={{
                position: "relative",
                backgroundImage: `url('/gradient/footer.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
            }}
        >
            <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
                <div className="flex flex-col items-center gap-6 lg:flex-row xl:gap-12 ">
                    <GiftCard />
                    <div className="text-center lg:text-left space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold font-heading whitespace-nowrap">Join the Celebration Club</h2>
                        <p className="text-white/60">
                            Be the first to discover new holidays, decor kits, and
                            <br className="hidden lg:block" /> subscriber rewards.
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <form onSubmit={handleSubmit} className="h-14 pl-6 pr-1.75 bg-white/20 text-white/60 rounded-full flex items-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="flex-1 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white text-black px-6 py-2.25 rounded-full font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>
                    <p className="text-center lg:text-left">
                        <span className="text-white/60">By clicking submit, you agree to our</span>{" "}
                        <Link href="/terms" className="font-medium underline">
                            Terms of Service
                        </Link>{" "}
                        <span className="text-white/60">and</span>{" "}
                        <Link href="/privacy" className="font-medium underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
