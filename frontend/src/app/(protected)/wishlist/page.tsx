import PageHeader from "@/components/main/page-header";
import { WishlistGrid } from "./wishlist-grid";

export default function WishlistPage() {
    return (
        <>
            <PageHeader
                title="Your Wishlist"
                description={
                    <>
                        All the celebrations you&apos;ve loved, <br className="hidden sm:block" /> saved in one place for whenever you&apos;re ready.
                    </>
                }
            />
            <WishlistGrid />
        </>
    );
}
