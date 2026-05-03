"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { type ApiSubscription, getMySubscription } from "@/lib/api";
import { CalendarIcon, LinkSquare02Icon, PackageIcon, PencilEdit02Icon, StarIcon, Upload01Icon } from "@hugeicons/core-free-icons";
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

function SubscriptionCard({ sub, loading }: { sub: ApiSubscription | null; loading: boolean }) {
    if (loading) {
        return (
            <div className="md:col-span-2 bg-primary/10 rounded-2xl border border-primary/20 p-5 flex items-center justify-center min-h-50">
                <Spinner className="size-8 stroke-primary" />
            </div>
        );
    }

    if (!sub) {
        return (
            <div className="md:col-span-2 bg-primary/10 rounded-2xl border border-primary/20 p-5 flex flex-col gap-4">
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

            <div className="flex flex-wrap gap-4 text-sm text-blue-600">
                <button>{sub.status === "PAUSED" ? "Resume Subscription" : "Pause Subscription"}</button>
                <Separator orientation="vertical" />
                <button>View Billing History</button>
                <Separator orientation="vertical" />
                <button>Update Payment</button>
            </div>
        </div>
    );
}

export default function AccountPage() {
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

    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">My Account</h3>
                    <p className="text-muted-foreground">Manage your preferences and update your profile settings here.</p>
                </div>

                {/* Active Rentals */}
                <div className="bg-white rounded-2xl border p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="size-12 lg:size-14 rounded-full border flex justify-center items-center">
                            <HugeiconsIcon icon={PackageIcon} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg lg:text-xl font-medium">Your Active Rental</h2>
                            <span className="text-sm lg:text-base text-muted-foreground">Currently in use</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {["Christmas Premium Kit", "New Year’s Eve Kit"].map((title, i) => (
                            <div key={i} className="bg-muted rounded-xl border p-4 flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg lg:text-xl font-semibold">{title}</h3>
                                        <p className="text-sm lg:text-base flex items-center gap-2">
                                            <HugeiconsIcon icon={CalendarIcon} size={16} />
                                            Dec 2 – Jan 1, 2025
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Deposit Held</p>
                                        <h3 className="text-lg lg:text-xl font-semibold">$100</h3>
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

                {/* Middle Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubscriptionCard sub={sub} loading={loading} />

                    {/* Address */}
                    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Shipping Address</h3>
                        <p className="flex-1 text-sm lg:text-base">
                            123 Maple Street, Suite 4
                            <br />
                            <span className="text-muted-foreground">Austin, TX</span>
                        </p>

                        <button className="text-sm text-blue-600 mr-auto flex items-center gap-1.5">
                            <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                            Edit Address
                        </button>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Payment Method</h3>
                        <p className="flex-1 text-sm lg:text-base">
                            Visa ending •••• 3142
                            <br />
                            <span className="text-muted-foreground">Expires 08/27</span>
                        </p>

                        <button className="text-sm text-blue-600 mr-auto flex items-center gap-1.5">
                            <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                            Update Card
                        </button>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Recent Rentals */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Recent Rentals</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                {
                                    title: "Thanksgiving 2024",
                                    type: "Starter Kit",
                                    status: "Returned",
                                    statusStyle: "bg-green-100 text-green-600",
                                },
                                {
                                    title: "Diwali 2024",
                                    type: "Premium Kit",
                                    status: "Late Fee Applied",
                                    statusStyle: "bg-orange-100 text-orange-600",
                                },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl border p-4 flex flex-col justify-between gap-4">
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
                                        <h4 className="font-medium">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.type}</p>

                                        <div className="mt-3 flex items-center gap-2">
                                            <p className="text-sm flex items-center gap-1 text-muted-foreground">
                                                <HugeiconsIcon icon={CalendarIcon} size={14} />
                                                Dec 2 – Jan 1, 2025
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${item.statusStyle}`}>{item.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons / Extend */}
                    <div className="rounded-2xl border p-5 flex flex-col gap-4 bg-white">
                        <div className="space-y-2">
                            <h3 className="font-medium">Previous Add-ons</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li>Extra Lights</li>
                                <li>Table Runner</li>
                            </ul>
                        </div>
                        <hr />
                        <div className="space-y-2">
                            <h3 className="font-medium">Extend Your Rental</h3>
                            <div className="flex gap-2">
                                {["+3 days", "+7 days", "+14 days"].map((item, i) => (
                                    <button key={i} className="flex-1 text-sm border rounded-lg py-2 hover:bg-muted transition">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="black" className="mt-2">
                            Request Extension
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
