"use client";

import { ShoppingBasket, UserCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="dark bg-secondary text-foreground">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={142} height={21.54} />
                </Link>

                <div className="hidden md:flex items-center gap-5">
                    <Link href="/">Home</Link>
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/subscription">Subscription</Link>
                    <Link href="/how-it-work">How It Work</Link>
                </div>

                <div className="flex items-center gap-5">
                    <HugeiconsIcon icon={Search} />
                    <ShoppingBasket />
                    <Button>
                        <UserCircle />
                        Sign in
                    </Button>
                </div>
            </div>
        </nav>
    );
}
