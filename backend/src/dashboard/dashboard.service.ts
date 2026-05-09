import { PrismaService } from "@/common/services/prisma.service";
import { Prisma } from "@/generated/prisma/client";
import { OrderStatus, PaymentStatus, SubscriptionStatus } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";

type MonthlyRevenue = { month: string; subscriptions: number; rentals: number };
type HolidayShare = { name: string; value: number };

const ZERO = new Prisma.Decimal(0);

function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function endOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
}

function startOfMonth(year: number, month: number) {
    return new Date(year, month, 1, 0, 0, 0, 0);
}

function monthLabel(d: Date) {
    return d.toLocaleString("en-US", { month: "short" });
}

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getStats() {
        const now = new Date();
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);

        // 12 monthly buckets ending with the current month.
        const monthStarts: Date[] = [];
        for (let i = 11; i >= 0; i--) {
            monthStarts.push(startOfMonth(now.getFullYear(), now.getMonth() - i));
        }
        const trendStart = monthStarts[0];

        const [
            activeRentals,
            upcomingDeliveries,
            pendingReturns,
            returnedToday,
            inspectionsPending,
            depositsHeldAgg,
            depositsRefundedAgg,
            rentalAggForTrend,
            subscriptionsForTrend,
            holidayDistribution,
        ] = await Promise.all([
            this.prisma.order.count({
                where: { status: { in: ["SHIPPED" as OrderStatus, "DELIVERED" as OrderStatus] } },
            }),
            this.prisma.order.count({
                where: {
                    status: { in: ["PENDING" as OrderStatus, "RESERVED" as OrderStatus, "SHIPPED" as OrderStatus] },
                    paymentStatus: "PAID" as PaymentStatus,
                },
            }),
            this.prisma.order.count({
                where: {
                    status: { in: ["RETURN_REQUESTED" as OrderStatus, "RETURN_IN_TRANSIT" as OrderStatus] },
                },
            }),
            this.prisma.order.count({
                where: {
                    returnReceivedAt: { gte: todayStart, lte: todayEnd },
                },
            }),
            this.prisma.order.count({
                where: { status: "RETURN_RECEIVED" as OrderStatus },
            }),
            // Deposits held = on orders past payment but not yet inspected/completed/cancelled.
            this.prisma.order.aggregate({
                _sum: { kitDeposit: true, addOnDeposit: true },
                where: {
                    paymentStatus: "PAID" as PaymentStatus,
                    status: {
                        in: [
                            "RESERVED" as OrderStatus,
                            "SHIPPED" as OrderStatus,
                            "DELIVERED" as OrderStatus,
                            "RETURN_REQUESTED" as OrderStatus,
                            "RETURN_IN_TRANSIT" as OrderStatus,
                            "RETURN_RECEIVED" as OrderStatus,
                        ],
                    },
                },
            }),
            this.prisma.order.aggregate({
                _sum: { depositRefunded: true },
            }),
            // Rental revenue per month for the last 12 months.
            this.prisma.order.findMany({
                where: {
                    paymentStatus: "PAID" as PaymentStatus,
                    paidAt: { gte: trendStart },
                },
                select: { paidAt: true, rentalFee: true, extendedFee: true },
            }),
            // Subscription revenue per month — start dates within the trend window.
            this.prisma.subscription.findMany({
                where: {
                    status: "ACTIVE" as SubscriptionStatus,
                    startedAt: { gte: trendStart },
                },
                include: {
                    plan: { select: { monthlyPrice: true, yearlyPrice: true } },
                },
            }),
            // Holiday distribution — share of all orders excluding cancelled.
            this.prisma.order.groupBy({
                by: ["holidayId"],
                _count: { _all: true },
                where: { status: { not: "CANCELLED" as OrderStatus } },
            }),
        ]);

        const depositsHeld = (depositsHeldAgg._sum.kitDeposit ?? ZERO).plus(depositsHeldAgg._sum.addOnDeposit ?? ZERO);
        const depositsRefunded = depositsRefundedAgg._sum.depositRefunded ?? ZERO;

        // Build monthly trend.
        const trend: MonthlyRevenue[] = monthStarts.map((d) => ({
            month: monthLabel(d),
            subscriptions: 0,
            rentals: 0,
        }));
        const indexFor = (d: Date) => {
            const months = (d.getFullYear() - trendStart.getFullYear()) * 12 + (d.getMonth() - trendStart.getMonth());
            return months >= 0 && months < trend.length ? months : -1;
        };
        for (const order of rentalAggForTrend) {
            if (!order.paidAt) continue;
            const i = indexFor(order.paidAt);
            if (i < 0) continue;
            trend[i].rentals += new Prisma.Decimal(order.rentalFee).plus(order.extendedFee).toNumber();
        }
        for (const sub of subscriptionsForTrend) {
            const i = indexFor(sub.startedAt);
            if (i < 0) continue;
            const price =
                sub.billingCycle === "YEARLY"
                    ? new Prisma.Decimal(sub.plan.yearlyPrice ?? 0).div(12)
                    : new Prisma.Decimal(sub.plan.monthlyPrice);
            trend[i].subscriptions += price.toNumber();
        }
        trend.forEach((t) => {
            t.rentals = Math.round(t.rentals);
            t.subscriptions = Math.round(t.subscriptions);
        });

        // Subscription revenue (active subs MRR) and Rental revenue (sum of all paid).
        const [activeSubs, allPaidOrdersAgg] = await Promise.all([
            this.prisma.subscription.findMany({
                where: { status: "ACTIVE" as SubscriptionStatus },
                include: { plan: { select: { monthlyPrice: true, yearlyPrice: true } } },
            }),
            this.prisma.order.aggregate({
                _sum: { rentalFee: true, extendedFee: true },
                where: { paymentStatus: "PAID" as PaymentStatus },
            }),
        ]);

        const subscriptionRevenue = activeSubs.reduce((acc, s) => {
            const v =
                s.billingCycle === "YEARLY"
                    ? new Prisma.Decimal(s.plan.yearlyPrice ?? 0)
                    : new Prisma.Decimal(s.plan.monthlyPrice);
            return acc.plus(v);
        }, ZERO);
        const rentalRevenue = (allPaidOrdersAgg._sum.rentalFee ?? ZERO).plus(allPaidOrdersAgg._sum.extendedFee ?? ZERO);

        // Holiday distribution — top 4 + Others, as percentages of total.
        const distTotal = holidayDistribution.reduce((acc, h) => acc + h._count._all, 0);
        const holidays =
            distTotal === 0
                ? []
                : await this.prisma.holiday.findMany({
                      where: { id: { in: holidayDistribution.map((h) => h.holidayId) } },
                      select: { id: true, name: true },
                  });
        const nameById = new Map(holidays.map((h) => [h.id, h.name]));
        const sorted = [...holidayDistribution].sort((a, b) => b._count._all - a._count._all);
        const top = sorted.slice(0, 4);
        const others = sorted.slice(4);
        const distribution: HolidayShare[] = [];
        if (distTotal > 0) {
            for (const h of top) {
                distribution.push({
                    name: nameById.get(h.holidayId) ?? "Unknown",
                    value: Math.round((h._count._all / distTotal) * 100),
                });
            }
            if (others.length) {
                const othersCount = others.reduce((acc, h) => acc + h._count._all, 0);
                distribution.push({ name: "Others", value: Math.round((othersCount / distTotal) * 100) });
            }
        }

        return {
            stats: {
                activeRentals,
                upcomingDeliveries,
                pendingReturns,
                returnedToday,
                inspectionsPending,
            },
            revenue: {
                depositsHeld: depositsHeld.toFixed(2),
                depositsRefunded: depositsRefunded.toFixed(2),
                subscriptionRevenue: subscriptionRevenue.toFixed(2),
                rentalRevenue: rentalRevenue.toFixed(2),
            },
            trend,
            distribution,
        };
    }
}
