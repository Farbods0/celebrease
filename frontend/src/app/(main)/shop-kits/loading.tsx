import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
    return (
        <div className="cb">
            <header
                style={{
                    background:
                        "radial-gradient(1100px 400px at 50% 0%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
                    padding: "clamp(52px,6vw,76px) 24px clamp(36px,4vw,52px)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    <Skeleton className="h-6 w-32 mx-auto mb-[14px]" />
                    <Skeleton className="h-12 w-64 mx-auto mb-[14px]" />
                    <Skeleton className="h-4 w-full max-w-[560px] mx-auto mt-4" />
                    <Skeleton className="h-4 w-3/4 max-w-[400px] mx-auto mt-2" />
                </div>
            </header>

            <section
                className="catalog-section"
                style={{ padding: "clamp(40px,5vw,56px) 24px clamp(72px,8vw,96px)" }}
            >
                <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "24px",
                        }}
                        className="catalog-skeleton-grid"
                    >
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="rounded-[22px]" style={{ aspectRatio: "4/5" }} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
