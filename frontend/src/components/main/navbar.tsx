"use client";

import { ShoppingBasket, UserCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { useHydrateLoves } from "@/lib/loves-store";
import { ArrowDown01Icon, LoginCircle02Icon, Logout01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Subscription", href: "/subscription" },
    { label: "How It Work", href: "/faqs" },
];

export default function Navbar() {
    const { data } = auth.useSession();
    const router = useRouter();

    useHydrateLoves(!!data?.user);

    return (
        <nav className="absolute w-full border-b">
            <div className="container mx-auto flex h-20 items-center justify-between gap-3 px-4 md:px-6">
                {/* Mobile menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                                <HugeiconsIcon icon={Menu01Icon} />
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="start" className="w-56">
                        {navLinks.map((item) => (
                            <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
                                {item.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/" className="shrink-0">
                    <Image src="/logo.png" alt="Logo" width={142} height={21.54} />
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-5">
                    {navLinks.map((item) => (
                        <Link key={item.href} href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    {data?.user ? (
                        <>
                            <Link href="/cart" aria-label="Cart">
                                <ShoppingBasket />
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button className="group bg-white hover:bg-white/80 shadow-lg">
                                            <UserCircle />
                                            <span className="hidden sm:inline">Account</span>
                                            <HugeiconsIcon
                                                icon={ArrowDown01Icon}
                                                className="transition-transform group-data-popup-open:rotate-180"
                                            />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                        render={
                                            <Link href="/account">
                                                <UserCircle />
                                                Account
                                            </Link>
                                        }
                                    />
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={async () =>
                                            await auth.signOut({
                                                fetchOptions: { onSuccess: () => router.push("/") },
                                            })
                                        }
                                    >
                                        <HugeiconsIcon icon={Logout01Icon} />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link href="/signin">
                            <Button className="bg-white hover:bg-white/80 shadow-lg">
                                <HugeiconsIcon icon={LoginCircle02Icon} />
                                <span className="hidden sm:inline">Sign in</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
