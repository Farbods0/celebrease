import { PlanCard } from "@/components/plans/plan-card";
import { PlanForm } from "@/components/plans/plan-form";
import { PlanTable } from "@/components/plans/plan-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { plansApi, type ApiPlan } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__main/plans")({
    loader: () => plansApi.list(),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiPlan | null>(null);

    const items = data.items;
    const existingCodes = items.map((p) => p.code);
    const canAddMore = existingCodes.length < 3;

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Subscription Plans</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Manage the Starter, Premium, and Ultimate tiers shown on the marketing page
                    </p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={!canAddMore}>
                            <Plus className="size-4" />
                            <span>Add Plan</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <PlanForm existingCodes={existingCodes} onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <PlanTable items={items} onEdit={setEditItem} />

            <div className="space-y-4 md:hidden">
                {items.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No plans found</p>
                ) : (
                    items.map((item) => <PlanCard key={item.id} item={item} onEdit={setEditItem} />)
                )}
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <PlanForm plan={editItem} existingCodes={existingCodes} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
