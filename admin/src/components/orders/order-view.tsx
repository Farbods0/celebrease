import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/reui/stepper";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatDuration,
    formatMoney,
    formatOrderStatus,
    formatPaymentStatus,
    formatTier,
    getNextActions,
    ordersApi,
    type ApiOrder,
    type OrderStatus,
} from "@/lib/api";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

const TIMELINE_STATUSES: OrderStatus[] = ["PENDING", "RESERVED", "SHIPPED", "DELIVERED", "COMPLETED"];

const TIMELINE_LABELS: Record<OrderStatus, string> = {
    PENDING: "Order Placed",
    RESERVED: "Reserved",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    RETURN_REQUESTED: "Return Requested",
    RETURN_IN_TRANSIT: "In Transit",
    RETURN_RECEIVED: "Received",
    INSPECTED: "Inspected",
};

const RETURN_STATUSES = new Set<OrderStatus>([
    "RETURN_REQUESTED",
    "RETURN_IN_TRANSIT",
    "RETURN_RECEIVED",
    "INSPECTED",
]);

function timelineDescription(order: ApiOrder, status: OrderStatus): string {
    switch (status) {
        case "PENDING":
            return moment(order.createdAt).format("MMM DD, YYYY");
        case "RESERVED":
            return order.paidAt ? moment(order.paidAt).format("MMM DD, YYYY") : "Pending";
        case "SHIPPED":
            return order.shippedAt ? moment(order.shippedAt).format("MMM DD, YYYY") : "Pending";
        case "DELIVERED":
            return order.deliveredAt ? moment(order.deliveredAt).format("MMM DD, YYYY") : "Pending";
        case "COMPLETED":
            return order.completedAt ? moment(order.completedAt).format("MMM DD, YYYY") : "Pending";
        default:
            return "Pending";
    }
}

function formatRange(start: string, end: string) {
    const s = moment(start);
    const e = moment(end);

    if (s.year() === e.year()) {
        return `${s.format("MMM DD")} - ${e.format("MMM DD, YYYY")}`;
    }

    return `${s.format("MMM DD, YYYY")} - ${e.format("MMM DD, YYYY")}`;
}

function currentStep(order: ApiOrder) {
    if (order.status === "CANCELLED") return 1;
    const idx = TIMELINE_STATUSES.indexOf(order.status);
    if (idx >= 0) return idx + 1;
    // Order is in a return stage — forward timeline is fully completed.
    if (RETURN_STATUSES.has(order.status)) return TIMELINE_STATUSES.length;
    return 1;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

const ACTION_LABELS: Record<OrderStatus, { label: string; variant: "default" | "outline" | "destructive" }> = {
    RESERVED: { label: "Mark Reserved", variant: "default" },
    SHIPPED: { label: "Mark Shipped", variant: "default" },
    DELIVERED: { label: "Mark Delivered", variant: "default" },
    COMPLETED: { label: "Mark Completed", variant: "default" },
    CANCELLED: { label: "Cancel Order", variant: "destructive" },
    PENDING: { label: "Pending", variant: "outline" },
    RETURN_REQUESTED: { label: "Return Requested", variant: "outline" },
    RETURN_IN_TRANSIT: { label: "Mark Return Shipped", variant: "default" },
    RETURN_RECEIVED: { label: "Mark Received", variant: "default" },
    INSPECTED: { label: "Inspected", variant: "outline" },
};

export function OrderView({ item, onUpdated }: { item: ApiOrder; onUpdated?: (updated: ApiOrder) => void }) {
    const [loading, setLoading] = useState<string | null>(null);
    const [showShipForm, setShowShipForm] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingUrl, setTrackingUrl] = useState("");

    const isReturnPhase = RETURN_STATUSES.has(item.status);
    // In the return phase the admin manages the order from /returns instead.
    const nextActions = isReturnPhase ? [] : getNextActions(item);

    async function handleStatusChange(status: OrderStatus) {
        if (status === "SHIPPED" && !showShipForm) {
            setShowShipForm(true);
            return;
        }

        setLoading(status);
        try {
            const updated = await ordersApi.updateStatus(item.id, {
                status,
                ...(status === "SHIPPED" && trackingNumber ? { trackingNumber } : {}),
                ...(status === "SHIPPED" && trackingUrl ? { trackingUrl } : {}),
            });
            toast.success(`Order ${updated.orderNumber} marked as ${formatOrderStatus(status)}`);
            onUpdated?.(updated);
            setShowShipForm(false);
            setTrackingNumber("");
            setTrackingUrl("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update order");
        } finally {
            setLoading(null);
        }
    }

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Order Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Order #" value={item.orderNumber} />
                    <Field label="Customer" value={item.user.name} />
                    <Field label="Email" value={item.user.email} />
                    <Field label="Phone" value={item.user.phone ?? item.user.address?.phone ?? "—"} />
                    <Field label="Holiday" value={item.holiday.name} />
                    <Field label="Kit" value={formatTier(item.kit.tier)} />
                    <Field label="Duration" value={formatDuration(item.duration)} />
                    <Field label="Period" value={formatRange(item.startDate, item.endDate)} />
                    <Field label="Status" value={<StatusBadge status={formatOrderStatus(item.status)} />} />
                </div>
            </section>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Items ({item.items.length})</h3>
                <div className="space-y-2">
                    {item.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No items</p>
                    ) : (
                        item.items.map((line) => (
                            <div key={line.item.id} className="border p-2 rounded-lg flex justify-between text-sm">
                                <span>{line.item.name}</span>
                                <span className="text-muted-foreground">x{line.qty}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Add-Ons ({item.addOns.length})</h3>
                <div className="space-y-2">
                    {item.addOns.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No add-ons</p>
                    ) : (
                        item.addOns.map((line) => (
                            <div key={line.addOn.id} className="border p-2 rounded-lg flex justify-between text-sm">
                                <span>
                                    {line.addOn.name} <span className="text-muted-foreground">x{line.qty}</span>
                                </span>
                                <span className="font-medium">{formatMoney(Number.parseFloat(line.price) * line.qty)}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {item.trackingNumber && (
                <section>
                    <h3 className="text-sm uppercase font-medium mb-2.5">Tracking</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Field label="Tracking #" value={item.trackingNumber} />
                        {item.trackingUrl && (
                            <Field
                                label="Tracking Link"
                                value={
                                    <a
                                        href={item.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        View →
                                    </a>
                                }
                            />
                        )}
                    </div>
                </section>
            )}

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Shipment Timeline</h3>
                <div className="flex items-center justify-center">
                    <Stepper
                        defaultValue={currentStep(item)}
                        orientation="vertical"
                        indicators={{
                            completed: <CheckIcon className="size-3.5" />,
                            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
                        }}
                    >
                        <StepperNav>
                            {TIMELINE_STATUSES.map((status, index) => (
                                <StepperItem key={status} step={index + 1} className="relative items-start not-last:flex-1">
                                    <StepperTrigger className="items-start gap-2.5 pb-4 last:pb-0">
                                        <StepperIndicator className="data-[state=completed]:bg-chart-4 data-[state=completed]:text-white">
                                            {index + 1}
                                        </StepperIndicator>
                                        <div className="mt-0.5 text-left">
                                            <StepperTitle>{TIMELINE_LABELS[status]}</StepperTitle>
                                            <StepperDescription>{timelineDescription(item, status)}</StepperDescription>
                                        </div>
                                    </StepperTrigger>
                                    {index < TIMELINE_STATUSES.length - 1 && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                    </Stepper>
                </div>
            </section>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Payment & Deposit</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Rental" value={formatMoney(item.rentalFee)} />
                    <Field label="Extended" value={formatMoney(item.extendedFee)} />
                    <Field label="Add-Ons" value={formatMoney(item.addOnsFee)} />
                    <Field label="Kit Deposit" value={formatMoney(item.kitDeposit)} />
                    <Field label="Add-On Deposit" value={formatMoney(item.addOnDeposit)} />
                    <Field label="Tax" value={formatMoney(item.tax)} />
                    <Field label="Shipping" value={formatMoney(item.shippingFee)} />
                    <Field label="Total" value={formatMoney(item.total)} />
                    <Field label="Payment" value={<StatusBadge status={formatPaymentStatus(item.paymentStatus)} />} />
                </div>
            </section>

            {item.status === "CANCELLED" && (
                <>
                    <Separator />
                    <section>
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                            <p className="text-sm font-medium text-red-700">
                                Order cancelled{item.cancelledAt ? ` on ${moment(item.cancelledAt).format("MMM DD, YYYY")}` : ""}
                            </p>
                        </div>
                    </section>
                </>
            )}

            {isReturnPhase && (
                <>
                    <Separator />
                    <section>
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                            <p className="text-sm font-medium text-amber-800">
                                This order is in the return flow. Manage it from the{" "}
                                <a href="/returns" className="underline font-semibold">
                                    Returns page
                                </a>
                                .
                            </p>
                        </div>
                    </section>
                </>
            )}

            {nextActions.length > 0 && (
                <>
                    <Separator />
                    <section>
                        {showShipForm && (
                            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted/50">
                                <h4 className="text-sm font-medium">Shipping Details (optional)</h4>
                                <div className="space-y-1.5">
                                    <Label htmlFor="trackingNumber" className="text-xs">
                                        Tracking Number
                                    </Label>
                                    <Input
                                        id="trackingNumber"
                                        placeholder="e.g. 1Z999AA10123456784"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="trackingUrl" className="text-xs">
                                        Tracking URL
                                    </Label>
                                    <Input
                                        id="trackingUrl"
                                        placeholder="https://track.example.com/..."
                                        value={trackingUrl}
                                        onChange={(e) => setTrackingUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {nextActions.map((status) => {
                                const config = ACTION_LABELS[status];
                                return (
                                    <Button
                                        key={status}
                                        variant={config.variant}
                                        disabled={!!loading}
                                        onClick={() => handleStatusChange(status)}
                                    >
                                        {loading === status
                                            ? "Updating..."
                                            : showShipForm && status === "SHIPPED"
                                              ? "Confirm & Ship"
                                              : config.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}
        </DialogContent>
    );
}
