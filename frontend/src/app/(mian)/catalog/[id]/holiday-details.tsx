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
import { ApiHoliday, baseURL, HolidayCategory, KitTier } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useLovesStore } from "@/lib/loves-store";
import { cn } from "@/lib/utils";
import { Heart, Plus, Tick } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categoryLabel: Record<HolidayCategory, string> = {
    TRADITIONAL: "Traditional",
    CULTURAL: "Cultural",
    EVENT_BASED: "Event Based",
};

const tierLabel: Record<KitTier, string> = {
    STARTER: "Starter Kit",
    PREMIUM: "Premium Kit",
    ULTIMATE: "Ultimate Kit",
};

const tierTagline: Record<KitTier, string> = {
    STARTER: "Best for minimal setups",
    PREMIUM: "Full décor experience",
    ULTIMATE: "The complete celebration",
};

export function HolidayDetails({ holiday }: { holiday: ApiHoliday }) {
    const [selectedKitId, setSelectedKitId] = useState<string | null>(holiday.kits[0]?.id ?? null);
    const [rentalWindow, setRentalWindow] = useState<"standard" | "extended">("standard");
    const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

    const { data: session } = auth.useSession();
    const router = useRouter();
    const loved = useLovesStore((s) => s.loved.has(holiday.id));
    const toggleLove = useLovesStore((s) => s.toggle);

    const onToggleLove = () => {
        if (!session?.user) {
            router.push("/signin");
            return;
        }
        toggleLove(holiday.id);
    };

    const selectedKit = holiday.kits.find((k) => k.id === selectedKitId) ?? null;

    const price30 = selectedKit ? Number(selectedKit.price30Day) : 0;
    const price60 = selectedKit ? Number(selectedKit.price60Day) : 0;
    const deposit = selectedKit ? Number(selectedKit.deposit) : 0;
    const extendedDelta = Math.max(0, price60 - price30);

    const kitPrice = price30;
    const extendedFee = rentalWindow === "extended" ? extendedDelta : 0;

    const addonTotal = [...selectedAddons].reduce((sum, id) => {
        const a = holiday.addOns.find((x) => x.addOn.id === id);
        return sum + (a ? Number(a.addOn.price) : 0);
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
                            <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{holiday.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* Top bar */}
                <button
                    type="button"
                    onClick={onToggleLove}
                    aria-pressed={loved}
                    className={cn("hidden sm:flex items-center gap-2", loved && "text-rose-500")}
                >
                    <HugeiconsIcon size={20} icon={Heart} fill={loved ? "currentColor" : "none"} />
                    <span className="underline">{loved ? "Saved" : "Save"}</span>
                </button>
            </div>
            {/* Gallery */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-1 h-auto md:h-112 rounded-2xl overflow-hidden">
                {[holiday.image, holiday.image, holiday.image, holiday.image, holiday.image].map((image, index) => (
                    <img
                        key={index}
                        src={`${baseURL}${image}`}
                        alt={holiday.name}
                        crossOrigin="anonymous"
                        className={cn(
                            "w-full h-48 md:h-full object-cover bg-muted",
                            index === 0 ? "col-span-2 row-span-1 md:row-span-2" : "",
                        )}
                    />
                ))}
            </div>
            {/* Main Content */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                {/* Left Column */}
                <div>
                    {/* Tag + Title */}
                    <div className="flex justify-between items-center">
                        <div className="w-max bg-primary/10 text-primary border border-primary/30 rounded-full px-4 py-1.5">
                            {categoryLabel[holiday.category]}
                        </div>
                        <button
                            type="button"
                            onClick={onToggleLove}
                            aria-pressed={loved}
                            className={cn("flex sm:hidden items-center gap-2", loved && "text-rose-500")}
                        >
                            <HugeiconsIcon size={20} icon={Heart} fill={loved ? "currentColor" : "none"} />
                            <span className="underline">{loved ? "Saved" : "Save"}</span>
                        </button>
                    </div>

                    <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold">{holiday.name}</h3>
                    {holiday.description ? <p className="mt-1">{holiday.description}</p> : null}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-amber-400 tracking-widest">★★★★★</span>
                        <span className="text-stone-400">4.5 (52 Reviews)</span>
                    </div>

                    {/* Choose Kit */}
                    {holiday.kits.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-medium uppercase mb-2">Choose your kit</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {holiday.kits.map((k) => {
                                    const active = selectedKitId === k.id;
                                    const isPopular = k.tier === "PREMIUM";
                                    const itemCount = k.items.reduce((sum, i) => sum + i.qty, 0);
                                    return (
                                        <button
                                            key={k.id}
                                            onClick={() => setSelectedKitId(k.id)}
                                            className={`relative text-left rounded-2xl border p-4 space-y-2 transition-all ${
                                                active
                                                    ? "bg-linear-to-r from-primary/10 to-secondary/10 border-primary"
                                                    : "bg-transparent hover:bg-linear-to-r hover:from-primary/10 hover:to-secondary/10"
                                            }`}
                                        >
                                            {isPopular && (
                                                <div className="absolute top-4 right-4 px-4 py-0.5 bg-linear-to-r from-primary to-secondary rounded-full w-fit">
                                                    <span className="text-sm text-white font-medium uppercase">Most Popular</span>
                                                </div>
                                            )}
                                            <p className="font-semibold">{tierLabel[k.tier]}</p>
                                            <p className="text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-semibold">
                                                ${Number(k.price30Day)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{tierTagline[k.tier]}</p>
                                            <p className="text-xs text-muted-foreground">Includes {itemCount} décor pieces</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rental Window */}
                    <div className="mt-6">
                        <p className="text-sm font-medium uppercase mb-2">Rental window</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setRentalWindow("standard")}
                                className={`relative rounded-2xl border p-4 space-y-1 transition-all ${
                                    rentalWindow === "standard" ? "bg-primary/10 border-primary" : "bg-transparent hover:bg-primary/10"
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
                                <p className="font-medium">Extended</p>{" "}
                                <p className="text-sm">60 Days {extendedDelta > 0 ? `(+$${extendedDelta})` : ""}</p>
                            </button>
                        </div>
                    </div>

                    {/* Select Dates */}
                    <div className="mt-6">
                        <p className="text-sm font-medium uppercase mb-2">Select your dates</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input type="date" />
                            <Input type="date" disabled />
                        </div>
                        <p className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
                            <HugeiconsIcon size={16} icon={Tick} />
                            Available for your selected dates
                        </p>
                    </div>

                    {/* Add-ons */}
                    {holiday.addOns.length > 0 && (
                        <>
                            <Separator className="mt-6" />
                            <div className="mt-6">
                                <p className="text-sm font-medium uppercase mb-2">Add-Ons</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {holiday.addOns.map(({ addOn }) => {
                                        const active = selectedAddons.has(addOn.id);
                                        return (
                                            <button
                                                key={addOn.id}
                                                onClick={() => toggleAddon(addOn.id)}
                                                className={`relative text-left rounded-2xl border p-4 transition-all ${
                                                    active
                                                        ? "border-emerald-300 bg-emerald-50"
                                                        : "border-border bg-background hover:bg-muted/40"
                                                }`}
                                            >
                                                <div
                                                    className={`absolute top-4 right-4 p-1.5 rounded-full ${
                                                        active ? "bg-emerald-500 text-white" : "bg-muted"
                                                    }`}
                                                >
                                                    <HugeiconsIcon size={20} icon={active ? Tick : Plus} />
                                                </div>
                                                <p className="font-medium text-foreground pr-10">{addOn.name}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">{addOn.sku}</p>
                                                <p className="mt-3 text-lg text-emerald-600 font-semibold">${Number(addOn.price)}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {/* Right Column — Order Card */}
                <div className="lg:sticky lg:top-6">
                    <div className="bg-white rounded-2xl border p-4 shadow-lg space-y-4">
                        <div className="space-y-3">
                            <p className="text-xl lg:text-2xl font-semibold">What&apos;s Inside Your Kit</p>
                            {selectedKit && selectedKit.items.length > 0 ? (
                                selectedKit.items.map(({ qty, item }) => (
                                    <div key={item.id} className="p-2 rounded-md border flex items-center gap-3">
                                        <img
                                            src={`${baseURL}${item.image}`}
                                            alt={item.name}
                                            crossOrigin="anonymous"
                                            className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <p className="text-sm font-semibold truncate">
                                                {item.name} ({qty})
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">{item.category}</p>
                                        </div>
                                        <span className="text-muted-foreground">↗</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Select a kit to see what&apos;s included.</p>
                            )}
                            <p className="text-sm text-muted-foreground">Items may vary slightly based on availability and season</p>
                        </div>
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

                        <div className="grid gap-2">
                            <Button variant="black" render={<Link href="/checkout">🛒 Purchase Now</Link>} />
                            <Button variant="outline" render={<Link href="/cart">+ Add to Cart</Link>} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
