import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
    return (
        <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                {/* Cart Items */}
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-7 md:h-8 lg:h-9 w-28 md:w-32 lg:w-36" />
                    {[...Array(2)].map((_, index) => (
                        <Skeleton key={index} className="h-52 rounded-2xl" />
                    ))}
                </div>

                {/* Order Summary */}
                <Skeleton className="h-full rounded-2xl" />
            </div>
        </main>
    );
}
