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
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatDate,
    formatPlanLabel,
    formatSlotStatus,
    formatStatus,
    formatSubId,
    getCurrentSlot,
    type ApiSubscription,
} from "@/lib/api";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function SubscriptionView({ item }: { item: ApiSubscription }) {
    const currentSlot = getCurrentSlot(item);
    const activeStep = currentSlot?.slotNumber ?? 1;

    const steps = item.holidaySlots.map((slot) => ({
        title: `Holiday ${slot.slotNumber}`,
        description: slot.holiday?.name ?? formatSlotStatus(slot.status),
    }));

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
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </DialogContent>
    );
}
