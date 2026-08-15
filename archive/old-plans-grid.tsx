"use client";

import { Button } from "@/components/ui/button";
import { type ApiPlan, type ApiSubscription, createSubscriptionCheckout, getMySubscription } from "@/lib/api";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ArrowRight02Icon, CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BillingCycle = "Monthly" | "Yearly";

type PlansGridProps = {
    plans: ApiPlan[];
    settings?: { yearlyDiscountPercent?: number };
};

const HIGHLIGHT_CODE = "Gold";

function priceFor(plan: ApiPlan, cycle: BillingCycle, discountPercent = 20) {
    const monthly = Number(plan.monthlyPrice);
    if (cycle === "Yearly") {
        const totalYearly = Math.round(monthly * 12 * (1 - discountPercent / 100));
        return {
            amount: totalYearly,
            period: "/year",
            billedLabel: `yearly (${discountPercent}% discount applied)`,
        };
    }
    return {
        amount: monthly,
        period: "/month",
        billedLabel: "monthly",
    };
}

export default function PlansGrid({ plans, settings }: PlansGridProps) {
    const discountPercent = settings?.yearlyDiscountPercent ?? 20;
    const [cycle, setCycle] = useState<BillingCycle>("Monthly");
    const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<ApiSubscription | null>(null);
    const [subLoading, setSubLoading] = useState(false);
    const { data: session, isPending: sessionLoading } = auth.useSession();
    const router = useRouter();

    const maxDiscount = discountPercent;

    useEffect(() => {
        if (sessionLoading) return;
        if (!session) {
            setSubscription(null);
            return;
        }
        let cancelled = false;
        setSubLoading(true);
        getMySubscription()
            .then((sub) => {
                if (!cancelled) setSubscription(sub);
            })
            .finally(() => {
                if (!cancelled) setSubLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [session, sessionLoading]);

    async function handleSubscribe(planId: string) {
        if (sessionLoading) return;
        if (!session) {
            router.push("/signin?redirect=/subscription");
            return;
        }
        if (subscription) {
            router.push("/account");
            return;
        }
        setPendingPlanId(planId);
        try {
            const { url } = await createSubscriptionCheckout({
                planId,
                billingCycle: cycle === "Yearly" ? "YEARLY" : "MONTHLY",
            });
            if (!url) throw new Error("Stripe did not return a redirect URL");
            window.location.href = url;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not start checkout");
            setPendingPlanId(null);
        }
    }

    return (
        <>
            <div className="mt-5 lg:mt-6 flex items-center justify-center gap-3">
                <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                    {(["Monthly", "Yearly"] as BillingCycle[]).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setCycle(item)}
                            className={`px-6 py-1.5 lg:px-7 lg:py-2 rounded-full whitespace-nowrap transition-colors ${
                                cycle === item ? "bg-white shadow-lg" : ""
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                {cycle === "Yearly" && maxDiscount > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                        Save up to {maxDiscount}%
                    </span>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-8">
                {plans.length === 0 ? (
                    <p className="lg:col-span-3 text-center text-muted-foreground py-10">Plans are not available right now.</p>
                ) : (
                    plans.map((plan) => {
                        const highlight = plan.code === HIGHLIGHT_CODE;
                        const { amount, period, billedLabel } = priceFor(plan, cycle, discountPercent);
                        const isCurrentPlan = subscription?.plan.id === plan.id;
                        const hasOtherSub = !!subscription && !isCurrentPlan;
                        const defaultLabel =
                            plan.code === "Silver"
                                ? "Start with Starter"
                                : plan.code === "Gold"
                                  ? "Go Premium"
                                  : "Go Ultimate";
                        const buttonLabel = subLoading
                            ? "Loading..."
                            : isCurrentPlan
                              ? "Current Plan"
                              : hasOtherSub
                                ? "Manage Subscription"
                                : pendingPlanId === plan.id
                                  ? "Redirecting..."
                                  : defaultLabel;

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "p-1 rounded-2xl shadow-lg transition-all duration-500 ease-out bg-white flex flex-col hover:bg-linear-to-r hover:from-primary hover:to-secondary hover:scale-105",
                                )}
                            >
                                <div className="flex-1 p-6 bg-white flex flex-col gap-6 rounded-xl">
                                    <div>
                                        <div className="mb-2 flex justify-between items-center">
                                            <h3 className="text-base lg:text-lg font-medium">{plan.name}</h3>
                                            {highlight && (
                                                <div className="px-4 py-0.5 bg-linear-to-r from-primary to-secondary rounded-full w-fit">
                                                    <span className="text-sm text-white font-medium uppercase">Most Popular</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl lg:text-5xl font-semibold">${amount}</span>
                                            <span className="text-muted-foreground">{period}</span>
                                        </div>
                                        <p className="text-sm text-green-600">Billed {billedLabel}</p>
                                        <p className="mt-2 text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 flex items-center gap-1">
                                            ✨ {plan.description ? plan.description : `${plan.code === "Silver" ? "Up to $350/yr" : plan.code === "Gold" ? "Up to $750/yr" : "Up to $1,500/yr"} equivalent retail value`}
                                        </p>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <p className="text-sm text-muted-foreground font-semibold uppercase">What&apos;s Included:</p>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <li key={feature.id} className="flex items-center gap-3">
                                                    <HugeiconsIcon icon={CheckmarkCircle03Icon} className="text-green-500" />
                                                    <p className="text-base lg:text-lg">{feature.text}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <p>{plan.holidaysPerYear} holidays per year included</p>
                                    </div>

                                    <Button
                                        variant="gradient"
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={subLoading || isCurrentPlan || pendingPlanId !== null}
                                    >
                                        {buttonLabel}
                                        <HugeiconsIcon icon={ArrowRight02Icon} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-linear-to-r from-slate-900 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-pink-400">A-La-Carte Rental Option</span>
                    <h4 className="text-xl font-bold">Just hosting a single holiday event?</h4>
                    <p className="text-sm text-purple-200">
                        One-time individual holiday décor rentals start at <strong className="text-white">$79 / kit</strong>. Save significantly per holiday by choosing an all-inclusive membership above!
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="bg-white text-purple-950 hover:bg-purple-100 border-none font-bold px-6 py-3 whitespace-nowrap"
                    onClick={() => router.push("/catalog")}
                >
                    Browse A-La-Carte Catalog →
                </Button>
            </div>
        </>
    );
}
