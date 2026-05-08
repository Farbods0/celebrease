import PageHeader from "@/components/main/page-header";
import { HolidayCategory } from "@/lib/api";
import { HolidayGrid } from "./holiday-grid";

type CatalogPageProps = {
    searchParams: Promise<{ category?: HolidayCategory | ""; search?: string }>;
};

export default async function CatalogPage(props: CatalogPageProps) {
    const searchParams = await props.searchParams;

    return (
        <>
            <PageHeader
                title="Explore Every Celebration"
                description={
                    <>
                        Discover seasonal, cultural, and event based décor <br className="hidden sm:block" /> kits curated for every moment.
                    </>
                }
            />
            <HolidayGrid searchParams={searchParams} />
        </>
    );
}
