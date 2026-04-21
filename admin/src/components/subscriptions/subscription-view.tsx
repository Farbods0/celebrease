import React from "react";
import type { Subscription } from "../../data";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/reui/stepper";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

const steps = [
    { title: "Holiday 1", description: "Halloween" },
    { title: "Holiday 2", description: "Christmas" },
    { title: "Holiday 3", description: "Not Started" },
];

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" | "status" }) {
    let valueColor: string | undefined;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium" style={valueColor ? { color: valueColor } : undefined}>
                {value}
            </span>
        </div>
    );
}

export default function SubscriptionView({ item }: { item: Subscription }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
            {/* Subscription Section */}
            {/* Return Details */}
            <section>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <Field label="Subscription #" value={item.subId} />
                    <Field label="Customer" value={item.customer} />
                    <Field label="Email address" value="emily.r@example.com" />
                    <Field label="Plan" value={item.plan} />
                    <Field label="Billing Via" value="Stripe" />
                    <Field label="Next Billing" value={item.renewal} />
                    <Field label="Status" value={item.status} />
                </div>
            </section>
            {/* Holiday Cycle Progress */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Holiday Cycle Progress</h3>
                <Stepper
                    defaultValue={2}
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
                                    <StepperSeparator className="group-data-[state=completed]/step:bg-card-blue absolute inset-x-0 top-2.5 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                                )}
                            </StepperItem>
                        ))}
                    </StepperNav>
                </Stepper>
            </section>
            {/* Automation Log */}
            <section>
                <h3 className="font-medium mb-3 uppercase text-sm">Damage History</h3>
                <div className="bg-card-blue/6 p-4 rounded-lg flex gap-3 items-start ">
                    <div className="w-1 bg-card-blue rounded-full self-stretch"></div>
                    <h3 className="text-base font-medium">Pick next holiday email sent - Nov 1</h3>
                </div>
                <div className="bg-card-blue/6 p-4 rounded-lg flex gap-3 items-start mt-3 mb-3">
                    <div className="w-1 bg-card-blue rounded-full self-stretch"></div>
                    <h3 className="text-base font-medium">Return scanned received - Oct 30</h3>
                </div>
                <div className="bg-card-blue/6 p-4 rounded-lg flex gap-3 items-start">
                    <div className="w-1 bg-card-blue rounded-full self-stretch"></div>
                    <h3 className="text-base font-medium">Shipment processed - Oct 15</h3>
                </div>
            </section>
            {/* Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 items-center">
                <Button variant="outline">Complete Inspection</Button>
                <Button className="bg-destructive">Save & Continue Later</Button>
            </div>
        </DialogContent>
    );
}
