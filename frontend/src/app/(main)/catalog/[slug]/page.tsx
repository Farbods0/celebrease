import {
    ApiHoliday,
    ApiHolidayAddOn,
    ApiHolidayKit,
    ApiKitItem,
    KitTier,
    baseURL,
    getHolidayById,
    getHolidays,
    ApiHolidayDetail,
    HolidayCategory,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { HolidayDetails } from "./holiday-details";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

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
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${baseURL}${path}`;
    if (path.startsWith("/")) return path;
    return `${baseURL}/${path}`;
};

export async function generateStaticParams() {
    try {
        const { items } = await getHolidays();
        return items.map((holiday) => ({
            slug: slugify(holiday.name),
        }));
    } catch (e) {
        console.error("Failed generateStaticParams:", e);
        return [];
    }
}

export default async function CatalogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Find holiday by slug
    const { items } = await getHolidays();
    const matchedHoliday = items.find((h) => slugify(h.name) === slug);
    
    let data: { holiday: ApiHolidayDetail | null; kits: ApiHolidayKit[]; addOns: ApiHolidayAddOn[]; holidays: ApiHoliday[] } = { holiday: null, kits: [], addOns: [], holidays: [] };
    
    if (matchedHoliday) {
        try {
            data = await getHolidayById(matchedHoliday.id);
        } catch (e) {
            console.error("Failed to fetch holiday:", e);
        }
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
            {/* Main kit detail, client component for interactivity */}
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
                                        href={`/catalog/${slugify(h.name)}`}
                                        className="cb-holiday-card"
                                        role="listitem"
                                        aria-label={`${h.name} kit${price !== null ? `, from $${price}` : ""}`}
                                    >
                                        <Image src={img(h.image)} alt={`${h.name} décor kit`} width={600} height={400} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="w-full h-full object-cover" />
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

// Trigger deploy// Trigger deploy 2
// trigger deploy 3
// trigger deploy 4
