import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="dark bg-background text-foreground">
            <div className="container mx-auto p-6 pt-12">
                <div className="grid grid-cols-2 gap-8 md:flex md:flex-wrap md:justify-between">
                    {/* Logo Section */}
                    <div className="w-full col-span-full pb-4 lg:w-max">
                        <Image src="/logo-white.png" alt="Logo" width={196} height={30} />
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold text-lg">Quick Links</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/">Home</Link>
                            <Link href="/about">About Us</Link>
                            <Link href="/blog">Blog</Link>
                            <Link href="/contact">Contact</Link>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold text-lg">Shop</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/catalog?category=TRADITIONAL">Traditional Holidays</Link>
                            <Link href="/catalog?category=CULTURAL">Cultural Celebrations</Link>
                            <Link href="/catalog?category=EVENT_BASED">Event-Based Moments</Link>
                        </div>
                    </div>

                    {/* About */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold text-lg">About</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/faqs">How It Works</Link>
                            <Link href="/sustainability">Sustainability</Link>
                            <Link href="/inspiration">Blog / Inspiration</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold text-lg">Support</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/faqs">FAQs</Link>
                            <Link href="/contact-us">Contact Us</Link>
                            <Link href="/rental-agreement">Rental Agreement</Link>
                            <Link href="/return-policy">Return Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
                    <p className="text-center">© CeleBrease 2025. All Rights Reserved.</p>

                    <div className="flex items-center gap-6 text-muted-foreground">
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/accessibility">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
