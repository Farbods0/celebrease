import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AddOn } from "../../data";
import { useAppForm } from "../form/form-context";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function Fieldcomp({
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

export default function AddonEdit({ item }: { item: AddOn }) {
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
                <DialogTitle>Add New Add-On</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
            {/* Inventory Section */}
            {/* Image Upload */}
            <section>
                <div>
                    <form.AppField name="image">{(field) => <field.FormImage label="Upload Photos" />}</form.AppField>
                </div>
            </section>
            <h3 className="text-sm uppercase font-medium mb-3">ADD-ON INFO</h3>
            <section className="space-y-3">
                <Field>
                    <FieldLabel htmlFor="input-field-username">Add-On Name</FieldLabel>
                    <Input id="input-field-username" type="text" placeholder="Enter add-on name" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field>
                        <FieldLabel htmlFor="input-field-username">Price</FieldLabel>
                        <Input id="input-field-username" type="text" placeholder="e.g., $150" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-field-username">Deposit (optional)</FieldLabel>
                        <Input id="input-field-username" type="text" placeholder="e.g., $100" />
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="input-field-username">Inventory Count</FieldLabel>
                    <Input id="input-field-username" type="text" placeholder="e.g., 50" />
                </Field>
            </section>
            {/* Holiday Mapping */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Holiday Mapping</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Christmas</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Diwali</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Halloween</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Nowruz</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Thanksgiving</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Valentine's</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Easter</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Independence Day</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">New Year</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Birthday</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Baby Shower</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Hanukkah</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Ramadan</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Holi</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                    <div className="space-x-2 space-y-3">
                        <FieldGroup className="w-56">
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                                <FieldLabel htmlFor="terms-checkbox-basic">Lunar New Year</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </div>
                </div>
            </section>
            <section>
                <div className="flex items-center justify-between">
                    <Label className="text-base" htmlFor="airplane-mode">
                        7 Active <span className="text-muted-foreground"> (visible to customers)</span>{" "}
                    </Label>
                    <Switch id="airplane-mode" />
                </div>
            </section>
            {/* Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Add-On</Button>
            </div>
        </DialogContent>
    );
}

