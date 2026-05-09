import PageHeader from "@/components/main/page-header";
import SectionHeader from "@/components/main/section-header";
import { ApiPlan, getPlans } from "@/lib/api";
import { CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import PlansGrid from "./plans-grid";

export default async function SubscriptionPage() {
    const data = await getPlans();

    return (
        <>
            <PageHeader
                title=<>
                    Celebrate All Year with the <br className="hidden sm:block" /> CeleBrease Subscription
                </>
                description={
                    <>
                        Three holidays per year. Premium décor, delivered when you <br className="hidden sm:block" /> need it - no storage,
                        no stress.
                    </>
                }
            />
            {/* --- HOW IT WORKS SECTION --- */}
            <section className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-8 md:space-y-10 lg:space-y-12">
                <SectionHeader title="Beautiful, Hassle-Free Rentals" subtitle="How It Works" />

                <div className="grid md:grid-cols-3 gap-5">
                    {[
                        {
                            step: 1,
                            title: "Choose a Holiday Kit",
                            description:
                                "Explore our seasonal kits for every celebration, featuring premium decorations to elevate your space.",
                        },
                        {
                            step: 2,
                            title: "Decorate &",
                            description:
                                "Your kit arrives clean and ready to use, no shopping needed. Unpack and enjoy lasting memories without storage worries.",
                        },
                        {
                            step: 3,
                            title: "Return Easily",
                            description:
                                "After your celebration, repack everything in the box with our prepaid label for guilt-free, sustainable reuse.",
                        },
                    ].map((step) => (
                        <div
                            key={step.step}
                            className="p-6 bg-muted border rounded-2xl flex flex-col gap-10 lg:gap-12 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="px-4 py-1.5 bg-white shadow-lg rounded-full w-fit">
                                <span className="font-semibold">Step {step.step}</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-xl lg:text-2xl">{step.title}</h3>
                                <p className="text-base lg:text-lg">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* --- SUBSCRIPTION PLANS SECTION --- */}
            <section className="bg-linear-to-b from-primary/10 to-transparent">
                <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-8 md:space-y-10 lg:space-y-12 relative">
                    <SectionHeader title="Plan your holidays efficiently" subtitle="Subscription Plans">
                        <p className="mt-4 lg:mt-5 text-muted-foreground">
                            All subscriptions include three 30-day holiday kits per year. You can <br className="hidden sm:block" /> extend
                            to 60 days with prorated rates.
                        </p>
                    </SectionHeader>
                    <PlansGrid plans={data.items} />
                </div>
            </section>
            {/* --- COMPARISON SECTION --- */}
            <section className="container mx-auto px-6 py-16 md:py-20 lg:py-24 flex flex-col lg:flex-row lg:justify-between gap-8 md:gap-10 lg:gap-12">
                <SectionHeader
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    title={
                        <>
                            Subscription vs <br className="hidden lg:block" /> One-Time Rental
                        </>
                    }
                    subtitle="Comparison"
                    className="lg:items-start lg:text-left"
                />
                <div className="overflow-hidden rounded-2xl border shadow-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="px-4 py-3 font-semibold text-sm uppercase">Feature</th>
                                <th className="px-4 py-3 font-semibold text-sm uppercase">Subscription</th>
                                <th className="px-4 py-3 font-semibold text-sm uppercase">One-Time Rental</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(() => {
                                const { holidaysPerYear, kitDiscount, addOnDiscount } = getRangesOrValues(data.items, [
                                    "holidaysPerYear",
                                    "kitDiscount",
                                    "addOnDiscount",
                                ]);

                                return [
                                    {
                                        feature: "Kits Per Year",
                                        sub: Array.isArray(holidaysPerYear) ? `Up to ${holidaysPerYear[1]}` : holidaysPerYear,
                                        one: "1",
                                    },
                                    {
                                        feature: "Savings",
                                        sub: Array.isArray(kitDiscount) ? `${kitDiscount[0]}-${kitDiscount[1]}%` : `${kitDiscount}%`,
                                        one: "—",
                                    },
                                    {
                                        feature: "Add-On Discount",
                                        sub: Array.isArray(addOnDiscount)
                                            ? `${addOnDiscount[0]}-${addOnDiscount[1]}%`
                                            : `${addOnDiscount}%`,
                                        one: "—",
                                    },
                                    { feature: "Pause / Skip", sub: true, one: false },
                                    { feature: "Refundable Deposit", sub: true, one: true },
                                    { feature: "Availability Priority", sub: true, one: false },
                                    { feature: "Early Access To New Holidays", sub: true, one: false },
                                ];
                            })().map((row, i) => (
                                <tr key={i} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                                    <td className="px-4 py-3">
                                        {typeof row.sub === "boolean" ? (
                                            <HugeiconsIcon size={20} icon={CheckmarkCircle03Icon} className="text-green-500" />
                                        ) : (
                                            row.sub
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {typeof row.one === "boolean" ? (
                                            row.one ? (
                                                <HugeiconsIcon size={20} icon={CheckmarkCircle03Icon} className="text-green-500" />
                                            ) : (
                                                "—"
                                            )
                                        ) : (
                                            row.one
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

function getRangesOrValues<K extends keyof ApiPlan>(
    plans: ApiPlan[],
    keys: K[],
): {
    [P in K]: ApiPlan[P] | [ApiPlan[P], ApiPlan[P]];
} {
    const result = {} as {
        [P in K]: ApiPlan[P] | [ApiPlan[P], ApiPlan[P]];
    };

    for (const key of keys) {
        const values = plans.map((plan) => plan[key]);

        const uniqueValues = [...new Set(values)];

        if (uniqueValues.length === 1) {
            result[key] = uniqueValues[0];
            continue;
        }

        const sorted = [...uniqueValues].sort((a, b) => Number(a) - Number(b));

        result[key] = [sorted[0], sorted[sorted.length - 1]];
    }

    return result;
}
