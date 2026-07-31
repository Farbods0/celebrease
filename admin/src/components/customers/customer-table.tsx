import { Button } from "@/components/ui/button";
import { customersApi, formatCustomerDate, formatDeposit, formatOnTimeReturns, getInitials, type ApiCustomer, type ApiCustomerDetail } from "@/lib/api";
import { Flag, Mail, ShieldBan } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

const REGION_COLORS = ["#9B2FC9", "#2D6CDF", "#1F9D6B", "#DC0075", "#C77700", "#D23B5A"];

function regionColor(region?: string | null) {
    if (!region) return "var(--ink-soft)";
    let hash = 0;
    for (let i = 0; i < region.length; i++) hash = region.charCodeAt(i) + ((hash << 5) - hash);
    return REGION_COLORS[Math.abs(hash) % REGION_COLORS.length];
}

function ExpandedCustomerRow({ item }: { item: ApiCustomer }) {
    const [detail, setDetail] = useState<ApiCustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customersApi.get(item.id).then(setDetail).catch(() => setDetail(null)).finally(() => setLoading(false));
    }, [item.id]);

    if (loading) {
        return (
            <tr>
                <td colSpan={8} style={{ padding: 16, textAlign: "center" }}>
                    <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent mx-auto" />
                </td>
            </tr>
        );
    }

    const avgOrderValue = detail && detail.orderCount > 0 && detail.recentOrders.length > 0
        ? `$${(detail.recentOrders.reduce((sum, o) => sum + Number(o.total), 0) / detail.recentOrders.length).toFixed(0)}`
        : ", ";

    return (
        <tr style={{ background: "var(--bg)" }}>
            <td colSpan={8} style={{ padding: 20 }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Address */}
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-soft)", marginBottom: 6 }}>Delivery Address</p>
                        {detail?.address ? (
                            <div className="text-sm space-y-0.5">
                                <p>{detail.address.streetLine1}</p>
                                {detail.address.streetLine2 && <p>{detail.address.streetLine2}</p>}
                                <p>{detail.address.city}, {detail.address.state} {detail.address.postalCode}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No address on file</p>
                        )}
                    </div>
                    {/* Stats */}
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-soft)", marginBottom: 6 }}>Account Info</p>
                        <div className="text-sm space-y-1">
                            <p>Last active: <span className="font-medium">{detail ? formatCustomerDate(detail.updatedAt) : ", "}</span></p>
                            <p>Avg order value: <span className="font-bold">{avgOrderValue}</span></p>
                            <p>Joined: <span className="font-medium">{formatCustomerDate(item.createdAt)}</span></p>
                        </div>
                    </div>
                    {/* Actions */}
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-soft)", marginBottom: 6 }}>Actions</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5 rounded-lg text-xs"
                                onClick={() => toast.info("Email feature coming soon")}
                            >
                                <Mail className="size-3.5" />
                                Email
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 rounded-lg text-xs"
                                onClick={() => toast.warning(`${item.name} flagged for review`)}
                            >
                                <Flag className="size-3.5" />
                                Flag
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="gap-1.5 rounded-lg text-xs"
                                onClick={() => toast.error(`${item.name} has been suspended`)}
                            >
                                <ShieldBan className="size-3.5" />
                                Suspend
                            </Button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}

type CustomerTableProps = {
    items: ApiCustomer[];
    onView: (item: ApiCustomer) => void;
};

export function CustomerTable({ items, onView }: CustomerTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="hidden md:block" style={{ overflowX: "auto" }}>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Region</th>
                        <th>Subscription</th>
                        <th>Total orders</th>
                        <th>On-time returns</th>
                        <th>Deposits held</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ padding: "64px 0", textAlign: "center" }}>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-2xl">
                                        🔍
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold">No results found</p>
                                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <Fragment key={item.id}>
                                <tr
                                    style={item.banned ? { opacity: 0.75 } : undefined}
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                    aria-expanded={expandedId === item.id}
                                >
                                    <td>
                                        <div className="cust">
                                            <div className="av-init">{getInitials(item.name)}</div>
                                            <div>
                                                <div className="nm">{item.name}</div>
                                                <div className="em">{item.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.region ? (
                                            <span className="region">
                                                <span className="region-dot" style={{ background: regionColor(item.region) }} />
                                                {item.region}
                                            </span>
                                        ) : (
                                            <span style={{ color: "var(--ink-soft)" }}>, </span>
                                        )}
                                    </td>
                                    <td>
                                        {item.hasActiveSubscription ? (
                                            <span className="status st-active">Active</span>
                                        ) : (
                                            <span style={{ color: "var(--ink-soft)" }}>, </span>
                                        )}
                                    </td>
                                    <td>{item.orderCount}</td>
                                    <td style={{ color: "var(--ink-muted)" }}>{formatOnTimeReturns(item.completedCount, item.orderCount)}</td>
                                    <td className="amt">{formatDeposit(item.depositsHeld)}</td>
                                    <td style={{ color: "var(--ink-muted)", fontSize: 13 }}>{formatCustomerDate(item.createdAt)}</td>
                                    <td>
                                        <span className={`status ${item.banned ? "st-banned" : "st-active"}`}>
                                            {item.banned ? "Banned" : "Active"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button
                                                type="button"
                                                className="act-btn"
                                                title="View profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(item);
                                                }}
                                            >
                                                👁
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedId === item.id && <ExpandedCustomerRow item={item} />}
                            </Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
