import Link from "next/link";

export default function Footer() {
    return (
        <footer className="cb-footer">
            <div className="cb-footer-grid">
                <div className="cb-footer-col">
                    <div className="cb-footer-brand">CeleBrease</div>
                    <p className="cb-footer-tagline">
                        Designer curated holiday décor kits, delivered. Decorate big, store nothing.
                    </p>
                </div>
                <div className="cb-footer-col">
                    <h4>Explore</h4>
                    <Link href="/">Home</Link>
                    <Link href="/shop-kits">Shop Kits</Link>
                    <Link href="/subscription">Subscription</Link>
                    <Link href="/about">About</Link>
                    <Link href="/how-it-works">How It Works</Link>
                </div>
                <div className="cb-footer-col">
                    <h4>Shop by type</h4>
                    <Link href="/shop-kits">Traditional</Link>
                    <Link href="/shop-kits">Cultural</Link>
                    <Link href="/shop-kits">Event-Based</Link>
                </div>
                <div className="cb-footer-col">
                    <h4>Support</h4>
                    <Link href="/contact">Contact</Link>
                    <Link href="/faqs">FAQs</Link>
                    <Link href="/rental-agreement">Rental Agreement</Link>
                    <Link href="/privacy">Privacy</Link>
                </div>
            </div>
            <div className="cb-footer-bottom">
                <span>© CeleBrease 2026 · Made for every celebration</span>
                <div className="cb-footer-links">
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                    <Link href="/accessibility">Accessibility</Link>
                </div>
            </div>
        </footer>
    );
}
