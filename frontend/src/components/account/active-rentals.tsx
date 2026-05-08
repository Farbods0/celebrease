"use client";

import { Button } from "@/components/ui/button";
import { listMyOrders } from "@/lib/api";
import { CalendarIcon, LinkSquare02Icon, PackageIcon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";

export default function ActiveRentals() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["active-orders"],
        queryFn: () => listMyOrders({ filter: "active", limit: 4 }),
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-12 lg:size-14 rounded-full border flex justify-center items-center">
                        <HugeiconsIcon icon={PackageIcon} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg lg:text-xl font-medium">Your Active Rentals</h2>
                        <span className="text-sm lg:text-base text-muted-foreground italic">Loading active rentals...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl border p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-12 lg:size-14 rounded-full border flex justify-center items-center">
                        <HugeiconsIcon icon={PackageIcon} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg lg:text-xl font-medium">Your Active Rentals</h2>
                        <span className="text-sm lg:text-base text-muted-foreground italic">Failed to load active rentals.</span>
                    </div>
                </div>
            </div>
        );
    }

    const activeOrders = data?.items || [];

    if (activeOrders.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="size-12 lg:size-14 rounded-full border flex justify-center items-center">
                    <HugeiconsIcon icon={PackageIcon} />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg lg:text-xl font-medium">Your Active Rental{activeOrders.length > 1 ? "s" : ""}</h2>
                    <span className="text-sm lg:text-base text-muted-foreground">Currently in use</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                    <div key={order.id} className="bg-muted rounded-xl border p-4 flex flex-col gap-4">
                        <div className="flex justify-between">
                            <div className="space-y-1">
                                <h3 className="text-lg lg:text-xl font-semibold capitalize">
                                    {order.holiday.name} {order.kit.tier.toLowerCase()} Kit
                                </h3>
                                <p className="text-sm lg:text-base flex items-center gap-2">
                                    <HugeiconsIcon icon={CalendarIcon} size={16} />
                                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                                        new Date(order.startDate),
                                    )}{" "}
                                    –{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }).format(new Date(order.endDate))}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-sm text-muted-foreground">Deposit Held</p>
                                <h3 className="text-lg lg:text-xl font-semibold">
                                    ${Number(order.kitDeposit) + Number(order.addOnDeposit)}
                                </h3>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2">
                            <Button variant="black">
                                <HugeiconsIcon icon={LinkSquare02Icon} />
                                Track Package
                            </Button>
                            <Button variant="outline">
                                <HugeiconsIcon icon={Upload01Icon} />
                                Return Label
                            </Button>
                            <Button variant="outline">Extend Rental</Button>
                            <Button variant="outline">Mark Returned</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
