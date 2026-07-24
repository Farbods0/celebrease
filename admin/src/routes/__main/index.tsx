import { orderStatusPill } from "@/lib/admin-status";
import {
    baseURL,
    dashboardApi,
    formatTier,
    inventoryApi,
    ordersApi,
    type ApiItem,
    type ApiOrder,
} from "@/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__main/")({
    loader: async () => {
        const [stats, orders, inventory] = await Promise.all([
            dashboardApi.stats().catch(() => ({
                stats: { activeRentals: 0, upcomingDeliveries: 0, pendingReturns: 0, returnedToday: 0, inspectionsPending: 0 },
                revenue: { depositsHeld: "0", depositsRefunded: "0", subscriptionRevenue: "0", rentalRevenue: "0" },
                trend: [] as { month: string; subscriptions: number; rentals: number }[],
                distribution: [] as { name: string; value: number }[],
            })),
            ordersApi.list({ page: 1, limit: 6 }).catch(() => ({ items: [] as ApiOrder[], total: 0 })),
            inventoryApi.listAll().catch(() => ({ items: [] as ApiItem[] })),
        ]);
        return { stats, orders, inventory };
    },
    component: RouteComponent,
});

function money(value: string | number) {
    const n = typeof value === "number" ? value : Number.parseFloat(value);
    if (Number.isNaN(n)) return "$0";
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const img = (path?: string | null) => (path ? `${baseURL}${path}` : "");

function RouteComponent() {
    const { stats: data, orders, inventory } = Route.useLoaderData();
    const [range, setRange] = useState<"7" | "30" | "ytd">("30");

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    const lowStock = (inventory.items ?? [])
        .filter((it) => it.inventory && it.inventory.availableQty <= (it.lowStockThreshold || 5))
        .sort((a, b) => (a.inventory?.availableQty ?? 0) - (b.inventory?.availableQty ?? 0))
        .slice(0, 5);

    const recentOrders = orders.items ?? [];

    // Build the 12-month chart from live trend (rentals + subscriptions combined).
    const trend = data.trend ?? [];
    const trendMax = Math.max(1, ...trend.map((t) => t.rentals + t.subscriptions));

    return (
        <div className="content">
            {/* Page head */}
            <div className="page-head">
                <div>
                    <h1>{greeting}, {firstName()} 👋</h1>
                    <div className="sub">Here's what's happening across CeleBrease today — {today}.</div>
                </div>
                <div className="seg">
                    <button className={range === "7" ? "on" : ""} onClick={() => setRange("7")}>7 days</button>
                    <button className={range === "30" ? "on" : ""} onClick={() => setRange("30")}>30 days</button>
                    <button className={range === "ytd" ? "on" : ""} onClick={() => setRange("ytd")}>YTD</button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
                <Kpi
                    label="Rental revenue"
                    value={money(data.revenue.rentalRevenue)}
                    icon="＄"
                    iconBg="var(--green-bg)"
                    iconColor="var(--green)"
                    note="This period"
                />
                <Kpi
                    label="Subscription revenue"
                    value={money(data.revenue.subscriptionRevenue)}
                    icon="🔁"
                    iconBg="#F3E8FB"
                    iconColor="var(--brand-purple)"
                    note="Recurring MRR"
                />
                <Kpi
                    label="Kits out on rental"
                    value={String(data.stats.activeRentals)}
                    icon="📦"
                    iconBg="var(--blue-bg)"
                    iconColor="var(--blue)"
                    note={`${data.stats.upcomingDeliveries} upcoming deliveries`}
                />
                <Kpi
                    label="Pending returns"
                    value={String(data.stats.pendingReturns)}
                    icon="↩️"
                    iconBg="var(--amber-bg)"
                    iconColor="var(--amber)"
                    note={data.stats.pendingReturns > 0 ? "Needs review" : "All clear"}
                />
            </div>

            {/* Chart + low inventory */}
            <div className="grid-2">
                <div className="panel">
                    <div className="panel-head">
                        <h3>Revenue &amp; rentals</h3>
                        <Link to="/orders">View report →</Link>
                    </div>
                    <div className="panel-body">
                        {trend.length === 0 ? (
                            <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)", fontSize: 14 }}>
                                No revenue data yet — it will appear as orders come in.
                            </div>
                        ) : (
                            <>
                                <div className="chart">
                                    {trend.map((t) => {
                                        const total = t.rentals + t.subscriptions;
                                        const h = Math.round((total / trendMax) * 100);
                                        return (
                                            <div className="bar-col" key={t.month}>
                                                <div className="bar-stack">
                                                    <div className="bar" style={{ height: `${Math.max(h, 3)}%` }} />
                                                </div>
                                                <span className="bar-lbl">{t.month}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="chart-legend">
                                    <span><i style={{ background: "var(--brand-purple)" }} />Booked revenue</span>
                                    <span><i style={{ background: "#E1BEEE" }} />Projected</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-head">
                        <h3>Low inventory</h3>
                        <Link to="/inventory">Manage →</Link>
                    </div>
                    <div className="panel-body" style={{ paddingTop: 6 }}>
                        {lowStock.length === 0 ? (
                            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5 }}>
                                All items are well stocked. 🎉
                            </div>
                        ) : (
                            lowStock.map((it) => {
                                const first = it.kitItems?.[0]?.kit;
                                const total = it.inventory?.totalQty || 0;
                                const avail = it.inventory?.availableQty ?? 0;
                                const pct = total > 0 ? Math.round((avail / total) * 100) : 0;
                                return (
                                    <div className="li" key={it.id}>
                                        <img className="th" src={img(it.image)} alt="" />
                                        <div style={{ minWidth: 0 }}>
                                            <div className="nm">{it.name}</div>
                                            <div className="meta">
                                                {first ? `${first.holiday.name} · ${formatTier(first.tier)}` : it.sku}
                                            </div>
                                            <div className="bar-mini"><i style={{ width: `${pct}%` }} /></div>
                                        </div>
                                        <div className="qty">
                                            <div className="n">{avail}</div>
                                            <div className="t">of {total}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Recent orders */}
            <div className="panel">
                <div className="panel-head">
                    <h3>Recent orders</h3>
                    <Link to="/orders">View all orders →</Link>
                </div>
                <div className="panel-body" style={{ padding: "14px 4px" }}>
                    {recentOrders.length === 0 ? (
                        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5 }}>
                            No orders yet.
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Kit</th>
                                    <th>Rental</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((o) => {
                                    const pill = orderStatusPill(o.status);
                                    return (
                                        <tr key={o.id}>
                                            <td className="oid">{o.orderNumber}</td>
                                            <td>
                                                <div className="cust">
                                                    <div className="av">{initials(o.user.name)}</div>
                                                    <div>
                                                        <div className="nm">{o.user.name}</div>
                                                        <div className="em">{o.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{o.holiday.name} · {formatTier(o.kit.tier)}</td>
                                            <td>{o.duration === "SIXTY_DAY" ? "60 days" : "30 days"}</td>
                                            <td className="amt">{money(o.total)}</td>
                                            <td><span className={`status ${pill.cls}`}>{pill.label}</span></td>
                                            <td>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

function Kpi({ label, value, icon, iconBg, iconColor, note }: {
    label: string; value: string; icon: string; iconBg: string; iconColor: string; note?: string;
}) {
    return (
        <div className="kpi">
            <div className="top">
                <span className="lbl">{label}</span>
                <span className="ic" style={{ background: iconBg, color: iconColor }}>{icon}</span>
            </div>
            <div className="val">{value}</div>
            {note && <span className="delta up"><span className="muted">{note}</span></span>}
        </div>
    );
}

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}
function firstName() {
    return "Admin";
}
