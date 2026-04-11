"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { services } from "@/data";
import { useAuthStore } from "@/hooks/useAuthState";
import { cn } from "@/lib/utils";
import {
    Calendar03Icon,
    FavouriteIcon,
    Login01Icon,
    Logout01Icon,
    Menu01Icon,
    Settings01Icon,
    User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="dark bg-secondary text-foreground">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={166} height={42} />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink render={<Link href="/">Home</Link>} />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent className="divide-y max-h-96 overflow-y-auto">
                                    <NavigationMenuLink render={<Link href="/services">All Services</Link>} />
                                    {services.map((service, index) => (
                                        <NavigationMenuLink key={index} render={<Link href="/service">{service.title}</Link>} />
                                    ))}
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink render={<Link href="/about">About</Link>} />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink render={<Link href="/contact">Contact</Link>} />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Actions */}
                <AuthMenu />

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-full md:hidden")}
                    aria-label="Toggle menu"
                >
                    <HugeiconsIcon icon={Menu01Icon} />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="container mx-auto flex flex-col gap-4 px-6 pb-6 md:hidden">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        Home
                    </Link>

                    <div className="flex flex-col gap-2">
                        <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                            All Services
                        </Link>
                        <div className="flex flex-col gap-2 h-48 overflow-y-auto">
                            {services.map((service, index) => (
                                <Link key={index} href="/service" onClick={() => setMobileMenuOpen(false)} className="pl-4">
                                    {service.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                        About
                    </Link>
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                        Contact
                    </Link>

                    <AuthMenu mobile />
                </div>
            )}
        </nav>
    );
}

function AuthMenu({ mobile = false }: { mobile?: boolean }) {
    const router = useRouter();
    const { user, signOut } = useAuthStore();

    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="icon-sm" className={cn(!mobile && "hidden md:inline-flex", "rounded-full")}>
                        <HugeiconsIcon icon={User02Icon} />
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center gap-3 px-3 py-2">
                    <Image src="https://i.pravatar.cc/40" alt="Rumi Aktar" width={48} height={48} className="rounded-full object-cover" />
                    <div className="min-w-0">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        render={
                            <Link href="/bookings">
                                <HugeiconsIcon icon={Calendar03Icon} />
                                <span>Bookings</span>
                            </Link>
                        }
                    />
                    {user?.role === "provider" ? (
                        <DropdownMenuItem
                            render={
                                <Link href="/reviews">
                                    <HugeiconsIcon icon={FavouriteIcon} />
                                    <span>Reviews</span>
                                </Link>
                            }
                        />
                    ) : null}
                    <DropdownMenuItem
                        render={
                            <Link href="/settings">
                                <HugeiconsIcon icon={Settings01Icon} />
                                <span>Settings</span>
                            </Link>
                        }
                    />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                        signOut();
                        router.push("/");
                    }}
                >
                    <HugeiconsIcon icon={Logout01Icon} />
                    <span>Signout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link
            href="/signin"
            className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), !mobile && "hidden md:inline-flex", "rounded-full")}
        >
            <HugeiconsIcon icon={Login01Icon} />
        </Link>
    );
}
