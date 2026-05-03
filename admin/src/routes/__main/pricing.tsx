import { PricingForm } from "@/components/pricing/pricing-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KitItem } from "@/data";
import { KIT_ITEMS } from "@/data";
import { cn, getHolidays } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { CircleDotDashed, Eye, GripVertical, Plus, Save, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

type RouteComponentProps = {
    items: KitItem[];
    onView: (item: KitItem) => void;
};

const RENTAL_PRICING = [
    { duration: "20 Days", price: "$150", deposit: "$100" },
    { duration: "30 Days", price: "$225", deposit: "$100" },
    { duration: "60 Days", price: "$100", deposit: "$100" },
];

const PREVIEW_ITEMS = ["Premium Garland", "Premium String Lights", "Wreath", "Ornaments Set", "Tree Skirt"];

const HOLIDAY_ADDONS = [
    { name: "Christmas Tree", price: "$100", deposit: "+$100", inv: 12, status: "Active" as const },
    { name: "Mantle Add-On Kit", price: "$25", deposit: "$0", inv: 40, status: "Active" as const },
    { name: "Outdoor Light Kit", price: "$30", deposit: "$0", inv: 18, status: "Active" as const },
];

function RouteComponent({ items, onView }: RouteComponentProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const { data: holidays, isLoading } = getHolidays();

    return (
        <main>
            <div className="px-6 py-4 bg-white flex justify-between items-center">
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold">Kits & Pricing</h1>
                    <div className="p-2 bg-muted rounded-full flex">
                        {["Starter Kit", "Premium Kit"].map((kit, index) => (
                            <div key={kit} className={cn("px-6 py-2 rounded-full font-medium", index === 0 ? "bg-white shadow-md" : "")}>
                                {kit}
                            </div>
                        ))}
                    </div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New Kit Tier</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <PricingForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <main className="flex w-full">
                {/* Desktop sidebar */}
                <aside className="hidden md:flex w-80 shrink-0 p-6">
                    <div className="rounded-lg border p-4 w-full h-fit">
                        <h2 className="font-medium mb-2">Select Holiday</h2>

                        {isLoading ? (
                            <div className="space-y-1">
                                <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                                <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                                <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {holidays.map((holiday, index) => (
                                    <button
                                        key={holiday.id}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg transition-all",
                                            index === 0 ? "bg-primary/10 font-medium" : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        {holiday.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0 flex flex-col gap-6 p-6">
                    {/* Kit header with action buttons */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1.5">
                            <h2 className="text-2xl font-semibold">Christmas Kit</h2>
                            <p className="text-sm text-muted-foreground">
                                Last saved: 2 minutes ago
                                <span className="text-foreground/20 mx-2">•</span>
                                Retail Value: $450
                                <span className="text-foreground/20 mx-2">•</span>
                                Profitability: High
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="opacity-70">
                                <CircleDotDashed className="size-4" />
                                Save Draft
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Eye className="size-4" />
                                Preview PDP
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#008b3f] hover:text-[#008b3f]">
                                <Save className="size-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Two column layout: Kit Overview + PDP Preview Items */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Kit Overview */}
                        <div className="rounded-xl border bg-white overflow-hidden">
                            <div className="px-5 py-3.5 bg-black/4 border-b">
                                <h3 className="text-lg font-semibold">Kit Overview</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-7">
                                <div className="flex flex-col">
                                    {[
                                        { label: "Kit ID", value: "XMAS-PREM-2025" },
                                        { label: "Kit Tier", value: "Premium Kit" },
                                        { label: "Category", value: "Traditional" },
                                        { label: "Status", value: "Active", valueClass: "text-[#008b3f]" },
                                        { label: "Seasonal Visibility", value: "Nov 1 – Jan 10", valueClass: "text-primary" },
                                    ].map((row, idx) => (
                                        <div
                                            key={row.label}
                                            className={cn("flex items-center justify-between py-2.5 text-sm", idx > 0 && "border-t")}
                                        >
                                            <span className="text-muted-foreground capitalize">{row.label}</span>
                                            <span className={cn("font-medium", row.valueClass)}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Rental Pricing */}
                                <div className="flex flex-col gap-3">
                                    <h4 className="font-medium">Rental Pricing</h4>
                                    <div className="rounded-lg bg-black/2 shadow-sm">
                                        <div className="grid grid-cols-3 gap-4 px-3.5 py-2.5 text-xs uppercase text-muted-foreground">
                                            <div>Rental Duration</div>
                                            <div>Price</div>
                                            <div>Deposit</div>
                                        </div>
                                        <div className="px-3.5 pb-3.5 pt-1 flex flex-col gap-3">
                                            {RENTAL_PRICING.map((row) => (
                                                <div key={row.duration} className="grid grid-cols-3 gap-4 items-center text-xs">
                                                    <div className="flex items-center justify-between rounded-md border h-7.5 px-2.5 font-medium">
                                                        <span>{row.duration.split(" ")[0]}</span>
                                                        <span className="opacity-40">Days</span>
                                                    </div>
                                                    <div className="flex items-center justify-center rounded-md border h-7.5 px-2.5 font-medium w-20.25">
                                                        {row.price}
                                                    </div>
                                                    <div className="flex items-center justify-center rounded-md border h-7.5 px-2.5 font-medium w-20.25">
                                                        {row.deposit}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-dashed border-primary bg-primary/[0.07] text-sm capitalize text-primary"
                                    >
                                        <Plus className="size-4" />
                                        Add Rental Period Variant
                                    </button>
                                </div>

                                {/* Admin Toggles */}
                                <div className="flex flex-col gap-3">
                                    <h4 className="font-medium">Admin Toggles</h4>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { label: "Kit Visible on PDP", checked: true },
                                            { label: "Starter/Premium Upgrade", checked: true },
                                            { label: "Add-Ons Enabled", checked: true },
                                            { label: "Limit Kit Inventory", checked: false },
                                        ].map((toggle) => (
                                            <div key={toggle.label} className="flex items-center justify-between">
                                                <span className="text-sm capitalize text-muted-foreground">{toggle.label}</span>
                                                <Switch defaultChecked={toggle.checked} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PDP Preview Items */}
                        <div className="rounded-xl border bg-white overflow-hidden">
                            <div className="px-5 py-3 bg-black/4 border-b flex items-center justify-between">
                                <h3 className="text-lg font-semibold">PDP Preview Items</h3>
                                <Button variant="black" size="sm">
                                    <Plus className="size-4" />
                                    Add item
                                </Button>
                            </div>
                            <div className="p-5 flex flex-col gap-2.5">
                                <p className="text-xs text-muted-foreground capitalize">Items shown on customer-facing PDP preview</p>
                                <div className="flex flex-col gap-3">
                                    {PREVIEW_ITEMS.map((name) => (
                                        <div
                                            key={name}
                                            className="flex h-11.5 items-center justify-between rounded-lg border bg-muted/40 pl-3 pr-4 py-2.5"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <GripVertical className="size-5 text-muted-foreground" />
                                                <span className="text-sm capitalize">{name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <button type="button" className="hover:text-destructive transition-colors">
                                                    <Trash2 className="size-4" />
                                                </button>
                                                <button type="button" className="hover:text-foreground transition-colors">
                                                    <SquarePen className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-dashed border-primary bg-primary/[0.07] text-sm capitalize text-primary"
                                    >
                                        <Plus className="size-4" />
                                        Add Preview Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Kit Contents */}
                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="px-5 py-3 bg-black/4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Full Kit Contents</h3>
                            <Button variant="black" size="sm">
                                <Plus className="size-4" />
                                Add item
                            </Button>
                        </div>
                        <div className="p-5">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>QTY</TableHead>
                                            <TableHead>ITEM SKU</TableHead>
                                            <TableHead>CATEGORY</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.sku}>
                                                <TableCell className="flex items-center gap-2">
                                                    <div className="size-8 shrink-0 rounded-md bg-muted"></div>
                                                    <span className="capitalize">{item.name}</span>
                                                </TableCell>

                                                <TableCell>{item.qty}</TableCell>
                                                <TableCell>{item.sku}</TableCell>
                                                <TableCell className="font-medium">{item.category}</TableCell>

                                                <TableCell>
                                                    <StatusBadge status={item.status} />
                                                </TableCell>

                                                <TableCell className="space-x-2">
                                                    <button className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium">
                                                        Trash
                                                    </button>

                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    {/* Holiday-Specific Add-Ons */}
                    <div className="rounded-xl border bg-white overflow-hidden">
                        <div className="px-5 py-3 bg-black/4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Holiday-Specific Add-Ons</h3>
                            <Button variant="black" size="sm">
                                <Plus className="size-4" />
                                Add item
                            </Button>
                        </div>
                        <div className="p-5">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Add-On</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Deposit</TableHead>
                                            <TableHead>Inv</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {HOLIDAY_ADDONS.map((addon) => (
                                            <TableRow key={addon.name}>
                                                <TableCell className="capitalize">{addon.name}</TableCell>
                                                <TableCell>{addon.price}</TableCell>
                                                <TableCell>{addon.deposit}</TableCell>
                                                <TableCell>{addon.inv}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={addon.status} />
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <button className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium">
                                                        Trash
                                                    </button>
                                                    <button className="rounded-md bg-border/30 px-2 py-0.5 text-xs font-medium">
                                                        Edit
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </main>
            </main>
        </main>
    );
}

// Route export
export const Route = createFileRoute("/__main/pricing")({
    component: () => <RouteComponent items={KIT_ITEMS} onView={(item) => console.log(item)} />,
});
