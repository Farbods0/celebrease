import { KitsContent } from "@/components/kits/kits-content";
import { KitsForm } from "@/components/kits/kits-form";
import { KitsSidebar } from "@/components/kits/kits-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { KIT_ITEMS } from "@/data";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__main/kits")({
    component: RouteComponent,
});

function RouteComponent() {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
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
                    {createOpen && <KitsForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <main className="flex w-full">
                {/* Desktop sidebar */}
                <KitsSidebar />

                {/* Main content */}
                <KitsContent items={KIT_ITEMS} onView={(item) => console.log(item)} />
            </main>
        </>
    );
}

// Route export
