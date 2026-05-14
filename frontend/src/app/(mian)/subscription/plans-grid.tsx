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
};

const HIGHLIGHT_CODE = "PREMIUM";

function priceFor(plan: ApiPlan, cycle: BillingCycle) {
    const monthly = Number(plan.monthlyPrice);
    const yearly = plan.yearlyPrice ? Number(plan.yearlyPrice) : null;

    if (cycle === "Yearly" && yearly !== null) {
        return {
            perMonth: Math.round((yearly / 12) * 100) / 100,
            billedLabel: `$${yearly}/year`,
        };
    }
    return {
        perMonth: monthly,
        billedLabel: `$${(monthly * 12).toFixed(0)}/year`,
    };
}

export default function PlansGrid({ plans }: PlansGridProps) {
    const [cycle, setCycle] = useState<BillingCycle>("Monthly");
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
            <div className="mt-5 lg:mt-6 flex items-center justify-center gap-6">
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
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-8">
                {plans.length === 0 ? (
                    <p className="lg:col-span-3 text-center text-muted-foreground py-10">Plans are not available right now.</p>
                ) : (
                    plans.map((plan) => {
                        const highlight = plan.code === HIGHLIGHT_CODE;
                        const { perMonth, billedLabel } = priceFor(plan, cycle);
                        const isCurrentPlan = subscription?.plan.id === plan.id;
                        const hasOtherSub = !!subscription && !isCurrentPlan;
                        const buttonLabel = subLoading
                            ? "Loading..."
                            : isCurrentPlan
                              ? "Current Plan"
                              : hasOtherSub
                                ? "Manage Subscription"
                                : pendingPlanId === plan.id
                                  ? "Redirecting..."
                                  : "Get Started";

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
                                            <span className="text-4xl lg:text-5xl font-semibold">${perMonth}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <p className="text-sm text-green-600">Billed {billedLabel}</p>
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
                                        variant="black"
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
        </>
    );
}
