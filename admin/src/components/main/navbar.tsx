import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, Package, PlusCircle, ShoppingBag, Star, Tag, Undo2, Users } from "lucide-react";
import { createElement } from "react";

const navItems = [
    { label: "Dashboard", link: "/", icon: LayoutDashboard, key: "dashboard" },
    { label: "Inventory", link: "/inventory", icon: Package, key: "inventory" },
    { label: "Kits & Pricing", link: "/pricing", icon: Tag, key: "pricing" },
    { label: "Add-Ons", link: "/addons", icon: PlusCircle, key: "addons" },
    { label: "Orders", link: "/orders", icon: ShoppingBag, key: "orders" },
    { label: "Returns", link: "/returns", icon: Undo2, key: "returns" },
    { label: "Subscriptions", link: "/subscriptions", icon: Star, key: "subscriptions" },
    { label: "Customers", link: "/customers", icon: Users, key: "customers" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
            <div className="flex h-18 w-full items-center gap-6 px-6">
                {/* Logo */}
                <Link to="/">
                    <img src="/logo.png" alt="Logo" width={142} height={21.54} />
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
                    {navItems.map((item) => (
                        <Link
                            to={item.link}
                            key={item.key}
                            className="group inline-flex items-center gap-2 rounded-md px-3 py-2 transition-colors whitespace-nowrap"
                            activeProps={{ className: "text-foreground font-medium" }}
                            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                        >
                            {createElement(item.icon, { className: "size-4" })}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User */}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                    <Avatar className="size-10">
                        <AvatarImage src="/avatars/john-doe.jpg" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col leading-tight">
                        <span className="font-medium text-foreground">John Doe</span>
                        <span className="text-xs tracking-wider text-muted-foreground">ADMIN</span>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground" />
                </div>
            </div>
        </header>
    );
}
