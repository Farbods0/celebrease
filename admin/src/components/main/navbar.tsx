import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { auth, type Session } from "@/lib/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
    BadgeCheck,
    ChevronDown,
    CreditCard,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    PlusCircle,
    Settings,
    ShieldUser,
    ShoppingBag,
    Tag,
    Undo2,
    Users,
} from "lucide-react";
import { createElement } from "react";

const primaryNavItems = [
    { label: "Dashboard", link: "/", icon: LayoutDashboard, key: "dashboard" },
    { label: "Holidays", link: "/holidays", icon: Layers, key: "holidays" },
    { label: "Kits", link: "/kits", icon: Tag, key: "kits" },
    { label: "Inventory", link: "/inventory", icon: Package, key: "inventory" },
    { label: "Orders", link: "/orders", icon: ShoppingBag, key: "orders" },
    { label: "Returns", link: "/returns", icon: Undo2, key: "returns" },
    { label: "Customers", link: "/customers", icon: Users, key: "customers" },
];

const moreNavItems = [
    { label: "Add-Ons", link: "/addons", icon: PlusCircle, key: "addons", group: "Catalog" },
    { label: "Plans", link: "/plans", icon: BadgeCheck, key: "plans", group: "Catalog" },
    { label: "Subscriptions", link: "/subscriptions", icon: CreditCard, key: "subscriptions", group: "Catalog" },
    { label: "Reviews", link: "/reviews", icon: MessageSquare, key: "reviews", group: "People" },
    { label: "Users", link: "/users", icon: ShieldUser, key: "users", group: "People" },
    { label: "Settings", link: "/settings", icon: Settings, key: "settings", group: "People" },
];


export function Navbar({ user }: { user: Session["user"] }) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur shadow-sm">
            <div className="flex h-18 w-full items-center gap-3 md:gap-6 px-6">
                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SheetHeader className="px-4 pt-4 pb-2">
                            <SheetTitle className="text-left">
                                <span
                                    className="text-xl font-black tracking-tight"
                                    style={{
                                        background: "linear-gradient(135deg, #9B2FC9, #DC0075)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    CeleBrease
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-0.5 px-2 pb-4">
                            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Main</p>
                            {primaryNavItems.map((item) => (
                                <SheetClose asChild key={item.key}>
                                    <Link
                                        to={item.link}
                                        className="inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                                        activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                                        inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                                    >
                                        {createElement(item.icon, { className: "size-4" })}
                                        <span>{item.label}</span>
                                    </Link>
                                </SheetClose>
                            ))}
                            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Catalog</p>
                            {moreNavItems.filter(i => i.group === "Catalog").map((item) => (
                                <SheetClose asChild key={item.key}>
                                    <Link
                                        to={item.link}
                                        className="inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                                        activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                                        inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                                    >
                                        {createElement(item.icon, { className: "size-4" })}
                                        <span>{item.label}</span>
                                    </Link>
                                </SheetClose>
                            ))}
                            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">People</p>
                            {moreNavItems.filter(i => i.group === "People").map((item) => (
                                <SheetClose asChild key={item.key}>
                                    <Link
                                        to={item.link}
                                        className="inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                                        activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
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

                {/* Logo + Admin badge */}
                <Link to="/" className="shrink-0 flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" width={142} height={21.54} />
                    <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: "#FEF3C7", color: "#B45309" }}
                    >
                        Admin
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0">
                    {primaryNavItems.map((item) => (
                        <Link
                            to={item.link}
                            key={item.key}
                            className="group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap"
                            activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                            inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                        >
                            {createElement(item.icon, { className: "size-4" })}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap">
                                More
                                <ChevronDown className="size-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">Catalog</DropdownMenuLabel>
                            {moreNavItems.filter(i => i.group === "Catalog").map((item) => (
                                <DropdownMenuItem key={item.key} asChild>
                                    <Link
                                        to={item.link}
                                        className="flex items-center gap-2 w-full"
                                        activeProps={{ className: "text-primary font-semibold" }}
                                    >
                                        {createElement(item.icon, { className: "size-4" })}
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">People</DropdownMenuLabel>
                            {moreNavItems.filter(i => i.group === "People").map((item) => (
                                <DropdownMenuItem key={item.key} asChild>
                                    <Link
                                        to={item.link}
                                        className="flex items-center gap-2 w-full"
                                        activeProps={{ className: "text-primary font-semibold" }}
                                    >
                                        {createElement(item.icon, { className: "size-4" })}
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="group ml-auto flex items-center gap-3 shrink-0 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                            <Avatar className="size-8 ring-2 ring-primary/30">
                                <AvatarImage src={user?.image || undefined} alt={user?.name} />
                                <AvatarFallback
                                    className="text-white font-bold text-xs"
                                    style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                                >
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-sm font-medium text-foreground">{user?.name}</span>
                                <span className="text-[10px] tracking-wider text-muted-foreground uppercase">Admin</span>
                            </div>
                            <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                            <Link to="/settings" className="flex items-center gap-2 w-full">
                                <Settings className="size-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            className="gap-2 cursor-pointer"
                            onClick={async () => {
                                await auth.signOut({
                                    fetchOptions: { onSuccess: () => navigate({ to: "/" }) },
                                });
                            }}
                        >
                            <LogOut className="size-4" />
                            Sign out
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
