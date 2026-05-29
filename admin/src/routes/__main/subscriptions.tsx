import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { SubscriptionView } from "@/components/subscriptions/subscription-view";
import { Dialog } from "@/components/ui/dialog";
import { subscriptionsApi, type ApiSubscription, type SubscriptionStatus } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/subscriptions")({
    loader: () => subscriptionsApi.list(),
    component: RouteComponent,
});

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiSubscription | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "ALL">("ALL");

    const filteredItems = useMemo(() => {
        let result = data.items;
        if (statusFilter !== "ALL") {
            result = result.filter((s) => s.status === statusFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (s) => s.user.name.toLowerCase().includes(q) || s.plan.name.toLowerCase().includes(q) || s.user.email.toLowerCase().includes(q)
            );
        }
        return result;
    }, [data.items, searchQuery, statusFilter]);

    const handleUpdated = (next: ApiSubscription) => {
        setData((prev) => ({
            ...prev,
            items: prev.items.map((s) => (s.id === next.id ? next : s)),
        }));
        setSelectedItem(next);
    };

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Subscriptions</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Manage subscriber plans, holiday cycles, and shipping triggers</p>
            </div>

            <div className="flex items-center gap-1 flex-wrap">
                {(["ALL", "ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"] as const).map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            statusFilter === s
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                        {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or plan..."
                    className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <SubscriptionTable items={filteredItems} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {filteredItems.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No subscriptions found</p>
                    ) : (
                        filteredItems.map((item) => <SubscriptionCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <SubscriptionView item={selectedItem} onUpdated={handleUpdated} />}
            </Dialog>
        </main>
    );
}
