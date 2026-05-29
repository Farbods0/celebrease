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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatDate,
    formatPlanLabel,
    formatSlotStatus,
    formatStatus,
    formatSubId,
    getCurrentSlot,
    holidaysApi,
    subscriptionsApi,
    type ApiHoliday,
    type ApiSubscription,
    type SubscriptionStatus,
} from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

const STATUS_OPTIONS: SubscriptionStatus[] = ["ACTIVE", "PAUSED", "CANCELLED"];

export function SubscriptionView({ item, onUpdated }: { item: ApiSubscription; onUpdated?: (next: ApiSubscription) => void }) {
    const router = useRouter();
    const currentSlot = getCurrentSlot(item);
    const activeStep = currentSlot?.slotNumber ?? 1;

    const [holidays, setHolidays] = useState<ApiHoliday[]>([]);
    const [pendingStatus, setPendingStatus] = useState<SubscriptionStatus | null>(null);
    const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);
    const [confirmCancel, setConfirmCancel] = useState(false);

    useEffect(() => {
        holidaysApi
            .listAll()
            .then((d) => setHolidays(d.items))
            .catch(() => undefined);
    }, []);

    const steps = item.holidaySlots.map((slot) => ({
        title: `Holiday ${slot.slotNumber}`,
        description: slot.holiday?.name ?? formatSlotStatus(slot.status),
    }));

    const handleStatusChange = async (status: SubscriptionStatus) => {
        if (status === item.status) return;
        setPendingStatus(status);
        try {
            const updated = await subscriptionsApi.updateStatus(item.id, { status });
            toast.success(`Subscription ${formatStatus(status).toLowerCase()}`);
            onUpdated?.(updated);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setPendingStatus(null);
        }
    };

    const handleAssignHoliday = async (slotId: string, holidayId: string) => {
        setPendingSlotId(slotId);
        try {
            const updated = await subscriptionsApi.assignHolidaySlot(item.id, slotId, { holidayId });
            toast.success("Holiday assigned to slot");
            onUpdated?.(updated);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to assign holiday");
        } finally {
            setPendingSlotId(null);
        }
    };

    const cancelled = item.status === "CANCELLED";

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>

            <section>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <Field label="Subscription #" value={formatSubId(item.id)} />
                    <Field label="Customer" value={item.user.name} />
                    <Field label="Email address" value={item.user.email} />
                    <Field label="Plan" value={formatPlanLabel(item)} />
                    <Field label="Billing Via" value="Stripe" />
                    <Field label="Next Billing" value={formatDate(item.nextBillingAt)} />
                    <Field label="Started" value={formatDate(item.startedAt)} />
                    <Field label="Status" value={<StatusBadge status={formatStatus(item.status)} />} />
                    {item.stripeSubscriptionId && (
                        <Field
                            label="Stripe Subscription"
                            value={
                                <a
                                    href={`https://dashboard.stripe.com/subscriptions/${item.stripeSubscriptionId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-blue-600 hover:underline"
                                >
                                    {item.stripeSubscriptionId}
                                </a>
                            }
                        />
                    )}
                </div>
            </section>

            {steps.length > 0 && (
                <section>
                    <h3 className="uppercase text-sm font-medium mb-3">Holiday Cycle Progress</h3>
                    <Stepper
                        defaultValue={activeStep}
                        indicators={{
                            completed: <CheckIcon className="size-3.5" />,
                            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
                        }}
                        className="w-full max-w-md space-y-8"
                    >
                        <StepperNav>
                            {steps.map((step, index) => (
                                <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
                                    <StepperTrigger className="flex flex-col gap-2.5">
                                        <StepperIndicator>{index + 1}</StepperIndicator>
                                        <StepperTitle>{step.title}</StepperTitle>
                                        <StepperDescription>{step.description}</StepperDescription>
                                    </StepperTrigger>

                                    {steps.length > index + 1 && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-secondary absolute inset-x-0 top-2.5 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                    </Stepper>
                </section>
            )}

            <section>
                <h3 className="font-medium mb-3 uppercase text-sm">Holiday Slots</h3>
                <div className="flex flex-col gap-3">
                    {item.holidaySlots.map((slot) => (
                        <div key={slot.id} className="bg-secondary/10 p-4 rounded-lg flex gap-3 items-start">
                            <div className="w-1 bg-secondary rounded-full self-stretch"></div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h3 className="text-base font-medium">
                                        Holiday {slot.slotNumber} — {slot.holiday?.name ?? "Not picked"}
                                    </h3>
                                    <StatusBadge status={formatSlotStatus(slot.status)} />
                                </div>
                                {slot.orderId && (
                                    <p className="mt-1 text-xs text-muted-foreground">Order: {slot.orderId}</p>
                                )}
                                {slot.status === "PENDING" && holidays.length > 0 && (
                                    <div className="mt-2">
                                        <Select
                                            disabled={pendingSlotId === slot.id}
                                            onValueChange={(value) => handleAssignHoliday(slot.id, value)}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Assign holiday..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {holidays.map((h) => (
                                                    <SelectItem key={h.id} value={h.id}>
                                                        {h.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {!cancelled && (
                <>
                    <Separator />
                    <section>
                        <h3 className="uppercase text-sm font-medium mb-2.5">Admin Actions</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {STATUS_OPTIONS.map((status) => {
                                const isCurrent = status === item.status;
                                const variant = status === "CANCELLED" ? "destructive" : isCurrent ? "default" : "outline";
                                return (
                                    <Button
                                        key={status}
                                        variant={variant}
                                        disabled={isCurrent || pendingStatus !== null}
                                        onClick={() => {
                                            if (status === "CANCELLED") {
                                                setConfirmCancel(true);
                                            } else {
                                                handleStatusChange(status);
                                            }
                                        }}
                                        size="sm"
                                    >
                                        {pendingStatus === status ? "..." : isCurrent ? `${formatStatus(status)} (current)` : formatStatus(status)}
                                    </Button>
                                );
                            })}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Status changes are propagated to Stripe (cancel, pause, resume).
                        </p>
                    </section>
                </>
            )}

            <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the subscription in Stripe. The customer will not be billed further. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleStatusChange("CANCELLED")}
                        >
                            Yes, cancel subscription
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogContent>
    );
}
