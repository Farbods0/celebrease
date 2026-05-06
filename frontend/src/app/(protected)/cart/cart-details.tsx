"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiCart, baseURL, KitTier, removeFromCart } from "@/lib/api";
import { LockPasswordIcon, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
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

export default function CartDetails({ carts: initialCarts }: { carts: ApiCart[] }) {
    const [carts, setCarts] = useState<ApiCart[]>(initialCarts);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);

    const handleRemove = async (cartId: string) => {
        const previous = carts;
        setRemovingId(cartId);
        setCarts((prev) => prev.filter((c) => c.id !== cartId));
        try {
            await removeFromCart(cartId);
        } catch (e) {
            setCarts(previous);
            toast.error(e instanceof Error ? e.message : "Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

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
    const shipping = carts.length > 0 ? 15 : 0;
    const taxes = (totals.rental + totals.addOns) * taxRate;
    const dueToday = totals.lineTotal + taxes + shipping;
    const allAgreed = agreed1 && agreed2 && agreed3;

    return (
        <>
            {/* Cart Items */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">Your Cart</h3>

                {carts.map((cart) => (
                    <div key={cart.id} className="border rounded-2xl p-5 flex flex-col md:flex-row gap-4 relative">
                        <Button
                            size="icon-sm"
                            disabled={removingId === cart.id}
                            onClick={() => handleRemove(cart.id)}
                            className="absolute top-5 right-5 bg-muted text-destructive hover:bg-destructive/10"
                            aria-label={`Remove ${cart.holiday.name}`}
                        >
                            <HugeiconsIcon icon={Trash} />
                        </Button>
                        <div className="size-18 rounded-lg overflow-hidden shrink-0">
                            <img
                                src={`${baseURL}${cart.holiday.image}`}
                                alt={cart.holiday.name}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="pr-10">
                                <h4 className="text-lg lg:text-xl font-medium">{cart.holiday.name}</h4>
                                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                                    {tierLabel[cart.kit.tier]} &middot; {formatRange(cart.startDate, cart.endDate)} &middot;{" "}
                                    {cart.duration === "SIXTY_DAY" ? "60 days" : "30 days"}
                                </p>
                            </div>

                            {cart.addOns.length > 0 && (
                                <div className="mt-3 bg-[#F4F7FB] rounded-xl p-4 text-sm space-y-2">
                                    <p className="font-medium">
                                        {cart.addOns.length} Add-on{cart.addOns.length === 1 ? "" : "s"}
                                    </p>
                                    {cart.addOns.map((a) => (
                                        <div key={a.addOn.id} className="flex justify-between items-center">
                                            <span className="text-muted-foreground">
                                                {a.addOn.name}
                                                {a.qty > 1 ? ` (x${a.qty})` : ""}
                                            </span>
                                            <span className="font-semibold">{fmtMoney(Number(a.price) * a.qty)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex justify-end text-2xl font-semibold">{fmtMoney(cart.total)}</div>
                        </div>
                    </div>
                ))}
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
                        <span className="font-medium tabular-nums tracking-tight">{fmtMoney(shipping)}</span>
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
                        <Checkbox checked={agreed1} onCheckedChange={() => setAgreed1((v) => !v)} className="mt-0.5" />
                        <span className="text-sm text-muted-foreground select-none">
                            I confirm my rental dates and shipping address are correct.
                        </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <Checkbox checked={agreed2} onCheckedChange={() => setAgreed2((v) => !v)} className="mt-0.5" />
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
                        <Checkbox checked={agreed3} onCheckedChange={() => setAgreed3((v) => !v)} className="mt-0.5" />
                        <span className="text-sm text-muted-foreground select-none">
                            I understand that a refundable deposit of {fmtMoney(totals.deposit)} will be released after kit inspection.
                        </span>
                    </label>
                </div>

                <div className="pt-2 grid">
                    <Button variant="black" disabled={!allAgreed} render={<Link href="/checkout">Proceed to Checkout</Link>} />
                </div>

                <div className="flex justify-center items-center gap-2 text-sm text-center text-muted-foreground">
                    <HugeiconsIcon icon={LockPasswordIcon} size={20} />
                    <span>Secure payment powered by Stripe</span>
                </div>
            </div>
        </>
    );
}
