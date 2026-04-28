import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { auth, type Session } from "@/lib/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, Menu, Package, PlusCircle, ShieldUser, ShoppingBag, Star, Tag, Undo2, Users } from "lucide-react";
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
    { label: "Plans", link: "/plans", icon: Tag, key: "plans" },
    { label: "Users", link: "/users", icon: ShieldUser, key: "users" },
];

export function Navbar({ user }: { user: Session["user"] }) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
            <div className="flex h-18 w-full items-center gap-3 md:gap-6 px-6">
                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 p-2">
                            {navItems.map((item) => (
                                <SheetClose asChild key={item.key}>
                                    <Link
                                        to={item.link}
                                        className="inline-flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
                                        activeProps={{ className: "bg-muted text-foreground font-medium" }}
                                        inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                                    >
                                        {createElement(item.icon, { className: "size-4" })}
                                        <span>{item.label}</span>
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link to="/" className="shrink-0">
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="group ml-auto flex items-center gap-3 shrink-0 cursor-pointer">
                            <Avatar className="size-10">
                                <AvatarImage src={user?.image || undefined} alt={user?.name} />
                                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="font-medium text-foreground">{user?.name}</span>
                                <span className="text-xs tracking-wider text-muted-foreground">ADMIN</span>
                            </div>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={async () => {
                                await auth.signOut({
                                    fetchOptions: { onSuccess: () => navigate({ to: "/" }) },
                                });
                            }}
                        >
                            Signout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

function getInitials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase();
}
