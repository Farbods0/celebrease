"use client";

import { subscribeNewsletter } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function CallToAction() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await subscribeNewsletter({ email });
            toast.success("You're on the list! Watch for holiday inspiration in your inbox.");
            setEmail("");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="cb-cta-band">
            <div className="cb-cta-inner">
                <h2>Be first to the party</h2>
                <p>Early access to new holidays, member pricing, and designer styling guides.</p>
                <form className="cb-news-form" onSubmit={onSubmit}>
                    <input
                        type="email"
                        placeholder="you@email.com"
                        aria-label="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Subscribing…" : "Subscribe"}
                    </button>
                </form>
                <p className="cb-cta-fine">No spam, just seasonal inspiration. Unsubscribe anytime.</p>
            </div>
        </section>
    );
}
