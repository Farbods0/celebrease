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
    settings?: { yearlyDiscountPercent?: number; aLaCarteStartingPrice?: number };
};


export default function PlansGrid({ plans, settings }: PlansGridProps) {
    const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<ApiSubscription | null>(null);
    const [subLoading, setSubLoading] = useState(false);
    const { data: session, isPending: sessionLoading } = auth.useSession();
    const router = useRouter();

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
                billingCycle: "YEARLY",
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
            <div className="grid lg:grid-cols-3 gap-6 mt-8">
                {plans.length === 0 ? (
                    <p className="lg:col-span-3 text-center text-muted-foreground py-10">Plans are not available right now.</p>
                ) : (
                    plans.map((plan) => {
                        const highlight = plan.isPopular;
                        const amount = Math.round(Number(plan.yearlyPrice || plan.monthlyPrice));
                        const isCurrentPlan = subscription?.plan.id === plan.id;
                        const hasOtherSub = !!subscription && !isCurrentPlan;
                        const defaultLabel = plan.buttonLabel || "Select Plan";
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
                                            <span className="text-muted-foreground">/year</span>
                                        </div>
                                        <p className="text-sm text-green-600 capitalize">Billed annually</p>
                                        {plan.description && (
                                            <p className="mt-2 text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 flex items-center gap-1">
                                                ✨ {plan.description}
                                            </p>
                                        )}
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
                        One-time individual holiday décor rentals start at <strong className="text-white">${settings?.aLaCarteStartingPrice ?? 79} / kit</strong>. Save significantly per holiday by choosing an all-inclusive membership above!
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
