import { WishlistGrid } from "./wishlist-grid";

export default function WishlistPage() {
    return (
        <div className="cb">
            {/* PAGE HEADER */}
            <header
                style={{
                    background: "radial-gradient(1100px 400px at 50% 0%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
                    padding: "clamp(52px,6vw,76px) 24px clamp(36px,4vw,52px)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    <span className="eyebrow" style={{ display: "block", marginBottom: "14px" }}>
                        Your saved kits
                    </span>
                    <h1
                        style={{
                            fontSize: "clamp(2.4rem,5vw,3.6rem)",
                            fontWeight: 800,
                            lineHeight: 1.06,
                            marginBottom: "14px",
                        }}
                    >
                        Your <span className="gradient-text">wishlist</span>
                    </h1>
                    <p
                        style={{
                            color: "var(--cb-ink-muted)",
                            fontSize: "clamp(16px,1.4vw,18px)",
                            maxWidth: "520px",
                            margin: "0 auto",
                            lineHeight: 1.65,
                        }}
                    >
                        Holidays you&apos;ve saved, ready to rent whenever the season calls. Add any kit to your cart and start celebrating.
                    </p>
                </div>
            </header>

            {/* GRID + EMPTY STATE */}
            <WishlistGrid />
        </div>
    );
}
