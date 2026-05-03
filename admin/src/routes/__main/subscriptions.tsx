import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { SubscriptionView } from "@/components/subscriptions/subscription-view";
import { Dialog } from "@/components/ui/dialog";
import { subscriptionsApi, type ApiSubscription } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/subscriptions")({
    loader: () => subscriptionsApi.list(),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();
    const [selectedItem, setSelectedItem] = useState<ApiSubscription | null>(null);

    const items = data.items;

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Subscriptions</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Manage subscriber plans, holiday cycles, and shipping triggers</p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <SubscriptionTable items={items} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No subscriptions found</p>
                    ) : (
                        items.map((item) => <SubscriptionCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <SubscriptionView item={selectedItem} />}
            </Dialog>
        </main>
    );
}
