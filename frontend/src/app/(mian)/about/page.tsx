import SectionHeader from "@/components/main/section-header";
import { Button } from "@/components/ui/button";
import { HeartAddIcon, Leaf01Icon, SparklesIcon, StarsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const values = [
    {
        icon: SparklesIcon,
        title: "Curated Excellence",
        description:
            "Every kit is hand-selected by designers who understand the magic of a well-decorated space. We source premium pieces so your celebrations feel extraordinary.",
    },
    {
        icon: Leaf01Icon,
        title: "Sustainable By Design",
        description:
            "Renting means less waste. Our circular model keeps décor in use, out of landfills, and in the hands of people who love to celebrate beautifully.",
    },
    {
        icon: HeartAddIcon,
        title: "Joy Without Clutter",
        description:
            "We believe special moments shouldn’t require a storage unit. Enjoy stunning decorations and return them when the party’s over — no strings, no boxes in the attic.",
    },
    {
        icon: StarsIcon,
        title: "Community First",
        description:
            "CeleBrease is built for hosts, families, and creators. We listen to our community and evolve our collections to match the celebrations that matter most.",
    },
];

const stats = [
    { value: "10K+", label: "Kits Delivered" },
    { value: "98%", label: "Happy Customers" },
    { value: "50+", label: "Celebration Themes" },
    { value: "3", label: "Subscription Plans" },
];

export default function AboutPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-16 md:space-y-20 lg:space-y-24 relative">
                {/* Hero */}
                <SectionHeader title="We Make Celebrations Effortless" subtitle="About Us" />

                {/* Story */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl lg:text-3xl font-semibold font-heading">Our Story</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            CeleBrease was born from a simple frustration: buying beautiful holiday decorations, using them once, and then
                            watching them gather dust in closets and attics. We asked ourselves — what if celebrating could be stunning,
                            simple, and sustainable all at once?
                        </p>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            Founded in 2025, we set out to build a service that delivers curated décor kits for every occasion. From Diwali
                            to Christmas, birthdays to baby showers, our mission is to help you create unforgettable moments without the
                            clutter, cost, or environmental guilt of buying décor you’ll rarely reuse.
                        </p>
                        <Button variant="black" nativeButton={false} render={<Link href="/subscription">Explore Plans</Link>} />
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="text-center space-y-4 p-10">
                                <div className="text-6xl lg:text-7xl font-bold font-heading bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                                    CB
                                </div>
                                <p className="text-lg lg:text-xl font-medium">Celebrate beautifully.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 border rounded-2xl text-center hover:scale-105 transition-all duration-300">
                            <div className="text-3xl lg:text-4xl font-bold font-heading bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                                {stat.value}
                            </div>
                            <p className="mt-2 text-sm lg:text-base text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Values */}
                <div className="space-y-10">
                    <SectionHeader title="What Drives Us" subtitle="Our Values" />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="p-6 border rounded-2xl flex flex-col items-center text-center gap-5 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="size-14 bg-linear-to-r from-primary to-secondary text-white rounded-xl flex justify-center items-center">
                                    <HugeiconsIcon icon={value.icon} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{value.title}</h3>
                                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
