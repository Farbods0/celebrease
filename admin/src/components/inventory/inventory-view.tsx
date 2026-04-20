import type { InventoryItem } from "@/data";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "../ui/status-badge";

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" | "status" }) {
    let valueColor: string | undefined;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium" style={valueColor ? { color: valueColor } : undefined}>
                {value}
            </span>
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
                <h3 className="uppercase text-sm font-medium mb-3">Inventory</h3>
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
                <h3 className="uppercase text-sm font-medium mb-3">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="SKU" value={item.sku} />
                    <Field label="Category" value="Lighting" />
                    <Field label="Cost per unit" value="$12.00" tone="available" />
                    <Field label="Vendor" value="Holiday Lighting Co." tone="reserved" />
                    <Field label="Added on" value="Oct 12, 2024" />
                    <Field label="Last updated" value="Nov 3, 2024" />
                </div>
            </section>
            {/* Status Management */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Status Management</h3>
                <div className="space-x-2 space-y-3">
                    <button className="bg-muted p-3 rounded-xl">Mark as Cleaned</button>
                    <button className="bg-muted p-3 rounded-xl">Move to Repair</button>
                    <button className="bg-muted p-3 rounded-xl">Retire Item</button>
                    <button className="bg-muted p-3 rounded-xl">Add Replacement Unit</button>
                    <button className="bg-muted p-3 rounded-xl">Mark Lost</button>
                </div>
            </section>
            {/* Kit Mapping */}
            <section>
                <div className="flex justify-between items-center mb-3">
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
                <h3 className="font-medium mb-3 uppercase text-sm">Damage History</h3>
                <div className="bg-destructive/5 p-4 rounded-lg flex gap-3 items-start mb-4">
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
