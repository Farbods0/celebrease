import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ADD_ONS, KIT_ITEMS } from "@/data";
import { cn } from "@/lib/utils";
import { CircleDotDashed, Eye, GripVertical, Plus, Save, SquarePen, Trash2 } from "lucide-react";
import { KitsAddonTable } from "./kits-addon-table";
import { KitsItemTable } from "./kits-item-table";

const RENTAL_PRICING = [
    { duration: "20 Days", price: "$150", deposit: "$100" },
    { duration: "30 Days", price: "$225", deposit: "$100" },
    { duration: "60 Days", price: "$100", deposit: "$100" },
];

const PREVIEW_ITEMS = ["Premium Garland", "Premium String Lights", "Wreath", "Ornaments Set", "Tree Skirt"];

export function KitsContent() {
    return (
        <main className="w-full md:max-h-[calc(100vh-200px)] flex flex-col gap-6 p-6 overflow-y-auto">
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
                    <KitsItemTable items={KIT_ITEMS} onView={() => {}} />
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
                    <KitsAddonTable items={ADD_ONS} onView={() => {}} />
                </div>
            </div>
        </main>
    );
}
