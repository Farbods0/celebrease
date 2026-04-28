import { UserCard } from "@/components/users/user-card";
import { UserTable } from "@/components/users/user-table";
import { UserView } from "@/components/users/user-view";
import { Dialog } from "@/components/ui/dialog";
import { USERS, type User } from "@/data";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/users")({
    component: RouteComponent,
});

function RouteComponent() {
    const items = USERS;
    const [selectedItem, setSelectedItem] = useState<User | null>(null);

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Users</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Admin and staff accounts with role, status, and login activity
                </p>
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                {/* Desktop table */}
                <UserTable items={items} onView={setSelectedItem} />

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                    {items.map((item, index) => (
                        <UserCard key={index} item={item} onView={setSelectedItem} />
                    ))}
                </div>
                {selectedItem && <UserView item={selectedItem} />}
            </Dialog>
        </main>
    );
}
