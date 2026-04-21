import { CustomerCard } from "@/components/customers/customer-card";
import { CustomerTable } from "@/components/customers/customer-table";
import { CUSTOMERS, type Customer } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog } from "../components/ui/dialog";
import CustomerView from "../components/customers/customer-view";

export const Route = createFileRoute("/customers")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = CUSTOMERS;
    const [selectedItem, setSelectedItem] = useState<Customer | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Customers</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    All customer accounts, order history, subscription status, deposits, and analytics
                </p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                {/* Desktop table */}
                <CustomerTable items={items} onView={setSelectedItem} />

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                    {items.map((item, index) => (
                        <CustomerCard key={index} item={item} onView={setSelectedItem} />
                    ))}
                </div>
                {selectedItem && <CustomerView item={selectedItem} />}
            </Dialog>
        </main>
    );
}
