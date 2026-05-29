"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutCancelClient() {
    return (
        <main className="mt-16 bg-muted">
            <div className="mx-auto max-w-xl px-6 py-16 md:py-20 text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-amber-100 text-3xl">
                    ⚠️
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                    Checkout Cancelled
                </h1>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                    Your payment was not completed. Your cart is still saved — pick up where you left off whenever you&apos;re ready.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button
                        nativeButton={false}
                        variant="black"
                        className="rounded-full px-7 h-11 font-bold"
                        render={<Link href="/cart">Return to Cart</Link>}
                    />
                    <Button
                        nativeButton={false}
                        variant="outline"
                        className="rounded-full px-7 h-11 font-semibold border-2 border-primary/40 text-primary hover:bg-primary/10"
                        render={<Link href="/catalog">Browse Catalog</Link>}
                    />
                </div>
            </div>
        </main>
    );
}
