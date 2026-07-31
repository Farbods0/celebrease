"use client";

import { listMyOrders } from "@/lib/api";
import { CalendarIcon, LinkSquare02Icon, PackageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";

export default function RecentRentals() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["recent-orders"],
        queryFn: () => listMyOrders({ filter: "recent", limit: 8 }),
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Recent Rentals</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Loading recent rentals...</span>
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Recent Rentals</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Failed to load recent rentals.</span>
                </p>
            </div>
        );
    }

    const recentOrders = data?.items || [];

    if (recentOrders.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h3 className="text-lg lg:text-xl font-semibold">Recent Rentals</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border p-4 flex flex-col justify-between gap-4">
                        {/* Top */}
                        <div className="flex items-start justify-between">
                            <div className="size-10 rounded-full border flex items-center justify-center">
                                <HugeiconsIcon icon={PackageIcon} size={18} />
                            </div>

                            <button className="text-muted-foreground">
                                <HugeiconsIcon icon={LinkSquare02Icon} size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div>
                            <h4 className="font-medium">{order.holiday.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{order.kit.tier.toLowerCase()} Kit</p>

                            <div className="mt-3 flex items-center gap-2">
                                <p className="text-sm flex items-center gap-1 text-muted-foreground">
                                    <HugeiconsIcon icon={CalendarIcon} size={14} />
                                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                                        new Date(order.startDate),
                                    )}{" "}, {" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }).format(new Date(order.endDate))}
                                </p>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${order.status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                                >
                                    {order.status === "COMPLETED" ? "Returned" : order.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
