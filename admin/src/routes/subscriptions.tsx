import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { SUBSCRIPTIONS, type Subscription } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/subscriptions")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = SUBSCRIPTIONS;
    const [selectedItem, setSelectedItem] = useState<Subscription | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Subscriptions</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Manage subscriber plans, holiday cycles, and shipping triggers</p>
            </div>

            {/* Desktop table */}
            <SubscriptionTable items={items} onView={setSelectedItem} />

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
                {items.map((item, index) => (
                    <SubscriptionCard key={index} item={item} onView={setSelectedItem} />
                ))}
            </div>
        </main>
    );
}
