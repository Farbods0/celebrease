import { DecorKit, Return, Sustainable } from "@/components/icons";
import SectionHeading from "@/components/main/section-heading";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { events } from "../data";

export default function HomePage() {
    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            {/* --- HERO SECTION --- */}
            <section></section>
            {/* --- HOW IT WORKS SECTION --- */}
            <section className="container mx-auto px-6 pt-16 md:pt-20 lg:pt-24">
                <SectionHeading title="Beautiful, & Hassle-Free Rentals" subtitle="How It Works" />

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
                            className="p-6 lg:p-8 border rounded-2xl flex flex-col gap-10 lg:gap-12 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="px-4 py-1.5 bg-linear-to-r from-primary/10 to-secondary/10 rounded-full w-fit">
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-semibold">
                                    Step {step.step}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-xl lg:text-2xl">{step.title}</h3>
                                <p className="text-base lg:text-lg">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:mt-10 lg:mt-12 px-6 lg:px-8 py-4 lg:py-6 border rounded-2xl max-w-96 mx-auto flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <span className="text-base lg:text-lg">Plans start from</span>
                        <span className="text-3xl lg:text-4xl font-semibold">$45</span>
                    </div>
                    <button className="bg-black text-white  px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                        Join Now
                        <HugeiconsIcon icon={ArrowRight02Icon} />
                    </button>
                </div>
            </section>
            {/* --- BENEFITS SECTION --- */}
            <section className="container mx-auto px-6 pt-16 md:pt-20 lg:pt-24">
                <SectionHeading title="Why Rent With Celebrease?" subtitle="Benefits" />

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Sustainable />,
                            title: "Sustainable & Reusable",
                            description: "Reduce waste and celebrate responsibly with our eco-friendly rental model.",
                        },
                        {
                            icon: <DecorKit />,
                            title: "Premium Décor Kits",
                            description: "Curated collections of high-quality decorations for every celebration.",
                        },
                        {
                            icon: <Return />,
                            title: "Hassle-Free Returns",
                            description: "Easy pickup and return service - celebrate without the cleanup.",
                        },
                    ].map((benefit) => (
                        <div
                            key={benefit.title}
                            className="p-6 lg:p-8 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl flex flex-col items-center gap-6 lg:gap-8 hover:scale-105 origin-bottom transition-all duration-300"
                        >
                            <div className="size-16 bg-linear-to-r from-primary to-secondary text-white rounded-2xl flex justify-center items-center">
                                {benefit.icon}
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="font-semibold text-xl lg:text-2xl">{benefit.title}</h3>
                                <p className="text-base lg:text-lg">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* --- CATEGORIES SECTION --- */}
            <section className="py-16 md:py-20 lg:py-24">
                <SectionHeading title="Our Loved Celebrations" subtitle="Categories" />

                <div className="flex gap-4 overflow-x-auto">
                    {events.map((event, index) => (
                        <div key={index} className="relative min-w-76 md:min-w-96 lg:min-w-116 aspect-4/5 rounded-md overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white space-y-2">
                                <h3 className="font-semibold text-xl lg:text-2xl">{event.title}</h3>
                                <p className="text-base lg:text-lg">
                                    From $45 - <span className="text-white/60">3-5 Days</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* --- REVIEWS SECTION --- */}
            <section className="pb-16 md:pb-20 lg:pb-24">
                <SectionHeading title="See How Customers Enjoying" subtitle="Reviews" />

                <div className="flex gap-4 overflow-x-auto">
                    {[
                        {
                            name: "Ashlynn .",
                            time: "3 hours ago",
                            review: "CeleBrease gave our Diwali a luxury touch. The colors, details, and effortless return process made it such a joyful experience.",
                        },
                        {
                            name: "Makenna C.",
                            time: "1 week ago",
                            review: "The unboxing experience alone was magical - everything felt festive, coordinated, and thoughtfully designed to make hosting completely stress-free.",
                        },
                        {
                            name: "Angel C.",
                            time: "5 days ago",
                            review: "CeleBrease completely transformed how we celebrate - every kit felt premium, easy to set up, and beautifully curated for our family gatherings.",
                        },
                        {
                            name: "Charlie G.",
                            time: "Yesterday",
                            review: "I loved not having to store boxes of décor! The subscription makes every season feel special without any extra work or clutter.",
                        },
                        {
                            name: "Lincoln L.",
                            time: "4 days ago",
                            review: "The quality blew me away. everything arrived spotless, organized, and ready to use. It genuinely made our holiday feel magazine-worthy!",
                        },
                        {
                            name: "Marcus Rhiel Madsen",
                            time: "2 weeks ago",
                            review: "As someone who loves decorating but hates the cleanup, CeleBrease is a dream. Stylish, sustainable, and so convenient to use!",
                        },
                        {
                            name: "Sophie Chen",
                            time: "2 days ago",
                            review: "CeleBrease completely transformed how we celebrate - every kit felt premium, easy to set up, and beautifully curated for our family gatherings.",
                        },
                    ].map((review) => (
                        <div
                            key={review.name}
                            className="p-6 min-w-70 md:min-w-78 lg:min-w-86 h-min bg-muted rounded-2xl flex flex-col gap-6 lg:gap-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                <div>
                                    <h4 className="font-medium text-base lg:text-lg">{review.name}</h4>
                                    <div className="text-sm">{review.time}</div>
                                </div>
                            </div>
                            <p className="text-base lg:text-lg">{review.review}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
