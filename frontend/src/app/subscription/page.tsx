import PageHeader from "@/components/main/page-header";
import SectionHeader from "@/components/main/section-header";

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
            <section className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-8 md:space-y-10 lg:space-y-12 relative">
                <SectionHeader title="Plan your holidays efficiently" subtitle="Subscription Plans">
                    <p className="mt-4 lg:mt-5 text-muted-foreground">
                        All subscriptions include three 30-day holiday kits per year. You can <br className="hidden sm:block" /> extend to
                        60 days with prorated rates.
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
                {/* TODO: Add subscription plans */}
            </section>
            <section className="container mx-auto px-6 py-16 md:py-20 lg:py-24 flex flex-col lg:flex-row lg:justify-between gap-8 md:gap-10 lg:gap-12">
                <SectionHeader
                    title={
                        <>
                            Subscription vs <br /> One-Time Rental
                        </>
                    }
                    subtitle="Comparison"
                    className="lg:items-start lg:text-left"
                />
                <div className="flex-1">{/* TODO: Add comparison table */}</div>
            </section>
        </>
    );
}
