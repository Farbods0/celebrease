import { KitsContent } from "@/components/kits/kits-content";
import { KitsForm } from "@/components/kits/kits-form";
import { KitsHolidayList, KitsSidebar } from "@/components/kits/kits-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { addOnsApi, holidaysApi, inventoryApi, kitsApi, type KitTier } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Menu, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/__main/kits")({
    loader: async () => {
        const [holidays, kits, items, addOns] = await Promise.all([
            holidaysApi.list({ addon: true }),
            kitsApi.listAll(),
            inventoryApi.listAll(),
            addOnsApi.listAll(),
        ]);
        return { holidays: holidays.items, kits: kits.items, items: items.items, addOns: addOns.items };
    },
    component: RouteComponent,
});

const TIERS: { value: KitTier; label: string }[] = [
    { value: "STARTER", label: "Starter Kit" },
    { value: "PREMIUM", label: "Premium Kit" },
];

function RouteComponent() {
    const { holidays, kits, items, addOns } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedHolidayId, setSelectedHolidayId] = useState<string | null>(holidays[0]?.id ?? null);
    const [selectedTier, setSelectedTier] = useState<KitTier>("STARTER");

    const handleSelectHolidayMobile = (id: string) => {
        setSelectedHolidayId(id);
        setSidebarOpen(false);
    };

    const selectedHoliday = useMemo(() => holidays.find((h) => h.id === selectedHolidayId) ?? null, [holidays, selectedHolidayId]);

    const selectedKit = useMemo(
        () => kits.find((k) => k.holidayId === selectedHolidayId && k.tier === selectedTier) ?? null,
        [kits, selectedHolidayId, selectedTier],
    );

    return (
        <>
            <div className="px-6 py-4 bg-white flex justify-between items-center">
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold">Kits & Pricing</h1>
                    <div className="p-2 bg-muted rounded-full flex">
                        {TIERS.map((tier) => {
                            const active = tier.value === selectedTier;
                            return (
                                <button
                                    type="button"
                                    key={tier.value}
                                    onClick={() => setSelectedTier(tier.value)}
                                    className={cn(
                                        "px-6 py-2 rounded-full font-medium transition-colors",
                                        active ? "bg-white shadow-md" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {tier.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden" aria-label="Select holiday">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-4 w-[85vw] max-w-sm">
                            <SheetHeader className="p-0">
                                <SheetTitle>Select Holiday</SheetTitle>
                            </SheetHeader>
                            <KitsHolidayList
                                holidays={holidays}
                                isLoading={false}
                                selectedHolidayId={selectedHolidayId}
                                onSelect={handleSelectHolidayMobile}
                                showHeading={false}
                            />
                        </SheetContent>
                    </Sheet>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={holidays.length === 0}>
                                <Plus className="size-4" />
                                <span className="hidden sm:inline">Add New Kit Tier</span>
                                <span className="sm:hidden">Add Kit</span>
                            </Button>
                        </DialogTrigger>
                        {createOpen && (
                            <KitsForm
                                holidays={holidays}
                                defaultHolidayId={selectedHolidayId ?? undefined}
                                defaultTier={selectedTier}
                                onClose={() => setCreateOpen(false)}
                            />
                        )}
                    </Dialog>
                </div>
            </div>

            <main className="flex w-full">
                <KitsSidebar holidays={holidays} isLoading={false} selectedHolidayId={selectedHolidayId} onSelect={setSelectedHolidayId} />

                <KitsContent
                    kit={selectedKit}
                    holiday={selectedHoliday}
                    holidays={holidays}
                    items={items}
                    addOns={addOns}
                    selectedTier={selectedTier}
                />
            </main>
        </>
    );
}
