import { InventoryCard } from "@/components/inventory/inventory-card";
import { initialFilterState, InventoryFilters, type InventoryFilterState } from "@/components/inventory/inventory-filters";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { InventoryTable } from "@/components/inventory/inventory-table";
import InventoryView from "@/components/inventory/inventory-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { inventoryApi, type ApiItem } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/inventory")({
    loader: () => inventoryApi.listAll(),
    component: RouteComponent,
});

function RouteComponent() {
    const { items } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);
    const [editing, setEditing] = useState<ApiItem | null>(null);
    const [filters, setFilters] = useState<InventoryFilterState>(initialFilterState);

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const it of items) if (it.category) set.add(it.category);
        return [...set].sort();
    }, [items]);

    const filtered = useMemo(() => {
        const search = filters.search.trim().toLowerCase();
        return items.filter((item) => {
            if (search && !item.name.toLowerCase().includes(search) && !item.sku.toLowerCase().includes(search)) {
                return false;
            }
            if (filters.holidayId !== "all") {
                const inHoliday = item.kitItems.some((ki) => ki.kit.holidayId === filters.holidayId);
                if (!inHoliday) return false;
            }
            if (!filters.tiers.has("ALL")) {
                const tiers = new Set(item.kitItems.map((ki) => ki.kit.tier));
                const ok = [...filters.tiers].some((t) => t !== "ALL" && tiers.has(t));
                if (!ok) return false;
            }
            if (filters.statuses.size > 0 && !filters.statuses.has(item.status)) {
                return false;
            }
            if (filters.category !== "all" && item.category !== filters.category) {
                return false;
            }
            if (filters.lowStockOnly) {
                const lowStock = (item.inventory?.availableQty ?? 0) <= item.lowStockThreshold && item.lowStockThreshold > 0;
                if (!lowStock) return false;
            }
            return true;
        });
    }, [items, filters]);

    return (
        <main className="flex w-full">
            <aside className="hidden md:flex sticky top-18 h-[calc(100vh-4.5rem)] w-80 shrink-0 border-r p-6">
                <InventoryFilters categories={categories} state={filters} onChange={setFilters} />
            </aside>

            <main className="flex-1 min-w-0 flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Inventory</h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Showing {filtered.length} of {items.length} items
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="size-4" />
                                <span>Add Inventory Item</span>
                            </Button>
                        </DialogTrigger>
                        {createOpen && <InventoryForm onClose={() => setCreateOpen(false)} />}
                    </Dialog>
                </div>

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
                            <InventoryFilters categories={categories} state={filters} onChange={setFilters} />
                        </DialogContent>
                    </Dialog>
                </div>

                <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <InventoryTable
                        items={filtered}
                        onView={setSelectedItem}
                        onEdit={(item) => {
                            setEditing(item);
                            setSelectedItem(null);
                        }}
                    />

                    <div className="space-y-4 md:hidden">
                        {filtered.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-10">No inventory items found.</p>
                        ) : (
                            filtered.map((item) => (
                                <InventoryCard
                                    key={item.id}
                                    item={item}
                                    onView={setSelectedItem}
                                    onEdit={(item) => {
                                        setEditing(item);
                                        setSelectedItem(null);
                                    }}
                                />
                            ))
                        )}
                    </div>

                    {selectedItem ? <InventoryView item={selectedItem} /> : null}
                </Sheet>

                <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                    {editing && <InventoryForm item={editing} onClose={() => setEditing(null)} />}
                </Dialog>
            </main>
        </main>
    );
}
