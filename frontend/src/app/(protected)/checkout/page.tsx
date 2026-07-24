"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getMyAddress, getMyCarts, getMySubscription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CheckoutDetails from "./checkout-details";

export default function CheckoutPage() {
    const {
        data: carts,
        isLoading: cartsLoading,
        isError: cartsError,
    } = useQuery({
        queryKey: ["carts"],
        queryFn: () => getMyCarts(),
    });

    const {
        data: address,
        isLoading: addressLoading,
        isError: addressError,
    } = useQuery({
        queryKey: ["address"],
        queryFn: () => getMyAddress(),
    });

    const { data: subscription } = useQuery({
        queryKey: ["subscription", "me"],
        queryFn: () => getMySubscription(),
    });

    const isLoading = cartsLoading || addressLoading;
    const isError = cartsError || addressError;
    const activeSubscription = subscription?.status === "ACTIVE" ? subscription : null;

    if (isLoading) {
        return (
            <div className="cb">
                <div style={{ background: "var(--cb-lavender)", minHeight: "calc(100vh - 80px)", padding: "clamp(32px,4vw,56px) 24px clamp(48px,6vw,80px)" }}>
                    <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28 }}>
                            <Skeleton style={{ height: 14, width: 140, borderRadius: 8 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <Skeleton style={{ height: 180, borderRadius: 22 }} />
                                <Skeleton style={{ height: 240, borderRadius: 22 }} />
                                <Skeleton style={{ height: 160, borderRadius: 22 }} />
                            </div>
                            <Skeleton style={{ height: 560, borderRadius: 22 }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="cb">
                <div style={{ background: "var(--cb-lavender)", minHeight: "calc(100vh - 80px)", padding: "clamp(32px,4vw,56px) 24px" }}>
                    <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                        <div style={{
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            borderRadius: "var(--cb-r-card)",
                            padding: "32px",
                            boxShadow: "var(--cb-shadow-xs)",
                        }}>
                            <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Something went wrong</h2>
                            <p style={{ color: "var(--cb-ink-muted)", fontSize: 15 }}>Unable to load checkout. Please try again later.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!(carts?.items ?? []).length) {
        return (
            <div className="cb">
                <div style={{ background: "var(--cb-lavender)", minHeight: "calc(100vh - 80px)", padding: "clamp(32px,4vw,56px) 24px" }}>
                    <div style={{ maxWidth: "var(--cb-max)", margin: "0 auto" }}>
                        <div style={{
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            borderRadius: "var(--cb-r-card)",
                            padding: "32px",
                            boxShadow: "var(--cb-shadow-xs)",
                        }}>
                            <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>No items to checkout</h2>
                            <p style={{ color: "var(--cb-ink-muted)", fontSize: 15, marginBottom: 20 }}>
                                Browse the catalog to find a kit for your next celebration.
                            </p>
                            <Link
                                href="/catalog"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    height: 44,
                                    padding: "0 24px",
                                    borderRadius: "var(--cb-r-pill)",
                                    background: "var(--cb-gradient-h)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    boxShadow: "var(--cb-shadow-sm)",
                                }}
                            >
                                Back to Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cb">
            <style>{`
                .co-wrap { background: var(--cb-lavender); min-height: calc(100vh - 80px); padding: clamp(32px,4vw,56px) 24px clamp(48px,6vw,80px); }
                .co-breadcrumb { max-width: var(--cb-max); margin: 0 auto 28px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--cb-ink-muted); }
                .co-breadcrumb a { color: var(--cb-purple); font-weight: 600; transition: opacity .2s; }
                .co-breadcrumb a:hover { opacity: .75; }
                .co-breadcrumb .sep { color: var(--cb-ink-soft); }
                .co-breadcrumb .cur { font-weight: 600; color: var(--cb-ink); }
                .co-steps { max-width: var(--cb-max); margin: 0 auto 36px; display: flex; align-items: center; }
                .co-step { display: flex; align-items: center; gap: 10px; flex: 1; }
                .co-step:last-child { flex: 0 0 auto; }
                .co-step-num { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; transition: all .25s; }
                .co-step.done .co-step-num { background: var(--cb-gradient-h); color: #fff; box-shadow: 0 4px 12px rgba(155,47,201,0.3); }
                .co-step.active .co-step-num { background: var(--cb-gradient-h); color: #fff; box-shadow: 0 4px 12px rgba(155,47,201,0.3); }
                .co-step.pending .co-step-num { background: #fff; border: 2px solid var(--cb-line); color: var(--cb-ink-soft); }
                .co-step-label { font-size: 13px; font-weight: 600; }
                .co-step.done .co-step-label { color: var(--cb-purple); }
                .co-step.active .co-step-label { color: var(--cb-ink); }
                .co-step.pending .co-step-label { color: var(--cb-ink-soft); }
                .co-step-line { flex: 1; height: 2px; background: var(--cb-line); margin: 0 10px; border-radius: 2px; }
                .co-step-line.done { background: var(--cb-gradient-h); }
                @media (max-width: 980px) {
                    .co-steps { display: none; }
                    .co-breadcrumb { display: none; }
                }
            `}</style>

            <div className="co-wrap">
                {/* Breadcrumb */}
                <nav className="co-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/" className="">Home</Link>
                    <span className="sep" aria-hidden="true">›</span>
                    <Link href="/cart" className="">Cart</Link>
                    <span className="sep" aria-hidden="true">›</span>
                    <span className="cur" aria-current="page">Checkout</span>
                </nav>

                {/* Steps indicator */}
                <div className="co-steps" role="list" aria-label="Checkout progress">
                    <div className="co-step done" role="listitem">
                        <span className="co-step-num" aria-label="Step 1 complete">✓</span>
                        <span className="co-step-label">Cart</span>
                    </div>
                    <div className="co-step-line done" aria-hidden="true" />
                    <div className="co-step active" role="listitem">
                        <span className="co-step-num" aria-label="Step 2, current">2</span>
                        <span className="co-step-label">Checkout</span>
                    </div>
                    <div className="co-step-line" aria-hidden="true" />
                    <div className="co-step pending" role="listitem">
                        <span className="co-step-num" aria-label="Step 3, not yet reached">3</span>
                        <span className="co-step-label">Confirmation</span>
                    </div>
                </div>

                <CheckoutDetails
                    carts={carts?.items ?? []}
                    address={address ?? null}
                    subscription={activeSubscription}
                />
            </div>
        </div>
    );
}
