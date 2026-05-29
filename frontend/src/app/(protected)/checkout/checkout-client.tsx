"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyAddress, getMyCarts, getMySubscription } from "@/lib/api";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CheckoutDetails from "./checkout-details";
import { CheckoutProgress, CheckoutTrustBadges } from "./checkout-progress";

export default function CheckoutClient() {
    const {
        data: carts,
        isLoading: cartsLoading,
        isError: cartsError,
    } = useQuery({
        queryKey: ["carts"],
        queryFn: () => getMyCarts(),
    });

    const {
        data: address,
        isLoading: addressLoading,
        isError: addressError,
    } = useQuery({
        queryKey: ["address"],
        queryFn: () => getMyAddress(),
    });

    const { data: subscription } = useQuery({
        queryKey: ["subscription", "me"],
        queryFn: () => getMySubscription(),
    });

    const isLoading = cartsLoading || addressLoading;
    const isError = cartsError || addressError;
    const activeSubscription = subscription?.status === "ACTIVE" ? subscription : null;

    if (isLoading) {
        return (
            <main className="mt-20 bg-muted">
                <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12">
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-7 md:h-8 lg:h-9 w-28 md:w-32 lg:w-36" />
                        <Skeleton className="h-6 w-88" />
                    </div>
                    <div className="h-108 grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                        <Skeleton className="h-full rounded-2xl" />
                        <Skeleton className="h-full rounded-2xl" />
                    </div>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="flex-1 container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="bg-destructive/5 rounded-2xl border p-6 space-y-2">
                    <h2 className="text-lg lg:text-xl font-semibold">Something went wrong</h2>
                    <p className="text-sm lg:text-base text-muted-foreground">Something went wrong. Please try again later.</p>
                </div>
            </main>
        );
    }

    if (!carts?.items.length) {
        return (
            <main className="flex-1 container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="rounded-3xl border border-dashed p-16 flex flex-col items-center gap-5 text-center">
                    <div className="size-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5EEFF, #FCE7F3)" }}>
                        <HugeiconsIcon icon={ShoppingCart01Icon} size={36} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Nothing to check out</h2>
                        <p className="text-base text-muted-foreground max-w-sm">
                            Add a holiday kit to your cart before proceeding to checkout.
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="inline-block px-8 py-3 rounded-full text-sm font-bold text-white no-underline"
                        style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                    >
                        Browse Catalog →
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12">
                <div className="mb-6 space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">Checkout</h3>
                    <p className="text-muted-foreground">Almost done! Confirm your details and reserve your kits.</p>
                </div>
                <CheckoutProgress activeStep={1} />
                <CheckoutDetails carts={carts.items} address={address ?? null} subscription={activeSubscription} />
                <CheckoutTrustBadges />
            </div>
        </main>
    );
}
