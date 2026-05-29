import { RevenueCard } from "#/components/dashboard/revenue-card";
import { HolidayDistributionChart } from "@/components/dashboard/holiday-distribution-chart";
import { RevenueTrendsChart } from "@/components/dashboard/revenue-trends-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { dashboardApi, formatOrderStatus, formatTier, inventoryApi, ordersApi, type ApiItem, type ApiOrder } from "@/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    AlertTriangle,
    Bell,
    Box,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Download,
    Flame,
    Plus,
    ShoppingBag,
    ShoppingCart,
    Star,
    TrendingUp,
    Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/")({
    loader: async () => {
        const [stats, orders] = await Promise.all([
            dashboardApi.stats().catch(() => ({
                stats: { activeRentals: 0, upcomingDeliveries: 0, pendingReturns: 0, returnedToday: 0, inspectionsPending: 0 },
                revenue: { depositsHeld: "0", depositsRefunded: "0", subscriptionRevenue: "0", rentalRevenue: "0" },
                trend: [] as { month: string; subscriptions: number; rentals: number }[],
                distribution: [] as { name: string; value: number }[],
            })),
            ordersApi.list({ page: 1, limit: 5 }).catch(() => ({ items: [] as ApiOrder[], total: 0 })),
        ]);
        return { stats, orders };
    },
    component: RouteComponent,
});

function formatMoney(value: string) {
    const n = Number.parseFloat(value);
    if (Number.isNaN(n)) return "$0";
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function RouteComponent() {
    const { stats: data, orders } = Route.useLoaderData();

    // Pending actions
    const pendingOrders = (orders?.items ?? []).filter((o) => o.status === "PENDING");
    const returnActionOrders = (orders?.items ?? []).filter(
        (o) => o.status === "RETURN_REQUESTED" || o.status === "RETURN_RECEIVED"
    );

    return (
        <main className="mx-auto w-full max-w-384 p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening today.</p>
                </div>
            </div>

            {/* Quick Actions */}
            <section aria-label="Quick actions" className="mt-5 flex flex-wrap gap-2">
                <Link to="/holidays">
                    <Button size="sm" className="gap-2">
                        <Plus className="size-4" />
                        New Holiday
                    </Button>
                </Link>
                <Link to="/returns">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Undo2 className="size-4" />
                        Manage Returns
                    </Button>
                </Link>
                <ExportReportButton />
                <ReminderButton />
            </section>

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

            {/* D1: Low Stock Alerts + D2: Pending Actions */}
            <section aria-label="Alerts" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <LowStockWidget />
                <NeedsAttentionWidget pendingOrders={pendingOrders} returnActionOrders={returnActionOrders} />
            </section>

            <section aria-label="Analytics" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueTrendsChart data={data.trend} />
                </div>
                <div className="lg:col-span-1">
                    <HolidayDistributionChart data={data.distribution} />
                </div>
            </section>

            <section aria-label="Recent activity" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <RecentOrdersCard orders={orders?.items ?? []} />
                <ActivityFeedCard orders={orders?.items ?? []} />
            </section>
        </main>
    );
}

// D1: Low Stock Alerts Widget — fetches its own inventory data
function LowStockWidget() {
    const [items, setItems] = useState<ApiItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        inventoryApi.listAll()
            .then((d) => {
                const low = d.items.filter(
                    (item) => item.inventory && item.inventory.availableQty <= (item.lowStockThreshold || 5)
                );
                setItems(low);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="size-4 text-amber-500" />
                <h2 className="text-sm font-semibold">Low Stock Alerts</h2>
            </div>
            {loading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
            ) : items.length === 0 ? (
                <div className="flex items-center gap-2 py-4 text-center justify-center">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">All items adequately stocked</p>
                </div>
            ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {items.slice(0, 10).map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-mono font-semibold text-amber-600">
                                    {item.inventory?.availableQty ?? 0}
                                </span>
                                <Link to="/inventory" className="text-xs text-primary hover:underline">
                                    View
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// D2: Needs Attention Widget
function NeedsAttentionWidget({ pendingOrders, returnActionOrders }: { pendingOrders: ApiOrder[]; returnActionOrders: ApiOrder[] }) {
    const totalItems = pendingOrders.length + returnActionOrders.length;
    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">Needs Attention</h2>
                {totalItems > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{totalItems}</span>
                )}
            </div>
            {totalItems === 0 ? (
                <div className="flex items-center gap-2 py-4 text-center justify-center">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">All caught up</p>
                </div>
            ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {returnActionOrders.map((order) => (
                        <li key={order.id} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {order.status === "RETURN_REQUESTED" ? "Return requested" : "Needs inspection"}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.orderNumber} - {order.user.name}</p>
                            </div>
                            <Link to="/returns" className="text-xs text-primary hover:underline shrink-0">
                                View
                            </Link>
                        </li>
                    ))}
                    {pendingOrders.map((order) => (
                        <li key={order.id} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">Pending order</p>
                                <p className="text-xs text-muted-foreground">{order.orderNumber} - {order.user.name}</p>
                            </div>
                            <Link to="/orders" className="text-xs text-primary hover:underline shrink-0">
                                View
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// D3: Export Report Button with date range picker
function ExportReportButton() {
    const [exporting, setExporting] = useState(false);
    const [showExportPicker, setShowExportPicker] = useState(false);
    const [exportFrom, setExportFrom] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    });
    const [exportTo, setExportTo] = useState(() => new Date().toISOString().split("T")[0]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const data = await ordersApi.list({ page: 1, limit: 100, startDate: exportFrom, endDate: exportTo });
            const orders = data.items;

            if (orders.length === 0) {
                toast.info("No orders in selected range to export");
                return;
            }

            const headers = ["Order #", "Customer", "Holiday", "Kit", "Status", "Total", "Date"];
            const rows = orders.map((o) => [
                o.orderNumber,
                o.user.name,
                o.holiday.name,
                formatTier(o.kit.tier),
                formatOrderStatus(o.status),
                `$${Number(o.total).toFixed(2)}`,
                new Date(o.createdAt).toLocaleDateString(),
            ]);

            const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `orders-${exportFrom}-to-${exportTo}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Report exported");
            setShowExportPicker(false);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to export");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="relative">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowExportPicker((v) => !v)}>
                <Download className="size-4" />
                Export Report
            </Button>
            {showExportPicker && (
                <div className="absolute top-full left-0 mt-2 z-50 rounded-lg border bg-card shadow-lg p-4 space-y-3 w-72">
                    <p className="text-sm font-medium">Export Date Range</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">From</label>
                            <input
                                type="date"
                                value={exportFrom}
                                onChange={(e) => setExportFrom(e.target.value)}
                                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">To</label>
                            <input
                                type="date"
                                value={exportTo}
                                onChange={(e) => setExportTo(e.target.value)}
                                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowExportPicker(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleExport} disabled={exporting}>
                            {exporting ? "Exporting..." : "Download CSV"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// D3: Send Reminder Button (with modal)
function ReminderButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
                <Bell className="size-4" />
                Send Reminder
            </Button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
                    <div className="bg-card rounded-xl border shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2">Send Reminder</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Compose a message to send to customers with upcoming return deadlines.
                        </p>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Your reminder message..."
                        />
                        <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                            Email delivery is not configured yet. This feature will send emails once SMTP settings are connected.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" disabled>
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function RecentOrdersCard({ orders }: { orders: ApiOrder[] }) {
    return (
        <div className="rounded-lg border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link to="/orders" className="text-xs font-semibold text-primary hover:underline">
                    View all →
                </Link>
            </div>
            {orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b">
                                <th className="py-2 pr-3">Order</th>
                                <th className="py-2 pr-3">Customer</th>
                                <th className="py-2 pr-3 hidden md:table-cell">Kit</th>
                                <th className="py-2 pr-3">Status</th>
                                <th className="py-2 pl-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b last:border-b-0">
                                    <td className="py-3 pr-3 font-mono text-xs">{order.orderNumber}</td>
                                    <td className="py-3 pr-3 font-medium">{order.user.name}</td>
                                    <td className="py-3 pr-3 text-muted-foreground hidden md:table-cell">
                                        {order.holiday.name} {formatTier(order.kit.tier)}
                                    </td>
                                    <td className="py-3 pr-3">
                                        <StatusBadge status={formatOrderStatus(order.status)} />
                                    </td>
                                    <td className="py-3 pl-3 text-right font-semibold">
                                        ${Number(order.total).toFixed(0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

type ActivityItem = {
    id: string;
    icon: typeof ShoppingCart;
    color: string;
    title: string;
    subtitle: string;
    time: string;
};

const STATUS_ICONS: Record<string, { icon: typeof ShoppingCart; color: string; verb: string }> = {
    PENDING: { icon: ShoppingCart, color: "text-primary bg-primary/10", verb: "New order placed" },
    RESERVED: { icon: ShoppingCart, color: "text-primary bg-primary/10", verb: "Order reserved" },
    SHIPPED: { icon: ShoppingBag, color: "text-blue-600 bg-blue-50", verb: "Order shipped" },
    DELIVERED: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", verb: "Order delivered" },
    RETURN_REQUESTED: { icon: Undo2, color: "text-amber-600 bg-amber-50", verb: "Return requested" },
    RETURN_IN_TRANSIT: { icon: Undo2, color: "text-amber-600 bg-amber-50", verb: "Return in transit" },
    RETURN_RECEIVED: { icon: Undo2, color: "text-amber-600 bg-amber-50", verb: "Return received" },
    COMPLETED: { icon: Star, color: "text-emerald-600 bg-emerald-50", verb: "Order completed" },
    CANCELLED: { icon: TrendingUp, color: "text-rose-600 bg-rose-50", verb: "Order cancelled" },
};

function relativeTime(value: string) {
    const then = new Date(value).getTime();
    if (Number.isNaN(then)) return "";
    const diffMs = Date.now() - then;
    const minutes = Math.round(diffMs / 60_000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.round(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} d ago`;
    return new Date(value).toLocaleDateString();
}

function buildActivityFeed(orders: ApiOrder[]): ActivityItem[] {
    return orders.slice(0, 5).map((order) => {
        const meta = STATUS_ICONS[order.status] ?? {
            icon: ShoppingCart,
            color: "text-muted-foreground bg-muted",
            verb: "Order updated",
        };
        return {
            id: order.id,
            icon: meta.icon,
            color: meta.color,
            title: meta.verb,
            subtitle: `${order.user.name} · ${order.holiday.name} ${formatTier(order.kit.tier)}`,
            time: relativeTime(order.updatedAt ?? order.createdAt),
        };
    });
}

function ActivityFeedCard({ orders }: { orders: ApiOrder[] }) {
    const feed = buildActivityFeed(orders);
    return (
        <div className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {feed.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No recent activity yet.</p>
            ) : (
                <ul className="space-y-3">
                    {feed.map((item) => (
                        <li key={item.id} className="flex items-start gap-3">
                            <span className={`size-8 rounded-full inline-flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-tight">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.subtitle}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
