"use client";

import { Button } from "@/components/ui/button";
import type { ApiPlan } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowRight02Icon, CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

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

    return (
        <>
            <div className="mt-5 lg:mt-6 flex items-center gap-6">
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
                <div className="px-4 py-1.5 bg-white shadow-lg rounded-full w-fit">
                    <span className="font-semibold">Save 10%</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-8">
                {plans.length === 0 ? (
                    <p className="lg:col-span-3 text-center text-muted-foreground py-10">Plans are not available right now.</p>
                ) : (
                    plans.map((plan) => {
                        const highlight = plan.code === HIGHLIGHT_CODE;
                        const { perMonth, billedLabel } = priceFor(plan, cycle);

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "p-1 h-max rounded-2xl shadow-lg",
                                    highlight ? "bg-linear-to-r from-primary to-secondary" : "bg-white",
                                )}
                            >
                                <div className="p-6 bg-white flex flex-col gap-6 rounded-xl">
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

                                    <Button variant="black">
                                        Get Started
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
