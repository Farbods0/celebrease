import { Button } from "@/components/ui/button";
import { getMyCarts } from "@/lib/api";
import Link from "next/link";
import CheckoutDetails from "./checkout-details";

export default async function CheckoutPage() {
    const data = await getMyCarts();

    if (!data.items.length) {
        return (
            <main className="flex-1 container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="bg-muted rounded-2xl border p-6 space-y-2">
                    <h2 className="text-lg lg:text-xl font-semibold">Oops! You have no items to checkout</h2>
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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                    <CheckoutDetails />
                </div>
            </div>
        </main>
    );
}
