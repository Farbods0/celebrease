import { events } from "@/data";
import Details from "./catelog";

export async function generateStaticParams() {
    return events.map((event) => ({ id: event.id }));
}

export default function CatalogDetailPage() {
    return <Details />;
}
