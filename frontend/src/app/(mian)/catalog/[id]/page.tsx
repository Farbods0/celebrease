import { HolidayCard } from "@/components/main/holiday-card";
import { Button } from "@/components/ui/button";
import { getHolidayById } from "@/lib/api";
import Link from "next/link";
import { HolidayDetails } from "./holiday-details";

export default async function CatalogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getHolidayById(id);

    return (
        <>
            {!data.holiday ? (
                <section className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                    <div className="bg-destructive/5 rounded-2xl border border-destructive/10 p-6 space-y-2">
                        <h2 className="text-lg lg:text-xl font-semibold">Oops! No Holiday Found</h2>
                        <p className="text-sm lg:text-base text-muted-foreground">Please check the URL or try again later.</p>
                        <div className="flex gap-3 pt-2">
                            <Link href="/catalog">
                                <Button variant="destructive" size="sm">
                                    Back to Catalog
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            ) : (
                <HolidayDetails holiday={data.holiday} kits={data.kits} addOns={data.addOns} />
            )}
            {/* You Might Also Like */}
            {data.holidays.length && (
                <section className="container mx-auto px-6 pb-8 md:pb-10 lg:pb-12">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold">You Might Also Like</h3>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.holidays.map((h) => (
                            <HolidayCard key={h.id} holiday={h} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
