"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircleIcon, LockPasswordIcon, Tick, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const MinusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" />
    </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m18 15-6-6-6 6" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

export default function CartPage() {
    const [christmasAddonsExpanded, setChristmasAddonsExpanded] = useState(true);
    const [newYearAddonsExpanded, setNewYearAddonsExpanded] = useState(false);

    // Checkbox states
    const [agreed1, setAgreed1] = useState(true);
    const [agreed2, setAgreed2] = useState(false);
    const [agreed3, setAgreed3] = useState(false);

    return (
        <main className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-start">
                {/* Cart Items */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">Your Cart</h3>

                    {/* Cart Item 1: Christmas Kit */}
                    <div className="border rounded-2xl p-5 flex flex-col md:flex-row gap-4 relative">
                        <Button size="icon-sm" className="absolute top-5 right-5 bg-muted text-destructive hover:bg-destructive/10">
                            <HugeiconsIcon icon={Trash} />
                        </Button>
                        <div className="size-18 rounded-lg overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=150"
                                alt="Christmas Kit"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="flex-1 pr-10">
                                <h4 className="text-lg lg:text-xl font-medium">Christmas Kit</h4>
                                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                                    <span className="text-foreground">Base: $50/month</span> &middot; Premium Kit &middot; Dec 5 &ndash; Jan
                                    5, 2026
                                </p>

                                <button
                                    onClick={() => setChristmasAddonsExpanded(!christmasAddonsExpanded)}
                                    className="text-sm text-blue-600 font-medium flex items-center gap-1.5 mt-2 hover:text-blue-700 transition-colors"
                                >
                                    3 Add-ons included
                                    {christmasAddonsExpanded ? (
                                        <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Expander Content */}
                            {christmasAddonsExpanded && (
                                <div className="mt-2 bg-[#F4F7FB] rounded-xl p-4 text-sm space-y-2">
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Tree Add-On (Refundable Deposit)</span>
                                        <span className="font-semibold">$120</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Garland (2 sets)</span>
                                        <span className="font-semibold">$24</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Table Runner & Centerpiece</span>
                                        <span className="font-semibold">$34</span>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Row */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3 bg-muted rounded-full border p-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full transition-colors bg-white border shadow-sm">
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-semibold w-6 text-center tabular-nums">01</span>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full transition-colors bg-white border shadow-sm">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-2xl font-semibold">$278</div>
                            </div>

                            {/* Alert Banner for Item 1 */}
                            <div className="mt-4 bg-[#FEF9F0] border border-[#FDE1B9] rounded-xl p-4 flex gap-3">
                                <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 text-[#D97706]" />
                                <div>
                                    <p className="text-sm text-[#A16207] leading-relaxed pr-2">
                                        <span className="font-semibold">Want to spend less?</span> Add a Basic Starter Kit for only $30-35 /
                                        30 days - includes tree, basic lights & mini ornaments.
                                    </p>
                                    <button className="mt-2.5 text-sm font-semibold text-[#D97706] flex items-center gap-1 hover:underline group">
                                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span> Switch to Basic Kit
                                        (Save $15-20)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Item 2: New Year's Eve Kit */}
                    <div className="border rounded-2xl p-5 flex flex-col md:flex-row gap-4 relative">
                        <Button size="icon-sm" className="absolute top-5 right-5 bg-muted text-destructive hover:bg-destructive/10">
                            <HugeiconsIcon icon={Trash} />
                        </Button>
                        <div className="size-18 rounded-lg overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=150"
                                alt="New Year's Eve Kit"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="flex-1 pr-10">
                                <h4 className="text-lg lg:text-xl font-medium">New Year&apos;s Eve Kit</h4>
                                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                                    Starter &middot; Dec 28 &ndash; Jan 2, 2026
                                </p>

                                <button
                                    onClick={() => setNewYearAddonsExpanded(!newYearAddonsExpanded)}
                                    className="text-sm text-blue-600 font-medium flex items-center gap-1.5 mt-2 hover:text-blue-700 transition-colors"
                                >
                                    3 Add-ons included
                                    {newYearAddonsExpanded ? (
                                        <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Expander Content */}
                            {newYearAddonsExpanded && (
                                <div className="mt-2 bg-[#F4F7FB] rounded-xl p-4 text-sm space-y-2">
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Champagne Glasses (Set of 4)</span>
                                        <span className="font-semibold">Included</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Party Hats & Noisemakers</span>
                                        <span className="font-semibold">Included</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-transparent">
                                        <span className="text-muted-foreground">Gold Fringe Backdrop</span>
                                        <span className="font-semibold">Included</span>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Row */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3 bg-muted rounded-full border p-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full transition-colors bg-white border shadow-sm">
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-semibold w-6 text-center tabular-nums">02</span>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full transition-colors bg-white border shadow-sm">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-2xl font-semibold">$340</div>
                            </div>

                            {/* Alert Banner for Item 2 */}
                            <div className="mt-4 bg-[#FEF2F8] border border-[#FAD1E8] rounded-xl p-4 flex gap-3">
                                <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 text-[#BE185D]" />
                                <div>
                                    <p className="text-sm text-[#9D174D] leading-relaxed pr-2">
                                        <span className="font-semibold">Upgrade to Standard Kit ($40-45)</span> for full ornament kit,
                                        stockings & garlands - or go Premium ($50-60) for velvet stockings & LED candles.
                                    </p>
                                    <button className="mt-2.5 text-sm font-semibold text-[#BE185D] flex items-center gap-1 hover:underline group">
                                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span> Upgrade to Standard
                                        or Premium Kit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl space-y-4">
                    <h2 className="text-xl lg:text-2xl font-semibold">Order Summary</h2>

                    {/* Summary Item 1 */}
                    <div>
                        <h4 className="font-medium">Christmas Kit</h4>
                        <p className="text-sm text-muted-foreground mt-1">Premium Kit &middot; Dec 5 &ndash; Jan 5, 2026</p>
                        <div className="mt-3 space-y-1 text-muted-foreground">
                            <div className="text-sm flex justify-between text-foreground">
                                <span>Christmas Premium Kit</span>
                                <span className="font-medium tabular-nums tracking-tight">$278.00</span>
                            </div>
                            <div className="text-xs flex justify-between">
                                <span>3 Add-ons</span>
                                <span className="font-medium tabular-nums tracking-tight">$105.00</span>
                            </div>
                            <div className="text-xs flex justify-between">
                                <span>Refundable Deposit</span>
                                <span className="font-medium tabular-nums tracking-tight">$120.00</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-dashed" />

                    {/* Summary Item 2 */}
                    <div>
                        <h4 className="font-medium">New Year&apos;s Eve Kit</h4>
                        <p className="text-sm text-muted-foreground mt-1">Dec 28 &ndash; Jan 2, 2026</p>
                        <div className="mt-3 space-y-1 text-muted-foreground">
                            <div className="text-sm flex justify-between text-foreground">
                                <span>Basic Kit</span>
                                <span className="font-medium tabular-nums tracking-tight">$138.00</span>
                            </div>
                            <div className="text-xs flex justify-between">
                                <span>3 Add-ons</span>
                                <span className="font-medium text-stone-500">Included</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-dashed" />

                    {/* Subtotals */}
                    <div className="space-y-2">
                        <div className="flex justify-between font-medium text-[#D97706]">
                            <span>Refundable Deposit</span>
                            <span className="font-medium tabular-nums tracking-tight">$120.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes (8%)</span>
                            <span className="font-medium tabular-nums tracking-tight">$33.28</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping & Handling</span>
                            <span className="font-medium tabular-nums tracking-tight">$15.00</span>
                        </div>
                    </div>

                    <hr className="border-t border-dashed" />

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-lg lg:text-xl">
                        <span>Total Due Today</span>
                        <span className="font-semibold">$449.28</span>
                    </div>

                    <div className="text-sm">
                        <p>$120.00 deposit is fully refundable after the kit return and inspection process.</p>
                        <p className="mt-2 text-muted-foreground">(Total charge: $569.28 - Refundable: $120.00)</p>
                    </div>

                    <hr className="border-t border-dashed" />

                    {/* Terms and Checkboxes */}
                    <div className="space-y-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <Checkbox checked={agreed1} onCheckedChange={() => setAgreed1(!agreed1)} className="mt-0.5" />
                            <span className="text-sm text-muted-foreground select-none group-hover:text-stone-900 transition-colors">
                                I confirm my rental dates and shipping address are correct.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <Checkbox checked={agreed2} onCheckedChange={() => setAgreed2(!agreed2)} className="mt-0.5" />
                            <span className="text-sm text-muted-foreground select-none">
                                I agree to the CeleBrease{" "}
                                <a href="#" className="underline hover:text-stone-900 transition-colors">
                                    Rental Agreement
                                </a>{" "}
                                and{" "}
                                <a href="#" className="underline hover:text-stone-900 transition-colors">
                                    Terms of Service
                                </a>
                                .
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <Checkbox checked={agreed3} onCheckedChange={() => setAgreed3(!agreed3)} className="mt-0.5" />
                            <span className="text-sm text-muted-foreground select-none">
                                I understand that a refundable deposit of $120 will be released after kit inspection.
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid">
                        <Button variant="black">Proceed to Checkout</Button>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-sm text-center text-muted-foreground">
                        <HugeiconsIcon icon={LockPasswordIcon} size={20} />
                        <span>Secure payment powered by Stripe</span>
                    </div>
                </div>

                {/* Promotional Banner */}
                <div className="bg-linear-to-br from-primary to-secondary rounded-2xl p-6 md:p-8 lg:p-10 text-white">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-white/90" />
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-heading">Want To Celebrate All Year Long?</h3>
                    </div>

                    <p className="mt-3 text-sm lg:text-base text-white/80 max-w-lg leading-relaxed">
                        Join our 3-Holiday Subscription Plan - choose three holidays per year, with free returns and exclusive pricing.
                    </p>

                    <ul className="mt-4 space-y-2 text-sm lg:text-base">
                        <li className="flex items-center gap-3">
                            <HugeiconsIcon icon={Tick} size={20} />
                            <span>Save up to 20% on each kit</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <HugeiconsIcon icon={Tick} size={20} />
                            <span>Pause, skip, or bank a holiday anytime</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <HugeiconsIcon icon={Tick} size={20} />
                            <span>Priority availability during peak seasons</span>
                        </li>
                    </ul>

                    <Button className="mt-6">
                        Explore Subscription Plans
                        <span className="font-semibold ml-1">&rarr;</span>
                    </Button>

                    <p className="mt-3 text-sm text-white/80 font-medium">
                        Perfect for families who love decorating all year, without the hassle.
                    </p>
                </div>
            </div>
        </main>
    );
}
