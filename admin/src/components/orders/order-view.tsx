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
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatDuration,
    formatMoney,
    formatOrderStatus,
    formatPaymentStatus,
    formatTier,
    type ApiOrder,
    type OrderStatus,
} from "@/lib/api";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const TIMELINE_STATUSES: OrderStatus[] = ["PENDING", "RESERVED", "SHIPPED", "DELIVERED", "COMPLETED"];

const TIMELINE_LABELS: Record<OrderStatus, string> = {
    PENDING: "Order Placed",
    RESERVED: "Reserved",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

function timelineDescription(order: ApiOrder, status: OrderStatus): string {
    switch (status) {
        case "PENDING":
            return formatDate(order.createdAt);
        case "SHIPPED":
            return order.shippedAt ? formatDate(order.shippedAt) : "Pending";
        case "DELIVERED":
            return order.deliveredAt ? formatDate(order.deliveredAt) : "Pending";
        case "COMPLETED":
            return order.completedAt ? formatDate(order.completedAt) : "Pending";
        default:
            return "Pending";
    }
}

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function currentStep(order: ApiOrder) {
    if (order.status === "CANCELLED") return 1;
    const idx = TIMELINE_STATUSES.indexOf(order.status);
    return idx >= 0 ? idx + 1 : 1;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function OrderView({ item }: { item: ApiOrder }) {
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
                    <Field label="Holiday" value={item.holiday.name} />
                    <Field label="Kit Type" value={formatTier(item.kit.tier)} />
                    <Field label="Duration" value={formatDuration(item.duration)} />
                    <Field label="Start" value={formatDate(item.startDate)} />
                    <Field label="End" value={formatDate(item.endDate)} />
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

            <Separator />
            <section>
                <div className="grid grid-cols-2 gap-3">
                    <Button>Mark as Delivered</Button>
                    <Button variant="outline">Download Shipping Label</Button>
                </div>
            </section>
        </DialogContent>
    );
}
