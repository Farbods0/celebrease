import { RevenueCard } from "#/components/dashboard/revenue-card";
import { HolidayDistributionChart } from "@/components/dashboard/holiday-distribution-chart";
import { RevenueTrendsChart } from "@/components/dashboard/revenue-trends-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Box, CalendarCheck, CheckCircle2, DollarSign, Flame, Plus, ShoppingCart, Star, TrendingUp, Undo2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
    return (
        <main className="mx-auto w-full max-w-384 p-6">
            {/* Page header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold md:text-3xl">Dashboard Overview</h1>
                <div className="w-full grid grid-cols-2 sm:w-max sm:flex gap-4">
                    <Button variant="black">
                        <Undo2 className="mr-1 size-4" />
                        Process Return
                    </Button>
                    <Button>
                        <Plus />
                        Create Order
                    </Button>
                </div>
            </div>

            {/* Operational stats */}
            <section aria-label="Operational stats" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    label="Active Rentals"
                    value={128}
                    icon={Box}
                    iconBg="bg-[color:var(--card-blue)]"
                    iconColor="text-[color:var(--card-blue-foreground)]"
                />
                <StatCard
                    label="Upcoming Deliveries"
                    value={42}
                    icon={CalendarCheck}
                    iconBg="bg-[color:var(--card-mint)]"
                    iconColor="text-[color:var(--card-mint-foreground)]"
                />
                <StatCard
                    label="Pending Returns"
                    value={19}
                    icon={Undo2}
                    iconBg="bg-[color:var(--card-peach)]"
                    iconColor="text-[color:var(--card-peach-foreground)]"
                />
                <StatCard
                    label="Returned Today"
                    value={11}
                    icon={CheckCircle2}
                    iconBg="bg-[color:var(--card-pink)]"
                    iconColor="text-[color:var(--card-pink-foreground)]"
                />
                <StatCard
                    label="Inspections Pending"
                    value={7}
                    icon={Flame}
                    iconBg="bg-[color:var(--card-peach)]"
                    iconColor="text-[color:var(--card-peach-foreground)]"
                />
            </section>

            {/* Revenue summary */}
            <section aria-label="Revenue summary" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <RevenueCard label="Deposits Held" value="$12,480" icon={DollarSign} tone="mint" />
                <RevenueCard label="Deposits Refunded" value="$1,320" icon={TrendingUp} tone="blue" />
                <RevenueCard label="Subscription Revenue" value="$8,640" icon={Star} tone="pink" />
                <RevenueCard label="Rental Revenue" value="$21,940" icon={ShoppingCart} tone="peach" />
            </section>

            {/* Charts */}
            <section aria-label="Analytics" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueTrendsChart />
                </div>
                <div className="lg:col-span-1">
                    <HolidayDistributionChart />
                </div>
            </section>
        </main>
    );
}
