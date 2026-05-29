import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { UserForm } from "@/components/users/user-form";
import { UserTable } from "@/components/users/user-table";
import { usersApi, type ApiUser } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import * as z from "zod";

const searchSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    role: z.enum(["admin", "user"]).optional(),
});

export const Route = createFileRoute("/__main/users")({
    validateSearch: searchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => usersApi.list(deps),
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiUser | null>(null);
    const [viewItem, setViewItem] = useState<ApiUser | null>(null);

    const items = data.items;

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Users</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Admin and staff accounts with role, status, and login activity</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Add New User</span>
                        </Button>
                    </DialogTrigger>
                    {createOpen && <UserForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <UserTable items={items} onEdit={setEditItem} />

                <div className="space-y-4 md:hidden">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-10">No users found</p>
                    ) : (
                        items.map((item) => <UserCard key={item.id} item={item} onEdit={setEditItem} />)
                    )}
                </div>
            </Dialog>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <UserForm user={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
