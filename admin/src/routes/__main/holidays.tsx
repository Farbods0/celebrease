import { StatCard } from "@/components/dashboard/stat-card";
import { HolidayCard } from "@/components/holidays/holiday-card";
import { HolidayForm } from "@/components/holidays/holiday-form";
import { HolidayTable } from "@/components/holidays/holiday-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { holidaysApi, type ApiHoliday } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Layers, Package, Plus, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/holidays")({
    loader: () => holidaysApi.listAll(),
    component: RouteComponent,
});

const CATEGORY_TABS = [
    { value: "ALL", label: "All" },
    { value: "TRADITIONAL", label: "Traditional" },
    { value: "CULTURAL", label: "Cultural" },
    { value: "EVENT_BASED", label: "Event-Based" },
] as const;

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiHoliday | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    const allItems = data.items;

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((h) => h.name.toLowerCase().includes(q));
        }
        if (categoryFilter !== "ALL") {
            result = result.filter((h) => h.category === categoryFilter);
        }
        return result;
    }, [allItems, searchQuery, categoryFilter]);

    const kpis = useMemo(() => {
        const total = allItems.length;
        const active = allItems.filter((h) => h.isActive).length;
        const totalKits = allItems.reduce((sum, h) => sum + h.kits.length, 0);
        const featured = allItems.filter((h) => h.sortOrder > 0 && h.sortOrder <= 3).length;
        return { total, active, totalKits, featured };
    }, [allItems]);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Holidays</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Manage holidays and their visibility</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New Holiday</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <HolidayForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Holidays" value={kpis.total} icon={CalendarCheck} iconBg="bg-primary/10" iconColor="text-primary" />
                <StatCard label="Active Holidays" value={kpis.active} icon={Layers} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <StatCard label="Total Kits" value={kpis.totalKits} icon={Package} iconBg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard label="Featured" value={kpis.featured} icon={Star} iconBg="bg-amber-50" iconColor="text-amber-600" />
            </div>

            {/* Search + Category Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search holidays..."
                        className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                    {CATEGORY_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setCategoryFilter(tab.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                categoryFilter === tab.value
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <HolidayTable items={filteredItems} onEdit={setEditItem} />

            <div className="space-y-4 md:hidden">
                {filteredItems.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No holidays found</p>
                ) : (
                    filteredItems.map((item) => <HolidayCard key={item.id} item={item} onEdit={setEditItem} />)
                )}
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <HolidayForm holiday={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
