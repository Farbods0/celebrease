import { Button } from "@/components/ui/button";
import { getMyCarts } from "@/lib/api";
import { Tick } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import CartDetails from "./cart-details";

export default async function CartPage() {
    const data = await getMyCarts();

    if (!data.items.length) {
        return (
            <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="bg-muted rounded-2xl border p-6 space-y-2">
                    <h2 className="text-lg lg:text-xl font-semibold">Oops! Your cart is empty</h2>
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
        <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                <CartDetails carts={data.items} />

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
                    <Button className="mt-6" render={<Link href="/subscription">Explore Subscription Plans &rarr;</Link>} />
                </div>
            </div>
        </main>
    );
}
