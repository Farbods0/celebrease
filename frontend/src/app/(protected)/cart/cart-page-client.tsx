"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyCarts, getMySubscription } from "@/lib/api";
import { ShoppingBag01Icon, Tick } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CartDetails from "./cart-details";
import YouMightAlsoLove from "./you-might-also-love";

export default function CartPageClient() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["carts"],
        queryFn: () => getMyCarts(),
    });

    const { data: subscription } = useQuery({
        queryKey: ["subscription", "me"],
        queryFn: () => getMySubscription(),
    });

    const isActiveSubscriber = subscription?.status === "ACTIVE";

    if (isLoading) {
        return (
            <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-7 md:h-8 lg:h-9 w-28 md:w-32 lg:w-36" />
                        {[...Array(2)].map((_, index) => (
                            <Skeleton key={index} className="h-52 rounded-2xl" />
                        ))}
                    </div>
                    <Skeleton className="h-full rounded-2xl" />
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

    if (!data?.items.length) {
        return (
            <main className="flex-1 container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="rounded-3xl border border-dashed p-16 flex flex-col items-center gap-5 text-center">
                    <div className="size-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5EEFF, #FCE7F3)" }}>
                        <HugeiconsIcon icon={ShoppingBag01Icon} size={36} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Your cart is empty</h2>
                        <p className="text-base text-muted-foreground max-w-sm">
                            Browse our curated holiday décor kits and add one to your cart to get started.
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

    const cartHolidayIds = data.items.map((c) => c.holiday.id);

    return (
        <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                <CartDetails carts={data.items} subscription={isActiveSubscriber ? subscription : null} />
                {!isActiveSubscriber && (
                    <div className="mt-6 bg-linear-to-br from-primary to-secondary rounded-2xl p-6 md:p-8 lg:p-10 text-white">
                        <h3 className="text-2xl md:text-3xl font-semibold font-heading">Want To Celebrate All Year Long?</h3>
                        <p className="mt-2 text-sm text-white/80 max-w-lg">
                            Join our 3-Holiday Subscription Plan &mdash; choose three holidays per year, with free returns and exclusive
                            pricing.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center gap-3">
                                <HugeiconsIcon icon={Tick} size={18} /> Save up to 20% on each kit
                            </li>
                            <li className="flex items-center gap-3">
                                <HugeiconsIcon icon={Tick} size={18} /> Pause, skip, or bank a holiday anytime
                            </li>
                            <li className="flex items-center gap-3">
                                <HugeiconsIcon icon={Tick} size={18} /> Priority availability during peak seasons
                            </li>
                        </ul>
                        <Button
                            nativeButton={false}
                            className="mt-6"
                            render={<Link href="/subscription">Explore Subscription Plans &rarr;</Link>}
                        />
                    </div>
                )}
            </div>
            <YouMightAlsoLove excludeIds={cartHolidayIds} />
        </main>
    );
}
