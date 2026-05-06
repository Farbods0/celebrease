import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12">
                <div className="mb-6 space-y-2">
                    <Skeleton className="h-7 md:h-8 lg:h-9 w-28 md:w-32 lg:w-36" />
                    <Skeleton className="h-6 w-88" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Skeleton className="col-span-2 h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        </main>
    );
}
