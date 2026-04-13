"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { events } from "@/data";
import { ArrowRight02Icon, Heart, Plus, Share03Icon, Tick } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

const kitItems = [
    { id: 1, emoji: "🧦", name: "Velvet Stockings (4)", sub: "Luxury fabric", bg: "bg-purple-900" },
    { id: 2, emoji: "🌿", name: "Garland (2)", sub: "Manila — flammable", bg: "bg-green-900" },
    { id: 3, emoji: "🎄", name: "Felt Ornament Kit", sub: "Cedar decorative set", bg: "bg-slate-700" },
    { id: 4, emoji: "🌲", name: "Tree Skirt", sub: "Arctic platin", bg: "bg-emerald-900" },
    { id: 5, emoji: "🏃", name: "Table Runner", sub: "Christmas styling", bg: "bg-amber-900" },
    { id: 6, emoji: "🕯️", name: "LED Candles", sub: "Flameless electric", bg: "bg-indigo-900" },
];

const addons = [
    { id: "tree", name: "6-foot Pre-lit Tree", sub: "Warm LED lights, easy setup", price: 45, strike: true },
    { id: "lights", name: "Extra Lights", sub: "Premium quality add-on", price: 25, strike: false },
    { id: "runner", name: "Table Runner Set", sub: "Premium quality add-on", price: 30, strike: false },
    { id: "wreath", name: "Wreath Collection", sub: "Premium quality add-on", price: 35, strike: false },
];

const similar = [
    {
        emoji: "🎊",
        tag: "Traditional",
        name: "New Year's",
        desc: "Ring in the new year with festive decorations and elegant touches.",
        tiers: [
            ["Basic (DIY Setup)", "$30–35"],
            ["Standard (Full Setup)", "$40–45"],
            ["Premium (Curated)", "$60–80"],
        ],
        days: "Duration",
        bg: "bg-emerald-800",
    },
    {
        emoji: "🕌",
        tag: "Cultural",
        name: "Ramadan",
        desc: "Foster a calm and lovely solace for reflection and celebration.",
        tiers: [
            ["Basic (DIY Setup)", "$30–35"],
            ["Standard (Full Setup)", "$40–45"],
            ["Premium (Curated)", "$50–60"],
        ],
        days: "30 Days",
        bg: "bg-amber-800",
    },
    {
        emoji: "🪔",
        tag: "Cultural",
        name: "Diwali",
        desc: "Illuminate your space with traditional diyas and vibrant decorations.",
        tiers: [
            ["Basic (DIY Setup)", "$30–35"],
            ["Standard (Full Setup)", "$40–45"],
            ["Premium (Curated)", "$50–60"],
        ],
        days: "7–14 Days",
        bg: "bg-orange-900",
    },
];

export default function CatalogDetailPage() {
    const [kit, setKit] = useState("premium");
    const [rentalWindow, setRentalWindow] = useState("standard");
    const [selectedAddons, setSelectedAddons] = useState(new Set(["tree"]));

    const kitPrice = kit === "premium" ? 89 : 59;
    const extendedFee = rentalWindow === "extended" ? 10 : 12;
    const deposit = 50;
    const addonTotal = [...selectedAddons].reduce((sum, id) => {
        const a = addons.find((x) => x.id === id);
        return sum + (a ? a.price : 0);
    }, 0);
    const total = kitPrice + extendedFee + deposit + addonTotal;

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <>
            <section className="container mx-auto mt-20 px-6 py-8 md:py-10 lg:py-12">
                <div className="flex items-center justify-between">
                    {/* Breadcrumb */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    {/* Top bar */}
                    <div className="flex gap-5">
                        <button className="flex items-center gap-2">
                            <HugeiconsIcon size={20} icon={Share03Icon} />
                            <span className="underline">Share</span>
                        </button>
                        <button className="flex items-center gap-2">
                            <HugeiconsIcon size={20} icon={Heart} />
                            <span className="underline">Save</span>
                        </button>
                    </div>
                </div>
                {/* Gallery */}
                <div className="mt-6 grid grid-cols-4 grid-rows-2 gap-1 h-72 md:h-112 rounded-2xl overflow-hidden">
                    {events.slice(0, 5).map((event) => (
                        <img key={event.id} src={event.image} alt={event.title} className="first:col-span-2 first:row-span-2 bg-muted" />
                    ))}
                </div>
                {/* Main Content */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                    {/* Left Column */}
                    <div>
                        {/* Tag + Title */}
                        <div className="w-max bg-primary/10 text-primary border border-primary/30 rounded-full px-4 py-1.5">
                            Traditional
                        </div>
                        <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold">Christmas Décor Kit</h3>
                        <p className="mt-1">Celebrate with candled décor — beautifully delivered.</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-amber-400 tracking-widest">★★★★★</span>
                            <span className="text-stone-400">4.5 (52 Reviews)</span>
                        </div>

                        {/* Choose Kit */}
                        <div className="mt-6">
                            <p className="text-sm font-medium uppercase mb-2">Choose your kit</p>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Basic */}
                                <button
                                    onClick={() => setKit("basic")}
                                    className={`relative text-left rounded-2xl border p-4 space-y-2 transition-all ${
                                        kit === "basic"
                                            ? "bg-linear-to-r from-primary/10 to-secondary/10 border-primary"
                                            : "bg-transparent hover:bg-linear-to-r hover:from-primary/10 hover:to-secondary/10"
                                    }`}
                                >
                                    <p className="font-semibold">Basic Kit</p>
                                    <p className="text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-semibold">
                                        $59
                                    </p>
                                    <p className="text-sm text-muted-foreground">Best for minimal setups</p>
                                    <p className="text-xs text-muted-foreground">Includes 8 core décor pieces</p>
                                </button>

                                {/* Premium */}
                                <button
                                    onClick={() => setKit("premium")}
                                    className={`relative text-left rounded-2xl border p-4 space-y-2 transition-all ${
                                        kit === "premium"
                                            ? "bg-linear-to-r from-primary/10 to-secondary/10 border-primary"
                                            : "bg-transparent hover:bg-linear-to-r hover:from-primary/10 hover:to-secondary/10"
                                    }`}
                                >
                                    <div className="absolute top-4 right-4 px-4 py-0.5 bg-linear-to-r from-primary to-secondary rounded-full w-fit">
                                        <span className="text-sm text-white font-medium uppercase">Most Popular</span>
                                    </div>
                                    <p className="font-semibold">Premium Kit</p>
                                    <p className="text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-semibold">
                                        $89
                                    </p>
                                    <p className="text-sm text-muted-foreground">Full décor experience</p>
                                    <p className="text-xs text-muted-foreground">Includes 20+ premium classics</p>
                                </button>
                            </div>
                        </div>

                        {/* Rental Window */}
                        <div className="mt-6">
                            <p className="text-sm font-medium uppercase mb-2">Rental window</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setRentalWindow("standard")}
                                    className={`relative rounded-2xl border p-4 space-y-1 transition-all ${
                                        kit === "standard" ? "bg-primary/10 border-primary" : "bg-transparent hover:bg-primary/10"
                                    }`}
                                >
                                    <p className="font-medium">Standard</p> <p className="text-sm">30 Days</p>
                                </button>
                                <button
                                    onClick={() => setRentalWindow("extended")}
                                    className={`relative rounded-2xl border p-4 space-y-1 transition-all ${
                                        rentalWindow === "extended" ? "bg-primary/10 border-primary" : "bg-transparent hover:bg-primary/10"
                                    }`}
                                >
                                    <p className="font-medium">Extended</p> <p className="text-sm">60 Days (+$10)</p>
                                </button>
                            </div>
                        </div>

                        {/* Select Dates */}
                        <div className="mt-6">
                            <p className="text-sm font-medium uppercase mb-2">Select your dates</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Input type="date" />
                                <Input type="date" />
                            </div>
                            <p className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
                                <HugeiconsIcon size={16} icon={Tick} />
                                Available for your selected dates
                            </p>
                        </div>

                        <Separator className="mt-6" />

                        {/* Add-ons */}
                        <div className="mt-6">
                            <p className="text-sm font-medium uppercase mb-2">Add-Ons</p>
                            <div className="grid grid-cols-2 gap-4">
                                {addons.map((addon) => {
                                    const active = selectedAddons.has(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={`relative text-left rounded-2xl border p-4 transition-all ${
                                                active
                                                    ? "border-emerald-300 bg-emerald-50"
                                                    : "border-border bg-background hover:bg-muted/40"
                                            }`}
                                        >
                                            <div className="absolute top-4 right-4 p-1.5 bg-muted rounded-full">
                                                <HugeiconsIcon size={20} icon={Plus} />
                                            </div>
                                            <p className="font-medium text-foreground">{addon.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{addon.sub}</p>
                                            <p className="mt-3 text-lg text-emerald-600 font-semibold">$59</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* Right Column — Order Card */}
                    <div className="lg:sticky lg:top-6">
                        <div className="bg-white rounded-2xl border p-4 shadow-lg grid gap-3">
                            <p className="text-xl lg:text-2xl font-semibold">What&apos;s Inside Your Kit</p>
                            {kitItems.map((item) => (
                                <div key={item.id} className="p-2 rounded-md border flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center text-lg shrink-0`}>
                                        {item.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <p className="text-sm font-semibold truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                                    </div>
                                    <span className="text-muted-foreground">↗</span>
                                </div>
                            ))}
                            <p className="text-sm text-muted-foreground">Items may vary slightly based on availability and season</p>
                            <Separator />
                            {/* Price Breakdown */}
                            <div className="bg-muted rounded-md border p-3 space-y-1">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Rental Fee</span>
                                    <span>${kitPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Extended Fee</span>
                                    <span>${extendedFee}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Deposit (Refundable)</span>
                                    <span>${deposit}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Add-ons</span>
                                    <span>${addonTotal}</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>

                            <Button variant="black">🛒 Purchase Now</Button>
                            <Button variant="outline">+ Add to Cart</Button>
                        </div>
                    </div>
                </div>
            </section>
            {/* You Might Also Like */}
            <section className="container mx-auto px-6 py-8 md:py-10 lg:py-12">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold">You Might Also Like</h3>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {events.slice(0, 4).map((event) => (
                        <div key={event.title} className="group border rounded-2xl overflow-hidden flex flex-col">
                            <div className="relative">
                                <img src={event.image} className="h-64 w-full object-cover" alt={event.title} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                                <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full text-sm font-medium">
                                    {"Traditional"}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl lg:text-2xl font-semibold">{event.title}</h3>
                                    <p className="text-base lg:text-lg text-muted-foreground">{event.description}</p>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Basic</p>
                                        <p className="text-base lg:text-lg font-semibold">${event.price.basic}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Premium</p>
                                        <p className="text-base lg:text-lg font-semibold">${event.price.premium}</p>
                                    </div>
                                </div>

                                <Button
                                    render={
                                        <Link href={`/catalog/details`}>
                                            View Kits
                                            <HugeiconsIcon icon={ArrowRight02Icon} />
                                        </Link>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
