import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KitItem } from "@/data";
import { KIT_ITEMS } from "@/data";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const holidays = ["Christmas", "Diwali", "Halloween", "Thanksgiving", "Valentine's", "Easter", "Independence Day", "New Year", "Birthdays"];

type RouteComponentProps = {
    items: KitItem[];
    onView: (item: KitItem) => void;
};

function RouteComponent({ items, onView }: RouteComponentProps) {
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
                <Button>
                    <Plus className="size-4" />
                    <span>Create New Kit Tier</span>
                </Button>
            </div>
            <main className="flex w-full">
                {/* Desktop sidebar */}
                <aside className="hidden md:flex w-80 shrink-0 p-6">
                    <div className="rounded-lg border p-4">
                        <h2 className="font-medium mb-2">Select Holiday</h2>

                        <div className="space-y-1">
                            {holidays.map((holiday, index) => (
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all
                ${index === 0 ? "bg-primary/10 font-medium" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    {holiday}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0 flex flex-col gap-6 p-6">
                    <div className="hidden md:block overflow-hidden rounded-lg border p-3">
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
                                            <div className="w-8 h-8 rounded-lg bg-white"></div>
                                            {item.name}
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
                </main>
            </main>
        </main>
    );
}

// Route export
export const Route = createFileRoute("/__main/pricing")({
    component: () => <RouteComponent items={KIT_ITEMS} onView={(item) => console.log(item)} />,
});
