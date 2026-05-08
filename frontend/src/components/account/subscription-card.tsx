"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getMySubscription, type ApiSubscription } from "@/lib/api";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_LABEL: Record<ApiSubscription["status"], { label: string; tone: string }> = {
    ACTIVE: { label: "Subscription Active", tone: "text-green-600" },
    PAUSED: { label: "Subscription Paused", tone: "text-amber-600" },
    EXPIRED: { label: "Payment Issue", tone: "text-red-600" },
    CANCELLED: { label: "Subscription Cancelled", tone: "text-muted-foreground" },
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatYear(value: string | null) {
    if (!value) return "—";
    return new Date(value).getFullYear().toString();
}

function holidaysUsed(sub: ApiSubscription) {
    return sub.holidaySlots.filter((s) => s.status !== "PENDING").length;
}

export default function SubscriptionCard() {
    const [sub, setSub] = useState<ApiSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getMySubscription()
            .then((s) => {
                if (!cancelled) setSub(s);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="md:col-span-2 bg-primary/10 rounded-2xl border border-primary/20 p-5 flex items-center justify-center min-h-50">
                <Spinner className="size-8 stroke-primary" />
            </div>
        );
    }

    if (!sub) {
        return (
            <div className="md:col-span-2 bg-primary/10 rounded-2xl border border-primary/20 p-5 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-12 lg:size-14 rounded-full bg-linear-to-br from-primary to-secondary text-white hidden sm:flex justify-center items-center">
                        <HugeiconsIcon icon={StarIcon} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg lg:text-xl font-semibold">No Active Subscription</h3>
                        <p className="text-sm text-muted-foreground">Pick a plan to start your first holiday cycle.</p>
                    </div>
                </div>
                <Link href="/subscription" className="mr-auto">
                    <Button variant="black">View plans</Button>
                </Link>
            </div>
        );
    }

    const status = STATUS_LABEL[sub.status];
    const used = holidaysUsed(sub);

    return (
        <div className="md:col-span-2 bg-primary/10 rounded-2xl border border-primary/20 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-12 lg:size-14 rounded-full bg-linear-to-br from-primary to-secondary text-white hidden sm:flex justify-center items-center">
                        <HugeiconsIcon icon={StarIcon} />
                    </div>
                    <div className="space-y-1">
                        <h3 className={`text-lg lg:text-xl font-semibold ${status.tone}`}>{status.label}</h3>
                        <p className="text-sm text-muted-foreground">
                            {sub.plan.name} — {sub.plan.holidaysPerYear} holidays per year ({sub.billingCycle.toLowerCase()})
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Deposit Held</p>
                    <h3 className="text-lg lg:text-xl font-semibold">$100</h3>
                </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <h3 className="text-lg lg:text-xl font-semibold">{formatDate(sub.nextBillingAt)}</h3>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground">Holidays Used</p>
                    <h3 className="text-lg lg:text-xl font-semibold">
                        {used} of {sub.plan.holidaysPerYear}
                    </h3>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground">Current Cycle</p>
                    <h3 className="text-lg lg:text-xl font-semibold">{formatYear(sub.cycleStart)}</h3>
                </div>
            </div>
        </div>
    );
}
