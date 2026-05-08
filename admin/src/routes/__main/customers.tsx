import { CustomerCard } from "@/components/customers/customer-card";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerView } from "@/components/customers/customer-view";
import { Dialog } from "@/components/ui/dialog";
import { customersApi, type ApiCustomer } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/customers")({
    loader: () => customersApi.list(),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();
    const [selectedItem, setSelectedItem] = useState<ApiCustomer | null>(null);

    const items = data.items;

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Customers</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    All customer accounts, order history, subscription status, deposits, and analytics
                </p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <CustomerTable items={items} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No customers found</p>
                    ) : (
                        items.map((item) => <CustomerCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <CustomerView item={selectedItem} />}
            </Dialog>
        </main>
    );
}
