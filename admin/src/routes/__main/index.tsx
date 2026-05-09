import { RevenueCard } from "#/components/dashboard/revenue-card";
import { HolidayDistributionChart } from "@/components/dashboard/holiday-distribution-chart";
import { RevenueTrendsChart } from "@/components/dashboard/revenue-trends-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { dashboardApi } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Box, CalendarCheck, CheckCircle2, DollarSign, Flame, ShoppingCart, Star, TrendingUp, Undo2 } from "lucide-react";

export const Route = createFileRoute("/__main/")({
    loader: () => dashboardApi.stats(),
    component: RouteComponent,
});

function formatMoney(value: string) {
    const n = Number.parseFloat(value);
    if (Number.isNaN(n)) return "$0";
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function RouteComponent() {
    const data = Route.useLoaderData();

    return (
        <main className="mx-auto w-full max-w-384 p-6">
            <h1 className="text-2xl font-semibold md:text-3xl">Dashboard Overview</h1>

            <section aria-label="Operational stats" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    label="Active Rentals"
                    value={data.stats.activeRentals}
                    icon={Box}
                    iconBg="bg-[color:var(--card-blue)]"
                    iconColor="text-[color:var(--card-blue-foreground)]"
                />
                <StatCard
                    label="Upcoming Deliveries"
                    value={data.stats.upcomingDeliveries}
                    icon={CalendarCheck}
                    iconBg="bg-[color:var(--card-mint)]"
                    iconColor="text-[color:var(--card-mint-foreground)]"
                />
                <StatCard
                    label="Pending Returns"
                    value={data.stats.pendingReturns}
                    icon={Undo2}
                    iconBg="bg-[color:var(--card-peach)]"
                    iconColor="text-[color:var(--card-peach-foreground)]"
                />
                <StatCard
                    label="Returned Today"
                    value={data.stats.returnedToday}
                    icon={CheckCircle2}
                    iconBg="bg-[color:var(--card-pink)]"
                    iconColor="text-[color:var(--card-pink-foreground)]"
                />
                <StatCard
                    label="Inspections Pending"
                    value={data.stats.inspectionsPending}
                    icon={Flame}
                    iconBg="bg-[color:var(--card-peach)]"
                    iconColor="text-[color:var(--card-peach-foreground)]"
                />
            </section>

            <section aria-label="Revenue summary" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <RevenueCard label="Deposits Held" value={formatMoney(data.revenue.depositsHeld)} icon={DollarSign} tone="mint" />
                <RevenueCard label="Deposits Refunded" value={formatMoney(data.revenue.depositsRefunded)} icon={TrendingUp} tone="blue" />
                <RevenueCard
                    label="Subscription Revenue"
                    value={formatMoney(data.revenue.subscriptionRevenue)}
                    icon={Star}
                    tone="pink"
                />
                <RevenueCard label="Rental Revenue" value={formatMoney(data.revenue.rentalRevenue)} icon={ShoppingCart} tone="peach" />
            </section>

            <section aria-label="Analytics" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueTrendsChart data={data.trend} />
                </div>
                <div className="lg:col-span-1">
                    <HolidayDistributionChart data={data.distribution} />
                </div>
            </section>
        </main>
    );
}
