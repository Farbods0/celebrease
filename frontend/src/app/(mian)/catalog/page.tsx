import { HolidayCategory } from "@/lib/api";
import { HolidayGrid } from "./holiday-grid";
import type { SortValue } from "./catalog-filter";

export default function CatalogPage() {
    return (
        <div className="cb">
            {/* PAGE HEADER */}
            <header
                style={{
                    background:
                        "radial-gradient(1100px 400px at 50% 0%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
                    padding: "clamp(52px,6vw,76px) 24px clamp(36px,4vw,52px)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
                        Holiday catalog
                    </span>
                    <h1
                        style={{
                            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                            fontWeight: 800,
                            lineHeight: 1.06,
                            marginBottom: "14px",
                        }}
                    >
                        Browse{" "}
                        <span className="gradient-text">holidays</span>
                    </h1>
                    <p
                        style={{
                            color: "var(--cb-ink-muted)",
                            fontSize: "clamp(16px, 1.4vw, 18px)",
                            maxWidth: "560px",
                            margin: "0 auto",
                            lineHeight: 1.65,
                        }}
                    >
                        Every celebration you love — styled, curated, and delivered. Browse our full collection of
                        holiday kits, then choose the ones that feel like you.
                    </p>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "20px",
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            borderRadius: "var(--cb-r-pill)",
                            padding: "8px 18px",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "var(--cb-ink-muted)",
                            boxShadow: "var(--cb-shadow-xs)",
                        }}
                        aria-live="polite"
                    >
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "var(--cb-magenta)",
                                boxShadow: "0 0 0 3px rgba(220,0,117,0.15)",
                                flexShrink: 0,
                            }}
                        />
                        Curated holiday décor kits, delivered to your door
                    </div>
                </div>
            </header>

            {/* HOLIDAY GRID (client — handles filter + search + sort) */}
            <HolidayGrid />
        </div>
    );
}
