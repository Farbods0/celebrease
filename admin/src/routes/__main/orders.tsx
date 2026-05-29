import { OrderCard } from "@/components/orders/order-card";
import { OrderTable } from "@/components/orders/order-table";
import { OrderView } from "@/components/orders/order-view";
import { Dialog } from "@/components/ui/dialog";
import { ordersApi, type ApiOrder } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/orders")({
    loader: () => ordersApi.list(),
    component: RouteComponent,
});

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiOrder | null>(null);

    const items = data.items;

    function handleOrderUpdated(updated: ApiOrder) {
        // Update the order in the local list
        setData((prev) => ({
            ...prev,
            items: prev.items.map((o) => (o.id === updated.id ? updated : o)),
        }));
        // Also update the selected item so the dialog reflects changes
        setSelectedItem(updated);
    }

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Orders</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Track rental, shipment, deposits, and return statuses</p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <OrderTable items={items} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No orders found</p>
                    ) : (
                        items.map((item) => <OrderCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <OrderView item={selectedItem} onUpdated={handleOrderUpdated} />}
            </Dialog>
        </main>
    );
}
