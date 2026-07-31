"use client";

import { Button } from "@/components/ui/button";
import type { ApiOrder } from "@/lib/api";
import { cancelMyOrder, listMyOrders, requestOrderReturn, retryOrderPayment } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    CalendarIcon,
    Cancel01Icon,
    CreditCardIcon,
    LinkSquare02Icon,
    PackageIcon,
    Tick01Icon,
    Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "sonner";

function formatRange(start: string, end: string) {
    const s = moment(start);
    const e = moment(end);

    if (s.year() === e.year()) {
        return `${s.format("MMM DD")} - ${e.format("MMM DD, YYYY")}`;
    }

    return `${s.format("MMM DD, YYYY")} - ${e.format("MMM DD, YYYY")}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StatusBadge({ status, paymentStatus }: { status: ApiOrder["status"]; paymentStatus: ApiOrder["paymentStatus"] }) {
    if (status === "CANCELLED") {
        return (
            <span className="max-w-fit inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Cancelled
            </span>
        );
    }

    if (paymentStatus === "PENDING") {
        return (
            <span className="max-w-fit inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Payment Pending
            </span>
        );
    }

    const labels: Record<string, { label: string; className: string }> = {
        PENDING: { label: "Processing", className: "bg-blue-100 text-blue-700" },
        RESERVED: { label: "Reserved", className: "bg-violet-100 text-violet-700" },
        SHIPPED: { label: "Shipped", className: "bg-sky-100 text-sky-700" },
        DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
        COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
        RETURN_REQUESTED: { label: "Return Requested", className: "bg-orange-100 text-orange-700" },
        RETURN_IN_TRANSIT: { label: "Return In Transit", className: "bg-orange-100 text-orange-700" },
        RETURN_RECEIVED: { label: "Awaiting Inspection", className: "bg-yellow-100 text-yellow-700" },
        INSPECTED: { label: "Inspection Complete", className: "bg-teal-100 text-teal-700" },
    };

    const info = labels[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };

    return (
        <span className={cn("max-w-fit inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", info.className)}>
            {info.label}
        </span>
    );
}

function OrderActions({ order }: { order: ApiOrder }) {
    const queryClient = useQueryClient();

    const cancelMutation = useMutation({
        mutationFn: () => cancelMyOrder(order.id),
        onSuccess: () => {
            toast.success("Order cancelled successfully");
            queryClient.invalidateQueries({ queryKey: ["active-orders"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const retryMutation = useMutation({
        mutationFn: () => retryOrderPayment(order.id),
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            }
        },
        onError: (err) => toast.error(err.message),
    });

    const returnMutation = useMutation({
        mutationFn: () => requestOrderReturn(order.id),
        onSuccess: () => {
            toast.success("Return requested. We'll email you the return label.");
            queryClient.invalidateQueries({ queryKey: ["active-orders"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const isPending = cancelMutation.isPending || retryMutation.isPending || returnMutation.isPending;

    // Payment pending, show Pay Now + Cancel
    if (order.paymentStatus === "PENDING" && order.status !== "CANCELLED") {
        return (
            <>
                <Button variant="black" onClick={() => retryMutation.mutate()} disabled={isPending}>
                    <HugeiconsIcon icon={CreditCardIcon} />
                    {retryMutation.isPending ? "Redirecting..." : "Pay Now"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate()}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={isPending}
                >
                    <HugeiconsIcon icon={Cancel01Icon} />
                    {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
            </>
        );
    }

    // Shipped, Track Package + Return Label
    if (order.status === "SHIPPED") {
        return (
            <>
                {order.trackingUrl ? (
                    <Button
                        variant="black"
                        nativeButton={false}
                        render={
                            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                                <HugeiconsIcon icon={LinkSquare02Icon} />
                                Track Package
                            </a>
                        }
                    />
                ) : (
                    <Button variant="black" disabled>
                        <HugeiconsIcon icon={LinkSquare02Icon} />
                        Awaiting Tracking
                    </Button>
                )}
                <Button variant="outline">
                    <HugeiconsIcon icon={Upload01Icon} />
                    Return Label
                </Button>
            </>
        );
    }

    // Delivered, show Request Return
    if (order.status === "DELIVERED") {
        return (
            <>
                <Button variant="outline" disabled>
                    <HugeiconsIcon icon={Tick01Icon} />
                    Delivered
                </Button>
                <Button variant="black" onClick={() => returnMutation.mutate()} disabled={isPending}>
                    <HugeiconsIcon icon={Upload01Icon} />
                    {returnMutation.isPending ? "Requesting…" : "Request Return"}
                </Button>
            </>
        );
    }

    // Return Requested, waiting on label / drop-off
    if (order.status === "RETURN_REQUESTED") {
        return order.returnLabelUrl ? (
            <Button
                variant="black"
                nativeButton={false}
                render={
                    <a href={order.returnLabelUrl} target="_blank" rel="noopener noreferrer">
                        <HugeiconsIcon icon={Upload01Icon} />
                        Return Label
                    </a>
                }
            />
        ) : (
            <Button variant="outline" disabled>
                <HugeiconsIcon icon={Upload01Icon} />
                Label Coming Soon
            </Button>
        );
    }

    // Return In Transit, track the return shipment
    if (order.status === "RETURN_IN_TRANSIT") {
        return order.returnTrackingUrl ? (
            <Button
                variant="black"
                nativeButton={false}
                render={
                    <a href={order.returnTrackingUrl} target="_blank" rel="noopener noreferrer">
                        <HugeiconsIcon icon={LinkSquare02Icon} />
                        Track Return
                    </a>
                }
            />
        ) : (
            <Button variant="outline" disabled>
                <HugeiconsIcon icon={PackageIcon} />
                Return In Transit
            </Button>
        );
    }

    // Return Received / Inspected, wait for refund finalization
    if (order.status === "RETURN_RECEIVED" || order.status === "INSPECTED") {
        return (
            <Button variant="outline" disabled>
                <HugeiconsIcon icon={PackageIcon} />
                {order.status === "RETURN_RECEIVED" ? "Awaiting Inspection" : "Inspection Complete"}
            </Button>
        );
    }

    // Reserved (paid, waiting to ship)
    if (order.status === "RESERVED") {
        return (
            <Button variant="outline" disabled>
                <HugeiconsIcon icon={PackageIcon} />
                Preparing Shipment
            </Button>
        );
    }

    // Completed
    if (order.status === "COMPLETED") {
        return (
            <Button variant="outline" disabled>
                <HugeiconsIcon icon={Tick01Icon} />
                Rental Complete
            </Button>
        );
    }

    // Paid but still PENDING status (processing)
    return (
        <Button variant="outline" disabled>
            <HugeiconsIcon icon={PackageIcon} />
            Processing
        </Button>
    );
}

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
                                    {formatRange(order.startDate, order.endDate)}
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
                            <OrderActions order={order} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
