"use client";

import { getMyPaymentMethod } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function PaymentCard() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["payment-method"],
        queryFn: () => getMyPaymentMethod(),
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Payment Method</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Loading Card Details...</span>
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Payment Method</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Failed to load payment method.</span>
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h3 className="text-lg lg:text-xl font-semibold">Payment Method</h3>
            <p className="flex-1 text-sm lg:text-base">
                {data ? (
                    <>
                        <span className="capitalize">{data.brand}</span> ending •••• {data.last4}
                        <br />
                        <span className="text-muted-foreground">
                            Expires {data.expMonth?.toString().padStart(2, "0")}/{data.expYear?.toString().slice(2)}
                        </span>
                    </>
                ) : (
                    <span className="text-muted-foreground italic">No payment method attached.</span>
                )}
            </p>
        </div>
    );
}
