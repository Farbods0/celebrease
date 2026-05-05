import PageHeader from "@/components/main/page-header";
import { getHolidays } from "@/lib/api";
import { HolidayGrid } from "./holiday-grid";

export default async function CatalogPage() {
    const data = await getHolidays();

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
            <HolidayGrid holidays={data.items} />
        </>
    );
}
