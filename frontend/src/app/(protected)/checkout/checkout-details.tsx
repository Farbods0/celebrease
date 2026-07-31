"use client";

import { useAppForm } from "@/components/form/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
    ApiAddress,
    ApiCart,
    ApiSubscription,
    DeliveryOption,
    KitTier,
    baseURL,
    createOrderCheckout,
    upsertMyAddress,
} from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
    name: z.string().min(2, "Enter your full name"),
    phone: z.string().min(10, "Enter a valid phone number"),
    address: z.string().min(5, "Enter your street address"),
    apartment: z.string(),
    city: z.string().min(2, "Enter your city"),
    state: z.string().min(2, "Enter your state"),
    zip: z.string().min(4, "Enter your ZIP code"),
    country: z.string().min(2, "Enter your country"),
});

const tierLabel: Record<KitTier, string> = {
    STARTER: "Starter",
    PREMIUM: "Premium",
    ULTIMATE: "Ultimate",
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    return `${dateFmt.format(s)}, ${dateFmt.format(e)}`;
}

function fmtMoney(value: string | number): string {
    const n = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(n)) return "$0.00";
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function img(path?: string | null): string {
    return path ? `${baseURL}${path}` : "";
}

export default function CheckoutDetails({
    carts,
    address,
    subscription,
}: {
    carts: ApiCart[];
    address: ApiAddress | null;
    subscription: ApiSubscription | null;
}) {
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
        validators: {
            onChange: checkoutSchema,
        },
        onSubmit: async ({ value }) => {
            if (!agreed1 || !agreed2 || !agreed3) {
                toast.error("Please agree to all terms and conditions to proceed.");
                return;
            }

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
                    cartIds: (carts ?? []).map((c) => c.id),
                    deliveryOption: deliveryType,
                    deliveryNotes: deliveryNotes || undefined,
                });

                if (res.url) {
                    window.location.href = res.url;
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to initiate checkout.");
            }
        },
    });

    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);

    const [deliveryType, setDeliveryType] = useState<DeliveryOption>(subscription ? "EXPRESS" : "STANDARD");
    const [deliveryNotes, setDeliveryNotes] = useState("");

    const shippingFee = subscription ? 0 : deliveryType === "STANDARD" ? 15.0 : 25.0;

    const availableSlots = subscription?.holidaySlots?.filter((s) => s.status === "PENDING") ?? [];
    const kitDiscountPct = subscription ? (subscription.plan?.kitDiscount ?? 0) / 100 : 0;
    const addOnDiscountPct = subscription ? (subscription.plan?.addOnDiscount ?? 0) / 100 : 0;

    const priced = (carts ?? []).map((cart, idx) => {
        const rentalBase = Number(cart.rentalFee ?? 0) + Number(cart.extendedFee ?? 0);
        const addOnBase = Number(cart.addOnsFee ?? 0);
        const deposit = Number(cart.kitDeposit ?? 0) + Number(cart.addOnDeposit ?? 0);
        const slotIndex = idx < availableSlots.length ? availableSlots[idx].slotNumber : null;
        const rentalDiscount = slotIndex !== null ? rentalBase * kitDiscountPct : 0;
        const addOnDiscount = slotIndex !== null ? addOnBase * addOnDiscountPct : 0;
        const lineDiscountedSubtotal = rentalBase - rentalDiscount + addOnBase - addOnDiscount + deposit;
        return { cart, rentalBase, addOnBase, rentalDiscount, addOnDiscount, deposit, lineDiscountedSubtotal, slotIndex };
    });

    const totals = priced.reduce(
        (acc, p) => {
            acc.rental += p.rentalBase;
            acc.addOns += p.addOnBase;
            acc.rentalDiscount += p.rentalDiscount;
            acc.addOnDiscount += p.addOnDiscount;
            acc.deposit += p.deposit;
            acc.lineTotal += p.lineDiscountedSubtotal;
            return acc;
        },
        { rental: 0, addOns: 0, rentalDiscount: 0, addOnDiscount: 0, deposit: 0, lineTotal: 0 },
    );
    const totalDiscount = totals.rentalDiscount + totals.addOnDiscount;
    const taxableAfterDiscount = totals.rental - totals.rentalDiscount + totals.addOns - totals.addOnDiscount;
    const taxes = taxableAfterDiscount * 0.08;
    const dueToday = totals.lineTotal + taxes + shippingFee;

    return (
        <>
            <style>{`
                /* ===== Checkout grid ===== */
                .co-grid { max-width: var(--cb-max); margin: 0 auto; display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }

                /* ===== Section cards ===== */
                .co-card { background: #fff; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card); padding: 28px 32px; box-shadow: var(--cb-shadow-xs); transition: box-shadow .25s; }
                .co-card:focus-within { box-shadow: var(--cb-shadow-sm); }
                .co-form-stack { display: flex; flex-direction: column; gap: 20px; }

                /* Section heading row */
                .co-sec-head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
                .co-sec-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--cb-gradient-soft); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
                .co-sec-head h2 { font-size: 20px; font-weight: 700; font-family: "Playfair Display", Georgia, serif; margin: 0; }
                .co-step-badge { margin-left: auto; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cb-magenta); background: rgba(220,0,117,0.08); padding: 4px 10px; border-radius: var(--cb-r-pill); white-space: nowrap; }

                /* Fields */
                .co-field-gap { display: flex; flex-direction: column; gap: 14px; }
                .co-field { display: flex; flex-direction: column; gap: 5px; }
                .co-field label { font-size: 13px; font-weight: 600; color: var(--cb-ink); }
                .co-field label .opt { font-weight: 400; color: var(--cb-ink-soft); font-size: 12px; }
                .co-field input,
                .co-field select,
                .co-field textarea {
                    width: 100%; padding: 0 16px; height: 48px;
                    border: 1.5px solid var(--cb-line); border-radius: 12px;
                    font-size: 15px; font-family: inherit; color: var(--cb-ink); background: #fff;
                    transition: border-color .2s, box-shadow .2s;
                }
                .co-field textarea { height: auto; padding: 12px 16px; min-height: 80px; resize: vertical; line-height: 1.6; }
                .co-field input::placeholder,
                .co-field textarea::placeholder { color: var(--cb-ink-soft); }
                .co-field input:focus,
                .co-field select:focus,
                .co-field textarea:focus { outline: none; border-color: var(--cb-purple); box-shadow: 0 0 0 3px rgba(155,47,201,0.13); }
                .co-field select {
                    appearance: none; -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8'%3E%3Cpath d='M1 1l6 6 6-6' stroke='%239B2FC9' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px;
                }
                .co-field-row { display: grid; gap: 14px; }
                .co-field-row-2 { grid-template-columns: 1fr 1fr; }
                .co-field-row-3 { grid-template-columns: 2fr 1fr 1fr; }

                /* Shipping options */
                .co-ship-options { display: flex; flex-direction: column; gap: 12px; }
                .co-ship-opt { display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px; border: 1.5px solid var(--cb-line); border-radius: 16px; cursor: pointer; transition: border-color .2s, background .2s, box-shadow .2s; position: relative; background: #fff; }
                .co-ship-opt:hover { border-color: rgba(155,47,201,0.35); background: rgba(155,47,201,0.02); }
                .co-ship-opt.selected { border-color: var(--cb-purple); background: rgba(155,47,201,0.04); box-shadow: 0 0 0 3px rgba(155,47,201,0.1); }
                .co-ship-opt.disabled-opt { opacity: .6; pointer-events: none; }
                .co-ship-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--cb-line); background: #fff; flex-shrink: 0; margin-top: 2px; transition: all .2s; display: flex; align-items: center; justify-content: center; }
                .co-ship-opt.selected .co-ship-radio { border-color: var(--cb-purple); background: var(--cb-purple); }
                .co-ship-opt.selected .co-ship-radio::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #fff; display: block; }
                .co-ship-info { flex: 1; }
                .co-ship-label { font-weight: 600; font-size: 15px; margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }
                .co-ship-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: var(--cb-r-pill); }
                .co-ship-badge-std { background: rgba(155,47,201,0.1); color: var(--cb-purple); }
                .co-ship-badge-exp { background: linear-gradient(to right,rgba(155,47,201,0.15),rgba(220,0,117,0.12)); color: var(--cb-magenta); }
                .co-ship-eta { font-size: 13px; color: var(--cb-ink-muted); }
                .co-ship-price { font-weight: 700; font-size: 16px; color: var(--cb-ink); flex-shrink: 0; align-self: center; }
                .co-ship-price-free { color: #059669; }

                /* ===== Summary card ===== */
                .co-summary { background: #fff; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card); padding: 28px; box-shadow: var(--cb-shadow-sm); position: sticky; top: 90px; display: flex; flex-direction: column; gap: 0; }
                .co-summary-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
                .co-summary-head h2 { font-size: 21px; font-weight: 700; font-family: "Playfair Display", Georgia, serif; margin: 0; }
                .co-summary-edit { font-size: 13px; color: var(--cb-purple); font-weight: 600; transition: opacity .2s; }
                .co-summary-edit:hover { opacity: .75; }

                /* Kit item */
                .co-kit-row { display: flex; gap: 14px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--cb-line); margin-bottom: 16px; }
                .co-kit-row:last-of-type { }
                .co-kit-thumb { width: 64px; height: 64px; border-radius: 14px; object-fit: cover; flex-shrink: 0; box-shadow: var(--cb-shadow-xs); }
                .co-kit-info { flex: 1; min-width: 0; }
                .co-kit-name { font-size: 15px; font-weight: 700; line-height: 1.3; margin-bottom: 3px; font-family: "Playfair Display", Georgia, serif; color: var(--cb-ink); }
                .co-kit-meta { font-size: 12px; color: var(--cb-ink-muted); }
                .co-tier-pill { display: inline-flex; align-items: center; gap: 4px; background: var(--cb-gradient-soft); color: var(--cb-purple); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 10px; border-radius: var(--cb-r-pill); margin-top: 5px; }
                .co-slot-note { font-size: 11px; color: #059669; font-weight: 600; margin-top: 3px; }

                /* Rental dates */
                .co-dates { background: var(--cb-lavender); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; }
                .co-dates-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cb-ink-muted); margin-bottom: 5px; }
                .co-dates-range { font-size: 13px; font-weight: 600; color: var(--cb-ink); display: flex; align-items: center; gap: 6px; }
                .co-dates-sep { color: var(--cb-ink-soft); }

                /* Shipping summary badge */
                .co-ship-summary { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--cb-ink-muted); background: var(--cb-lavender); padding: 8px 12px; border-radius: 10px; margin-bottom: 14px; }

                /* Line items */
                .co-lines { display: flex; flex-direction: column; gap: 9px; padding-bottom: 14px; border-bottom: 1px solid var(--cb-line); margin-bottom: 14px; }
                .co-line { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
                .co-line .lbl { color: var(--cb-ink-muted); }
                .co-line .val { font-weight: 500; }
                .co-line .val-free { color: #059669; font-weight: 600; }
                .co-line .val-deposit { color: var(--cb-purple); font-weight: 600; }
                .co-line .val-discount { color: #059669; font-weight: 600; }

                /* Totals */
                .co-totals { display: flex; flex-direction: column; gap: 8px; padding-bottom: 16px; border-bottom: 1px solid var(--cb-line); margin-bottom: 16px; }
                .co-total-line { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
                .co-total-line .lbl { color: var(--cb-ink-muted); }
                .co-total-line .val { font-weight: 500; }
                .co-grand { padding-top: 10px; border-top: 1px solid var(--cb-line); margin-top: 6px; }
                .co-grand .lbl { color: var(--cb-ink); font-size: 17px; font-weight: 600; }
                .co-grand .val { font-family: "Playfair Display", Georgia, serif; font-size: 26px; font-weight: 700; background: var(--cb-gradient-h); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

                /* Deposit callout */
                .co-deposit-callout { background: var(--cb-gradient-soft); border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; }
                .co-deposit-head { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--cb-purple); margin-bottom: 4px; }
                .co-deposit-callout p { font-size: 13px; color: #4A1259; line-height: 1.55; }

                /* Agreements */
                .co-agreements { display: flex; flex-direction: column; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--cb-line); margin-bottom: 16px; }
                .co-agree-row { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
                .co-agree-text { font-size: 13px; color: var(--cb-ink-muted); line-height: 1.5; select-none: true; }
                .co-agree-text a { color: var(--cb-purple); font-weight: 600; }
                .co-agree-text a:hover { text-decoration: underline; }

                /* Place order button */
                .co-place-btn { background: var(--cb-gradient-h); color: #fff; font-size: 16px; font-weight: 700; height: 58px; border-radius: var(--cb-r-pill); display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform .2s, box-shadow .2s; box-shadow: 0 8px 24px rgba(155,47,201,0.3); width: 100%; cursor: pointer; border: none; font-family: inherit; letter-spacing: 0.01em; }
                .co-place-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(220,0,117,0.3); }
                .co-place-btn:active { transform: translateY(0); }
                .co-place-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }

                /* Secure note */
                .co-secure { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 12.5px; color: var(--cb-ink-muted); margin-top: 12px; }

                /* Trust badges */
                .co-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
                .co-trust-badge { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--cb-ink-muted); }

                /* Responsive */
                @media (max-width: 980px) {
                    .co-grid { grid-template-columns: 1fr; }
                    .co-summary { position: static; }
                }
                @media (max-width: 600px) {
                    .co-field-row-2 { grid-template-columns: 1fr; }
                    .co-field-row-3 { grid-template-columns: 1fr; }
                    .co-card { padding: 22px 18px; }
                    .co-trust { grid-template-columns: 1fr; }
                }
            `}</style>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}
            >
                <div className="co-grid">
                    {/* ===== LEFT: Form ===== */}
                    <div className="co-form-stack">

                        {/* Contact / Address */}
                        <div className="co-card">
                            <div className="co-sec-head">
                                <span className="co-sec-icon" aria-hidden="true">🏠</span>
                                <h2>Delivery address</h2>
                                <span className="co-step-badge">Step 1 of 3</span>
                            </div>

                            <div className="co-field-gap">
                                <div className={`co-field-row co-field-row-2`}>
                                    <form.AppField name="name">
                                        {(field) => (
                                            <div className="co-field">
                                                <label htmlFor="co-name">Full name</label>
                                                <input
                                                    id="co-name"
                                                    type="text"
                                                    placeholder="Sarah Mitchell"
                                                    autoComplete="name"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    required
                                                />
                                                {field.state.meta.errors[0] && (
                                                    <span style={{ fontSize: 12, color: "#DC2626" }}>{(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}</span>
                                                )}
                                            </div>
                                        )}
                                    </form.AppField>

                                    <form.AppField name="phone">
                                        {(field) => (
                                            <div className="co-field">
                                                <label htmlFor="co-phone">Phone <span className="opt">(for delivery updates)</span></label>
                                                <input
                                                    id="co-phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    autoComplete="tel"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                />
                                                {field.state.meta.errors[0] && (
                                                    <span style={{ fontSize: 12, color: "#DC2626" }}>{(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}</span>
                                                )}
                                            </div>
                                        )}
                                    </form.AppField>
                                </div>

                                <form.AppField name="address">
                                    {(field) => (
                                        <div className="co-field">
                                            <label htmlFor="co-addr">Street address</label>
                                            <input
                                                id="co-addr"
                                                type="text"
                                                placeholder="House number and street name"
                                                autoComplete="address-line1"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                required
                                            />
                                            {field.state.meta.errors[0] && (
                                                <span style={{ fontSize: 12, color: "#DC2626" }}>{field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]}</span>
                                            )}
                                        </div>
                                    )}
                                </form.AppField>

                                <form.AppField name="apartment">
                                    {(field) => (
                                        <div className="co-field">
                                            <label htmlFor="co-apt">Apt, suite, floor <span className="opt">(optional)</span></label>
                                            <input
                                                id="co-apt"
                                                type="text"
                                                placeholder="e.g. Apt 4B"
                                                autoComplete="address-line2"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                            />
                                        </div>
                                    )}
                                </form.AppField>

                                <div className={`co-field-row co-field-row-3`}>
                                    <form.AppField name="city">
                                        {(field) => (
                                            <div className="co-field">
                                                <label htmlFor="co-city">City</label>
                                                <input
                                                    id="co-city"
                                                    type="text"
                                                    placeholder="City"
                                                    autoComplete="address-level2"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    required
                                                />
                                                {field.state.meta.errors[0] && (
                                                    <span style={{ fontSize: 12, color: "#DC2626" }}>{(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}</span>
                                                )}
                                            </div>
                                        )}
                                    </form.AppField>

                                    <form.AppField name="state">
                                        {(field) => (
                                            <div className="co-field">
                                                <label htmlFor="co-state">State</label>
                                                <input
                                                    id="co-state"
                                                    type="text"
                                                    placeholder="IL"
                                                    autoComplete="address-level1"
                                                    maxLength={2}
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    required
                                                />
                                                {field.state.meta.errors[0] && (
                                                    <span style={{ fontSize: 12, color: "#DC2626" }}>{(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}</span>
                                                )}
                                            </div>
                                        )}
                                    </form.AppField>

                                    <form.AppField name="zip">
                                        {(field) => (
                                            <div className="co-field">
                                                <label htmlFor="co-zip">ZIP code</label>
                                                <input
                                                    id="co-zip"
                                                    type="text"
                                                    placeholder="60614"
                                                    autoComplete="postal-code"
                                                    inputMode="numeric"
                                                    maxLength={10}
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    required
                                                />
                                                {field.state.meta.errors[0] && (
                                                    <span style={{ fontSize: 12, color: "#DC2626" }}>{(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}</span>
                                                )}
                                            </div>
                                        )}
                                    </form.AppField>
                                </div>

                                <form.AppField name="country">
                                    {(field) => (
                                        <div className="co-field">
                                            <label htmlFor="co-country">Country</label>
                                            <select
                                                id="co-country"
                                                autoComplete="country"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                            >
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                            </select>
                                        </div>
                                    )}
                                </form.AppField>
                            </div>
                        </div>

                        {/* Shipping method */}
                        <div className="co-card">
                            <div className="co-sec-head">
                                <span className="co-sec-icon" aria-hidden="true">🚚</span>
                                <h2>Shipping method</h2>
                                <span className="co-step-badge">Step 2 of 3</span>
                            </div>

                            <fieldset style={{ border: "none", padding: 0 }}>
                                <legend className="sr-only">Choose a shipping method</legend>
                                <div className="co-ship-options">
                                    {[
                                        {
                                            value: "STANDARD" as DeliveryOption,
                                            label: "Standard Delivery",
                                            badge: subscription ? "Free with plan" : "Standard",
                                            badgeClass: "co-ship-badge-std",
                                            eta: "Arrives in 3, 5 business days · Prepaid return label included",
                                            price: subscription ? "FREE" : "$15.00",
                                            isFree: !!subscription || false,
                                        },
                                        {
                                            value: "EXPRESS" as DeliveryOption,
                                            label: "Express Delivery",
                                            badge: "Fastest",
                                            badgeClass: "co-ship-badge-exp",
                                            eta: "Arrives in 1, 2 business days · Signature required",
                                            price: subscription ? "FREE" : "$25.00",
                                            isFree: !!subscription,
                                        },
                                    ].map((opt) => (
                                        <div
                                            key={opt.value}
                                            className={`co-ship-opt${deliveryType === opt.value ? " selected" : ""}${subscription ? " disabled-opt" : ""}`}
                                            onClick={() => !subscription && setDeliveryType(opt.value)}
                                            role="radio"
                                            aria-checked={deliveryType === opt.value}
                                            tabIndex={0}
                                            onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !subscription) setDeliveryType(opt.value); }}
                                        >
                                            <span className="co-ship-radio" aria-hidden="true" />
                                            <div className="co-ship-info">
                                                <div className="co-ship-label">
                                                    {opt.label}
                                                    <span className={`co-ship-badge ${opt.badgeClass}`}>{opt.badge}</span>
                                                </div>
                                                <div className="co-ship-eta">{opt.eta}</div>
                                            </div>
                                            <span className={`co-ship-price${opt.isFree ? " co-ship-price-free" : ""}`}>
                                                {opt.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        {/* Delivery notes */}
                        <div className="co-card">
                            <div className="co-sec-head">
                                <span className="co-sec-icon" aria-hidden="true">📋</span>
                                <h2>Delivery preferences</h2>
                                <span className="co-step-badge">Step 3 of 3</span>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="co-notes">Special instructions <span style={{ fontWeight: 400, color: "var(--cb-ink-soft)", fontSize: 12 }}>(optional)</span></FieldLabel>
                                <Textarea
                                    id="co-notes"
                                    placeholder="Gate code, leave at door, preferred time window..."
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    style={{
                                        borderColor: "var(--cb-line)",
                                        borderRadius: 12,
                                        fontSize: 15,
                                        fontFamily: "inherit",
                                    }}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ===== RIGHT: Order summary ===== */}
                    <aside aria-label="Order summary">
                        <div className="co-summary">
                            <div className="co-summary-head">
                                <h2>Order summary</h2>
                                <Link href="/cart" className="co-summary-edit" aria-label="Edit cart items">
                                    Edit cart →
                                </Link>
                            </div>

                            {/* Kit items */}
                            {priced.map(({ cart, rentalBase, addOnBase, rentalDiscount, addOnDiscount, deposit, slotIndex }, idx) => (
                                <div key={cart.id} className="co-kit-row">
                                    {cart.holiday?.image ? (
                                        <img
                                            loading="lazy"
                                            src={img(cart.holiday.image)}
                                            alt={cart.holiday?.name ?? "Holiday kit"}
                                            className="co-kit-thumb"
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        <div className="co-kit-thumb" style={{ background: "var(--cb-lavender)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                            🎁
                                        </div>
                                    )}
                                    <div className="co-kit-info">
                                        <div className="co-kit-name">{cart.holiday?.name ?? "Holiday Kit"}</div>
                                        <div className="co-kit-meta">
                                            {cart.kit?.tier ? (tierLabel[cart.kit.tier] ?? "Kit") : "Kit"} &middot; {formatRange(cart.startDate, cart.endDate)}
                                        </div>
                                        <span className="co-tier-pill">&#10022; {cart.kit?.tier ? (tierLabel[cart.kit.tier] ?? "Kit") : "Kit"}</span>
                                        {slotIndex !== null && subscription && (
                                            <div className="co-slot-note">
                                                Subscription slot {slotIndex} of {subscription.plan?.holidaysPerYear ?? "?"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add-ons summary per cart */}
                            {priced.map(({ cart }) =>
                                (cart.addOns?.length ?? 0) > 0 ? (
                                    <div key={`addons-${cart.id}`} style={{ paddingBottom: 12, borderBottom: "1px solid var(--cb-line)", marginBottom: 12 }}>
                                        {(cart.addOns ?? []).map((ao, aoIdx) => (
                                            <div key={ao.addOn?.id ?? aoIdx} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0" }}>
                                                {ao.addOn?.image ? (
                                                    <img
                                                        loading="lazy"
                                                        src={img(ao.addOn.image)}
                                                        alt={ao.addOn.name}
                                                        style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                                                        width={40}
                                                        height={40}
                                                    />
                                                ) : (
                                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--cb-lavender)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✨</div>
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cb-ink)" }}>{ao.addOn?.name ?? "Add-on"}</div>
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{fmtMoney(Number(ao.price ?? 0))}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null
                            )}

                            {/* Rental dates, show for first cart */}
                            {priced[0] && (
                                <div className="co-dates">
                                    <div className="co-dates-label">Rental period</div>
                                    <div className="co-dates-range">
                                        <span>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(priced[0].cart.startDate))}</span>
                                        <span className="co-dates-sep">→</span>
                                        <span>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(priced[0].cart.endDate))}</span>
                                    </div>
                                </div>
                            )}

                            {/* Shipping summary */}
                            <div className="co-ship-summary" aria-live="polite" aria-atomic="true">
                                <span aria-hidden="true">📦</span>
                                <span>
                                    {deliveryType === "EXPRESS" ? "Express Delivery" : "Standard Delivery"}
                                    {", "}
                                    {shippingFee === 0 ? "FREE" : fmtMoney(shippingFee)}
                                </span>
                            </div>

                            {/* Line items */}
                            <div className="co-lines">
                                {priced.map(({ cart, rentalBase, addOnBase, rentalDiscount, addOnDiscount }) => (
                                    <div key={`lines-${cart.id}`} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                        <div className="co-line">
                                            <span className="lbl">{cart.holiday?.name ?? "Kit"} rental</span>
                                            <span className="val">{fmtMoney(rentalBase)}</span>
                                        </div>
                                        {rentalDiscount > 0 && (
                                            <div className="co-line">
                                                <span className="lbl">Subscriber discount</span>
                                                <span className="val val-discount">-{fmtMoney(rentalDiscount)}</span>
                                            </div>
                                        )}
                                        {(cart.addOns?.length ?? 0) > 0 && (
                                            <div className="co-line">
                                                <span className="lbl">{cart.addOns?.length ?? 0} Add-on{(cart.addOns?.length ?? 0) === 1 ? "" : "s"}</span>
                                                <span className="val">{fmtMoney(addOnBase)}</span>
                                            </div>
                                        )}
                                        {addOnDiscount > 0 && (
                                            <div className="co-line">
                                                <span className="lbl">Add-on discount</span>
                                                <span className="val val-discount">-{fmtMoney(addOnDiscount)}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="co-line">
                                    <span className="lbl">Shipping</span>
                                    <span className={`val${shippingFee === 0 ? " val-free" : ""}`}>
                                        {shippingFee === 0 ? "FREE" : fmtMoney(shippingFee)}
                                    </span>
                                </div>
                                <div className="co-line">
                                    <span className="lbl">Tax (8%)</span>
                                    <span className="val">{fmtMoney(taxes)}</span>
                                </div>
                                <div className="co-line">
                                    <span className="lbl">Refundable deposit</span>
                                    <span className="val val-deposit">{fmtMoney(totals.deposit)}</span>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="co-totals">
                                <div className="co-total-line">
                                    <span className="lbl">Subtotal</span>
                                    <span className="val">{fmtMoney(totals.rental + totals.addOns - totalDiscount)}</span>
                                </div>
                                <div className="co-total-line">
                                    <span className="lbl">Shipping</span>
                                    <span className="val" style={shippingFee === 0 ? { color: "#059669", fontWeight: 600 } : {}}>
                                        {shippingFee === 0 ? "FREE" : fmtMoney(shippingFee)}
                                    </span>
                                </div>
                                <div className="co-total-line">
                                    <span className="lbl">Tax (8%)</span>
                                    <span className="val">{fmtMoney(taxes)}</span>
                                </div>
                                <div className="co-total-line">
                                    <span className="lbl" style={{ color: "var(--cb-ink-muted)" }}>Refundable deposit</span>
                                    <span className="val" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>+{fmtMoney(totals.deposit)}</span>
                                </div>
                                <div className="co-total-line co-grand">
                                    <span className="lbl">Total charged today</span>
                                    <span className="val">{fmtMoney(dueToday)}</span>
                                </div>
                            </div>

                            {/* Deposit callout */}
                            <div className="co-deposit-callout" role="note">
                                <div className="co-deposit-head"><span aria-hidden="true">✓</span> 100% deposit refund guarantee</div>
                                <p>Your {fmtMoney(totals.deposit)} deposit is returned in full within 5 business days of kit return in good condition.</p>
                            </div>

                            {/* Agreements */}
                            <div className="co-agreements">
                                <label className="co-agree-row" style={{ cursor: "pointer" }}>
                                    <Checkbox checked={agreed1} onCheckedChange={(val) => setAgreed1(!!val)} style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span className="co-agree-text">
                                        I confirm my rental dates and shipping address are correct.
                                    </span>
                                </label>

                                <label className="co-agree-row" style={{ cursor: "pointer" }}>
                                    <Checkbox checked={agreed2} onCheckedChange={(val) => setAgreed2(!!val)} style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span className="co-agree-text">
                                        I agree to the CeleBrease{" "}
                                        <Link href="/rental-agreement">Rental Agreement</Link>{" "}
                                        and{" "}
                                        <Link href="/terms">Terms of Service</Link>.
                                    </span>
                                </label>

                                <label className="co-agree-row" style={{ cursor: "pointer" }}>
                                    <Checkbox checked={agreed3} onCheckedChange={(val) => setAgreed3(!!val)} style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span className="co-agree-text">
                                        I understand the refundable deposit of {fmtMoney(totals.deposit)} is released after kit inspection.
                                    </span>
                                </label>
                            </div>

                            {/* Place order button */}
                            <button
                                type="submit"
                                className="co-place-btn"
                                aria-label={`Place reservation for ${fmtMoney(dueToday)}`}
                                disabled={!agreed1 || !agreed2 || !agreed3}
                            >
                                <span aria-hidden="true">🎁</span>
                                Place Reservation, {fmtMoney(dueToday)} →
                            </button>

                            {/* Secure note */}
                            <div className="co-secure">
                                <span aria-hidden="true">🔒</span>
                                <span>Secure payment powered by Stripe</span>
                            </div>

                            {/* Trust badges */}
                            <div className="co-trust" aria-label="Security and trust indicators">
                                <div className="co-trust-badge"><span aria-hidden="true">🔒</span> SSL encrypted</div>
                                <div className="co-trust-badge"><span aria-hidden="true">↩️</span> Free returns</div>
                                <div className="co-trust-badge"><span aria-hidden="true">💯</span> Deposit protected</div>
                                <div className="co-trust-badge"><span aria-hidden="true">✕</span> Cancel anytime</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </form>

            <style>{`
                .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
            `}</style>
        </>
    );
}
