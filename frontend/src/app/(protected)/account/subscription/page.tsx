import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
    searchParams: Promise<{ success?: string; cancelled?: string }>;
};

export default async function SubscriptionStatusPage({ searchParams }: Props) {
    const { success, cancelled } = await searchParams;

    return (
        <main className="mt-20 flex-1 flex flex-col bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">Subscription</h3>
                    <p className="text-muted-foreground">
                        {success === "1"
                            ? "Your subscription is being activated. It may take a few seconds for everything to sync."
                            : cancelled === "1"
                              ? "Checkout was cancelled. No charge was made."
                              : "Manage your CeleBrease subscription."}
                    </p>
                </div>

                {success === "1" ? (
                    <div className="bg-white rounded-2xl border p-6 space-y-2">
                        <h2 className="text-lg lg:text-xl font-semibold text-green-600">Payment received</h2>
                        <p className="text-sm lg:text-base text-muted-foreground">
                            We&apos;re finalizing your subscription. Refresh in a moment to see your holiday slots.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link href="/account">
                                <Button variant="black">Back to my account</Button>
                            </Link>
                        </div>
                    </div>
                ) : cancelled === "1" ? (
                    <div className="bg-white rounded-2xl border p-6 space-y-2">
                        <h2 className="text-lg lg:text-xl font-semibold">No subscription created</h2>
                        <p className="text-sm lg:text-base text-muted-foreground">
                            You closed the checkout before completing payment. You can pick a plan again anytime.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link href="/subscription">
                                <Button variant="black">View plans</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border p-6">
                        <p>
                            <Link className="text-blue-600 underline" href="/subscription">
                                Pick a plan
                            </Link>{" "}
                            to start your first holiday cycle.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
