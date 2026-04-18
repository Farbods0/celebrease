import { InventoryCard } from "@/components/inventory/inventory-card";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { INVENTORY, TOTAL_ITEMS } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, SlidersHorizontal, Upload } from "lucide-react";

export const Route = createFileRoute("/inventory")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = INVENTORY;

    return (
        <main className="flex w-full">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex sticky top-18 h-[calc(100vh-4.5rem)] w-80 shrink-0 border-r py-6">
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
                        <Button>
                            <Plus className="size-4" />
                            <span>Add Inventory Item</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile filter trigger */}
                <div className="-mt-2 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full bg-card">
                                <SlidersHorizontal className="size-4" />
                                All Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <SheetHeader>
                                <SheetTitle>All Filters</SheetTitle>
                            </SheetHeader>
                            <InventoryFilters />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop table */}
                <InventoryTable items={items} />

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                    {items.map((item) => (
                        <InventoryCard key={item.id} item={item} />
                    ))}
                </div>
            </main>
        </main>
    );
}
