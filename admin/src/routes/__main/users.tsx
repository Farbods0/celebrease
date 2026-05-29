import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { UserForm } from "@/components/users/user-form";
import { UserTable } from "@/components/users/user-table";
import { usersApi, type ApiUser } from "@/lib/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Ban, Plus, ShieldCheck, Users, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const router = useRouter();
    const { user } = Route.useRouteContext();

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<ApiUser | null>(null);

    const items = data.items;

    const handleDelete = async (item: ApiUser) => {
        try {
            await usersApi.remove(item.id);
            toast.success(`User "${item.name}" deleted`);
            await router.invalidate();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    const kpis = useMemo(() => {
        const total = items.length;
        const admins = items.filter((u) => u.role === "admin" || u.role === "superadmin").length;
        const banned = items.filter((u) => u.banned).length;
        const active = items.filter((u) => !u.banned).length;
        return { total, admins, banned, active };
    }, [items]);

    const handleSearchChange = (value: string) => {
        navigate({ search: (prev) => ({ ...prev, search: value || undefined, page: undefined }) });
    };

    const handleRoleFilter = (role: "admin" | "user" | undefined) => {
        navigate({ search: (prev) => ({ ...prev, role, page: undefined }) });
    };

    return (
        <main className="mx-auto w-full max-w-384 flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">User Management</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Admin accounts and their access levels</p>
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

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={kpis.total} icon={Users} iconBg="bg-primary/10" iconColor="text-primary" />
                <StatCard label="Admins" value={kpis.admins} icon={ShieldCheck} iconBg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard label="Active" value={kpis.active} icon={UserX} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <StatCard label="Banned" value={kpis.banned} icon={Ban} iconBg="bg-red-50" iconColor="text-red-500" />
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="search"
                        value={search.search ?? ""}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by name or email…"
                        className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Role:</span>
                    {(["", "admin", "user"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => handleRoleFilter(r === "" ? undefined : r)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                (r === "" ? !search.role : search.role === r)
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                        >
                            {r === "" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <UserTable items={items} onEdit={setEditItem} onDelete={handleDelete} currentUserId={user.id} />

            <div className="space-y-4 md:hidden">
                {items.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-10">No users found</p>
                ) : (
                    items.map((item) => <UserCard key={item.id} item={item} onEdit={setEditItem} />)
                )}
            </div>

            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <UserForm user={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </main>
    );
}
