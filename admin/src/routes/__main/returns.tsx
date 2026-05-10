import { ReturnCard } from "@/components/returns/return-card";
import { ReturnTable } from "@/components/returns/return-table";
import { ReturnView } from "@/components/returns/return-view";
import { Dialog } from "@/components/ui/dialog";
import { ordersApi, type ApiOrder } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/returns")({
    loader: () => ordersApi.list({ filter: "returns" }),
    component: RouteComponent,
});

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiOrder | null>(null);

    const items = data.items;

    function handleUpdated(updated: ApiOrder) {
        const stillReturning =
            updated.status === "RETURN_REQUESTED" ||
            updated.status === "RETURN_IN_TRANSIT" ||
            updated.status === "RETURN_RECEIVED" ||
            updated.status === "INSPECTED";

        setData((prev) => ({
            ...prev,
            items: stillReturning
                ? prev.items.map((o) => (o.id === updated.id ? updated : o))
                : prev.items.filter((o) => o.id !== updated.id),
        }));

        if (stillReturning) {
            setSelectedItem(updated);
        } else {
            setSelectedItem(null);
        }
    }

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Returns</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Process returns, release deposits, and document damages</p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <ReturnTable items={items} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No active returns</p>
                    ) : (
                        items.map((item) => <ReturnCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <ReturnView item={selectedItem} onUpdated={handleUpdated} />}
            </Dialog>
        </main>
    );
}
