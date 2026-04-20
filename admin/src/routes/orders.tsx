import { OrderCard } from "@/components/orders/order-card";
import { OrderTable } from "@/components/orders/order-table";
import { ORDERS, type Order } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import OrderView from "../components/orders/order-view";

export const Route = createFileRoute("/orders")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = ORDERS;
    const [selectedItem, setSelectedItem] = useState<Order | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Orders</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Track rental, shipment, deposits, and return statuses</p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                {/* Desktop table */}
                <OrderTable items={items} onView={setSelectedItem} />

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                    {items.map((item, index) => (
                        <OrderCard key={index} item={item} onView={setSelectedItem} />
                    ))}
                </div>

              {selectedItem && <OrderView item={selectedItem} />}
            </Dialog>
        </main>
    );
}
