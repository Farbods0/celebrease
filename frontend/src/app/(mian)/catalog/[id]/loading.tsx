import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function LoadingComp() {
    return (
        <section className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
            <Skeleton className="h-6 w-56" />
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-1 h-auto md:h-112 rounded-2xl overflow-hidden">
                {[...Array(5)].map((_, index) => (
                    <Skeleton
                        key={index}
                        className={cn("w-full h-48 md:h-full", index === 0 ? "col-span-2 row-span-1 md:row-span-2" : "")}
                    />
                ))}
            </div>
        </section>
    );
}
