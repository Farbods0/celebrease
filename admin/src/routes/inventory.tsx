import { InventoryCard } from "@/components/inventory/inventory-card";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { INVENTORY, TOTAL_ITEMS } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, SlidersHorizontal, Upload } from "lucide-react";
import { useAppForm } from "../components/form/form-context";

export const Route = createFileRoute("/inventory")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = INVENTORY;

    const form = useAppForm({
        defaultValues: {
            // Basic Information
            name: "",
            sku: "",
            category: "",
            quantity: 0,
            description: "",

            // Image
            image: "", // or "" if you're storing URL

            // Pricing & Vendor Info
            vendorName: "",
            vendorEmail: "",
            vendorPhone: "",
            costPerUnit: 0,
        },

        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

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
                            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add Inventory Item</DialogTitle>
                                </DialogHeader>
                                <form className="grid gap-6">
                                    <div>
                                        <form.AppField name="image">{(field) => <field.FormImage label="Image" />}</form.AppField>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                        <p className="col-span-2 text-xs text-muted-foreground uppercase">Basic Information</p>

                                        <form.AppField name="name">
                                            {(field) => <field.FormInput label="Item Name" placeholder="e.g., LED String Lights" />}
                                        </form.AppField>

                                        <form.AppField name="sku">
                                            {(field) => <field.FormInput label="SKU" placeholder="e.g., CELE-LGT-01" />}
                                        </form.AppField>

                                        <form.AppField name="category">
                                            {(field) => <field.FormInput label="Item Category" />}
                                        </form.AppField>

                                        <form.AppField name="quantity">
                                            {(field) => <field.FormInput label="Total Quantity" placeholder="e.g., 120" type="number" />}
                                        </form.AppField>

                                        <div className="col-span-2">
                                            <form.AppField name="description">
                                                {(field) => (
                                                    <field.FormTextarea
                                                        label="Item Description"
                                                        placeholder="Add detailed description of the item..."
                                                    />
                                                )}
                                            </form.AppField>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                        <p className="col-span-2 text-xs text-muted-foreground uppercase">Pricing & Vendor Information</p>

                                        <div className="col-span-2">
                                            <form.AppField name="vendorName">
                                                {(field) => (
                                                    <field.FormInput label="Vendor Name" placeholder="e.g., Holiday Lighting Co." />
                                                )}
                                            </form.AppField>
                                        </div>

                                        <form.AppField name="vendorEmail">
                                            {(field) => (
                                                <field.FormInput label="Vendor Email" type="email" placeholder="vendor@example.com" />
                                            )}
                                        </form.AppField>

                                        <form.AppField name="costPerUnit">
                                            {(field) => <field.FormInput label="Cost Per Unit" placeholder="e.g., 12.00" type="number" />}
                                        </form.AppField>

                                        <div className="col-span-2">
                                            <form.AppField name="vendorPhone">
                                                {(field) => <field.FormInput label="Vendor Phone" placeholder="+1 (555) 123-4567" />}
                                            </form.AppField>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <form.AppForm>
                                            <form.FormSubmit label="Continue" />
                                        </form.AppForm>
                                    </div>
                                </form>
                            </DialogContent>
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
