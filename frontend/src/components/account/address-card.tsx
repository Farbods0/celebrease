"use client";

import { getMyAddress } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import AddressDialog from "./address-dialog";

export default function AddressCard() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["address"],
        queryFn: () => getMyAddress(),
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Shipping Address</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Loading Shipping Address...</span>
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-semibold">Shipping Address</h3>
                <p className="flex-1 text-sm lg:text-base">
                    <span className="text-muted-foreground italic">Failed to load shipping address.</span>
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h3 className="text-lg lg:text-xl font-semibold">Shipping Address</h3>
            <p className="flex-1 text-sm lg:text-base">
                {data ? (
                    <>
                        {data.streetLine1} {data.streetLine2 ? `, ${data.streetLine2}` : ""}
                        <br />
                        <span className="text-muted-foreground">
                            {data.city}, {data.state} {data.postalCode}
                        </span>
                    </>
                ) : (
                    <span className="text-muted-foreground italic">No shipping address provided yet.</span>
                )}
            </p>

            <AddressDialog address={data ?? null} />
        </div>
    );
}
