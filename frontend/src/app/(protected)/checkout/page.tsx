"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyAddress, getMyCarts, getMySubscription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CheckoutDetails from "./checkout-details";

export default function CheckoutPage() {
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
                <div className="bg-muted rounded-2xl border p-6 space-y-2">
                    <h2 className="text-lg lg:text-xl font-semibold">Oops! No items to checkout</h2>
                    <p className="text-sm lg:text-base text-muted-foreground">
                        Browse the catalog to find a kit for your next celebration.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <Link href="/catalog">
                            <Button variant="black" size="sm">
                                Back to Catalog
                            </Button>
                        </Link>
                    </div>
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
                <CheckoutDetails carts={carts.items} address={address ?? null} subscription={activeSubscription} />
            </div>
        </main>
    );
}
