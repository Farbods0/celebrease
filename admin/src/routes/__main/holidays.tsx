import { HolidayCard } from "@/components/holidays/holiday-card";
import { HolidayForm } from "@/components/holidays/holiday-form";
import { HolidayTable } from "@/components/holidays/holiday-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { holidaysApi, type ApiHoliday } from "@/lib/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/holidays")({
    loader: () => holidaysApi.listAll(),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();
    const router = useRouter();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiHoliday | null>(null);

    const items = data.items;

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this holiday?")) return;
        try {
            await holidaysApi.remove(id);
            toast.success("Holiday deleted");
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Something went wrong");
        }
    };

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Holidays</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Manage holidays and their visibility</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New Holiday</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <HolidayForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <HolidayTable items={items} onEdit={setEditItem} onDelete={handleDelete} />

            <div className="space-y-4 md:hidden">
                {items.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No holidays found</p>
                ) : (
                    items.map((item) => <HolidayCard key={item.id} item={item} onEdit={setEditItem} onDelete={handleDelete} />)
                )}
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <HolidayForm holiday={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
