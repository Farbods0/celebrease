import { RouteSkeleton } from "@/components/main/route-skeleton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { UserForm } from "@/components/users/user-form";
import { UserTable } from "@/components/users/user-table";
import { usersApi, type ApiUser } from "@/lib/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
    pendingComponent: RouteSkeleton,
});

const STYLES = `
/* Role badges */
.role-badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;padding:4px 11px;border-radius:20px;letter-spacing:.02em}
.role-super{background:var(--brand-gradient);color:#fff}
.role-admin{background:#F3E8FB;color:var(--brand-purple)}
.role-staff{background:var(--blue-bg);color:var(--blue)}
.role-viewer{background:var(--bg);color:var(--ink-muted);border:1px solid var(--line)}

/* User-specific status pills */
.st-active{color:var(--green);background:var(--green-bg)}
.st-inactive{color:var(--ink-soft);background:var(--bg);border:1px solid var(--line)}
.st-suspended{color:var(--red);background:var(--red-bg)}
.st-pending{color:var(--amber);background:var(--amber-bg)}

/* User avatar */
.u-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;overflow:hidden}
.u-av img{width:100%;height:100%;object-fit:cover}
.u-av.grad{background:var(--brand-gradient);color:#fff;box-shadow:0 0 0 2.5px #fff,0 0 0 4.5px #9B2FC9}
.u-av.purple{background:#EDE4F5;color:var(--brand-purple)}
.u-av.blue{background:var(--blue-bg);color:var(--blue)}
.u-av.green{background:var(--green-bg);color:var(--green)}
.u-av.amber{background:var(--amber-bg);color:var(--amber)}

/* Inline action buttons */
.act-row{display:flex;align-items:center;gap:6px}
.act-btn{height:30px;padding:0 11px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid var(--line);color:var(--ink-muted);background:#fff;cursor:pointer;transition:background .12s,color .12s}
.act-btn:hover{background:var(--bg);color:var(--ink)}
.act-btn.danger{color:var(--red);border-color:var(--red-bg)}
.act-btn.danger:hover{background:var(--red-bg)}
.act-btn:disabled{opacity:.4;cursor:default}

/* Roles legend */
.roles-legend{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 24px;box-shadow:var(--shadow-xs)}
.roles-legend h4{font-size:13px;font-weight:700;margin-bottom:14px;color:var(--ink)}
.legend-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.legend-item{border:1px solid var(--line);border-radius:10px;padding:14px;background:var(--bg)}
.legend-item .l-title{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.legend-item .l-desc{font-size:12px;color:var(--ink-muted);line-height:1.55}

/* Last active / member since */
.last-active{font-size:12.5px;color:var(--ink-soft)}
.last-active b{color:var(--ink-muted);font-weight:500}

/* Filter bar */
.filter-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.filter-select{height:36px;padding:0 12px;border:1px solid var(--line);border-radius:9px;font-family:inherit;font-size:13px;color:var(--ink-muted);background:#fff;cursor:pointer;outline:none}
.filter-select:focus{border-color:var(--brand-purple)}

/* Table user cell */
.user-cell{display:flex;align-items:center;gap:11px}
.user-cell .nm{font-weight:600;font-size:13.5px;line-height:1.3}
.user-cell .em{font-size:11.5px;color:var(--ink-soft)}

@media(max-width:1100px){
  .legend-grid{grid-template-columns:repeat(2,1fr)}
}
`;

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
        <div className="content">
            <style>{STYLES}</style>

            {/* Page header */}
            <div className="page-head">
                <div>
                    <h1>Users &amp; Team</h1>
                    <div className="sub">Manage admin access, roles, and permissions for the CeleBrease operations team.</div>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="btn-grad">＋ Add user</button>
                    </DialogTrigger>
                    {createOpen && <UserForm onClose={() => setCreateOpen(false)} />}
                </Dialog>
            </div>

            {/* KPI summary */}
            <div className="kpis">
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Total team members</span>
                        <span className="ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>🛡️</span>
                    </div>
                    <div className="val">{kpis.total}</div>
                    <span className="delta up"><span className="muted">across all roles</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Admins</span>
                        <span className="ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>👤</span>
                    </div>
                    <div className="val">{kpis.admins}</div>
                    <span className="delta up"><span className="muted">admin &amp; super admin</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Active</span>
                        <span className="ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>●</span>
                    </div>
                    <div className="val">{kpis.active}</div>
                    <span className="delta up"><span className="muted">accounts in good standing</span></span>
                </div>
                <div className="kpi">
                    <div className="top">
                        <span className="lbl">Suspended</span>
                        <span className="ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>⛔</span>
                    </div>
                    <div className="val">{kpis.banned}</div>
                    <span className="delta" style={{ color: "var(--ink-soft)" }}>
                        <span className="muted">{kpis.banned > 0 ? "needs review" : "no change"}</span>
                    </span>
                </div>
            </div>

            {/* Users table */}
            <div className="panel">
                <div className="panel-head">
                    <h3>
                        Team members
                        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 8 }}>
                            {data.total} total
                        </span>
                    </h3>
                    <div className="filter-bar" style={{ marginLeft: "auto", gap: 8 }}>
                        <div className="search" style={{ height: 36, padding: "0 12px", maxWidth: 260 }}>
                            <span>⌕</span>
                            <input
                                type="search"
                                value={search.search ?? ""}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search name or email…"
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={search.role ?? ""}
                            onChange={(e) => handleRoleFilter((e.target.value || undefined) as "admin" | "user" | undefined)}
                        >
                            <option value="">All roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>

                <UserTable items={items} onEdit={setEditItem} onDelete={handleDelete} currentUserId={user.id} />

                <div style={{ padding: 16 }} className="md:hidden">
                    {items.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5, padding: "24px 0" }}>
                            No users found
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {items.map((item) => (
                                <UserCard key={item.id} item={item} onEdit={setEditItem} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Roles legend */}
            <div className="roles-legend">
                <h4>Role permissions reference</h4>
                <div className="legend-grid">
                    <div className="legend-item">
                        <div className="l-title">
                            <span className="role-badge role-super">Super Admin</span>
                        </div>
                        <div className="l-desc">
                            Full unrestricted access. Can manage all resources, team members, billing, and settings. Only one per account.
                        </div>
                    </div>
                    <div className="legend-item">
                        <div className="l-title">
                            <span className="role-badge role-admin">Admin</span>
                        </div>
                        <div className="l-desc">
                            Can manage catalog, orders, customers, inventory, and invite users. Cannot remove the Super Admin.
                        </div>
                    </div>
                    <div className="legend-item">
                        <div className="l-title">
                            <span className="role-badge role-staff">User</span>
                        </div>
                        <div className="l-desc">
                            Standard customer account. Browses the catalog, subscribes to plans, and rents kits on the storefront.
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit dialog (portalled) */}
            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && <UserForm user={editItem} onClose={() => setEditItem(null)} />}
            </Dialog>
        </div>
    );
}
