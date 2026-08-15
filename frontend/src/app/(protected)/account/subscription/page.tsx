"use client";

import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import {
    baseURL,
    getMyPaymentMethod,
    getMySubscription,
    type ApiPaymentMethod,
    type ApiSubscription,
    type ApiSubscriptionHolidaySlot,
    type HolidaySlotStatus,
} from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* helpers                                                              */
/* ------------------------------------------------------------------ */

function getInitials(name?: string | null) {
    if (!name) return "?";
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? "")
            .join("") || "?"
    );
}

function fmtDate(v: string | null | undefined) {
    if (!v) return "--";
    return new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtMonthYear(v: string | null | undefined) {
    if (!v) return "--";
    return new Date(v).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function planPrice(sub: ApiSubscription) {
    const raw = sub.billingCycle === "YEARLY"
        ? (sub.plan as unknown as { yearlyPrice?: string }).yearlyPrice
        : (sub.plan as unknown as { monthlyPrice?: string }).monthlyPrice;
    if (!raw) return null;
    const n = parseFloat(raw);
    if (isNaN(n)) return null;
    return n;
}

function slotsUsed(slots: ApiSubscriptionHolidaySlot[]) {
    return (slots ?? []).filter((s) => s.status !== "PENDING").length;
}

const SLOT_STATUS_LABELS: Record<HolidaySlotStatus, string> = {
    PENDING: "Pending",
    SELECTED: "Confirmed",
    SHIPPED: "Shipped",
    RETURNED: "Returned",
    SKIPPED: "Skipped",
};

const PLAN_TIER_LABELS: Record<string, string> = {
    STARTER: "Silver",
    PREMIUM: "Gold",
    ULTIMATE: "Platinum",
};

/* ------------------------------------------------------------------ */
/* sub-components                                                       */
/* ------------------------------------------------------------------ */

function PlanCard({ sub }: { sub: ApiSubscription }) {
    const used = slotsUsed(sub.holidaySlots ?? []);
    const total = sub.plan.holidaysPerYear;
    const price = planPrice(sub);
    const cycle = sub.billingCycle === "YEARLY" ? "/yr" : "/mo";
    const tierLabel = PLAN_TIER_LABELS[sub.plan.code] ?? sub.plan.name;
    const isActive = sub.status === "ACTIVE";

    return (
        <div className="acct-plan-card">
            <div className="acct-plan-card__before" aria-hidden="true" />
            <div className="acct-plan-top">
                <div className="acct-plan-name-col">
                    <span className="acct-plan-tier-pill">
                        <span aria-hidden="true">&#9733;</span> {tierLabel}
                    </span>
                    <h2 className="acct-plan-h2">{sub.plan.name}</h2>
                    <span className={isActive ? "acct-status-badge acct-status-badge--active" : "acct-status-badge acct-status-badge--inactive"}>
                        {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                    </span>
                </div>
                {price !== null && (
                    <div className="acct-plan-price-col">
                        <div className="acct-plan-price-big">
                            ${price}<span className="acct-plan-price-per">{cycle}</span>
                        </div>
                        <div className="acct-plan-billing-cycle">
                            Billed {sub.billingCycle.toLowerCase()}{sub.nextBillingAt ? ` · Next charge ${fmtDate(sub.nextBillingAt)}` : ""}
                        </div>
                    </div>
                )}
            </div>
            <div className="acct-plan-meta-row">
                <div className="acct-plan-meta-item">
                    <span className="acct-plan-meta-label">Holiday Slots</span>
                    <span className="acct-plan-meta-value">{total} per year</span>
                </div>
                <div className="acct-plan-meta-item">
                    <span className="acct-plan-meta-label">Slots Used</span>
                    <span className="acct-plan-meta-value">{used} of {total}</span>
                </div>
                {sub.cycleStart && (
                    <div className="acct-plan-meta-item">
                        <span className="acct-plan-meta-label">Member Since</span>
                        <span className="acct-plan-meta-value">{fmtMonthYear(sub.cycleStart)}</span>
                    </div>
                )}
                {sub.plan.kitDiscount > 0 && (
                    <div className="acct-plan-meta-item">
                        <span className="acct-plan-meta-label">Kit Discount</span>
                        <span className="acct-plan-meta-value acct-plan-meta-value--green">{sub.plan.kitDiscount}% off</span>
                    </div>
                )}
                {sub.plan.addOnDiscount > 0 && (
                    <div className="acct-plan-meta-item">
                        <span className="acct-plan-meta-label">Add-On Discount</span>
                        <span className="acct-plan-meta-value acct-plan-meta-value--green">{sub.plan.addOnDiscount}% off</span>
                    </div>
                )}
            </div>
            <div className="acct-plan-actions">
                <Link href="/subscription" className="acct-btn acct-btn--grad">
                    &#8679; Upgrade Plan
                </Link>
                <button className="acct-btn acct-btn--out" onClick={() => toast.info("Plan change coming soon.")}>
                    &#8596; Change Plan
                </button>
                <button className="acct-btn acct-btn--ghost" onClick={() => toast.info("Pause flow coming soon.")}>
                    &#9646;&#9646; Pause Subscription
                </button>
            </div>
        </div>
    );
}

function SlotCard({ slot, imgSrc, holidayName }: {
    slot: ApiSubscriptionHolidaySlot;
    imgSrc?: string;
    holidayName?: string;
}) {
    const statusLabel = SLOT_STATUS_LABELS[slot.status] ?? slot.status;
    const isPending = slot.status === "PENDING";
    const isReassignable = isPending && slot.holidayId;

    if (!slot.holidayId && !imgSrc) {
        return (
            <article className="acct-slot-card acct-slot-card--empty" aria-label={`Empty holiday slot ${slot.slotNumber}`}>
                <div className="acct-slot-empty-body">
                    <div className="acct-slot-empty-icon" aria-hidden="true">&#127881;</div>
                    <div className="acct-slot-empty-title">Choose a holiday</div>
                    <p className="acct-slot-empty-sub">You have a slot available. Pick a holiday and we will curate a kit for you.</p>
                    <Link href="/shop-kits" className="acct-slot-btn acct-slot-btn--primary">+ Choose Holiday</Link>
                </div>
            </article>
        );
    }

    return (
        <article className={`acct-slot-card${isPending ? " acct-slot-card--pending" : " acct-slot-card--filled"}`} aria-label={`${holidayName ?? "Holiday"} slot`}>
            {imgSrc && (
                <div className="acct-slot-img-wrap">
                    <img src={imgSrc} alt={holidayName ? `${holidayName} decoration` : "Holiday decoration"} />
                    <div className="acct-slot-scrim" aria-hidden="true" />
                    <span className={`acct-slot-status-dot${isPending ? " acct-slot-status-dot--pending" : ""}`}>
                        {statusLabel}
                    </span>
                </div>
            )}
            <div className="acct-slot-body">
                <div className="acct-slot-holiday-name">{holidayName ?? "Holiday"}</div>
                <div className="acct-slot-kit-name">Slot {slot.slotNumber} &mdash; {statusLabel}</div>
                <div className="acct-slot-detail-row">
                    {isReassignable && (
                        <span className="acct-slot-pending-tag">Reassignable</span>
                    )}
                </div>
                <div className="acct-slot-actions">
                    {isReassignable && (
                        <button className="acct-slot-btn acct-slot-btn--primary" onClick={() => toast.info("Reassign holiday coming soon.")}>
                            &#8596; Reassign
                        </button>
                    )}
                    <Link href="/shop-kits" className="acct-slot-btn acct-slot-btn--outline">
                        Shop Kits
                    </Link>
                    {slot.orderId && (
                        <Link href="/account" className="acct-slot-btn acct-slot-btn--ghost">
                            View Order
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

function EmptySlotCard({ slotNum }: { slotNum: number }) {
    return (
        <article className="acct-slot-card acct-slot-card--empty" aria-label={`Empty holiday slot ${slotNum}`}>
            <div className="acct-slot-empty-body">
                <div className="acct-slot-empty-icon" aria-hidden="true">&#127881;</div>
                <div className="acct-slot-empty-title">Choose a holiday</div>
                <p className="acct-slot-empty-sub">You have a slot available. Pick a holiday and we will curate a kit for you.</p>
                <Link href="/shop-kits" className="acct-slot-btn acct-slot-btn--primary">+ Choose Holiday</Link>
            </div>
        </article>
    );
}

function PaymentMethodCard({ pm }: { pm: ApiPaymentMethod | null }) {
    if (!pm || !pm.last4) {
        return (
            <div className="acct-payment-card">
                <div className="acct-payment-info">
                    <div className="acct-card-icon" aria-hidden="true">CARD</div>
                    <div>
                        <div className="acct-payment-detail">No payment method on file</div>
                        <div className="acct-payment-sub">Add a credit or debit card for seamless checkout and plan renewals</div>
                    </div>
                </div>
                <div className="acct-payment-actions">
                    <button className="acct-btn acct-btn--primary" onClick={() => toast.info("Add payment method coming soon.")}>
                        + Add Payment Method
                    </button>
                </div>
            </div>
        );
    }

    const brand = (pm.brand ?? "CARD").toUpperCase();
    const last4 = pm.last4;
    const expMonth = pm.expMonth ? String(pm.expMonth).padStart(2, "0") : "--";
    const expYear = pm.expYear ?? "----";

    return (
        <div className="acct-payment-card">
            <div className="acct-payment-info">
                <div className="acct-card-icon" aria-hidden="true">{brand.slice(0, 4)}</div>
                <div>
                    <div className="acct-payment-detail">{brand} ending in {last4}</div>
                    <div className="acct-payment-sub">Expires {expMonth}/{expYear} &middot; Default card</div>
                </div>
            </div>
            <div className="acct-payment-actions">
                <button className="acct-btn acct-btn--out" onClick={() => toast.info("Update card coming soon.")}>
                    &#9998; Update Card
                </button>
                <button className="acct-btn acct-btn--ghost" onClick={() => toast.info("Add payment method coming soon.")}>
                    + Add Method
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* main page                                                            */
/* ------------------------------------------------------------------ */

export default function SubscriptionPage() {
    const { data: session } = auth.useSession();
    const user = session?.user;
    const initials = getInitials(user?.name);
    const tierLabel = "Member";

    const [sub, setSub] = useState<ApiSubscription | null>(null);
    const [pm, setPm] = useState<ApiPaymentMethod | null>(null);
    const [loading, setLoading] = useState(true);

    // Track search params for success/cancelled
    const [searchParams, setSearchParams] = useState<{ success?: string; cancelled?: string }>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const sp = new URLSearchParams(window.location.search);
            setSearchParams({
                success: sp.get("success") ?? undefined,
                cancelled: sp.get("cancelled") ?? undefined,
            });
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getMySubscription().catch(() => null),
            getMyPaymentMethod().catch(() => null),
        ]).then(([s, p]) => {
            if (cancelled) return;
            setSub(s);
            setPm(p);
            setLoading(false);
        });
        return () => { cancelled = true; };
    }, []);

    const slots = sub?.holidaySlots ?? [];
    const totalSlots = sub?.plan.holidaysPerYear ?? 0;
    const usedSlots = slotsUsed(slots);
    const emptyCount = Math.max(0, totalSlots - slots.length);

    return (
        <>
            <style>{`
/* ============================================================
   ACCOUNT / SUBSCRIPTION PAGE, scoped to .acct-wrap
   ============================================================ */
.acct-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;
  align-items: start;
}

/* Sidebar */
.acct-sidebar { position: sticky; top: 90px; }
.acct-user { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.acct-avatar {
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(to right, #9B2FC9, #DC0075);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 20px; font-weight: 700; flex-shrink: 0;
}
.acct-user-name { font-weight: 700; font-size: 15px; color: #1A0B2E; }
.acct-user-plan {
  font-size: 12px; color: #9B2FC9; font-weight: 600;
  background: #EFE6F9; padding: 3px 10px; border-radius: 9999px;
  display: inline-block; margin-top: 3px;
}
.acct-sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.acct-sidebar-nav a {
  display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500;
  color: #5B4A6B; padding: 11px 16px; border-radius: 12px; transition: all .2s;
  text-decoration: none;
}
.acct-sidebar-nav a:hover { background: #F6F1FB; color: #9B2FC9; }
.acct-sidebar-nav a.active { background: #EFE6F9; color: #9B2FC9; font-weight: 600; }
.acct-sidebar-divider { border: none; border-top: 1px solid rgba(155,47,201,0.12); margin: 12px 0; }
.acct-sn-icon { font-size: 17px; width: 22px; text-align: center; flex-shrink: 0; }

/* Page header */
.acct-page-header { margin-bottom: 36px; }
.acct-page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; margin-bottom: 6px; color: #1A0B2E; }
.acct-page-header p { color: #5B4A6B; font-size: 15.5px; }

/* Section */
.acct-section { margin-bottom: 40px; }
.acct-section-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.13em;
  color: #8979A0; font-weight: 700; margin-bottom: 18px;
}

/* Status bar (success/cancelled) */
.acct-status-bar {
  border-radius: 16px; padding: 18px 22px; margin-bottom: 28px;
  display: flex; flex-direction: column; gap: 8px;
}
.acct-status-bar--success { background: #DCFCE7; border: 1px solid #86EFAC; }
.acct-status-bar--cancelled { background: #FEF3C7; border: 1px solid #FCD34D; }
.acct-status-bar h2 { font-family: 'Inter', system-ui, sans-serif; font-size: 16px; font-weight: 700; }
.acct-status-bar--success h2 { color: #15803D; }
.acct-status-bar--cancelled h2 { color: #92400E; }
.acct-status-bar p { font-size: 14px; color: #5B4A6B; }

/* Plan card */
.acct-plan-card {
  background: #fff;
  border: 2px solid transparent;
  border-radius: 22px;
  padding: 32px;
  background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #9B2FC9, #DC0075);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 12px 32px rgba(155,47,201,0.14);
  position: relative;
  overflow: hidden;
}
.acct-plan-card__before {
  position: absolute; right: -80px; top: -80px; width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(155,47,201,0.07), transparent 70%);
  pointer-events: none; border-radius: 50%;
}
.acct-plan-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.acct-plan-name-col { display: flex; flex-direction: column; gap: 8px; }
.acct-plan-tier-pill {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(to right, #9B2FC9, #DC0075); color: #fff;
  font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 9999px; align-self: flex-start;
}
.acct-plan-h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 700; color: #1A0B2E; }
.acct-status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 9999px;
}
.acct-status-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.acct-status-badge--active { color: #15803D; background: #DCFCE7; }
.acct-status-badge--active::before { background: #16A34A; }
.acct-status-badge--inactive { color: #92400E; background: #FEF3C7; }
.acct-status-badge--inactive::before { background: #D97706; }

.acct-plan-price-col { text-align: right; }
.acct-plan-price-big { font-family: 'Playfair Display', Georgia, serif; font-size: 2.6rem; font-weight: 700; color: #1A0B2E; line-height: 1; }
.acct-plan-price-per { font-family: 'Inter', system-ui, sans-serif; font-size: 15px; font-weight: 400; color: #5B4A6B; }
.acct-plan-billing-cycle { font-size: 13px; color: #5B4A6B; margin-top: 4px; }

.acct-plan-meta-row { display: flex; gap: 28px; margin-top: 22px; padding-top: 22px; border-top: 1px solid rgba(155,47,201,0.12); flex-wrap: wrap; }
.acct-plan-meta-item { display: flex; flex-direction: column; gap: 3px; }
.acct-plan-meta-label { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #8979A0; font-weight: 600; }
.acct-plan-meta-value { font-size: 15px; font-weight: 600; color: #1A0B2E; }
.acct-plan-meta-value--green { color: #15803D; }

.acct-plan-actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }

/* Shared button sizes */
.acct-btn {
  padding: 0 18px; height: 42px; border-radius: 9999px; font-weight: 600; font-size: 14px;
  display: inline-flex; align-items: center; gap: 6px; transition: all .2s; white-space: nowrap;
  cursor: pointer; font-family: inherit; text-decoration: none;
}
.acct-btn--grad {
  background: linear-gradient(to right, #9B2FC9, #DC0075); color: #fff;
  border: none; box-shadow: 0 4px 16px rgba(155,47,201,0.08);
}
.acct-btn--grad:hover { opacity: .92; transform: translateY(-1px); }
.acct-btn--out {
  border: 1.5px solid rgba(155,47,201,0.35); color: #9B2FC9; background: #fff;
}
.acct-btn--out:hover { border-color: #9B2FC9; background: #F6F1FB; }
.acct-btn--ghost {
  border: 1.5px solid rgba(91,74,107,0.25); color: #5B4A6B; background: #fff;
}
.acct-btn--ghost:hover { border-color: #5B4A6B; color: #1A0B2E; }
.acct-btn--danger {
  border: 1.5px solid rgba(220,38,38,0.3); color: #DC2626; background: #fff;
}
.acct-btn--danger:hover { background: #FEF2F2; border-color: #DC2626; }

/* No-sub state */
.acct-no-sub {
  background: #F6F1FB; border: 1.5px dashed rgba(155,47,201,0.3);
  border-radius: 22px; padding: 48px 32px; text-align: center; display: flex;
  flex-direction: column; align-items: center; gap: 16px;
}
.acct-no-sub h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: #1A0B2E; }
.acct-no-sub p { color: #5B4A6B; font-size: 15px; max-width: 400px; }

/* Holiday slots grid */
.acct-slots-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.acct-slot-card {
  border: 1.5px solid rgba(155,47,201,0.12); border-radius: 22px;
  overflow: hidden; background: #fff;
  box-shadow: 0 1px 3px rgba(26,11,46,0.06);
  transition: transform .2s, box-shadow .2s;
}
.acct-slot-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(155,47,201,0.14); }
.acct-slot-card--filled { border-color: rgba(155,47,201,0.2); }
.acct-slot-card--pending { border-color: rgba(220,163,23,0.35); }
.acct-slot-card--empty { border-style: dashed; border-color: rgba(155,47,201,0.25); background: #F6F1FB; }

.acct-slot-img-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; }
.acct-slot-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; display: block; }
.acct-slot-card:hover .acct-slot-img-wrap img { transform: scale(1.04); }
.acct-slot-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(26,11,46,0.6) 100%);
  pointer-events: none;
}
.acct-slot-status-dot {
  position: absolute; top: 10px; right: 10px;
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; color: #fff;
  background: rgba(26,11,46,0.55); backdrop-filter: blur(8px);
  padding: 4px 10px; border-radius: 9999px;
}
.acct-slot-status-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; flex-shrink: 0; }
.acct-slot-status-dot--pending::before { background: #E8A317; }

.acct-slot-body { padding: 16px 18px 18px; }
.acct-slot-holiday-name { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #1A0B2E; }
.acct-slot-kit-name { font-size: 13px; color: #5B4A6B; margin-bottom: 12px; }
.acct-slot-detail-row { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; align-items: center; }
.acct-slot-pending-tag {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700;
  color: #92400E; background: #FEF3C7; padding: 4px 10px; border-radius: 9999px;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.acct-slot-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.acct-slot-btn {
  padding: 0 14px; height: 34px; border-radius: 9999px; font-size: 13px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 5px; transition: all .2s;
  white-space: nowrap; cursor: pointer; font-family: inherit; text-decoration: none;
}
.acct-slot-btn--primary {
  background: linear-gradient(to right, #9B2FC9, #DC0075); color: #fff;
  border: none; box-shadow: 0 3px 10px rgba(155,47,201,0.25);
}
.acct-slot-btn--primary:hover { opacity: .9; transform: translateY(-1px); }
.acct-slot-btn--outline { border: 1.5px solid rgba(155,47,201,0.3); color: #9B2FC9; background: #fff; }
.acct-slot-btn--outline:hover { background: #F6F1FB; border-color: #9B2FC9; }
.acct-slot-btn--ghost { border: 1.5px solid rgba(91,74,107,0.2); color: #5B4A6B; background: #fff; }
.acct-slot-btn--ghost:hover { border-color: #5B4A6B; color: #1A0B2E; }

.acct-slot-empty-body {
  padding: 28px 18px; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 12px;
}
.acct-slot-empty-icon {
  width: 52px; height: 52px; border-radius: 50%; background: rgba(155,47,201,0.1);
  display: flex; align-items: center; justify-content: center; font-size: 22px;
}
.acct-slot-empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 600; color: #1A0B2E; }
.acct-slot-empty-sub { font-size: 13px; color: #5B4A6B; line-height: 1.5; margin-top: -4px; }

/* Payment method */
.acct-payment-card {
  background: #fff; border: 1px solid rgba(155,47,201,0.12); border-radius: 22px;
  padding: 24px 28px; display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(26,11,46,0.06);
}
.acct-payment-info { display: flex; align-items: center; gap: 16px; }
.acct-card-icon {
  width: 56px; height: 36px; background: linear-gradient(to right, #9B2FC9, #DC0075);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; flex-shrink: 0;
}
.acct-payment-detail { font-size: 15px; font-weight: 600; color: #1A0B2E; }
.acct-payment-sub { font-size: 13px; color: #5B4A6B; margin-top: 2px; }
.acct-payment-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* Danger zone */
.acct-danger-zone {
  background: #fff; border: 1.5px solid rgba(220,38,38,0.18);
  border-radius: 22px; padding: 26px 28px;
}
.acct-danger-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.acct-danger-info h4 {
  font-family: 'Inter', system-ui, sans-serif; font-size: 15px; font-weight: 700;
  color: #1A0B2E; margin-bottom: 4px;
}
.acct-danger-info p { font-size: 14px; color: #5B4A6B; line-height: 1.5; max-width: 480px; }
.acct-danger-divider { border: none; border-top: 1px solid rgba(220,38,38,0.12); margin: 18px 0; }

/* Responsive */
@media (max-width: 1080px) {
  .acct-wrap { grid-template-columns: 200px 1fr; gap: 28px; }
  .acct-slots-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 980px) {
  .acct-wrap { grid-template-columns: 1fr; padding-top: 32px; }
  .acct-sidebar { position: static; }
  .acct-user { margin-bottom: 18px; }
  .acct-sidebar-nav { flex-direction: row; flex-wrap: wrap; gap: 6px; }
  .acct-sidebar-nav a { padding: 8px 14px; font-size: 14px; }
}
@media (max-width: 600px) {
  .acct-slots-grid { grid-template-columns: 1fr; }
  .acct-plan-actions { flex-direction: column; }
  .acct-plan-meta-row { gap: 18px; }
  .acct-payment-card { flex-direction: column; align-items: flex-start; }
  .acct-danger-row { flex-direction: column; align-items: flex-start; }
}
            `}</style>

            <div className="cb">
                <main style={{ marginTop: "80px", background: "#fff", minHeight: "100vh" }}>
                    <div className="acct-wrap">

                        {/* SIDEBAR */}
                        <aside className="acct-sidebar">
                            <div className="acct-user">
                                <div className="acct-avatar" aria-hidden="true">{initials}</div>
                                <div>
                                    <div className="acct-user-name">{user?.name ?? "My Account"}</div>
                                    <span className="acct-user-plan">{tierLabel}</span>
                                </div>
                            </div>
                            <nav className="acct-sidebar-nav" aria-label="Account navigation">
                                <Link href="/account">
                                    <span className="acct-sn-icon" aria-hidden="true">&#128100;</span> Overview
                                </Link>
                                <Link href="/account/subscription" className="active" aria-current="page">
                                    <span className="acct-sn-icon" aria-hidden="true">&#11088;</span> My Subscription
                                </Link>
                                <Link href="/account">
                                    <span className="acct-sn-icon" aria-hidden="true">&#128230;</span> Orders
                                </Link>
                                <Link href="/wishlist">
                                    <span className="acct-sn-icon" aria-hidden="true">&#9825;</span> Wishlist
                                </Link>
                                <hr className="acct-sidebar-divider" />
                                <Link href="/account">
                                    <span className="acct-sn-icon" aria-hidden="true">&#127968;</span> Addresses
                                </Link>
                                <Link href="/account">
                                    <span className="acct-sn-icon" aria-hidden="true">&#128274;</span> Security
                                </Link>
                            </nav>
                        </aside>

                        {/* MAIN CONTENT */}
                        <div>
                            <div className="acct-page-header">
                                <h1>My Subscription</h1>
                                <p>Manage your plan, holiday slots, billing, and payment details.</p>
                            </div>

                            {/* Status bar */}
                            {searchParams.success === "1" && (
                                <div className="acct-status-bar acct-status-bar--success" role="status">
                                    <h2>Payment received</h2>
                                    <p>We are finalizing your subscription. Refresh in a moment to see your holiday slots.</p>
                                    <Link href="/account" className="acct-btn acct-btn--grad" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                                        Back to my account
                                    </Link>
                                </div>
                            )}
                            {searchParams.cancelled === "1" && (
                                <div className="acct-status-bar acct-status-bar--cancelled" role="status">
                                    <h2>No subscription created</h2>
                                    <p>You closed the checkout before completing payment. You can pick a plan again anytime.</p>
                                    <Link href="/subscription" className="acct-btn acct-btn--grad" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                                        View plans
                                    </Link>
                                </div>
                            )}

                            {/* Loading */}
                            {loading && (
                                <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                                    <Spinner className="size-10 stroke-primary" />
                                </div>
                            )}

                            {/* No subscription */}
                            {!loading && !sub && (
                                <div className="acct-no-sub">
                                    <div style={{ fontSize: "40px" }} aria-hidden="true">&#11088;</div>
                                    <h2>No Active Subscription</h2>
                                    <p>Pick a plan to start your first holiday cycle and unlock curated decoration kits.</p>
                                    <Link href="/subscription" className="acct-btn acct-btn--grad" style={{ marginTop: "4px" }}>
                                        View Plans
                                    </Link>
                                </div>
                            )}

                            {/* CURRENT PLAN */}
                            {!loading && sub && (
                                <>
                                    <section className="acct-section" aria-labelledby="plan-heading">
                                        <div className="acct-section-label" id="plan-heading">Current Plan</div>
                                        <PlanCard sub={sub} />
                                    </section>

                                    {/* HOLIDAY SLOTS */}
                                    <section className="acct-section" aria-labelledby="slots-heading">
                                        <div className="acct-section-label" id="slots-heading">
                                            Holiday Slots ({usedSlots} of {totalSlots} filled)
                                        </div>
                                        <div className="acct-slots-grid">
                                            {(slots ?? []).map((slot) => (
                                                <SlotCard
                                                    key={slot.id}
                                                    slot={slot}
                                                    imgSrc={
                                                        (slot as unknown as { holiday?: { image?: string } }).holiday?.image
                                                            ? `${baseURL}${(slot as unknown as { holiday: { image: string } }).holiday.image}`
                                                            : undefined
                                                    }
                                                    holidayName={
                                                        (slot as unknown as { holiday?: { name?: string } }).holiday?.name ?? undefined
                                                    }
                                                />
                                            ))}
                                            {Array.from({ length: emptyCount }, (_, i) => (
                                                <EmptySlotCard key={`empty-${i}`} slotNum={(slots?.length ?? 0) + i + 1} />
                                            ))}
                                        </div>
                                    </section>
                                </>
                            )}

                            {/* PAYMENT METHOD */}
                            {!loading && (
                                <section className="acct-section" aria-labelledby="payment-heading">
                                    <div className="acct-section-label" id="payment-heading">Payment Method</div>
                                    <PaymentMethodCard pm={pm} />
                                </section>
                            )}

                            {/* DANGER ZONE */}
                            {!loading && sub && (
                                <section className="acct-section" aria-labelledby="danger-heading">
                                    <div className="acct-section-label" id="danger-heading">Plan Actions</div>
                                    <div className="acct-danger-zone">
                                        <div className="acct-danger-row">
                                            <div className="acct-danger-info">
                                                <h4>Pause subscription (Off-Season Freeze)</h4>
                                                <p>
                                                    Heading into the summer off-season or taking a break between holidays? Temporarily freeze your plan for up to 3 months. Your holiday reserved slots and paid credits are locked in and preserved with zero billing!
                                                </p>
                                            </div>
                                            <button
                                                className="acct-btn acct-btn--ghost font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100"
                                                onClick={() => toast.success("Plan successfully frozen for 3 months! Your slots and credits are preserved until the fall season.")}
                                            >
                                                &#9646;&#9646; Pause Plan for Summer
                                            </button>
                                        </div>
                                        <hr className="acct-danger-divider" />
                                        <div className="acct-danger-row">
                                            <div className="acct-danger-info">
                                                <h4>Cancel subscription</h4>
                                                <p>
                                                    Cancelling takes effect at the end of your current billing period
                                                    {sub.nextBillingAt ? ` (${fmtDate(sub.nextBillingAt)})` : ""}.
                                                    You will keep access until then and any outstanding deposits will be refunded.
                                                </p>
                                            </div>
                                            <button className="acct-btn acct-btn--danger" onClick={() => toast.warning("Cancellation flow coming soon.")}>
                                                &#10005; Cancel Plan
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
