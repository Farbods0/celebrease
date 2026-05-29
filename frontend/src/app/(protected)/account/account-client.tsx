"use client";

import ActiveRentals from "@/components/account/active-rentals";
import AddressCard from "@/components/account/address-card";
import PaymentCard from "@/components/account/payment-card";
import RecentRentals from "@/components/account/recent-rentals";
import SubscriptionCard from "@/components/account/subscription-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getInitials(name?: string | null) {
    if (!name) return "?";
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "?";
}

export default function AccountClient() {
    const { data: session } = auth.useSession();
    const router = useRouter();
    const user = session?.user;
    const displayName = user?.name ?? "there";
    const firstName = displayName.split(" ")[0] ?? displayName;
    const initials = getInitials(user?.name);

    const handleSignOut = async () => {
        await auth.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signed out");
                    router.push("/");
                },
            },
        });
    };

    return (
        <main className="mt-20 bg-muted min-h-screen">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-4 md:gap-5">
                    <div
                        className="flex size-16 md:size-18 items-center justify-center rounded-full text-xl md:text-2xl font-extrabold text-white tracking-tight"
                        style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                        aria-hidden
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold truncate">
                            Welcome back, {firstName}!
                        </h1>
                        <p className="text-sm text-muted-foreground truncate">
                            {user?.email ?? ""}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="ml-auto rounded-full border-border/70 px-5 h-9 text-muted-foreground hover:text-foreground"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="rentals" className="space-y-6">
                    <TabsList variant="line" className="w-full justify-start gap-1 border-b border-border/60 rounded-none pb-0">
                        <TabsTrigger value="rentals" className="px-4 py-2 data-active:text-primary">
                            <span className="mr-1.5">📦</span> My Rentals
                        </TabsTrigger>
                        <TabsTrigger value="subscription" className="px-4 py-2 data-active:text-primary">
                            <span className="mr-1.5">🌟</span> Subscription
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="px-4 py-2 data-active:text-primary">
                            <span className="mr-1.5">🏠</span> Addresses
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="px-4 py-2 data-active:text-primary">
                            <span className="mr-1.5">⚙️</span> Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rentals" className="flex-1 space-y-6">
                        <ActiveRentals />
                        <RecentRentals />
                    </TabsContent>

                    <TabsContent value="subscription" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubscriptionCard />
                        </div>
                    </TabsContent>

                    <TabsContent value="addresses" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AddressCard />
                            <PaymentCard />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <SettingsPanel name={user?.name ?? ""} email={user?.email ?? ""} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

function SettingsPanel({ name, email }: { name: string; email: string }) {
    const handleChangePassword = () => {
        toast.info("We've sent a password reset link to your email.");
    };
    const handleDelete = () => {
        toast.warning("Please contact support to delete your account.");
    };

    return (
        <div className="bg-white rounded-2xl border border-border/60 p-5 md:p-6 max-w-2xl">
            <h2 className="text-lg lg:text-xl font-semibold mb-1">Account Settings</h2>
            <p className="text-sm text-muted-foreground mb-6">
                Manage your account info and notification preferences.
            </p>

            <div className="space-y-4">
                <EditableField label="Full Name" initialValue={name} placeholder="John Doe" />
                <EditableField label="Email" initialValue={email} placeholder="you@email.com" type="email" />
            </div>

            <hr className="my-6 border-border/60" />

            <h3 className="text-sm font-bold text-foreground mb-3">Notifications</h3>
            <div className="space-y-2.5">
                {[
                    { id: "kits", label: "Email me about new holiday kits", checked: true },
                    { id: "returns", label: "Send return reminders", checked: true },
                    { id: "promo", label: "Promotional offers and discounts", checked: false },
                    { id: "renewal", label: "Subscription renewal reminders", checked: true },
                ].map((pref) => (
                    <label key={pref.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox id={`notif-${pref.id}`} defaultChecked={pref.checked} />
                        <span className="text-sm text-foreground/90">{pref.label}</span>
                    </label>
                ))}
            </div>

            <hr className="my-6 border-border/60" />

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    className="rounded-full border-border/70 h-10 px-5"
                    onClick={handleChangePassword}
                >
                    Change Password
                </Button>
                <Button
                    variant="outline"
                    className="rounded-full h-10 px-5 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    onClick={handleDelete}
                >
                    Delete Account
                </Button>
            </div>
        </div>
    );
}

function EditableField({
    label,
    initialValue,
    placeholder,
    type = "text",
}: {
    label: string;
    initialValue: string;
    placeholder?: string;
    type?: "text" | "email";
}) {
    const [value, setValue] = useState(initialValue);
    const [savedValue, setSavedValue] = useState(initialValue);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(initialValue);
        setSavedValue(initialValue);
    }, [initialValue]);

    const dirty = value !== savedValue;

    const handleSave = () => {
        if (!dirty || saving) return;
        // Optimistic UI — no backend endpoint yet
        setSaving(true);
        setTimeout(() => {
            setSavedValue(value);
            setSaving(false);
            toast.success("Profile updated");
        }, 200);
    };

    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                {label}
            </p>
            <div className="flex items-center gap-2">
                <Input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="black"
                    size="sm"
                    onClick={handleSave}
                    disabled={!dirty || saving}
                    className="shrink-0"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
