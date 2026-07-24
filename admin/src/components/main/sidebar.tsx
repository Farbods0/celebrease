import { auth, type Session } from "@/lib/auth";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
    Bell,
    Gift,
    LayoutDashboard,
    LogOut,
    Package,
    PartyPopper,
    Receipt,
    Repeat,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    Star,
    Tag,
    Undo2,
    Users,
} from "lucide-react";
import { createElement, type ComponentType } from "react";

type NavItem = {
    label: string;
    link: string;
    icon: ComponentType<{ className?: string }>;
    badgeKey?: "inventory" | "orders" | "returns";
};

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
    {
        group: "Overview",
        items: [{ label: "Dashboard", link: "/", icon: LayoutDashboard }],
    },
    {
        group: "Catalog",
        items: [
            { label: "Holidays", link: "/holidays", icon: PartyPopper },
            { label: "Kits", link: "/kits", icon: Gift },
            { label: "Inventory", link: "/inventory", icon: Package, badgeKey: "inventory" },
            { label: "Add-ons", link: "/addons", icon: Sparkles },
        ],
    },
    {
        group: "Revenue",
        items: [
            { label: "Plans", link: "/plans", icon: Tag },
            { label: "Subscriptions", link: "/subscriptions", icon: Repeat },
            { label: "Orders", link: "/orders", icon: Receipt, badgeKey: "orders" },
            { label: "Returns", link: "/returns", icon: Undo2, badgeKey: "returns" },
        ],
    },
    {
        group: "People",
        items: [
            { label: "Reviews", link: "/reviews", icon: Star },
            { label: "Customers", link: "/customers", icon: Users },
            { label: "Users", link: "/users", icon: ShieldCheck },
            { label: "Settings", link: "/settings", icon: Settings },
        ],
    },
];

const CRUMB: Record<string, string> = {
    "/": "Dashboard",
    "/holidays": "Holidays",
    "/kits": "Kits",
    "/inventory": "Inventory",
    "/addons": "Add-ons",
    "/plans": "Plans",
    "/subscriptions": "Subscriptions",
    "/orders": "Orders",
    "/returns": "Returns",
    "/reviews": "Reviews",
    "/customers": "Customers",
    "/users": "Users",
    "/settings": "Settings",
};

function getInitials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "CB";
}

export type SidebarBadges = Partial<Record<"inventory" | "orders" | "returns", number>>;

export function Sidebar({ user, badges }: { user: Session["user"]; badges?: SidebarBadges }) {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <div className="sb-logo">
                <span className="mark">CeleBrease</span>
                <span className="tag">Admin</span>
            </div>
            <nav className="sb-nav">
                {NAV_GROUPS.map((g) => (
                    <div key={g.group}>
                        <div className="sb-group">{g.group}</div>
                        {g.items.map((item) => {
                            const count = item.badgeKey ? badges?.[item.badgeKey] ?? 0 : 0;
                            return (
                                <Link
                                    key={item.link}
                                    to={item.link}
                                    className="sb-item"
                                    activeOptions={{ exact: item.link === "/" }}
                                    activeProps={{ className: "sb-item active" }}
                                >
                                    <span className="ic">{createElement(item.icon, { className: "size-[17px]" })}</span>
                                    <span>{item.label}</span>
                                    {count > 0 && <span className="sb-badge">{count}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>
            <div className="sb-foot">
                <button
                    type="button"
                    className="sb-user"
                    onClick={() =>
                        auth.signOut({ fetchOptions: { onSuccess: () => navigate({ to: "/signin" }) } })
                    }
                    title="Sign out"
                >
                    <div className="av">{getInitials(user?.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="nm">{user?.name ?? "Admin"}</div>
                        <div className="rl">{user?.role === "superadmin" ? "Super Admin" : "Admin"}</div>
                    </div>
                    <LogOut className="size-4" style={{ color: "var(--ink-soft)" }} />
                </button>
            </div>
        </aside>
    );
}

export function Topbar() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const current = CRUMB[pathname] ?? "Dashboard";

    return (
        <div className="topbar">
            <div className="crumb">
                <b>{current}</b>
                {current !== "Dashboard" && " · CeleBrease"}
            </div>
            <div className="search">
                <Search className="size-[15px]" />
                <input placeholder="Search orders, customers, kits…" aria-label="Search" />
            </div>
            <div className="top-actions">
                <button className="icon-btn" aria-label="Notifications">
                    <Bell className="size-[17px]" />
                    <span className="dot" />
                </button>
            </div>
        </div>
    );
}
