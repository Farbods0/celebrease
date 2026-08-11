"use client";

import { auth } from "@/lib/auth";
import { useHydrateLoves } from "@/lib/loves-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Subscription", href: "/subscription" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
];

export default function Navbar() {
    const { data } = auth.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useHydrateLoves(!!data?.user);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    return (
        <>
            <div className="cb-announce">🎁 <strong>Winter 2026 holidays are now booking</strong>, reserve your kit before slots fill</div>
            <nav className="cb-nav">
                <div className="cb-nav-inner">
                    <Link href="/" className="cb-logo">
                        <img src="/celebrease-logo.svg" alt="" aria-hidden="true" height={34} style={{ height: 34, width: "auto" }} />
                        CeleBrease
                    </Link>

                    <div className="cb-nav-links">
                        {navLinks.map((item) => (
                            <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : ""}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="cb-nav-actions">
                        <Link href="/wishlist" className="cb-nav-icon" aria-label="Wishlist">♡</Link>
                        <Link href="/cart" className="cb-nav-icon" aria-label="Cart">🛍</Link>
                        {data?.user ? (
                            <>
                                <Link href="/account" className="cb-pill-grad signin">Account</Link>
                                <button
                                    className="cb-nav-icon"
                                    aria-label="Sign out"
                                    onClick={async () =>
                                        await auth.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })
                                    }
                                >
                                    ⎋
                                </button>
                            </>
                        ) : (
                            <Link href="/signin" className="cb-pill-grad signin">Sign In</Link>
                        )}
                        <button className="cb-hamburger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>☰</button>
                    </div>
                </div>

                {open && (
                    <div style={{ borderTop: "1px solid var(--cb-line)", background: "#fff", padding: "8px 24px 16px" }}>
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                style={{ display: "block", padding: "12px 0", fontWeight: 500, borderBottom: "1px solid var(--cb-line)" }}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={data?.user ? "/account" : "/signin"}
                            onClick={() => setOpen(false)}
                            className="cb-pill-grad"
                            style={{ marginTop: 14, justifyContent: "center", width: "100%" }}
                        >
                            {data?.user ? "Account" : "Sign In"}
                        </Link>
                    </div>
                )}
            </nav>
        </>
    );
}
