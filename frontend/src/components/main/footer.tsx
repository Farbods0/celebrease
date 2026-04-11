import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook02Icon, InstagramIcon, NewTwitterIcon, PinterestIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-accent">
            <div className="container mx-auto flex flex-col gap-6 px-6 py-6">
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-semibold text-primary">QuickFix</h2>
                        <p className="max-w-xs text-muted-foreground">
                            Connecting you with verified local professionals quickly, safely, and transparently.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-medium">Company</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/about">About Us</Link>
                            <Link href="/services">Services</Link>
                            <Link href="/contact">Contact</Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-medium">Legal</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/terms-of-service">Terms of Service</Link>
                            <Link href="/cancellation-refund-policy">Cancellation & Refund Policy</Link>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 QuickFix All rights reserved.</p>

                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="icon-sm" className="rounded-full">
                            <HugeiconsIcon icon={Facebook02Icon} />
                        </Button>
                        <Button variant="secondary" size="icon-sm" className="rounded-full">
                            <HugeiconsIcon icon={NewTwitterIcon} />
                        </Button>
                        <Button variant="secondary" size="icon-sm" className="rounded-full">
                            <HugeiconsIcon icon={InstagramIcon} />
                        </Button>
                        <Button variant="secondary" size="icon-sm" className="rounded-full">
                            <HugeiconsIcon icon={PinterestIcon} />
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
