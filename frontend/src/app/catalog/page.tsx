import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { events } from "@/data";
import { ArrowRight02Icon, FilterMailIcon, Heart, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CatalogPage() {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url('gradient/section.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="h-20" />
                <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold">Explore Every Celebration</h2>
                    <p>
                        Discover seasonal, cultural, and event based décor <br /> kits curated for every moment.
                    </p>
                </div>
            </div>
            <div className="container mx-auto p-6 py-12 flex flex-col gap-6 lg:gap-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">All Celebrations</h2>
                        <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                            {["All", "Traditional", "Cultural", "Event Based"].map((item) => (
                                <div
                                    key={item}
                                    className={`px-4 py-1.5 lg:px-5 lg:py-2 rounded-full whitespace-nowrap ${item === "All" ? "bg-white shadow-lg" : ""}`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Input className="pl-9.5 lg:pl-11" placeholder="Search any kit" />
                            <div className="absolute top-1/2 left-3 lg:left-4 -translate-y-1/2">
                                <HugeiconsIcon className="size-5" icon={Search} />
                            </div>
                        </div>
                        <Button variant="outline">
                            <HugeiconsIcon icon={FilterMailIcon} />
                            All Filters
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {events.map((event) => (
                        <div key={event.title} className="group border rounded-2xl overflow-hidden flex flex-col">
                            {/* Image Section */}
                            <div className="relative">
                                <img src={event.image} className="h-64 w-full object-cover" alt={event.title} />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                                {/* Category badge */}
                                <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full text-sm font-medium">
                                    {"Traditional"}
                                </div>

                                {/* Wishlist button */}
                                <div className="absolute top-4 right-4 bg-white/30 text-white border backdrop-blur p-1.75 rounded-full cursor-pointer hover:scale-105 transition">
                                    <HugeiconsIcon className="size-5" icon={Heart} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl lg:text-2xl font-semibold">{event.title}</h3>
                                    <p className="text-base lg:text-lg text-muted-foreground">{event.description}</p>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Basic</p>
                                        <p className="text-base lg:text-lg font-semibold">${event.price.basic}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Premium</p>
                                        <p className="text-base lg:text-lg font-semibold">${event.price.premium}</p>
                                    </div>
                                </div>

                                {/* Button */}
                                <Button>
                                    View Kits
                                    <HugeiconsIcon icon={ArrowRight02Icon} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
