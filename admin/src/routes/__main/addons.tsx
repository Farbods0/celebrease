import { AddOnCard } from "@/components/addons/addon-card";
import { AddonEdit } from "@/components/addons/addon-edit";
import { AddonForm } from "@/components/addons/addon-form";
import { AddOnTable } from "@/components/addons/addon-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ADD_ONS, type AddOn } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__main/addons")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = ADD_ONS;
    const [selectedItem, setSelectedItem] = useState<AddOn | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Add-Ons Manager</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Manage holiday-specific add-on inventory, pricing, deposit rules, and holiday mapping
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
                                <span>New Add-On</span>
                            </Button>
                        </DialogTrigger>
                        <AddonForm />
                    </Dialog>
                </div>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                {/* Desktop table */}
                <AddOnTable items={items} onView={setSelectedItem} />

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                    {items.map((item, index) => (
                        <AddOnCard key={index} item={item} onView={setSelectedItem} />
                    ))}
                </div>
                {selectedItem && <AddonEdit item={selectedItem} />}
            </Dialog>
        </main>
    );
}
