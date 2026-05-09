import { request } from "./base";

export type DashboardStats = {
    stats: {
        activeRentals: number;
        upcomingDeliveries: number;
        pendingReturns: number;
        returnedToday: number;
        inspectionsPending: number;
    };
    revenue: {
        depositsHeld: string;
        depositsRefunded: string;
        subscriptionRevenue: string;
        rentalRevenue: string;
    };
    trend: { month: string; subscriptions: number; rentals: number }[];
    distribution: { name: string; value: number }[];
};

export const dashboardApi = {
    stats: () => request<DashboardStats>("/dashboard/stats"),
};
