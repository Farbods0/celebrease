import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Return } from "../../data";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAppForm } from "../form/form-context";

function FieldComp({
    label,
    value,
    tone,
}: {
    label: string;
    value: React.ReactNode;
    tone?: "available" | "reserved" | "repair" | "status";
}) {
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

export default function ReturnView({ item }: { item: Return }) {
    const form = useAppForm({
        defaultValues: {
            // Basic Information

            // Image
            image: "",
        },
    });

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Return Inspection</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
            {/* Inventory Section */}
            {/* Return Details */}
            <section>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <FieldComp label="Return" value="Order #8421 – Christmas Premium" />
                    <FieldComp label="Customer" value={item.customerName} />
                </div>
            </section>
            {/* Checklist */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Checklist</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-3">
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">LED candles</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Rangoli accents</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Floral banner</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Packaging bag</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                </div>
            </section>
            {/* Condition */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Condition</h3>
                <div className="grid md:grid-cols-3 gap-3">
                    <Button variant="outline">Excellent</Button>
                    <Button variant="outline">Minor Scuffs</Button>
                    <Button variant="outline">Major Damage</Button>
                </div>
            </section>
            <section>
                <Field>
                    <FieldLabel htmlFor="textarea-message">Damage Notes</FieldLabel>
                    <Textarea id="textarea-message" placeholder="Describe the damage here..." />
                </Field>
            </section>
            {/* Image Upload */}
            <section>
                <div>
                    <form.AppField name="image">{(field) => <field.FormImage label="Upload Photos" />}</form.AppField>
                </div>
            </section>
            {/* Deposit Decision */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Deposit Decision</h3>
                <div className="grid md:grid-cols-3 gap-3">
                    <Button variant="outline">Full Refund ($100)</Button>
                    <Button variant="outline">Partial Refund</Button>
                    <Button variant="outline">No Refund</Button>
                </div>
            </section>
            {/* Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 items-center">
                <Button variant="outline">Complete Inspection</Button>
                <Button>Save & Continue Later</Button>
            </div>
        </DialogContent>
    );
}
