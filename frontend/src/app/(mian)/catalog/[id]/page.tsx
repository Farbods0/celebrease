import {
    ApiHoliday,
    ApiHolidayAddOn,
    ApiHolidayKit,
    ApiKitItem,
    KitTier,
    baseURL,
    getHolidayById,
    ApiHolidayDetail,
    HolidayCategory,
} from "@/lib/api";
import Link from "next/link";
import { HolidayDetails } from "./holiday-details";
import { Button } from "@/components/ui/button";

const CATEGORY_LABEL: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event",
};
const CATEGORY_CLS: Record<HolidayCategory, string> = {
    TRADITIONAL: "",
    CULTURAL: "cultural",
    EVENT_BASED: "event",
};

function lowestPrice(kits: ApiHoliday["kits"]): number | null {
    if (!kits || kits.length === 0) return null;
    return Math.min(...kits.map((k) => Number(k.price30Day)));
}

const img = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `${baseURL}${path}`;
};

export default async function CatalogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let data: { holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] } = { holiday: null, kits: [], addOns: [], holidays: [] };
    try {
        data = await getHolidayById(id);
    } catch (e) {
        console.error("Failed to fetch holiday:", e);
    }

    if (!data.holiday) {
        return (
            <div className="cb">
                <section style={{ maxWidth: "var(--cb-max)", margin: "0 auto", padding: "80px 24px" }}>
                    <div
                        style={{
                            background: "#FFF1F2",
                            borderRadius: "var(--cb-r-card)",
                            border: "1px solid rgba(220,0,117,0.15)",
                            padding: "32px",
                        }}
                    >
                        <h2>Oops! No Holiday Found</h2>
                        <p style={{ color: "var(--cb-ink-muted)", marginTop: 8 }}>
                            Please check the URL or try again later.
                        </p>
                        <Link href="/catalog" style={{ marginTop: 16, display: "inline-block" }}>
                            <Button variant="destructive" size="sm">Back to Catalog</Button>
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="cb">
            {/* Main kit detail — client component for interactivity */}
            <HolidayDetails
                holiday={data.holiday}
                kits={data.kits}
                addOns={data.addOns}
            />

            {/* You Might Also Like */}
            {data.holidays.length > 0 && (
                <div className="cb-kit-below">
                    <section className="cb-related-section" aria-labelledby="related-heading">
                        <div className="cb-related-header">
                            <div>
                                <span className="eyebrow">More to celebrate</span>
                                <h2 id="related-heading">You might also love</h2>
                            </div>
                            <Link href="/catalog" className="cb-related-link">
                                Explore all holidays →
                            </Link>
                        </div>
                        <div className="cb-related-scroll" role="list" aria-label="Related holiday kits">
                            {data.holidays.slice(0, 6).map((h) => {
                                const cat = CATEGORY_LABEL[h.category as HolidayCategory] ?? "Traditional";
                                const catCls = CATEGORY_CLS[h.category as HolidayCategory] ?? "";
                                const price = lowestPrice(h.kits);
                                const totalPieces = (h.kits ?? []).reduce(
                                    (sum, k) => sum + (k.items ?? []).reduce((s, i) => s + i.qty, 0),
                                    0,
                                );
                                return (
                                    <Link
                                        key={h.id}
                                        href={`/catalog/${h.id}`}
                                        className="cb-holiday-card"
                                        role="listitem"
                                        aria-label={`${h.name} kit${price !== null ? `, from $${price}` : ""}`}
                                    >
                                        <img src={img(h.image)} alt={`${h.name} décor kit`} />
                                        <div className="scrim" aria-hidden="true" />
                                        <span className={`cb-cat-badge ${catCls}`}>{cat}</span>
                                        <div className="meta">
                                            <div className="name">{h.name}</div>
                                            <div className="price">
                                                {price !== null ? `From $${price}` : "Coming soon"}
                                                {totalPieces > 0 ? ` · ${totalPieces} pieces` : ""}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
