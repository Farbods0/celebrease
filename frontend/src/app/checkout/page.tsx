"use client";

import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export default function CheckoutPage() {
    const form = useAppForm({
        defaultValues: {
            fullName: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            zip: "",
            country: "United States",

            deliveryDate: "",
            deliveryType: "standard",
            deliveryNotes: "",

            cardName: "",
            cardNumber: "",
            expiry: "",
            cvc: "",
        },
    });

    // Checkbox states
    const [agreed1, setAgreed1] = useState(true);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);

    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12">
                <div className="mb-6 space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">Checkout</h3>
                    <p className="text-muted-foreground">Almost done! Confirm your details and reserve your kits.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                    {/* Form */}
                    <form className="grid gap-4">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl p-5 grid gap-4">
                            <p className="text-lg lg:text-xl font-medium">Shipping Address</p>

                            <form.AppField name="fullName">
                                {(field) => <field.FormInput label="Full Name" placeholder="John Doe" />}
                            </form.AppField>

                            <form.AppField name="address">
                                {(field) => <field.FormInput label="Street Address" placeholder="123 Main Street" />}
                            </form.AppField>

                            <form.AppField name="apartment">
                                {(field) => <field.FormInput label="Apartment / Suite (optional)" />}
                            </form.AppField>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <form.AppField name="city">{(field) => <field.FormInput label="City" />}</form.AppField>

                                <form.AppField name="state">{(field) => <field.FormInput label="State / Province" />}</form.AppField>

                                <form.AppField name="zip">{(field) => <field.FormInput label="ZIP / Postal Code" />}</form.AppField>
                            </div>

                            <form.AppField name="country">
                                {(field) => <field.FormInput label="Country" placeholder="Select country" />}
                            </form.AppField>
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-white rounded-2xl p-5 grid gap-4">
                            <p className="text-lg lg:text-xl font-medium">Delivery Details</p>

                            <form.AppField name="deliveryDate">
                                {(field) => <field.FormInput type="date" label="Rental Period Start" />}
                            </form.AppField>

                            <form.AppField name="deliveryType">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Delivery Option</FieldLabel>
                                            <RadioGroup value={field.state.value} onValueChange={field.handleChange}>
                                                {[
                                                    { label: "Standard Delivery - +$15.00", value: "standard" },
                                                    { label: "Express Delivery - +$25.00", value: "express" },
                                                ].map((option, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-10 lg:h-12 rounded-lg border border-input bg-transparent px-3 py-2 lg:px-4 lg:py-3 text-base flex items-center gap-3"
                                                    >
                                                        <RadioGroupItem value={option.value} id={option.value} />
                                                        <div className="flex-1 flex items-center justify-between">
                                                            {option.label.split(" - ").map((word, index) => (
                                                                <span key={index} className={index === 0 ? "" : "text-muted-foreground"}>
                                                                    {word}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </Field>
                                    );
                                }}
                            </form.AppField>

                            <form.AppField name="deliveryNotes">
                                {(field) => (
                                    <field.FormTextarea label="Delivery Preferences (optional)" placeholder="Any special instructions..." />
                                )}
                            </form.AppField>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-5 grid gap-4">
                            <p className="text-lg lg:text-xl font-medium">Payment Method</p>

                            <form.AppField name="cardName">{(field) => <field.FormInput label="Cardholder Name" />}</form.AppField>

                            <form.AppField name="cardNumber">
                                {(field) => <field.FormInput label="Card Number" placeholder="1234 1234 1234 1234" />}
                            </form.AppField>

                            <div className="grid grid-cols-2 gap-3">
                                <form.AppField name="expiry">{(field) => <field.FormInput label="Expiry (MM/YY)" />}</form.AppField>

                                <form.AppField name="cvc">{(field) => <field.FormInput label="CVC" />}</form.AppField>
                            </div>
                        </div>
                    </form>
                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl p-5 shadow-2xl space-y-4">
                        <h2 className="text-xl lg:text-2xl font-semibold">Order Summary</h2>

                        {/* Summary Item 1 */}
                        <div>
                            <h4 className="font-medium">Christmas Kit</h4>
                            <p className="text-sm text-muted-foreground mt-1">Premium Kit &middot; Dec 5 &ndash; Jan 5, 2026</p>
                            <div className="mt-3 space-y-1 text-muted-foreground">
                                <div className="text-sm flex justify-between text-foreground">
                                    <span>Christmas Premium Kit</span>
                                    <span className="font-medium tabular-nums tracking-tight">$278.00</span>
                                </div>
                                <div className="text-xs flex justify-between">
                                    <span>3 Add-ons</span>
                                    <span className="font-medium tabular-nums tracking-tight">$105.00</span>
                                </div>
                                <div className="text-xs flex justify-between">
                                    <span>Refundable Deposit</span>
                                    <span className="font-medium tabular-nums tracking-tight">$120.00</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-t border-dashed" />

                        {/* Summary Item 2 */}
                        <div>
                            <h4 className="font-medium">New Year&apos;s Eve Kit</h4>
                            <p className="text-sm text-muted-foreground mt-1">Dec 28 &ndash; Jan 2, 2026</p>
                            <div className="mt-3 space-y-1 text-muted-foreground">
                                <div className="text-sm flex justify-between text-foreground">
                                    <span>Basic Kit</span>
                                    <span className="font-medium tabular-nums tracking-tight">$138.00</span>
                                </div>
                                <div className="text-xs flex justify-between">
                                    <span>3 Add-ons</span>
                                    <span className="font-medium text-stone-500">Included</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-t border-dashed" />

                        {/* Subtotals */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-medium text-[#D97706]">
                                <span>Refundable Deposit</span>
                                <span className="font-medium tabular-nums tracking-tight">$120.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Taxes (8%)</span>
                                <span className="font-medium tabular-nums tracking-tight">$33.28</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping & Handling</span>
                                <span className="font-medium tabular-nums tracking-tight">$15.00</span>
                            </div>
                        </div>

                        <hr className="border-t border-dashed" />

                        {/* Grand Total */}
                        <div className="flex justify-between items-center text-lg lg:text-xl">
                            <span>Total Due Today</span>
                            <span className="font-semibold">$449.28</span>
                        </div>

                        <div className="text-sm">
                            <p>$120.00 deposit is fully refundable after the kit return and inspection process.</p>
                            <p className="mt-2 text-muted-foreground">(Total charge: $569.28 - Refundable: $120.00)</p>
                        </div>

                        <hr className="border-t border-dashed" />

                        {/* Terms and Checkboxes */}
                        <div className="space-y-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <Checkbox checked={agreed1} onCheckedChange={() => setAgreed1(!agreed1)} className="mt-0.5" />
                                <span className="text-sm text-muted-foreground select-none group-hover:text-stone-900 transition-colors">
                                    I confirm my rental dates and shipping address are correct.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <Checkbox checked={agreed2} onCheckedChange={() => setAgreed2(!agreed2)} className="mt-0.5" />
                                <span className="text-sm text-muted-foreground select-none">
                                    I agree to the CeleBrease{" "}
                                    <a href="#" className="underline hover:text-stone-900 transition-colors">
                                        Rental Agreement
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="underline hover:text-stone-900 transition-colors">
                                        Terms of Service
                                    </a>
                                    .
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <Checkbox checked={agreed3} onCheckedChange={() => setAgreed3(!agreed3)} className="mt-0.5" />
                                <span className="text-sm text-muted-foreground select-none">
                                    I understand that a refundable deposit of $120 will be released after kit inspection.
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 grid">
                            <Button variant="black">Proceed to Checkout</Button>
                        </div>

                        <div className="flex justify-center items-center gap-2 text-sm text-center text-muted-foreground">
                            <HugeiconsIcon icon={LockPasswordIcon} size={20} />
                            <span>Secure payment powered by Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
