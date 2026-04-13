import PageHeader from "@/components/main/page-header";
import SectionHeader from "@/components/main/section-header";
import { ArrowRight02Icon, CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function SubscriptionPage() {
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
                    <SectionHeader title="Plan your holidays efficiently" subtitle="Subscription Plans">
                        <p className="mt-4 lg:mt-5 text-muted-foreground">
                            All subscriptions include three 30-day holiday kits per year. You can <br className="hidden sm:block" /> extend
                            to 60 days with prorated rates.
                        </p>
                        <div className="mt-5 lg:mt-6 flex items-center gap-6">
                            <div className="p-1.5 lg:p-2 bg-muted w-fit rounded-full flex">
                                {["Monthly", "Yearly"].map((item) => (
                                    <div
                                        key={item}
                                        className={`px-6 py-1.5 lg:px-7 lg:py-2 rounded-full whitespace-nowrap ${item === "Monthly" ? "bg-white shadow-lg" : ""}`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-1.5 bg-white shadow-lg rounded-full w-fit">
                                <span className="font-semibold">Save 10%</span>
                            </div>
                        </div>
                    </SectionHeader>
                    <div className="grid lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Starter",
                                price: 41,
                                billed: "$466/year",
                                deposit: 50,
                                features: [
                                    "3 holidays per year",
                                    "Curated Starter Kits",
                                    "Free returns & shipping",
                                    "10% off add-ons",
                                    "Pause or skip anytime",
                                ],
                                highlight: false,
                            },
                            {
                                name: "Premium",
                                price: 72,
                                billed: "$864/year",
                                deposit: 100,
                                features: [
                                    "3 holidays per year",
                                    "Premium Décor Kits",
                                    "Free returns & shipping",
                                    "20% off add-ons",
                                    "Priority support",
                                    "Early access to new holidays",
                                ],
                                highlight: true,
                            },
                            {
                                name: "Ultimate",
                                price: 99,
                                billed: "$1100/year",
                                deposit: 100,
                                features: [
                                    "3 holidays per year",
                                    "Luxury Collection Kits",
                                    "Free returns & shipping",
                                    "25% off add-ons",
                                    "Priority delivery dates",
                                    "Exclusive limited editions",
                                    "Concierge support",
                                ],
                                highlight: false,
                            },
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className={cn(
                                    "p-1 h-max rounded-2xl shadow-lg",
                                    plan.highlight ? "bg-linear-to-r from-primary to-secondary" : "bg-white",
                                )}
                            >
                                <div className="p-6 bg-white flex flex-col gap-6 rounded-xl">
                                    <div>
                                        <div className="mb-2 flex justify-between items-center">
                                            <h3 className="text-base lg:text-lg font-medium">{plan.name}</h3>
                                            {plan.highlight && (
                                                <div className="px-4 py-0.5 bg-linear-to-r from-primary to-secondary rounded-full w-fit">
                                                    <span className="text-sm text-white font-medium uppercase">Most Popular</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl lg:text-5xl font-semibold">${plan.price}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <p className="text-sm text-green-600">Billed {plan.billed}</p>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <p className="text-sm text-muted-foreground font-semibold uppercase">What&apos;s Included:</p>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-3">
                                                    <HugeiconsIcon icon={CheckmarkCircle03Icon} className="text-green-500" />
                                                    <p className="text-base lg:text-lg">{feature}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <p>${plan.deposit} refundable deposit per kit</p>
                                    </div>

                                    <Button variant="black">
                                        Get Started
                                        <HugeiconsIcon icon={ArrowRight02Icon} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
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
                            {[
                                { feature: "Kits Per Year", sub: "3", one: "1" },
                                { feature: "Savings", sub: "Up to 20%", one: "—" },
                                { feature: "Add-On Discount", sub: "10-25%", one: "—" },
                                { feature: "Pause / Skip", sub: true, one: false },
                                { feature: "Refundable Deposit", sub: true, one: true },
                                { feature: "Availability Priority", sub: true, one: false },
                                { feature: "Early Access To New Holidays", sub: true, one: false },
                            ].map((row, i) => (
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
