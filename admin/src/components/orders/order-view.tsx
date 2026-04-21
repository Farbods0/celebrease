import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Order } from "../../data";

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
const steps = [
    { title: "Order Reserved", description: "Nov 10, 2025" },
    { title: "Shipped", description: "Nov 12, 2025" },
    { title: "Delivered", description: "Expected Nov 15, 2025" },
    { title: "Return in Transit", description: "Pending" },
    { title: "Returned", description: "Pending" },
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

export default function OrderView({ item }: { item: Order }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {/* Item Details */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Order #" value={item.orderId} />
                    <Field label="Customer" value={item.customer} />
                    <Field label="Phone" value="(555) 123-4567" />
                    <Field label="Email address" value="(555) 123-4567" tone="available" />
                    <Field label="Holiday" value={item.holiday} tone="reserved" />
                    <Field label="Kit Type" value={item.kitType} />
                    <Field label="Duration" value={item.duration} />
                    <Field label="Price" value={item.total} />
                    <Field label="Deposit" value={item.deposit} />
                </div>
            </section>
            {/* Items */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-3">Items</h3>
                <div className="space-y-2">
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className=" border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                </div>
            </section>
            {/* Add-on */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-3">Add-on</h3>
                <div className="space-y-2">
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className=" border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                </div>
            </section>
            {/* Shipment Timeline */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-3">Shipment Timeline</h3>
                <div className="flex items-center justify-center">
                    <Stepper
                        className="flex flex-col gap-10"
                        defaultValue={2}
                        orientation="vertical"
                        indicators={{
                            completed: <CheckIcon className="size-3.5" />,
                            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
                        }}
                    >
                        <StepperNav>
                            {steps.map((step, index) => (
                                <StepperItem key={index} step={index + 1} className="relative items-start not-last:flex-1">
                                    <StepperTrigger className="items-start gap-2.5 pb-12 last:pb-0">
                                        <StepperIndicator className="data-[state=completed]:bg-chart-4 data-[state=completed]:text-white">
                                            {index + 1}
                                        </StepperIndicator>
                                        <div className="mt-0.5 text-left">
                                            <StepperTitle>{step.title}</StepperTitle>
                                            <StepperDescription>{step.description}</StepperDescription>
                                        </div>
                                    </StepperTrigger>
                                    {index < steps.length - 1 && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                        <h3 className="font-medium">Tracking: UPS #1Z7Y28...</h3>
                    </Stepper>
                </div>
            </section>
            {/* Payment & Deposit */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Payment & Deposit</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Total" value={item.total} />
                    <Field label="Deposit Status" value={item.status} />
                </div>
            </section>
            {/* Button */}
            <section>
                <div className="flex items-center gap-3">
                    <button className="bg-black p-3 rounded-lg text-primary-foreground w-full">Release Deposit</button>
                    <button className="border p-3 rounded-lg text-foreground w-full">Download Invoice</button>
                </div>
            </section>
            {/* bottom button */}
            <section>
                <div className="border-t p-3 ">
                    <div className="flex items-center justify-between gap-3">
                        <button className="border p-3 rounded-lg text-foreground">Download Shipping Label</button>
                        <button className="bg-primary p-3 rounded-lg text-primary-foreground ">Mark as Delivered</button>
                    </div>
                </div>
            </section>
        </DialogContent>
    );
}
