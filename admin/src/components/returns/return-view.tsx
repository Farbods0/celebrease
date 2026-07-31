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
import { Textarea } from "@/components/ui/textarea";
import {
    formatDuration,
    formatMoney,
    formatOrderStatus,
    formatTier,
    ordersApi,
    type ApiOrder,
    type InspectReturnLinePayload,
    type OrderStatus,
    type ReturnCondition,
} from "@/lib/api";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const RETURN_TIMELINE_STATUSES: OrderStatus[] = [
    "RETURN_REQUESTED",
    "RETURN_IN_TRANSIT",
    "RETURN_RECEIVED",
    "INSPECTED",
    "COMPLETED",
];

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

const CONDITIONS: ReturnCondition[] = ["GOOD", "DAMAGED", "MISSING", "LOST"];

function timelineDescription(order: ApiOrder, status: OrderStatus): string {
    switch (status) {
        case "RETURN_REQUESTED":
            return order.returnRequestedAt ? moment(order.returnRequestedAt).format("MMM DD, YYYY") : "Pending";
        case "RETURN_IN_TRANSIT":
            return order.returnShippedAt ? moment(order.returnShippedAt).format("MMM DD, YYYY") : "Pending";
        case "RETURN_RECEIVED":
            return order.returnReceivedAt ? moment(order.returnReceivedAt).format("MMM DD, YYYY") : "Pending";
        case "INSPECTED":
            return order.inspectedAt ? moment(order.inspectedAt).format("MMM DD, YYYY") : "Pending";
        case "COMPLETED":
            return order.completedAt ? moment(order.completedAt).format("MMM DD, YYYY") : "Pending";
        default:
            return "Pending";
    }
}

function formatRange(start: string, end: string) {
    const s = moment(start);
    const e = moment(end);
    if (s.year() === e.year()) return `${s.format("MMM DD")} - ${e.format("MMM DD, YYYY")}`;
    return `${s.format("MMM DD, YYYY")} - ${e.format("MMM DD, YYYY")}`;
}

function currentReturnStep(order: ApiOrder) {
    const idx = RETURN_TIMELINE_STATUSES.indexOf(order.status);
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

type LineKey = string;
type LineState = {
    itemId?: string;
    addOnId?: string;
    qty: number;
    condition: ReturnCondition;
    feeCharged: number;
    notes: string;
};

function lineKey(itemId: string | undefined, addOnId: string | undefined): LineKey {
    return itemId ? `i:${itemId}` : `a:${addOnId}`;
}

export function ReturnView({ item, onUpdated }: { item: ApiOrder; onUpdated?: (updated: ApiOrder) => void }) {
    const [loading, setLoading] = useState<string | null>(null);

    // Return-label form
    const [showLabelForm, setShowLabelForm] = useState(false);
    const [returnLabelUrl, setReturnLabelUrl] = useState(item.returnLabelUrl ?? "");
    const [returnTrackingNumber, setReturnTrackingNumber] = useState(item.returnTrackingNumber ?? "");
    const [returnTrackingUrl, setReturnTrackingUrl] = useState(item.returnTrackingUrl ?? "");

    // Inspection form
    const [showInspect, setShowInspect] = useState(false);
    const [inspectNotes, setInspectNotes] = useState("");
    const [lines, setLines] = useState<Record<LineKey, LineState>>(() => {
        const initial: Record<LineKey, LineState> = {};
        for (const l of item.items) {
            initial[lineKey(l.item.id, undefined)] = {
                itemId: l.item.id,
                qty: l.qty,
                condition: "GOOD",
                feeCharged: 0,
                notes: "",
            };
        }
        for (const l of item.addOns) {
            initial[lineKey(undefined, l.addOn.id)] = {
                addOnId: l.addOn.id,
                qty: l.qty,
                condition: "GOOD",
                feeCharged: 0,
                notes: "",
            };
        }
        return initial;
    });

    const totalDeposit = useMemo(
        () => Number.parseFloat(item.kitDeposit) + Number.parseFloat(item.addOnDeposit),
        [item.kitDeposit, item.addOnDeposit],
    );
    const totalFees = useMemo(
        () => Object.values(lines).reduce((acc, l) => acc + (Number.isFinite(l.feeCharged) ? l.feeCharged : 0), 0),
        [lines],
    );
    const projectedForfeit = Math.min(totalFees, totalDeposit);
    const projectedRefund = totalDeposit - projectedForfeit;

    function updateLine(key: LineKey, patch: Partial<LineState>) {
        setLines((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    }

    async function handleSaveReturnLabel() {
        if (!returnLabelUrl && !returnTrackingNumber && !returnTrackingUrl) {
            toast.error("Provide at least one of label URL, tracking number, or tracking URL");
            return;
        }
        setLoading("LABEL");
        try {
            const updated = await ordersApi.setReturnLabel(item.id, {
                ...(returnLabelUrl ? { returnLabelUrl } : {}),
                ...(returnTrackingNumber ? { returnTrackingNumber } : {}),
                ...(returnTrackingUrl ? { returnTrackingUrl } : {}),
            });
            toast.success("Return label saved");
            onUpdated?.(updated);
            setShowLabelForm(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save return label");
        } finally {
            setLoading(null);
        }
    }

    async function handleStatusChange(status: OrderStatus) {
        setLoading(status);
        try {
            const updated = await ordersApi.updateStatus(item.id, { status });
            toast.success(`Order ${updated.orderNumber} marked as ${formatOrderStatus(status)}`);
            onUpdated?.(updated);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update order");
        } finally {
            setLoading(null);
        }
    }

    async function handleSubmitInspection() {
        const payload: InspectReturnLinePayload[] = Object.values(lines).map((l) => ({
            itemId: l.itemId,
            addOnId: l.addOnId,
            qty: l.qty,
            condition: l.condition,
            ...(l.feeCharged > 0 ? { feeCharged: l.feeCharged } : {}),
            ...(l.notes ? { notes: l.notes } : {}),
        }));

        setLoading("INSPECT");
        try {
            const updated = await ordersApi.inspectReturn(item.id, {
                lines: payload,
                ...(inspectNotes ? { inspectionNotes: inspectNotes } : {}),
            });
            toast.success(`Inspection complete, refunded ${formatMoney(updated.depositRefunded)}`);
            onUpdated?.(updated);
            setShowInspect(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to submit inspection");
        } finally {
            setLoading(null);
        }
    }

    async function handleCompleteInspected() {
        setLoading("COMPLETE");
        try {
            const updated = await ordersApi.completeInspected(item.id);
            toast.success(`Order ${updated.orderNumber} completed`);
            onUpdated?.(updated);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to complete order");
        } finally {
            setLoading(null);
        }
    }

    const canMarkInTransit = item.status === "RETURN_REQUESTED";
    const canMarkReceived = item.status === "RETURN_IN_TRANSIT";
    const canInspect = item.status === "RETURN_RECEIVED";
    const canComplete = item.status === "INSPECTED";
    const canEditLabel = item.status === "RETURN_REQUESTED" || item.status === "RETURN_IN_TRANSIT";

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Return Inspection</DialogTitle>
            </DialogHeader>

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Order Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Order #" value={item.orderNumber} />
                    <Field label="Customer" value={item.user.name} />
                    <Field label="Email" value={item.user.email} />
                    <Field label="Phone" value={item.user.phone ?? item.user.address?.phone ?? ", "} />
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

            {item.addOns.length > 0 && (
                <section>
                    <h3 className="text-sm uppercase font-medium mb-2.5">Add-Ons ({item.addOns.length})</h3>
                    <div className="space-y-2">
                        {item.addOns.map((line) => (
                            <div key={line.addOn.id} className="border p-2 rounded-lg flex justify-between text-sm">
                                <span>
                                    {line.addOn.name} <span className="text-muted-foreground">x{line.qty}</span>
                                </span>
                                <span className="font-medium">{formatMoney(Number.parseFloat(line.price) * line.qty)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Return Timeline</h3>
                <div className="flex items-center justify-center">
                    <Stepper
                        defaultValue={currentReturnStep(item)}
                        orientation="vertical"
                        indicators={{
                            completed: <CheckIcon className="size-3.5" />,
                            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
                        }}
                    >
                        <StepperNav>
                            {RETURN_TIMELINE_STATUSES.map((status, index) => (
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
                                    {index < RETURN_TIMELINE_STATUSES.length - 1 && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                    </Stepper>
                </div>
            </section>

            {(item.returnLabelUrl || item.returnTrackingNumber) && (
                <section>
                    <h3 className="text-sm uppercase font-medium mb-2.5">Return Shipment</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {item.returnLabelUrl && (
                            <Field
                                label="Return Label"
                                value={
                                    <a
                                        href={item.returnLabelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Open label →
                                    </a>
                                }
                            />
                        )}
                        {item.returnTrackingNumber && <Field label="Return Tracking #" value={item.returnTrackingNumber} />}
                        {item.returnTrackingUrl && (
                            <Field
                                label="Return Tracking URL"
                                value={
                                    <a
                                        href={item.returnTrackingUrl}
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

            {(item.status === "INSPECTED" || item.status === "COMPLETED") && item.returnLines.length > 0 && (
                <section>
                    <h3 className="text-sm uppercase font-medium mb-2.5">Inspection Result</h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <Field label="Refunded" value={formatMoney(item.depositRefunded)} />
                        <Field label="Forfeited" value={formatMoney(item.depositForfeited)} />
                        <Field label="Inspected" value={item.inspectedAt ? moment(item.inspectedAt).format("MMM DD, YYYY") : ", "} />
                    </div>
                    {item.inspectionNotes && (
                        <p className="text-sm text-muted-foreground border rounded-lg p-2">{item.inspectionNotes}</p>
                    )}
                </section>
            )}

            <section>
                <h3 className="text-sm uppercase font-medium mb-2.5">Payment & Deposit</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Kit Deposit" value={formatMoney(item.kitDeposit)} />
                    <Field label="Add-On Deposit" value={formatMoney(item.addOnDeposit)} />
                    <Field label="Total Deposit" value={formatMoney(totalDeposit)} />
                    <Field label="Total Paid" value={formatMoney(item.total)} />
                </div>
            </section>

            {canEditLabel && (
                <>
                    <Separator />
                    <section>
                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-sm uppercase font-medium">Return Label</h3>
                            {!showLabelForm && (
                                <Button size="sm" variant="outline" onClick={() => setShowLabelForm(true)}>
                                    {item.returnLabelUrl || item.returnTrackingNumber ? "Update" : "Add"}
                                </Button>
                            )}
                        </div>
                        {showLabelForm && (
                            <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                                <div className="space-y-1.5">
                                    <Label htmlFor="returnLabelUrl" className="text-xs">
                                        Label URL
                                    </Label>
                                    <Input
                                        id="returnLabelUrl"
                                        placeholder="https://shippo.com/label/..."
                                        value={returnLabelUrl}
                                        onChange={(e) => setReturnLabelUrl(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="returnTrackingNumber" className="text-xs">
                                        Tracking Number
                                    </Label>
                                    <Input
                                        id="returnTrackingNumber"
                                        placeholder="e.g. 1Z999AA10123456784"
                                        value={returnTrackingNumber}
                                        onChange={(e) => setReturnTrackingNumber(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="returnTrackingUrl" className="text-xs">
                                        Tracking URL
                                    </Label>
                                    <Input
                                        id="returnTrackingUrl"
                                        placeholder="https://track.example.com/..."
                                        value={returnTrackingUrl}
                                        onChange={(e) => setReturnTrackingUrl(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={() => setShowLabelForm(false)} disabled={!!loading}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveReturnLabel} disabled={!!loading}>
                                        {loading === "LABEL" ? "Saving…" : "Save Label"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </section>
                </>
            )}

            {canInspect && showInspect && (
                <>
                    <Separator />
                    <section>
                        <h3 className="text-sm uppercase font-medium mb-2.5">Inspect Returned Items</h3>
                        <div className="space-y-2">
                            {item.items.map((line) => {
                                const key = lineKey(line.item.id, undefined);
                                const state = lines[key];
                                if (!state) return null;
                                return (
                                    <InspectRow
                                        key={key}
                                        title={line.item.name}
                                        qty={line.qty}
                                        state={state}
                                        onChange={(patch) => updateLine(key, patch)}
                                    />
                                );
                            })}
                            {item.addOns.map((line) => {
                                const key = lineKey(undefined, line.addOn.id);
                                const state = lines[key];
                                if (!state) return null;
                                return (
                                    <InspectRow
                                        key={key}
                                        title={`${line.addOn.name} (add-on)`}
                                        qty={line.qty}
                                        state={state}
                                        onChange={(patch) => updateLine(key, patch)}
                                    />
                                );
                            })}
                        </div>

                        <div className="space-y-1.5 mt-3">
                            <Label htmlFor="inspectionNotes" className="text-xs">
                                Inspection Notes (optional)
                            </Label>
                            <Textarea
                                id="inspectionNotes"
                                placeholder="Overall condition, observations, etc."
                                value={inspectNotes}
                                onChange={(e) => setInspectNotes(e.target.value)}
                                rows={2}
                            />
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 p-3 rounded-lg border bg-muted/40">
                            <Field label="Deposit Held" value={formatMoney(totalDeposit)} />
                            <Field label="Deductions" value={formatMoney(projectedForfeit)} />
                            <Field
                                label="Refund"
                                value={<span className="text-emerald-700">{formatMoney(projectedRefund)}</span>}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button variant="outline" onClick={() => setShowInspect(false)} disabled={!!loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitInspection} disabled={!!loading}>
                                {loading === "INSPECT" ? "Refunding…" : "Confirm & Refund"}
                            </Button>
                        </div>
                    </section>
                </>
            )}

            {!showInspect && (canMarkInTransit || canMarkReceived || canInspect || canComplete) && (
                <>
                    <Separator />
                    <section>
                        <div className="grid grid-cols-2 gap-3">
                            {canMarkInTransit && (
                                <Button disabled={!!loading} onClick={() => handleStatusChange("RETURN_IN_TRANSIT")}>
                                    {loading === "RETURN_IN_TRANSIT" ? "Updating..." : "Mark Return Shipped"}
                                </Button>
                            )}
                            {canMarkReceived && (
                                <Button disabled={!!loading} onClick={() => handleStatusChange("RETURN_RECEIVED")}>
                                    {loading === "RETURN_RECEIVED" ? "Updating..." : "Mark Received"}
                                </Button>
                            )}
                            {canInspect && (
                                <Button onClick={() => setShowInspect(true)} disabled={!!loading}>
                                    Open Inspection
                                </Button>
                            )}
                            {canComplete && (
                                <Button disabled={!!loading} onClick={handleCompleteInspected}>
                                    {loading === "COMPLETE" ? "Completing…" : "Complete Order"}
                                </Button>
                            )}
                        </div>
                    </section>
                </>
            )}
        </DialogContent>
    );
}

function InspectRow({
    title,
    qty,
    state,
    onChange,
}: {
    title: string;
    qty: number;
    state: LineState;
    onChange: (patch: Partial<LineState>) => void;
}) {
    return (
        <div className="border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{title}</span>
                <span className="text-muted-foreground">x{qty}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-xs">Condition</Label>
                    <select
                        className="w-full h-9 rounded-md border bg-background px-2 text-sm"
                        value={state.condition}
                        onChange={(e) => onChange({ condition: e.target.value as ReturnCondition })}
                    >
                        {CONDITIONS.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Fee Charged</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={state.feeCharged}
                        onChange={(e) => onChange({ feeCharged: Number.parseFloat(e.target.value) || 0 })}
                    />
                </div>
            </div>
            {state.condition !== "GOOD" && (
                <Input
                    placeholder="Notes (optional)"
                    value={state.notes}
                    onChange={(e) => onChange({ notes: e.target.value })}
                />
            )}
        </div>
    );
}
