import { OrderCard } from "@/components/orders/order-card";
import { OrderTable } from "@/components/orders/order-table";
import { OrderView } from "@/components/orders/order-view";
import { Dialog } from "@/components/ui/dialog";
import { ordersApi, type ApiOrder, type ListOrdersParams } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import * as z from "zod";

const searchSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(20),
    search: z.string().optional(),
    filter: z.enum(["all", "active", "returns", "completed"]).optional().default("all"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const Route = createFileRoute("/__main/orders")({
    validateSearch: searchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => {
        const params: ListOrdersParams = { page: deps.page, limit: deps.limit };
        if (deps.search) params.search = deps.search;
        if (deps.filter && deps.filter !== "all") params.filter = deps.filter as "active" | "returns";
        if (deps.startDate) params.startDate = deps.startDate;
        if (deps.endDate) params.endDate = deps.endDate;
        return ordersApi.list(params);
    },
    component: RouteComponent,
});

const FILTER_TABS = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "returns", label: "Returns" },
    { value: "completed", label: "Completed" },
] as const;

function RouteComponent() {
    const initialData = Route.useLoaderData();
    const { page, search: searchParam, filter, startDate, endDate } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<ApiOrder | null>(null);
    const [searchInput, setSearchInput] = useState(searchParam ?? "");

    // Re-sync data when loader returns new data
    if (initialData !== data && initialData.items !== data.items) {
        setData(initialData);
    }

    const items = data.items;
    const totalPages = Math.max(1, Math.ceil(data.total / 20));

    function handleOrderUpdated(updated: ApiOrder) {
        setData((prev) => ({
            ...prev,
            items: prev.items.map((o) => (o.id === updated.id ? updated : o)),
        }));
        setSelectedItem(updated);
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ search: { page: 1, search: searchInput || undefined, filter } });
    };

    const handleFilterChange = (newFilter: string) => {
        navigate({ search: { page: 1, search: searchParam, filter: newFilter as typeof filter } });
    };

    const handlePageChange = (newPage: number) => {
        navigate({ search: { page: newPage, search: searchParam, filter } });
    };

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Orders</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Track rental, shipment, deposits, and return statuses</p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search orders..."
                        className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </form>
                <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleFilterChange(tab.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                filter === tab.value
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <input
                    type="date"
                    value={startDate ?? ""}
                    onChange={(e) => navigate({ search: (prev) => ({ ...prev, startDate: e.target.value || undefined, page: undefined }) })}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                    type="date"
                    value={endDate ?? ""}
                    onChange={(e) => navigate({ search: (prev) => ({ ...prev, endDate: e.target.value || undefined, page: undefined }) })}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {(startDate || endDate) && (
                    <button
                        type="button"
                        onClick={() => navigate({ search: (prev) => ({ ...prev, startDate: undefined, endDate: undefined }) })}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                        Clear dates
                    </button>
                )}
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <OrderTable items={items} onView={setSelectedItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-12">No orders yet</p>
                    ) : (
                        items.map((item) => <OrderCard key={item.id} item={item} onView={setSelectedItem} />)
                    )}
                </div>

                {selectedItem && <OrderView item={selectedItem} onUpdated={handleOrderUpdated} />}
            </Dialog>

            {/* Pagination */}
            {data.total > 0 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        Page {page} of {totalPages} ({data.total} total)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="size-3.5" />
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                        >
                            Next
                            <ChevronRight className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
