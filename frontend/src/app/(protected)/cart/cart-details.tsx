"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ApiCart, ApiSubscription, baseURL, KitTier, removeFromCart } from "@/lib/api";
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
    return `${dateFmt.format(s)}, ${dateFmt.format(e)}`;
}

function fmtMoney(value: string | number): string {
    const n = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(n)) return "$0.00";
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

type PricedCart = {
    cart: ApiCart;
    rentalBase: number;
    addOnBase: number;
    rentalDiscount: number;
    addOnDiscount: number;
    deposit: number;
    discountedTotal: number;
    slotIndex: number | null;
};

/* ---- scoped styles ---- */
const CART_STYLES = `
.cb-cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}
.cb-cart-items-col { display: flex; flex-direction: column; gap: 0; }
.cb-items-group-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--cb-ink-soft); padding-bottom: 14px; border-bottom: 1px solid var(--cb-line); margin-bottom: 16px;
}
.cb-cart-items-list { display: flex; flex-direction: column; gap: 14px; list-style: none; padding: 0; margin: 0; }
.cb-cart-item {
  background: #fff; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card);
  padding: 20px; display: grid; grid-template-columns: 110px 1fr auto; gap: 20px; align-items: start;
  transition: box-shadow .22s, border-color .22s;
}
.cb-cart-item:hover { box-shadow: var(--cb-shadow-md); border-color: rgba(155,47,201,0.22); }
.cb-cart-item-thumb {
  width: 110px; height: 110px; border-radius: 16px; object-fit: cover; flex-shrink: 0; box-shadow: var(--cb-shadow-xs);
}
.cb-cart-item-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.cb-cart-item-tier {
  display: inline-flex; align-items: center; gap: 5px; background: var(--cb-gradient-soft);
  color: var(--cb-purple); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 11px; border-radius: var(--cb-r-pill); width: fit-content;
}
.cb-cart-item-name {
  font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; line-height: 1.2; color: var(--cb-ink);
}
.cb-cart-item-meta {
  font-size: 13.5px; color: var(--cb-ink-muted); display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
}
.cb-cart-item-meta .dot-sep { color: var(--cb-ink-soft); }
.cb-cart-slot-badge {
  display: inline-flex; align-items: center; gap: 5px; background: #ecfdf5; color: #059669;
  font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: var(--cb-r-pill); margin-top: 2px; width: fit-content;
}
.cb-cart-slot-used {
  font-size: 11px; color: var(--cb-ink-soft); margin-top: 2px;
}
.cb-cart-item-addons {
  display: flex; flex-direction: column; gap: 5px; margin-top: 4px;
  background: var(--cb-lavender); border-radius: 12px; padding: 10px 12px;
}
.cb-cart-addon-line {
  display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--cb-ink-muted);
  padding-left: 10px; border-left: 2px solid rgba(155,47,201,0.2);
}
.cb-cart-addon-price { margin-left: auto; font-weight: 600; color: var(--cb-ink); font-size: 12px; }
.cb-cart-item-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 10px; padding-top: 2px; min-width: 80px;
}
.cb-cart-item-price {
  font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--cb-ink); line-height: 1;
}
.cb-cart-item-price.discounted { color: #059669; }
.cb-cart-item-price-original {
  font-size: 14px; color: var(--cb-ink-soft); text-decoration: line-through; line-height: 1;
}
.cb-cart-item-deposit { font-size: 11.5px; color: var(--cb-ink-soft); text-align: right; }
.cb-cart-save-badge { font-size: 11px; color: #059669; font-weight: 700; text-align: right; }
.cb-cart-remove-btn {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: var(--cb-ink-soft); font-size: 14px; background: rgba(26,11,46,0.04);
  transition: all .2s; cursor: pointer; border: none; flex-shrink: 0;
}
.cb-cart-remove-btn:hover { background: rgba(220,38,38,0.1); color: #dc2626; }
.cb-cart-remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Shipping selector */
.cb-shipping-selector { margin-top: 20px; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card); overflow: hidden; }
.cb-shipping-head {
  padding: 16px 20px 14px; border-bottom: 1px solid var(--cb-line);
  font-size: 14px; font-weight: 700; color: var(--cb-ink); display: flex; align-items: center; gap: 8px;
}
.cb-shipping-option {
  display: flex; align-items: center; gap: 16px; padding: 16px 20px; cursor: pointer;
  transition: background .18s; border-bottom: 1px solid var(--cb-line);
}
.cb-shipping-option:last-child { border-bottom: none; }
.cb-shipping-option:hover { background: var(--cb-lavender); }
.cb-shipping-option input[type="radio"] { accent-color: var(--cb-purple); width: 17px; height: 17px; flex-shrink: 0; cursor: pointer; }
.cb-shipping-option-info { flex: 1; }
.cb-shipping-option-name { font-size: 14.5px; font-weight: 600; color: var(--cb-ink); }
.cb-shipping-option-desc { font-size: 13px; color: var(--cb-ink-muted); margin-top: 2px; }
.cb-shipping-option-price { font-size: 15px; font-weight: 700; color: var(--cb-ink); flex-shrink: 0; }
.cb-shipping-option-price.free-tag { color: #10b981; }

/* Promo */
.cb-promo-row { margin-top: 16px; display: flex; gap: 10px; }
.cb-promo-input {
  flex: 1; height: 46px; border: 1.5px solid var(--cb-line); border-radius: 12px; padding: 0 16px;
  font-size: 14px; font-family: inherit; color: var(--cb-ink); background: #fff; transition: border-color .2s; outline: none;
}
.cb-promo-input::placeholder { color: var(--cb-ink-soft); }
.cb-promo-input:focus { border-color: var(--cb-purple); }
.cb-promo-input.applied { border-color: #10b981; background: #f0fdf4; }
.cb-promo-input.error { border-color: #dc2626; background: #fef2f2; }
.cb-promo-btn {
  height: 46px; padding: 0 20px; border-radius: 12px; background: var(--cb-gradient-soft);
  color: var(--cb-purple); font-size: 14px; font-weight: 700; border: 1.5px solid rgba(155,47,201,0.2);
  cursor: pointer; transition: all .2s; white-space: nowrap; font-family: inherit;
}
.cb-promo-btn:hover:not(:disabled) { background: var(--cb-gradient-h); color: #fff; border-color: transparent; }
.cb-promo-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* "You may also like" strip */
.cb-also-like { padding: clamp(48px,5vw,72px) 0 0; }
.cb-also-like-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
.cb-also-like-head h3 { font-size: clamp(1.4rem,2.6vw,1.9rem); }
.cb-also-like-link { color: var(--cb-purple); font-weight: 600; font-size: 14px; }
.cb-also-like-scroll {
  display: grid; grid-auto-flow: column; grid-auto-columns: minmax(180px, 1fr); gap: 14px;
  overflow-x: auto; padding-bottom: 10px; scroll-snap-type: x mandatory;
  scrollbar-width: thin; scrollbar-color: var(--cb-purple) transparent;
}
.cb-also-like-scroll::-webkit-scrollbar { height: 4px; }
.cb-also-like-scroll::-webkit-scrollbar-thumb { background: rgba(155,47,201,0.35); border-radius: 2px; }
.cb-also-card {
  position: relative; aspect-ratio: 4/5; border-radius: var(--cb-r-card); overflow: hidden;
  cursor: pointer; transition: transform .25s, box-shadow .25s; scroll-snap-align: start;
  box-shadow: var(--cb-shadow-sm); display: block;
}
.cb-also-card:hover { transform: translateY(-5px); box-shadow: var(--cb-shadow-lg); }
.cb-also-card-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(26,11,46,0.88) 100%); pointer-events: none; }
.cb-also-card-meta { position: absolute; left: 14px; right: 14px; bottom: 14px; color: #fff; }
.cb-also-card-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; }
.cb-also-card-price { font-size: 12px; color: rgba(255,255,255,0.88); margin-top: 2px; }

/* Summary card */
.cb-summary-col { position: sticky; top: 80px; }
.cb-summary-card {
  background: #fff; border: 1px solid var(--cb-line); border-radius: var(--cb-r-card);
  padding: 28px; box-shadow: var(--cb-shadow-sm); display: flex; flex-direction: column; gap: 0;
}
.cb-summary-title { font-size: 20px; font-weight: 700; margin-bottom: 22px; font-family: 'Playfair Display', serif; }
.cb-summary-lines { display: flex; flex-direction: column; gap: 13px; }
.cb-summary-line { display: flex; justify-content: space-between; align-items: center; font-size: 14.5px; }
.cb-summary-line .label { color: var(--cb-ink-muted); }
.cb-summary-line .val { font-weight: 600; color: var(--cb-ink); }
.cb-summary-line .val.free { color: #10b981; font-weight: 700; }
.cb-summary-line .val.deposit { color: var(--cb-purple); }
.cb-summary-line .val.discount { color: #059669; font-weight: 700; }
.cb-summary-divider { height: 1px; background: var(--cb-line); margin: 16px 0; }
.cb-summary-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
.cb-summary-total-label { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; }
.cb-summary-total-amt {
  font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800;
  background: var(--cb-gradient-h); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.cb-deposit-note {
  background: var(--cb-gradient-soft); border-radius: 14px; padding: 14px 16px; margin-bottom: 18px;
  font-size: 13px; color: #4a1259; line-height: 1.55;
}
.cb-deposit-note strong {
  display: block; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--cb-purple); font-weight: 700; margin-bottom: 5px; font-family: inherit;
}
.cb-checkout-cta {
  display: flex; align-items: center; justify-content: center; gap: 10px; height: 56px;
  border-radius: var(--cb-r-pill); background: var(--cb-gradient-h); color: #fff;
  font-size: 16px; font-weight: 700; box-shadow: var(--cb-shadow-glow);
  transition: opacity .2s, transform .2s, box-shadow .2s; width: 100%; text-align: center; border: none; cursor: pointer;
  font-family: inherit; text-decoration: none;
}
.cb-checkout-cta:hover:not(.disabled) { opacity: .95; transform: translateY(-2px); box-shadow: 0 26px 64px rgba(220,0,117,0.28); }
.cb-checkout-cta.disabled { opacity: 0.55; cursor: not-allowed; pointer-events: none; }
.cb-continue-shop {
  display: block; text-align: center; color: var(--cb-purple); font-size: 14px; font-weight: 600;
  margin-top: 14px; transition: opacity .2s;
}
.cb-continue-shop:hover { opacity: 0.75; }
.cb-trust-badges { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
.cb-trust-badge {
  background: var(--cb-lavender); border-radius: 12px; padding: 10px 12px;
  display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--cb-ink-muted); font-weight: 500;
}
.cb-trust-badge .badge-icon { font-size: 16px; flex-shrink: 0; }
/* Agreements */
.cb-agreements { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.cb-agreement-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.cb-agreement-text { font-size: 13px; color: var(--cb-ink-muted); line-height: 1.5; select: none; }
.cb-agreement-text a { color: var(--cb-purple); font-weight: 600; }
.cb-agreement-text a:hover { text-decoration: underline; }
.cb-secure-line {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 13px; color: var(--cb-ink-soft); margin-top: 14px; text-align: center;
}

/* Responsive */
@media (max-width: 980px) {
  .cb-cart-layout { grid-template-columns: 1fr; gap: 24px; }
  .cb-summary-col { position: static; }
}
@media (max-width: 680px) {
  .cb-cart-item { grid-template-columns: 86px 1fr; gap: 14px; }
  .cb-cart-item-thumb { width: 86px; height: 86px; }
  .cb-cart-item-right { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; align-items: center; }
  .cb-trust-badges { grid-template-columns: 1fr; }
}
`;

export default function CartDetails({ carts: initialCarts, subscription }: { carts: ApiCart[]; subscription: ApiSubscription | null }) {
    const [carts, setCarts] = useState<ApiCart[]>(initialCarts);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState(false);
    const [shipping, setShipping] = useState<"standard" | "express">("standard");

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

    const handlePromoApply = () => {
        // TODO: wire to POST /api/promo/validate
        if (promoCode.trim().toUpperCase() === "CELEBRATE10") {
            setPromoApplied(true);
            setPromoError(false);
            toast.success("Promo code applied! 10% off rentals.");
        } else {
            setPromoApplied(false);
            setPromoError(true);
            toast.error("Invalid promo code.");
        }
    };

    const availableSlots = subscription?.holidaySlots?.filter((s) => s.status === "PENDING") ?? [];
    const kitDiscountPct = subscription ? subscription.plan.kitDiscount / 100 : 0;
    const addOnDiscountPct = subscription ? subscription.plan.addOnDiscount / 100 : 0;

    const priced: PricedCart[] = (carts ?? []).map((cart, idx) => {
        const rentalBase = Number(cart.rentalFee) + Number(cart.extendedFee);
        const addOnBase = Number(cart.addOnsFee);
        const deposit = Number(cart.kitDeposit) + Number(cart.addOnDeposit);
        const slotIndex = idx < availableSlots.length ? availableSlots[idx].slotNumber : null;
        const rentalDiscount = slotIndex !== null ? rentalBase * kitDiscountPct : 0;
        const addOnDiscount = slotIndex !== null ? addOnBase * addOnDiscountPct : 0;
        const discountedTotal = rentalBase - rentalDiscount + addOnBase - addOnDiscount + deposit;
        return { cart, rentalBase, addOnBase, rentalDiscount, addOnDiscount, deposit, discountedTotal, slotIndex };
    });

    const totals = priced.reduce(
        (acc, p) => {
            acc.rentalGross += p.rentalBase;
            acc.rentalDiscount += p.rentalDiscount;
            acc.addOnsGross += p.addOnBase;
            acc.addOnDiscount += p.addOnDiscount;
            acc.deposit += p.deposit;
            acc.discountedSubtotal += p.discountedTotal;
            return acc;
        },
        { rentalGross: 0, rentalDiscount: 0, addOnsGross: 0, addOnDiscount: 0, deposit: 0, discountedSubtotal: 0 },
    );

    const totalDiscount = totals.rentalDiscount + totals.addOnDiscount;
    const taxRate = 0.08;
    const shippingCost = shipping === "express" ? 25 : (carts.length > 0 && !subscription ? 15 : 0);
    const taxableAfterDiscount = totals.rentalGross - totals.rentalDiscount + totals.addOnsGross - totals.addOnDiscount;
    const taxes = taxableAfterDiscount * taxRate;
    const dueToday = totals.discountedSubtotal + taxes + shippingCost;
    const allAgreed = agreed1 && agreed2 && agreed3;
    const kitSubtotal = totals.rentalGross + totals.addOnsGross;

    return (
        <>
            <style>{CART_STYLES}</style>

            {/* LEFT: Items column */}
            <div className="cb-cart-items-col">
                <div className="cb-items-group-label">Kit Rentals</div>
                <ul className="cb-cart-items-list" aria-label="Cart items">
                    {priced.map(({ cart, rentalDiscount, addOnDiscount, discountedTotal, slotIndex }) => {
                        const hasDiscount = rentalDiscount + addOnDiscount > 0;
                        return (
                            <li key={cart.id} className="cb-cart-item">
                                <img
                                    loading="lazy"
                                    className="cb-cart-item-thumb"
                                    src={`${baseURL}${cart.holiday?.image ?? ""}`}
                                    alt={cart.holiday?.name ?? "Holiday kit"}
                                />
                                <div className="cb-cart-item-body">
                                    <span className="cb-cart-item-tier">{tierLabel[cart.kit?.tier ?? "STARTER"]}</span>
                                    <div className="cb-cart-item-name">{cart.holiday?.name ?? ""}</div>
                                    <div className="cb-cart-item-meta">
                                        <span>{cart.duration === "SIXTY_DAY" ? "60 days" : "30 days"}</span>
                                        {(cart.startDate || cart.endDate) && (
                                            <>
                                                <span className="dot-sep">&middot;</span>
                                                <span>{formatRange(cart.startDate ?? "", cart.endDate ?? "")}</span>
                                            </>
                                        )}
                                    </div>
                                    {slotIndex !== null && subscription && (
                                        <span className="cb-cart-slot-badge">
                                            &#10003; Slot {slotIndex} of {subscription.plan.holidaysPerYear}
                                        </span>
                                    )}
                                    {slotIndex === null && subscription && availableSlots.length === 0 && (
                                        <span className="cb-cart-slot-used">No slots remaining &mdash; billed at full price</span>
                                    )}
                                    {(cart.addOns ?? []).length > 0 && (
                                        <div className="cb-cart-item-addons" aria-label="Add ons">
                                            {(cart.addOns ?? []).map((a) => (
                                                <div key={a.addOn?.id ?? a.addOn?.name} className="cb-cart-addon-line">
                                                    <span>+ {a.addOn?.name ?? ""}{a.qty > 1 ? ` (x${a.qty})` : ""}</span>
                                                    <span className="cb-cart-addon-price">{fmtMoney(Number(a.price) * a.qty)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="cb-cart-item-right">
                                    <button
                                        className="cb-cart-remove-btn"
                                        disabled={removingId === cart.id}
                                        onClick={() => handleRemove(cart.id)}
                                        aria-label={`Remove ${cart.holiday?.name ?? "item"} from cart`}
                                    >
                                        &#10005;
                                    </button>
                                    {hasDiscount ? (
                                        <>
                                            <span className="cb-cart-item-price-original">{fmtMoney(Number(cart.total ?? 0))}</span>
                                            <span className="cb-cart-item-price discounted">{fmtMoney(discountedTotal)}</span>
                                            <span className="cb-cart-save-badge">Save {fmtMoney(rentalDiscount + addOnDiscount)}</span>
                                        </>
                                    ) : (
                                        <span className="cb-cart-item-price">{fmtMoney(Number(cart.total ?? 0))}</span>
                                    )}
                                    <span className="cb-cart-item-deposit">+ {fmtMoney(Number(cart.kitDeposit ?? 0) + Number(cart.addOnDeposit ?? 0))} deposit</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Shipping selector */}
                <div className="cb-shipping-selector" role="group" aria-labelledby="cb-shipping-head">
                    <div className="cb-shipping-head" id="cb-shipping-head">&#128666; Shipping method</div>
                    <label className="cb-shipping-option">
                        <input
                            type="radio"
                            name="cb-shipping"
                            value="standard"
                            checked={shipping === "standard"}
                            onChange={() => setShipping("standard")}
                        />
                        <div className="cb-shipping-option-info">
                            <div className="cb-shipping-option-name">Standard (both ways)</div>
                            <div className="cb-shipping-option-desc">Delivers 5&ndash;7 business days before holiday</div>
                        </div>
                        <div className={`cb-shipping-option-price${subscription ? " free-tag" : ""}`}>
                            {subscription ? "FREE" : "$15"}
                        </div>
                    </label>
                    <label className="cb-shipping-option">
                        <input
                            type="radio"
                            name="cb-shipping"
                            value="express"
                            checked={shipping === "express"}
                            onChange={() => setShipping("express")}
                        />
                        <div className="cb-shipping-option-info">
                            <div className="cb-shipping-option-name">Express (both ways)</div>
                            <div className="cb-shipping-option-desc">Delivers 2&ndash;3 business days before holiday</div>
                        </div>
                        <div className="cb-shipping-option-price">+$25</div>
                    </label>
                </div>

                {/* Promo code */}
                <div className="cb-promo-row">
                    <label htmlFor="cb-promo-input" style={{position:"absolute",width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",borderWidth:0}}>Promo code</label>
                    <input
                        id="cb-promo-input"
                        type="text"
                        className={`cb-promo-input${promoApplied ? " applied" : promoError ? " error" : ""}`}
                        placeholder="Promo code"
                        value={promoCode}
                        disabled={promoApplied}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(false); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handlePromoApply(); }}
                        aria-label="Enter promo code"
                        autoComplete="off"
                    />
                    <button
                        className="cb-promo-btn"
                        type="button"
                        onClick={handlePromoApply}
                        disabled={promoApplied || !promoCode.trim()}
                        aria-label="Apply promo code"
                    >
                        {promoApplied ? "Applied" : "Apply"}
                    </button>
                </div>
                {promoApplied && <p style={{fontSize:"12px",color:"#059669",fontWeight:700,marginTop:"6px"}}>&#10003; Promo CELEBRATE10 applied &mdash; 10% off kit rentals!</p>}
                {promoError && <p style={{fontSize:"12px",color:"#dc2626",marginTop:"6px"}}>&#10005; Invalid promo code. Please try again.</p>}

                {/* "You may also like" */}
                <div className="cb-also-like">
                    <div className="cb-also-like-head">
                        <div>
                            <span className="eyebrow">Popular additions</span>
                            <h3>Add another holiday</h3>
                        </div>
                        <Link href="/catalog" className="cb-also-like-link">See all holidays &#8594;</Link>
                    </div>
                    <div className="cb-also-like-scroll" role="list">
                        {[
                            { id: "hanukkah", name: "Hanukkah", price: "From $34", bg: "#2d1a6b", emoji: "&#128302;" },
                            { id: "thanksgiving", name: "Thanksgiving", price: "From $29", bg: "#7c2d12", emoji: "&#127823;" },
                            { id: "new-years", name: "New Year's", price: "From $34", bg: "#1e3a5f", emoji: "&#127881;" },
                            { id: "valentines-day", name: "Valentine's Day", price: "From $29", bg: "#7c0a2a", emoji: "&#10084;" },
                            { id: "easter", name: "Easter", price: "From $29", bg: "#3a6b2d", emoji: "&#127800;" },
                        ].map((s) => (
                            <Link
                                key={s.id}
                                href={`/catalog/${s.id}`}
                                className="cb-also-card"
                                role="listitem"
                                style={{background: s.bg}}
                                aria-label={`${s.name}, ${s.price}`}
                            >
                                <div className="cb-also-card-scrim" aria-hidden="true" />
                                <div className="cb-also-card-meta">
                                    <div className="cb-also-card-name">{s.name}</div>
                                    <div className="cb-also-card-price">{s.price}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Order Summary */}
            <aside className="cb-summary-col" aria-label="Order summary">
                <div className="cb-summary-card">
                    <h2 className="cb-summary-title">Order summary</h2>

                    <div className="cb-summary-lines" aria-live="polite" aria-atomic="true">
                        <div className="cb-summary-line">
                            <span className="label">Kit rentals ({carts.length})</span>
                            <span className="val">{fmtMoney(kitSubtotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="cb-summary-line">
                                <span className="label">Subscriber discount</span>
                                <span className="val discount">-{fmtMoney(totalDiscount)}</span>
                            </div>
                        )}
                        <div className="cb-summary-line">
                            <span className="label">Deposit (refundable)</span>
                            <span className="val deposit">{fmtMoney(totals.deposit)}</span>
                        </div>
                        <div className="cb-summary-line">
                            <span className="label">Shipping</span>
                            <span className={`val${shippingCost === 0 ? " free" : ""}`}>
                                {shippingCost === 0 ? "FREE" : fmtMoney(shippingCost)}
                            </span>
                        </div>
                        <div className="cb-summary-line">
                            <span className="label">Tax (8%)</span>
                            <span className="val">{fmtMoney(taxes)}</span>
                        </div>
                    </div>

                    <div className="cb-summary-divider" />

                    <div className="cb-summary-total-row">
                        <span className="cb-summary-total-label">Total today</span>
                        <span className="cb-summary-total-amt">{fmtMoney(dueToday)}</span>
                    </div>

                    <div className="cb-deposit-note">
                        <strong>Your deposit is always safe</strong>
                        We hold your refundable deposit and return 100% within 5 business days of kit return &mdash; no questions asked.
                    </div>

                    {/* Agreements */}
                    <div className="cb-summary-divider" />
                    <div className="cb-agreements">
                        <label className="cb-agreement-row">
                            <Checkbox checked={agreed1} onCheckedChange={() => setAgreed1((v) => !v)} className="mt-0.5" />
                            <span className="cb-agreement-text">I confirm my rental dates and shipping address are correct.</span>
                        </label>
                        <label className="cb-agreement-row">
                            <Checkbox checked={agreed2} onCheckedChange={() => setAgreed2((v) => !v)} className="mt-0.5" />
                            <span className="cb-agreement-text">
                                I agree to the CeleBrease{" "}
                                <Link href="/rental-agreement">Rental Agreement</Link>{" "}
                                and <Link href="/terms">Terms of Service</Link>.
                            </span>
                        </label>
                        <label className="cb-agreement-row">
                            <Checkbox checked={agreed3} onCheckedChange={() => setAgreed3((v) => !v)} className="mt-0.5" />
                            <span className="cb-agreement-text">
                                I understand that a refundable deposit of {fmtMoney(totals.deposit)} will be released after kit inspection.
                            </span>
                        </label>
                    </div>

                    <Link
                        href={allAgreed ? "/checkout" : "#"}
                        className={`cb-checkout-cta${!allAgreed ? " disabled" : ""}`}
                        aria-disabled={!allAgreed}
                        onClick={(e) => { if (!allAgreed) e.preventDefault(); }}
                    >
                        Proceed to checkout
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                    <Link href="/catalog" className="cb-continue-shop">&#8592; Continue browsing</Link>

                    <div className="cb-trust-badges" role="list" aria-label="Trust signals">
                        <div className="cb-trust-badge" role="listitem">
                            <span className="badge-icon" aria-hidden="true">&#128274;</span>
                            <span>Secure checkout</span>
                        </div>
                        <div className="cb-trust-badge" role="listitem">
                            <span className="badge-icon" aria-hidden="true">&#9851;</span>
                            <span>Easy returns</span>
                        </div>
                        <div className="cb-trust-badge" role="listitem">
                            <span className="badge-icon" aria-hidden="true">&#10005;</span>
                            <span>Cancel anytime</span>
                        </div>
                    </div>

                    <div className="cb-secure-line">
                        <span>&#128274;</span>
                        <span>Secure payment powered by Stripe</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
