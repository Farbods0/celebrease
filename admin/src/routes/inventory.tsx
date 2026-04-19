import { InventoryCard } from "@/components/inventory/inventory-card";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { InventoryTable } from "@/components/inventory/inventory-table";
import InventoryView from "@/components/inventory/inventory-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { INVENTORY, TOTAL_ITEMS, type InventoryItem } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, SlidersHorizontal, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/inventory")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = INVENTORY;
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    return (
        <main className="flex w-full">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex sticky top-18 h-[calc(100vh-4.5rem)] w-80 shrink-0 border-r p-6">
                <InventoryFilters />
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Inventory</h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Showing {items.length} of {TOTAL_ITEMS} items
                        </p>
                    </div>

                    <div className="w-full grid grid-cols-2 sm:w-max sm:flex gap-4">
                        <Button variant="outline">
                            <Upload className="size-4" />
                            <span>Upload CSV</span>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="size-4" />
                                    <span>Add Inventory Item</span>
                                </Button>
                            </DialogTrigger>
                            <InventoryForm />
                        </Dialog>
                    </div>
                </div>

                {/* Mobile filter trigger */}
                <div className="-mt-2 md:hidden">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full bg-card">
                                <SlidersHorizontal className="size-4" />
                                All Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs">
                            <DialogHeader>
                                <DialogTitle>All Filters</DialogTitle>
                            </DialogHeader>
                            <InventoryFilters />
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    {/* Desktop table */}
                    <InventoryTable items={items} onView={setSelectedItem} />

                    {/* Mobile cards */}
                    <div className="space-y-4 md:hidden">
                        {items.map((item) => (
                            <InventoryCard key={item.id} item={item} onView={setSelectedItem} />
                        ))}
                    </div>

                    {selectedItem ? <InventoryView item={selectedItem} /> : null}
                </Dialog>
            </main>
        </main>
    );
}
