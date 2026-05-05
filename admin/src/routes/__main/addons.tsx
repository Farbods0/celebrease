import { AddOnCard } from "@/components/addons/addon-card";
import { AddonForm } from "@/components/addons/addon-form";
import { AddOnTable } from "@/components/addons/addon-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { addOnsApi, type ApiAddOn } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__main/addons")({
    loader: () => addOnsApi.listAll(),
    component: RouteComponent,
});

function RouteComponent() {
    const { items } = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<ApiAddOn | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Add-Ons Manager</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Manage holiday-specific add-on inventory, pricing, deposit rules, and holiday mapping
                    </p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New Add-On</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <AddonForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <AddOnTable items={items} onEdit={setEditing} />

            <div className="space-y-4 md:hidden">
                {items.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No add-ons yet.</p>
                ) : (
                    items.map((item) => <AddOnCard key={item.id} item={item} onEdit={setEditing} />)
                )}
            </div>

            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                {editing && <AddonForm item={editing} onClose={() => setEditing(null)} />}
            </Dialog>
        </main>
    );
}
