import { ReturnCard } from "@/components/returns/return-card";
import { ReturnTable } from "@/components/returns/return-table";
import { RETURNS, type Return } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/returns")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = RETURNS;
    const [selectedItem, setSelectedItem] = useState<Return | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Returns</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Process returns, release deposits, and document damages</p>
            </div>

            {/* Desktop table */}
            <ReturnTable items={items} onView={setSelectedItem} />

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
                {items.map((item, index) => (
                    <ReturnCard key={index} item={item} onView={setSelectedItem} />
                ))}
            </div>
        </main>
    );
}
