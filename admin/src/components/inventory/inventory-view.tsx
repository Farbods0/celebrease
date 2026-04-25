import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { InventoryItem } from "@/data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export default function InventoryView({ item }: { item: InventoryItem }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
            {/* Inventory Section */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Inventory</h3>
                <div className="space-y-2">
                    <div className="grid grid-cols-[80px_1fr_6px] items-center justify-between gap-2 ">
                        <p className="text-sm text-muted-foreground">Available</p>
                        <Progress status="Available" value={64} />
                        <p className="text-sm text-muted-foreground">{item.available}</p>
                    </div>
                    <div className="grid grid-cols-[80px_1fr_6px] items-center justify-between gap-2 ">
                        <p className="text-sm text-muted-foreground">Reserved</p>
                        <Progress status="Reserved" value={25} />
                        <p className="text-sm text-muted-foreground">{item.reserved}</p>
                    </div>
                    <div className="grid grid-cols-[80px_1fr_6px] items-center justify-between gap-2 ">
                        <p className="text-sm text-muted-foreground">Shipped</p>
                        <Progress status="Shipped" value={19} />
                        <p className="text-sm text-muted-foreground">{item.shipped}</p>
                    </div>
                    <div className="grid grid-cols-[80px_1fr_6px] items-center justify-between gap-2 ">
                        <p className="text-sm text-muted-foreground">In Cleaning</p>
                        <Progress status="Cleaning" value={10} />
                        <p className="text-sm text-muted-foreground">{item.cleaning}</p>
                    </div>
                    <div className="grid grid-cols-[80px_1fr_6px] items-center justify-between gap-2 ">
                        <p className="text-sm text-muted-foreground">In Repair</p>
                        <Progress status="Repair" value={5} />
                        <p className="text-sm text-muted-foreground">{item.repair}</p>
                    </div>
                </div>
            </section>
            {/* Item Details */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="SKU" value={item.sku} />
                    <Field label="Category" value="Lighting" />
                    <Field label="Cost per unit" value="$12.00" />
                    <Field label="Vendor" value="Holiday Lighting Co." />
                    <Field label="Added on" value="Oct 12, 2024" />
                    <Field label="Last updated" value="Nov 3, 2024" />
                </div>
            </section>
            {/* Status Management */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Status Management</h3>
                <div className="flex flex-wrap gap-2">
                    <button className="bg-muted px-3 py-2 rounded-lg text-sm">Mark as Cleaned</button>
                    <button className="bg-muted px-3 py-2 rounded-lg text-sm">Move to Repair</button>
                    <button className="bg-muted px-3 py-2 rounded-lg text-sm">Retire Item</button>
                    <button className="bg-muted px-3 py-2 rounded-lg text-sm">Add Replacement Unit</button>
                    <button className="bg-muted px-3 py-2 rounded-lg text-sm">Mark Lost</button>
                </div>
            </section>
            {/* Kit Mapping */}
            <section>
                <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-sm uppercase font-medium">Kit Mapping</h3>
                    <p className="border-b border-muted-foreground">Edit</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                        <p className="text-muted-foreground">1 unit</p>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                        <p className="text-muted-foreground">1 unit</p>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                        <p className="text-muted-foreground">1 unit</p>
                    </div>
                </div>
            </section>
            {/* Damage History */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Damage History</h3>
                <div className="bg-destructive/5 p-4 rounded-lg flex gap-3 items-start mb-2">
                    <div className="w-1 bg-destructive rounded-full self-stretch"></div>
                    <div>
                        <p className="text-muted-foreground">Nov 12, 2024 • Processed by Admin #3</p>
                        <h3 className="text-base font-medium">Broken wire</h3>
                        <p className="text-muted-foreground">Nov 12, 2024 • Processed by Admin #3</p>
                    </div>
                </div>
                <div className="bg-destructive/5 p-4 rounded-lg flex gap-3 items-start">
                    <div className="w-1 bg-destructive rounded-full self-stretch"></div>
                    <div>
                        <p className="text-muted-foreground">Oct 2, 2024 • Processed by Admin #1</p>
                        <h3 className="text-base font-medium">Missing bulb</h3>
                        <p className="text-muted-foreground">Customer lost item</p>
                    </div>
                </div>
            </section>
        </DialogContent>
    );
}
