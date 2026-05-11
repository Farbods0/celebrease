import { GiftCard } from "@/components/icons";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section
            style={{
                position: "relative",
                backgroundImage: `url('gradient/footer.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
            }}
        >
            <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
                <div className="flex flex-col items-center gap-6 lg:flex-row xl:gap-12 ">
                    <GiftCard />
                    <div className="text-center lg:text-left space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold font-heading whitespace-nowrap">Join the Celebration Club</h2>
                        <p className="text-white/60">
                            Be the first to discover new holidays, decor kits, and
                            <br className="hidden lg:block" /> subscriber rewards.
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-14 pl-6 pr-1.75 bg-white/20 text-white/60 rounded-full flex items-center">
                        <input type="text" placeholder="Enter your email" className="flex-1 outline-none" />
                        <button className="bg-white text-black px-6 py-2.25 rounded-full font-semibold flex items-center gap-2">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-center lg:text-left">
                        <span className="text-white/60">By clicking submit, you agree to our</span>{" "}
                        <Link href="/terms" className="font-medium underline">
                            Terms of Service
                        </Link>{" "}
                        <span className="text-white/60">and</span>{" "}
                        <Link href="/privacy" className="font-medium underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
