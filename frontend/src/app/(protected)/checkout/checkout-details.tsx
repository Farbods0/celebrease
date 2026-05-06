"use client";

import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ApiAddress, ApiCart, DeliveryOption, KitTier, createOrderCheckout, upsertMyAddress } from "@/lib/api";
import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const tierLabel: Record<KitTier, string> = {
    STARTER: "Starter Kit",
    PREMIUM: "Premium Kit",
    ULTIMATE: "Ultimate Kit",
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    return `${dateFmt.format(s)} – ${dateFmt.format(e)}`;
}

function fmtMoney(value: string | number): string {
    const n = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(n)) return "$0.00";
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CheckoutDetails({ carts, address }: { carts: ApiCart[]; address: ApiAddress | null }) {
    const form = useAppForm({
        defaultValues: {
            name: address?.name ?? "",
            phone: address?.phone ?? "",
            address: address?.streetLine1 ?? "",
            apartment: address?.streetLine2 ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            zip: address?.postalCode ?? "",
            country: address?.country ?? "",
        },
        onSubmit: async ({ value }) => {
            if (!agreed1 || !agreed2 || !agreed3) {
                toast.error("Please agree to all terms and conditions to proceed.");
                return;
            }

            startTransition(async () => {
                try {
                    await upsertMyAddress({
                        name: value.name,
                        phone: value.phone,
                        streetLine1: value.address,
                        streetLine2: value.apartment || undefined,
                        city: value.city,
                        state: value.state,
                        postalCode: value.zip,
                        country: value.country,
                    });

                    const res = await createOrderCheckout({
                        cartIds: carts.map((c) => c.id),
                        deliveryOption: deliveryType,
                        deliveryNotes: deliveryNotes || undefined,
                    });

                    if (res.url) {
                        window.location.href = res.url;
                    }
                } catch (error: any) {
                    toast.error(error.message || "Failed to initiate checkout.");
                }
            });
        },
    });

    const [isPending, startTransition] = useTransition();

    // Checkbox states
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);

    const [deliveryType, setDeliveryType] = useState<DeliveryOption>("STANDARD");
    const [deliveryNotes, setDeliveryNotes] = useState("");

    const shippingFee = deliveryType === "STANDARD" ? 15.0 : 25.0;

    const totals = carts.reduce(
        (acc, c) => {
            acc.rental += Number(c.rentalFee) + Number(c.extendedFee);
            acc.addOns += Number(c.addOnsFee);
            acc.deposit += Number(c.kitDeposit) + Number(c.addOnDeposit);
            acc.lineTotal += Number(c.total);
            return acc;
        },
        { rental: 0, addOns: 0, deposit: 0, lineTotal: 0 },
    );

    const taxRate = 0.08;
    const taxes = (totals.rental + totals.addOns) * taxRate;
    const dueToday = totals.lineTotal + taxes + shippingFee;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start"
        >
            {/* Form */}
            <div className="grid gap-4">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-5 grid gap-4">
                    <p className="text-lg lg:text-xl font-medium">Shipping Address</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <form.AppField name="name">
                                {(field) => <field.FormInput label="Full Name" placeholder="John Doe" />}
                            </form.AppField>
                        </div>

                        <form.AppField name="phone">
                            {(field) => <field.FormInput label="Phone Number" placeholder="+1234567890" />}
                        </form.AppField>
                    </div>

                    <form.AppField name="address">
                        {(field) => <field.FormInput label="Street Address" placeholder="123 Main Street" />}
                    </form.AppField>

                    <form.AppField name="apartment">{(field) => <field.FormInput label="Apartment / Suite (optional)" />}</form.AppField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <form.AppField name="city">{(field) => <field.FormInput label="City" />}</form.AppField>
                        <form.AppField name="state">{(field) => <field.FormInput label="State / Province" />}</form.AppField>
                        <form.AppField name="zip">{(field) => <field.FormInput label="ZIP / Postal Code" />}</form.AppField>
                    </div>

                    <form.AppField name="country">
                        {(field) => <field.FormInput label="Country" placeholder="United States" />}
                    </form.AppField>
                </div>

                {/* Delivery Details */}
                <div className="bg-white rounded-2xl p-5 grid gap-4">
                    <p className="text-lg lg:text-xl font-medium">Delivery Details</p>

                    <Field>
                        <FieldLabel htmlFor="deliveryType">Delivery Option</FieldLabel>
                        <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                            {[
                                { label: "Standard Delivery - +$15.00", value: "STANDARD" },
                                { label: "Express Delivery - +$25.00", value: "EXPRESS" },
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

                    <Field>
                        <FieldLabel htmlFor="deliveryNotes">Delivery Preferences (optional)</FieldLabel>
                        <Textarea
                            id="deliveryNotes"
                            placeholder="Any special instructions..."
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                        />
                    </Field>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl space-y-4">
                <h2 className="text-xl lg:text-2xl font-semibold">Order Summary</h2>

                {carts.map((cart, idx) => (
                    <div key={cart.id}>
                        <h4 className="font-medium">{cart.holiday.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {tierLabel[cart.kit.tier]} &middot; {formatRange(cart.startDate, cart.endDate)}
                        </p>
                        <div className="mt-3 space-y-1 text-muted-foreground">
                            <div className="text-sm flex justify-between text-foreground">
                                <span>Rental</span>
                                <span className="font-medium tabular-nums tracking-tight">
                                    {fmtMoney(Number(cart.rentalFee) + Number(cart.extendedFee))}
                                </span>
                            </div>
                            {cart.addOns.length > 0 && (
                                <div className="text-xs flex justify-between">
                                    <span>
                                        {cart.addOns.length} Add-on{cart.addOns.length === 1 ? "" : "s"}
                                    </span>
                                    <span className="font-medium tabular-nums tracking-tight">{fmtMoney(cart.addOnsFee)}</span>
                                </div>
                            )}
                            <div className="text-xs flex justify-between">
                                <span>Refundable Deposit</span>
                                <span className="font-medium tabular-nums tracking-tight">
                                    {fmtMoney(Number(cart.kitDeposit) + Number(cart.addOnDeposit))}
                                </span>
                            </div>
                        </div>
                        {idx < carts.length - 1 && <hr className="border-t border-dashed mt-4" />}
                    </div>
                ))}

                <hr className="border-t border-dashed" />

                <div className="space-y-1">
                    <div className="flex justify-between font-medium text-[#D97706]">
                        <span>Refundable Deposit</span>
                        <span className="tabular-nums tracking-tight">{fmtMoney(totals.deposit)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes (8%)</span>
                        <span className="font-medium tabular-nums tracking-tight">{fmtMoney(taxes)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping & Handling</span>
                        <span className="font-medium tabular-nums tracking-tight">{fmtMoney(shippingFee)}</span>
                    </div>
                </div>

                <hr className="border-t border-dashed" />

                <div className="flex justify-between items-center text-lg lg:text-xl">
                    <span>Total Due Today</span>
                    <span className="font-semibold">{fmtMoney(dueToday)}</span>
                </div>

                <div className="text-sm">
                    <p>{fmtMoney(totals.deposit)} deposit is fully refundable after the kit return and inspection process.</p>
                </div>

                <hr className="border-t border-dashed" />

                <div className="space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <Checkbox checked={agreed1} onCheckedChange={(val) => setAgreed1(!!val)} className="mt-0.5" />
                        <span className="text-sm text-muted-foreground select-none">
                            I confirm my rental dates and shipping address are correct.
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <Checkbox checked={agreed2} onCheckedChange={(val) => setAgreed2(!!val)} className="mt-0.5" />
                        <span className="text-sm text-muted-foreground select-none">
                            I agree to the CeleBrease{" "}
                            <a href="#" className="underline hover:text-stone-900">
                                Rental Agreement
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline hover:text-stone-900">
                                Terms of Service
                            </a>
                            .
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <Checkbox checked={agreed3} onCheckedChange={(val) => setAgreed3(!!val)} className="mt-0.5" />
                        <span className="text-sm text-muted-foreground select-none">
                            I understand that a refundable deposit of {fmtMoney(totals.deposit)} will be released after kit inspection.
                        </span>
                    </label>
                </div>

                <div className="pt-2 grid">
                    <Button variant="black" form="checkout-form" disabled={isPending} type="submit">
                        {isPending ? "Processing..." : "Proceed to Checkout"}
                    </Button>
                </div>

                <div className="flex justify-center items-center gap-2 text-sm text-center text-muted-foreground">
                    <HugeiconsIcon icon={LockPasswordIcon} size={20} />
                    <span>Secure payment powered by Stripe</span>
                </div>
            </div>
        </form>
    );
}
