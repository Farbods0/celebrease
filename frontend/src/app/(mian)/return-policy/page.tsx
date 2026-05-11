import SectionHeader from "@/components/main/section-header";
import { Package01Icon, Tick02Icon, TimeQuarterPassIcon, TruckReturnIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const steps = [
    {
        icon: Package01Icon,
        title: "Repack Everything",
        description:
            "Place all décor items, accessories, and packaging materials back into the original box. Use the packing checklist included in your kit to ensure nothing is missed.",
    },
    {
        icon: TruckReturnIcon,
        title: "Attach Prepaid Label",
        description:
            "Your return shipping label is included in the box. Simply peel and stick it over the old label. No printer or extra postage needed.",
    },
    {
        icon: TimeQuarterPassIcon,
        title: "Schedule Pickup",
        description:
            "Leave the sealed box at your doorstep on the scheduled pickup date. Our courier will collect it automatically — no signature required.",
    },
    {
        icon: Tick02Icon,
        title: "Deposit Refunded",
        description:
            "Once we receive and inspect your kit (within 3–5 business days), your refundable deposit is released. Most refunds appear within 5–10 business days.",
    },
];

const conditions = [
    "All items must be returned within the agreed rental period to avoid late fees.",
    "Missing items will be charged at their individual replacement value.",
    "Damaged items are assessed on a case-by-case basis; minor wear is acceptable.",
    "Original packaging must be used for safe transit. If lost, a $5 replacement box fee applies.",
    "If your pickup is missed, reschedule from your account dashboard at no extra cost.",
];

export default function ReturnPolicyPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader title="Easy Returns, Zero Hassle" subtitle="Return Policy" />

                {/* Steps */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => (
                        <div
                            key={step.title}
                            className="p-6 border rounded-2xl flex flex-col items-center text-center gap-5 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="size-14 bg-linear-to-r from-primary to-secondary text-white rounded-xl flex justify-center items-center">
                                <HugeiconsIcon icon={step.icon} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">{step.title}</h3>
                                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conditions */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <h3 className="text-2xl lg:text-3xl font-semibold font-heading text-center">Return Conditions</h3>
                    <ul className="space-y-4">
                        {conditions.map((condition, index) => (
                            <li key={index} className="flex items-start gap-4 p-4 border rounded-xl bg-white">
                                <div className="mt-0.5 shrink-0 size-6 bg-linear-to-r from-primary to-secondary text-white rounded-full flex justify-center items-center">
                                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                                </div>
                                <p className="text-base lg:text-lg leading-relaxed">{condition}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact CTA */}
                <div className="text-center space-y-4">
                    <p className="text-base lg:text-lg text-muted-foreground">Need to reschedule a return or report a missing pickup?</p>
                    <p className="text-base lg:text-lg">
                        Reach us at{" "}
                        <a href="mailto:support@celebrease.com" className="text-primary font-medium hover:underline">
                            support@celebrease.com
                        </a>{" "}
                        or call{" "}
                        <a href="tel:+15551234567" className="text-primary font-medium hover:underline">
                            +1 (555) 123-4567
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
