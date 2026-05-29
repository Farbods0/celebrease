import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { baseURL, apiPrefix } from "@/lib/api/base";
import { settingsApi, type ApiSiteSettings } from "@/lib/api/settings";
import { auth } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Building2, Camera, KeyRound, Loader2, LogOut, ShieldCheck, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/settings")({
    component: RouteComponent,
});

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4">
                <h2 className="text-sm font-semibold">{title}</h2>
                {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function RouteComponent() {
    const router = useRouter();
    const { user } = Route.useRouteContext();

    // Profile state
    const [name, setName] = useState(user.name ?? "");
    const [phone, setPhone] = useState((user as any).phone ?? "");
    const [region, setRegion] = useState((user as any).region ?? "");
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Avatar state
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Sessions state
    const [sessionsLoading, setSessionsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }
        setAvatarLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`${baseURL}${apiPrefix}/upload/image?folder=avatars`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            const imageUrl = data.url || data.path;
            await auth.updateUser({ image: imageUrl });
            toast.success("Avatar updated");
            await router.invalidate();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to upload avatar");
        } finally {
            setAvatarLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            await auth.updateUser({ name, phone: phone || undefined, region: region || undefined });
            toast.success("Profile updated");
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update profile");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setPasswordLoading(true);
        try {
            const res = await auth.changePassword({ currentPassword, newPassword, revokeOtherSessions: false });
            if (res.error) throw new Error(res.error.message);
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleRevokeSessions = async () => {
        setSessionsLoading(true);
        try {
            await auth.revokeOtherSessions();
            toast.success("All other sessions revoked");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to revoke sessions");
        } finally {
            setSessionsLoading(false);
        }
    };

    const initials = (user.name?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase();

    const [activeTab, setActiveTab] = useState<"account" | "company">("account");

    return (
        <main className="mx-auto w-full max-w-2xl flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your account and security preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab("account")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        activeTab === "account"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <User className="size-3.5" />
                    Account
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("company")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        activeTab === "company"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Building2 className="size-3.5" />
                    Company
                </button>
            </div>

            {activeTab === "company" && <CompanySettingsTab />}
            {activeTab === "account" && (<>

            {/* Profile */}
            <Section title="Profile" description="Your public name and contact details">
                <div className="flex flex-col gap-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="size-16 ring-2 ring-primary/20">
                                <AvatarImage src={user.image ? (user.image.startsWith("http") ? user.image : `${baseURL}${user.image}`) : undefined} alt={user.name} />
                                <AvatarFallback
                                    className="text-white font-bold text-lg"
                                    style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={avatarLoading}
                                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {avatarLoading ? <Loader2 className="size-3 animate-spin" /> : <Camera className="size-3" />}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full Name">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Your full name"
                            />
                        </Field>

                        <Field label="Phone" hint="Optional">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="+1 (555) 000-0000"
                            />
                        </Field>

                        <Field label="Region" hint="Optional — e.g. US, CA, UK">
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="e.g. US"
                            />
                        </Field>

                        <Field label="Email" hint="Contact support to change your email">
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleProfileSave} disabled={profileLoading}>
                            {profileLoading ? "Saving…" : "Save profile"}
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Account info */}
            <Section title="Account" description="Read-only account details">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Role</span>
                        </div>
                        <span className="text-sm font-semibold capitalize">{(user as any).role}</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email verified</span>
                        </div>
                        <span className="text-sm font-semibold">{user.emailVerified ? "Yes" : "No"}</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <KeyRound className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Member since</span>
                        </div>
                        <span className="text-sm font-semibold">
                            {new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(user.createdAt))}
                        </span>
                    </div>
                </div>
            </Section>

            {/* Security */}
            <Section title="Security" description="Change your password">
                <div className="flex flex-col gap-4">
                    <Field label="Current Password">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Enter current password"
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="New Password" hint="Minimum 8 characters">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="New password"
                            />
                        </Field>
                        <Field label="Confirm New Password">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Confirm new password"
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handlePasswordChange}
                            disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                        >
                            {passwordLoading ? "Updating…" : "Update password"}
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Sessions */}
            <Section title="Sessions" description="Manage active login sessions across all devices">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium">Sign out all other devices</p>
                        <p className="text-xs text-muted-foreground mt-0.5">This will revoke all sessions except the current one</p>
                    </div>
                    <Button variant="outline" onClick={handleRevokeSessions} disabled={sessionsLoading}>
                        <LogOut className="size-4" />
                        {sessionsLoading ? "Revoking…" : "Revoke others"}
                    </Button>
                </div>
            </Section>
            </>)}
        </main>
    );
}

// ─── Company Settings Tab ────────────────────────────────────────

const DEFAULT_SETTINGS: ApiSiteSettings = {
    id: "singleton",
    companyName: "CeleBrease",
    supportEmail: "",
    supportPhone: "",
    websiteUrl: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    maintenanceMode: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpFromEmail: "",
    smtpFromName: "CeleBrease",
    taxRate: 0.08,
    shippingStandard: 15,
    shippingExpress: 25,
    logoUrl: "",
    heroTitle: "Celebrate Beautifully, Without The Storage.",
    heroSubtitle: "Rent professionally curated holiday decor kits, delivered to your door.",
    heroBadgeText: "New: 2026 Holiday Kits Available",
    heroCtaPrimary: "Browse Holiday Kits",
    heroCtaSecondary: "See How It Works",
    tagline: "Celebrate beautifully, without the storage.",
    announcementBanner: "",
    announcementBannerActive: false,
    updatedAt: "",
};

function CompanySettingsTab() {
    const [settings, setSettings] = useState<ApiSiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stripeMode, setStripeMode] = useState<"live" | "test" | "unknown" | null>(null);

    useEffect(() => {
        settingsApi.get()
            .then((data) => setSettings(data))
            .catch(() => toast.error("Failed to load company settings"))
            .finally(() => setLoading(false));
        settingsApi.stripeStatus()
            .then((data) => setStripeMode(data.mode))
            .catch(() => setStripeMode("unknown"));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await settingsApi.update({
                companyName: settings.companyName,
                supportEmail: settings.supportEmail,
                supportPhone: settings.supportPhone,
                websiteUrl: settings.websiteUrl,
                instagram: settings.instagram,
                facebook: settings.facebook,
                tiktok: settings.tiktok,
                maintenanceMode: settings.maintenanceMode,
                smtpHost: settings.smtpHost,
                smtpPort: settings.smtpPort,
                smtpUser: settings.smtpUser,
                smtpPass: settings.smtpPass,
                smtpFromEmail: settings.smtpFromEmail,
                smtpFromName: settings.smtpFromName,
                taxRate: settings.taxRate,
                shippingStandard: settings.shippingStandard,
                shippingExpress: settings.shippingExpress,
                logoUrl: settings.logoUrl,
                heroTitle: settings.heroTitle,
                heroSubtitle: settings.heroSubtitle,
                heroBadgeText: settings.heroBadgeText,
                heroCtaPrimary: settings.heroCtaPrimary,
                heroCtaSecondary: settings.heroCtaSecondary,
                tagline: settings.tagline,
                announcementBanner: settings.announcementBanner,
                announcementBannerActive: settings.announcementBannerActive,
            });
            setSettings(updated);
            toast.success("Company settings saved");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const update = (field: keyof Omit<ApiSiteSettings, "id" | "updatedAt">, value: string | boolean | number) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const inputClass = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <Section title="Company Information" description="Your business identity and contact details">
                <div className="flex flex-col gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl.startsWith("http") ? settings.logoUrl : `${baseURL}${settings.logoUrl}`}
                                    alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="text-xs text-muted-foreground">No logo</span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium">Company Logo</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Used in emails and the customer website header</p>
                            <label className="mt-2 inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-primary hover:underline">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const res = await fetch(`${baseURL}${apiPrefix}/upload/image?folder=logos`, {
                                                method: "POST",
                                                credentials: "include",
                                                body: formData,
                                            });
                                            if (!res.ok) throw new Error("Upload failed");
                                            const data = await res.json();
                                            update("logoUrl", data.url || data.path);
                                            toast.success("Logo uploaded — save settings to apply");
                                        } catch {
                                            toast.error("Failed to upload logo");
                                        }
                                    }}
                                />
                                Upload new logo
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Company Name">
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={(e) => update("companyName", e.target.value)}
                                className={inputClass}
                                placeholder="Company name"
                            />
                        </Field>
                        <Field label="Website URL">
                            <input
                                type="url"
                                value={settings.websiteUrl}
                                onChange={(e) => update("websiteUrl", e.target.value)}
                                className={inputClass}
                                placeholder="https://celebrease.com"
                            />
                        </Field>
                        <Field label="Support Email">
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => update("supportEmail", e.target.value)}
                                className={inputClass}
                                placeholder="support@celebrease.com"
                            />
                        </Field>
                        <Field label="Support Phone">
                            <input
                                type="tel"
                                value={settings.supportPhone}
                                onChange={(e) => update("supportPhone", e.target.value)}
                                className={inputClass}
                                placeholder="+1 (555) 000-0000"
                            />
                        </Field>
                    </div>
                </div>
            </Section>

            <Section title="Social Links" description="Connect your social media accounts">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Instagram">
                        <input
                            type="text"
                            value={settings.instagram}
                            onChange={(e) => update("instagram", e.target.value)}
                            className={inputClass}
                            placeholder="@celebrease"
                        />
                    </Field>
                    <Field label="Facebook">
                        <input
                            type="text"
                            value={settings.facebook}
                            onChange={(e) => update("facebook", e.target.value)}
                            className={inputClass}
                            placeholder="facebook.com/celebrease"
                        />
                    </Field>
                    <Field label="TikTok">
                        <input
                            type="text"
                            value={settings.tiktok}
                            onChange={(e) => update("tiktok", e.target.value)}
                            className={inputClass}
                            placeholder="@celebrease"
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Pricing & Fees" description="Tax rate and shipping fees applied at checkout">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Tax Rate" hint="e.g. 0.08 for 8%">
                        <input
                            type="number"
                            step="0.001"
                            value={settings.taxRate}
                            onChange={(e) => update("taxRate", Number(e.target.value))}
                            className={inputClass}
                            placeholder="0.08"
                        />
                    </Field>
                    <Field label="Standard Shipping ($)" hint="Flat fee">
                        <input
                            type="number"
                            step="0.01"
                            value={settings.shippingStandard}
                            onChange={(e) => update("shippingStandard", Number(e.target.value))}
                            className={inputClass}
                            placeholder="15.00"
                        />
                    </Field>
                    <Field label="Express Shipping ($)" hint="Flat fee">
                        <input
                            type="number"
                            step="0.01"
                            value={settings.shippingExpress}
                            onChange={(e) => update("shippingExpress", Number(e.target.value))}
                            className={inputClass}
                            placeholder="25.00"
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Homepage Content" description="Hero section and footer text shown on the customer-facing website">
                <div className="flex flex-col gap-4">
                    <Field label="Hero Badge Text">
                        <input type="text" value={settings.heroBadgeText} onChange={(e) => update("heroBadgeText", e.target.value)} className={inputClass} placeholder="New: 2026 Holiday Kits Available" />
                    </Field>
                    <Field label="Hero Title">
                        <input type="text" value={settings.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputClass} placeholder="Celebrate Beautifully..." />
                    </Field>
                    <Field label="Hero Subtitle">
                        <input type="text" value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} className={inputClass} placeholder="Rent professionally curated..." />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Primary CTA Button">
                            <input type="text" value={settings.heroCtaPrimary} onChange={(e) => update("heroCtaPrimary", e.target.value)} className={inputClass} placeholder="Browse Holiday Kits" />
                        </Field>
                        <Field label="Secondary CTA Button">
                            <input type="text" value={settings.heroCtaSecondary} onChange={(e) => update("heroCtaSecondary", e.target.value)} className={inputClass} placeholder="See How It Works" />
                        </Field>
                    </div>
                    <Field label="Footer Tagline">
                        <input type="text" value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} className={inputClass} placeholder="Celebrate beautifully, without the storage." />
                    </Field>
                </div>
            </Section>

            <Section title="Announcement Banner" description="Show a banner at the top of the customer website">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Show Banner</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Display the banner on the customer-facing site</p>
                        </div>
                        <Switch checked={settings.announcementBannerActive} onCheckedChange={(v) => update("announcementBannerActive", v)} />
                    </div>
                    <Field label="Banner Text">
                        <input type="text" value={settings.announcementBanner} onChange={(e) => update("announcementBanner", e.target.value)}
                            className={inputClass} placeholder="Free shipping on all orders this week!" />
                    </Field>
                </div>
            </Section>

            <Section title="Email (SMTP)" description="Configure outgoing email for order confirmations, reminders, and notifications">
                <div className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="SMTP Host">
                            <input
                                type="text"
                                value={settings.smtpHost}
                                onChange={(e) => update("smtpHost", e.target.value)}
                                className={inputClass}
                                placeholder="smtp.gmail.com"
                            />
                        </Field>
                        <Field label="SMTP Port">
                            <input
                                type="number"
                                value={settings.smtpPort}
                                onChange={(e) => update("smtpPort", Number(e.target.value))}
                                className={inputClass}
                                placeholder="587"
                            />
                        </Field>
                        <Field label="SMTP Username">
                            <input
                                type="text"
                                value={settings.smtpUser}
                                onChange={(e) => update("smtpUser", e.target.value)}
                                className={inputClass}
                                placeholder="you@gmail.com"
                            />
                        </Field>
                        <Field label="SMTP Password">
                            <input
                                type="password"
                                value={settings.smtpPass}
                                onChange={(e) => update("smtpPass", e.target.value)}
                                className={inputClass}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="From Email">
                            <input
                                type="email"
                                value={settings.smtpFromEmail}
                                onChange={(e) => update("smtpFromEmail", e.target.value)}
                                className={inputClass}
                                placeholder="noreply@celebrease.com"
                            />
                        </Field>
                        <Field label="From Name">
                            <input
                                type="text"
                                value={settings.smtpFromName}
                                onChange={(e) => update("smtpFromName", e.target.value)}
                                className={inputClass}
                                placeholder="CeleBrease"
                            />
                        </Field>
                    </div>
                    {settings.smtpHost && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                            <span className="inline-block size-2 rounded-full bg-emerald-500" />
                            SMTP host configured — save settings to apply
                        </div>
                    )}
                    {!settings.smtpHost && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                            <span className="inline-block size-2 rounded-full bg-amber-400" />
                            Email not configured — set SMTP host to enable notifications and reminders
                        </div>
                    )}
                </div>
            </Section>

            <Section title="Maintenance" description="Control site availability">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Maintenance Mode</p>
                        <p className="text-xs text-muted-foreground mt-0.5">When enabled, customers see a maintenance page</p>
                    </div>
                    <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(v) => update("maintenanceMode", v)}
                    />
                </div>
            </Section>

            <Section title="Stripe Integration" description="Payment processing mode">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-sm font-medium">Mode</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Determined by your STRIPE_SECRET_KEY on the server</p>
                    </div>
                    {stripeMode === null ? (
                        <span className="text-xs text-muted-foreground">Loading...</span>
                    ) : stripeMode === "live" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Live mode
                        </span>
                    ) : stripeMode === "test" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-amber-400" />
                            Test mode
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            Unknown
                        </span>
                    )}
                </div>
            </Section>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Company Settings"}
                </Button>
            </div>
        </>
    );
}
