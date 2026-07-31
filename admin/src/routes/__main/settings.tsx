import { RouteSkeleton } from "@/components/main/route-skeleton";
import { baseURL, apiPrefix } from "@/lib/api/base";
import { settingsApi, type ApiSiteSettings } from "@/lib/api/settings";
import { auth } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/settings")({
    component: RouteComponent,
    pendingComponent: RouteSkeleton,
});

const SETTINGS_CSS = `
.settings-layout{display:grid;grid-template-columns:210px 1fr;gap:20px;align-items:start}
.settings-nav{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);overflow:hidden}
.settings-nav-head{padding:14px 16px;border-bottom:1px solid var(--line);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft)}
.settings-nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13.5px;font-weight:500;color:var(--ink-muted);border-left:3px solid transparent;cursor:pointer;transition:background .13s,color .13s;width:100%;text-align:left}
.settings-nav-item .sn-ic{font-size:15px;opacity:.8;width:18px;text-align:center}
.settings-nav-item:hover{background:var(--bg);color:var(--ink)}
.settings-nav-item.active{background:linear-gradient(90deg,rgba(155,47,201,.07),rgba(220,0,117,.04));color:var(--brand-purple);font-weight:600;border-left-color:var(--brand-purple)}
.settings-nav-item + .settings-nav-item{border-top:1px solid var(--line)}
.form-panel{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-xs);overflow:hidden}
.form-panel-head{padding:20px 26px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}
.form-panel-head h2{font-size:17px;font-weight:700}
.form-panel-head .fpd{font-size:13px;color:var(--ink-muted);margin-top:2px}
.form-panel-body{padding:28px 26px;display:flex;flex-direction:column;gap:28px}
.form-section{display:flex;flex-direction:column;gap:18px}
.form-section-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);padding-bottom:10px;border-bottom:1px solid var(--line)}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.field-row.full{grid-template-columns:1fr}
.field-row.trio{grid-template-columns:1fr 1fr 1fr}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:12.5px;font-weight:600;color:var(--ink-muted);letter-spacing:.01em}
.field label span.req{color:var(--red);margin-left:2px}
.field input[type=text],.field input[type=email],.field input[type=number],.field input[type=url],.field input[type=tel],.field input[type=password],.field select,.field textarea{background:var(--bg);border:1px solid var(--line-strong);border-radius:var(--radius-sm);padding:9px 13px;font-family:inherit;font-size:13.5px;color:var(--ink);outline:none;transition:border-color .15s,box-shadow .15s}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--brand-purple);box-shadow:0 0 0 3px rgba(155,47,201,.10);background:#fff}
.field input:disabled{color:var(--ink-soft);cursor:not-allowed}
.field .input-wrap{position:relative}
.field .input-wrap .prefix{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:13.5px;color:var(--ink-soft);font-weight:600;pointer-events:none}
.field .hint{font-size:11.5px;color:var(--ink-soft);margin-top:2px}
.rate-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.rate-card{background:var(--bg);border:1px solid var(--line-strong);border-radius:var(--radius-sm);padding:16px 18px;display:flex;align-items:center;gap:14px}
.rate-card .rc-ic{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.rate-card .rc-ic.std{background:var(--blue-bg);color:var(--blue)}
.rate-card .rc-ic.exp{background:var(--amber-bg);color:var(--amber)}
.rate-card .rc-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft)}
.rate-card .rc-name{font-size:14px;font-weight:600;margin:2px 0 1px}
.rate-card .rc-eta{font-size:11.5px;color:var(--ink-soft)}
.rate-card .rc-amount{margin-left:auto;font-size:22px;font-weight:800;letter-spacing:-0.02em}
.rate-card .rc-amount span{font-size:13px;font-weight:500;color:var(--ink-soft)}
.tax-row{display:flex;align-items:center;gap:14px;background:var(--bg);border:1px solid var(--line-strong);border-radius:var(--radius-sm);padding:14px 18px}
.tax-row .tx-ic{width:38px;height:38px;border-radius:10px;background:var(--green-bg);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.tax-row .tx-info{flex:1}
.tax-row .tx-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft)}
.tax-row .tx-val{font-size:22px;font-weight:800;letter-spacing:-0.02em;margin:1px 0}
.tax-row .tx-note{font-size:11.5px;color:var(--ink-soft)}
.tax-row .field{flex-shrink:0;width:130px}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-top:1px solid var(--line)}
.toggle-row:first-child{padding-top:0;border-top:none}
.toggle-row .tr-info .tr-name{font-size:13.5px;font-weight:600}
.toggle-row .tr-info .tr-desc{font-size:12px;color:var(--ink-soft);margin-top:1px}
.toggle{position:relative;width:40px;height:22px;flex-shrink:0;display:inline-block}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-track{display:block;width:40px;height:22px;border-radius:11px;background:var(--line-strong);cursor:pointer;transition:background .2s}
.toggle input:checked + .toggle-track{background:var(--brand-purple)}
.toggle-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:var(--shadow-xs);transition:transform .2s;pointer-events:none}
.toggle input:checked ~ .toggle-thumb{transform:translateX(18px)}
.form-actions{display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid var(--line)}
.form-actions .last-saved{font-size:12px;color:var(--ink-soft);display:flex;align-items:center;gap:6px}
.form-actions .last-saved::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0}
.btn-secondary{height:38px;padding:0 18px;border-radius:10px;border:1px solid var(--line-strong);font-size:13.5px;font-weight:600;color:var(--ink-muted);background:#fff;display:inline-flex;align-items:center;gap:7px}
.btn-secondary:hover{background:var(--bg)}
.btn-secondary:disabled{opacity:.55;cursor:not-allowed}
.btn-grad:disabled{opacity:.6;cursor:not-allowed}
.btn-actions{display:flex;gap:10px}
.badge-live{display:inline-flex;align-items:center;gap:6px;background:var(--green-bg);color:var(--green);font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:20px}
.badge-live::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green)}
.badge-mode{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:20px}
.badge-mode::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}
.badge-mode.live{background:var(--green-bg);color:var(--green)}
.badge-mode.test{background:var(--amber-bg);color:var(--amber)}
.badge-mode.unknown{background:var(--bg);color:var(--ink-soft)}
.color-row{display:flex;align-items:center;gap:10px}
.color-swatch{width:32px;height:32px;border-radius:8px;flex-shrink:0;border:1px solid rgba(0,0,0,.08)}
.avatar-row{display:flex;align-items:center;gap:16px}
.avatar-lg{width:64px;height:64px;border-radius:50%;background:var(--brand-gradient);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;object-fit:cover;overflow:hidden}
.avatar-lg img{width:100%;height:100%;object-fit:cover}
.avatar-cam{position:absolute;bottom:-2px;right:-2px;width:24px;height:24px;border-radius:50%;background:var(--brand-purple);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:var(--shadow-sm);border:2px solid #fff}
.account-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.account-card{background:var(--bg);border:1px solid var(--line-strong);border-radius:var(--radius-sm);padding:14px 16px}
.account-card .ac-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft)}
.account-card .ac-val{font-size:15px;font-weight:700;margin-top:4px;text-transform:capitalize}
.logo-box{width:64px;height:64px;border-radius:10px;border:1px solid var(--line-strong);background:var(--bg);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
.logo-box img{width:100%;height:100%;object-fit:contain;padding:4px}
.link-upload{font-size:12.5px;font-weight:600;color:var(--brand-purple);cursor:pointer}
.link-upload:hover{text-decoration:underline}
.smtp-status{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500;padding:9px 13px;border-radius:var(--radius-sm)}
.smtp-status::before{content:'';width:8px;height:8px;border-radius:50%;background:currentColor;flex-shrink:0}
.smtp-status.ok{color:var(--green);background:var(--green-bg);border:1px solid var(--green)}
.smtp-status.warn{color:var(--amber);background:var(--amber-bg);border:1px solid var(--amber)}
@media(max-width:1100px){
.settings-layout{grid-template-columns:1fr}
.settings-nav{display:flex;flex-direction:row;overflow-x:auto}
.settings-nav-head{display:none}
.settings-nav-item{border-left:none;border-bottom:3px solid transparent;white-space:nowrap}
.settings-nav-item.active{border-left-color:transparent;border-bottom-color:var(--brand-purple)}
.settings-nav-item + .settings-nav-item{border-top:none}
.field-row,.field-row.trio{grid-template-columns:1fr}
.rate-cards{grid-template-columns:1fr}
.account-cards{grid-template-columns:1fr}
}
`;

type SectionKey = "profile" | "security" | "company" | "pricing" | "email" | "branding";

const NAV: { key: SectionKey; icon: string; label: string }[] = [
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "security", icon: "🛡️", label: "Security" },
    { key: "company", icon: "🏢", label: "Company" },
    { key: "pricing", icon: "🧾", label: "Pricing & Tax" },
    { key: "email", icon: "✉️", label: "Email" },
    { key: "branding", icon: "🎨", label: "Branding" },
];

function RouteComponent() {
    const router = useRouter();
    const { user } = Route.useRouteContext();

    const [section, setSection] = useState<SectionKey>("profile");

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
            await Promise.all([
                auth.updateUser({ name, phone: phone || undefined, region: region || undefined }),
                router.invalidate(),
            ]);
            toast.success("Profile updated");
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
    const avatarSrc = user.image ? (user.image.startsWith("http") ? user.image : `${baseURL}${user.image}`) : undefined;

    const activeNav = NAV.find((n) => n.key === section)!;
    const headDesc: Record<SectionKey, string> = {
        profile: "Your public name, avatar, and contact details.",
        security: "Change your password and manage active sessions.",
        company: "Store identity, contact info, and social links.",
        pricing: "Tax rate and shipping fees applied at checkout.",
        email: "Configure outgoing email and homepage content.",
        branding: "Brand colors and customer-facing homepage copy.",
    };

    return (
        <div className="content">
            <style>{SETTINGS_CSS}</style>

            <div className="page-head">
                <div>
                    <h1>Settings</h1>
                    <div className="sub">Manage your account, store configuration, integrations, and preferences.</div>
                </div>
                <span className="badge-live">All systems live</span>
            </div>

            <div className="settings-layout">
                {/* LEFT: settings sub-nav */}
                <div className="settings-nav">
                    <div className="settings-nav-head">Configuration</div>
                    {NAV.map((n) => (
                        <button
                            key={n.key}
                            type="button"
                            className={`settings-nav-item ${section === n.key ? "active" : ""}`}
                            onClick={() => setSection(n.key)}
                        >
                            <span className="sn-ic">{n.icon}</span> {n.label}
                        </button>
                    ))}
                </div>

                {/* RIGHT: form panel */}
                <div className="form-panel">
                    <div className="form-panel-head">
                        <div>
                            <h2>{activeNav.label}</h2>
                            <div className="fpd">{headDesc[section]}</div>
                        </div>
                    </div>

                    <div className="form-panel-body">
                        {section === "profile" && (
                            <ProfileSection
                                user={user}
                                name={name}
                                setName={setName}
                                phone={phone}
                                setPhone={setPhone}
                                region={region}
                                setRegion={setRegion}
                                initials={initials}
                                avatarSrc={avatarSrc}
                                avatarLoading={avatarLoading}
                                fileInputRef={fileInputRef}
                                onAvatarChange={handleAvatarChange}
                                profileLoading={profileLoading}
                                onSave={handleProfileSave}
                            />
                        )}

                        {section === "security" && (
                            <SecuritySection
                                currentPassword={currentPassword}
                                setCurrentPassword={setCurrentPassword}
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                passwordLoading={passwordLoading}
                                onChangePassword={handlePasswordChange}
                                sessionsLoading={sessionsLoading}
                                onRevokeSessions={handleRevokeSessions}
                            />
                        )}

                        {(section === "company" || section === "pricing" || section === "email" || section === "branding") && (
                            <CompanySettingsTab section={section} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Profile Section ─────────────────────────────────────────────

function ProfileSection(props: {
    user: any;
    name: string;
    setName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    region: string;
    setRegion: (v: string) => void;
    initials: string;
    avatarSrc?: string;
    avatarLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    profileLoading: boolean;
    onSave: () => void;
}) {
    const {
        user, name, setName, phone, setPhone, region, setRegion,
        initials, avatarSrc, avatarLoading, fileInputRef, onAvatarChange, profileLoading, onSave,
    } = props;

    return (
        <>
            <div className="form-section">
                <div className="form-section-title">Identity</div>
                <div className="avatar-row">
                    <div style={{ position: "relative" }}>
                        <div className="avatar-lg">
                            {avatarSrc ? <img loading="lazy" decoding="async" src={avatarSrc} alt={user.name} /> : initials}
                        </div>
                        <button
                            type="button"
                            className="avatar-cam"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarLoading}
                        >
                            {avatarLoading ? "…" : "📷"}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onAvatarChange} />
                    </div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{user.name}</div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{user.email}</div>
                    </div>
                </div>

                <div className="field-row">
                    <div className="field">
                        <label>Full name <span className="req">*</span></label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                    </div>
                    <div className="field">
                        <label>Phone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                        <div className="hint">Optional.</div>
                    </div>
                </div>

                <div className="field-row">
                    <div className="field">
                        <label>Region</label>
                        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. US" />
                        <div className="hint">Optional — e.g. US, CA, UK.</div>
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" value={user.email} disabled />
                        <div className="hint">Contact support to change your email.</div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Account</div>
                <div className="account-cards">
                    <div className="account-card">
                        <div className="ac-lbl">Role</div>
                        <div className="ac-val">{(user as any).role}</div>
                    </div>
                    <div className="account-card">
                        <div className="ac-lbl">Email verified</div>
                        <div className="ac-val">{user.emailVerified ? "Yes" : "No"}</div>
                    </div>
                    <div className="account-card">
                        <div className="ac-lbl">Member since</div>
                        <div className="ac-val">
                            {new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(user.createdAt))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <div className="last-saved">Profile details</div>
                <div className="btn-actions">
                    <button className="btn-grad" onClick={onSave} disabled={profileLoading}>
                        💾 {profileLoading ? "Saving…" : "Save profile"}
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Security Section ────────────────────────────────────────────

function SecuritySection(props: {
    currentPassword: string;
    setCurrentPassword: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    passwordLoading: boolean;
    onChangePassword: () => void;
    sessionsLoading: boolean;
    onRevokeSessions: () => void;
}) {
    const {
        currentPassword, setCurrentPassword, newPassword, setNewPassword,
        confirmPassword, setConfirmPassword, passwordLoading, onChangePassword,
        sessionsLoading, onRevokeSessions,
    } = props;

    return (
        <>
            <div className="form-section">
                <div className="form-section-title">Change password</div>
                <div className="field-row full">
                    <div className="field">
                        <label>Current password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="Enter current password"
                        />
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label>New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            placeholder="New password"
                        />
                        <div className="hint">Minimum 8 characters.</div>
                    </div>
                    <div className="field">
                        <label>Confirm new password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <div className="last-saved">Password &amp; authentication</div>
                    <div className="btn-actions">
                        <button
                            className="btn-grad"
                            onClick={onChangePassword}
                            disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                        >
                            🔑 {passwordLoading ? "Updating…" : "Update password"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Sessions</div>
                <div className="toggle-row">
                    <div className="tr-info">
                        <div className="tr-name">Sign out all other devices</div>
                        <div className="tr-desc">This will revoke all sessions except the current one.</div>
                    </div>
                    <button className="btn-secondary" onClick={onRevokeSessions} disabled={sessionsLoading}>
                        {sessionsLoading ? "Revoking…" : "Revoke others"}
                    </button>
                </div>
            </div>
        </>
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
    yearlyDiscountPercent: 20,
    aLaCarteStartingPrice: 79.00,
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

function CompanySettingsTab({ section }: { section: SectionKey }) {
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
                yearlyDiscountPercent: settings.yearlyDiscountPercent,
                aLaCarteStartingPrice: settings.aLaCarteStartingPrice,
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

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", color: "var(--ink-soft)", fontSize: 13.5 }}>
                Loading…
            </div>
        );
    }

    const taxPct = Math.round((settings.taxRate || 0) * 1000) / 10;

    return (
        <>
            {section === "company" && (
                <>
                    <div className="form-section">
                        <div className="form-section-title">Store identity</div>

                        <div className="avatar-row">
                            <div className="logo-box">
                                {settings.logoUrl ? (
                                    <img loading="lazy" decoding="async" src={settings.logoUrl.startsWith("http") ? settings.logoUrl : `${baseURL}${settings.logoUrl}`} alt="Logo" />
                                ) : (
                                    <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>No logo</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>Company logo</div>
                                <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>Used in emails and the customer website header.</div>
                                <label className="link-upload" style={{ display: "inline-block", marginTop: 6 }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
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

                        <div className="field-row">
                            <div className="field">
                                <label>Company name <span className="req">*</span></label>
                                <input type="text" value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Company name" />
                            </div>
                            <div className="field">
                                <label>Website URL</label>
                                <input type="url" value={settings.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} placeholder="https://celebrease.com" />
                            </div>
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label>Support email</label>
                                <input type="email" value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} placeholder="support@celebrease.com" />
                            </div>
                            <div className="field">
                                <label>Support phone</label>
                                <input type="tel" value={settings.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Social links</div>
                        <div className="field-row trio">
                            <div className="field">
                                <label>Instagram</label>
                                <input type="text" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@celebrease" />
                            </div>
                            <div className="field">
                                <label>Facebook</label>
                                <input type="text" value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="facebook.com/celebrease" />
                            </div>
                            <div className="field">
                                <label>TikTok</label>
                                <input type="text" value={settings.tiktok} onChange={(e) => update("tiktok", e.target.value)} placeholder="@celebrease" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Operational preferences</div>
                        <div className="toggle-row">
                            <div className="tr-info">
                                <div className="tr-name">Maintenance mode</div>
                                <div className="tr-desc">Show a maintenance notice on the customer-facing storefront.</div>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => update("maintenanceMode", e.target.checked)} />
                                <span className="toggle-track" />
                                <span className="toggle-thumb" />
                            </label>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Stripe integration</div>
                        <div className="tax-row">
                            <div className="tx-ic" style={{ background: "#F3E8FB", color: "var(--brand-purple)" }}>💳</div>
                            <div className="tx-info">
                                <div className="tx-lbl">Payment mode</div>
                                <div className="tx-note" style={{ marginTop: 2 }}>Determined by your STRIPE_SECRET_KEY on the server.</div>
                            </div>
                            {stripeMode === null ? (
                                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Loading…</span>
                            ) : stripeMode === "live" ? (
                                <span className="badge-mode live">Live mode</span>
                            ) : stripeMode === "test" ? (
                                <span className="badge-mode test">Test mode</span>
                            ) : (
                                <span className="badge-mode unknown">Unknown</span>
                            )}
                        </div>
                    </div>
                </>
            )}

            {section === "pricing" && (
                <>
                    <div className="form-section">
                        <div className="form-section-title">Shipping rates</div>
                        <div className="rate-cards">
                            <div className="rate-card">
                                <div className="rc-ic std">📬</div>
                                <div>
                                    <div className="rc-label">Standard</div>
                                    <div className="rc-name">Ground shipping</div>
                                    <div className="rc-eta">3–5 business days</div>
                                </div>
                                <div className="rc-amount">${Math.floor(settings.shippingStandard)}<span>.{(settings.shippingStandard % 1).toFixed(2).slice(2)}</span></div>
                            </div>
                            <div className="rate-card">
                                <div className="rc-ic exp">⚡</div>
                                <div>
                                    <div className="rc-label">Express</div>
                                    <div className="rc-name">Priority shipping</div>
                                    <div className="rc-eta">1–2 business days</div>
                                </div>
                                <div className="rc-amount">${Math.floor(settings.shippingExpress)}<span>.{(settings.shippingExpress % 1).toFixed(2).slice(2)}</span></div>
                            </div>
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label>Standard rate (USD)</label>
                                <div className="input-wrap">
                                    <span className="prefix">$</span>
                                    <input type="number" style={{ paddingLeft: 28 }} value={settings.shippingStandard} min={0} step="0.01" onChange={(e) => update("shippingStandard", Number(e.target.value))} />
                                </div>
                                <div className="hint">Applied at checkout for ground shipping.</div>
                            </div>
                            <div className="field">
                                <label>Express rate (USD)</label>
                                <div className="input-wrap">
                                    <span className="prefix">$</span>
                                    <input type="number" style={{ paddingLeft: 28 }} value={settings.shippingExpress} min={0} step="0.01" onChange={(e) => update("shippingExpress", Number(e.target.value))} />
                                </div>
                                <div className="hint">Applied at checkout for priority shipping.</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Subscription Settings</div>
                        <div className="field" style={{ maxWidth: 200 }}>
                            <label>Global Yearly Discount (%)</label>
                            <input
                                type="number"
                                value={settings.yearlyDiscountPercent}
                                min={0}
                                max={100}
                                onChange={(e) => update("yearlyDiscountPercent", Number(e.target.value))}
                            />
                            <div className="hint">Applied automatically when users select yearly billing.</div>
                        </div>
                        <div className="field" style={{ maxWidth: 200 }}>
                            <label>A-La-Carte Starting Price ($)</label>
                            <input
                                type="number"
                                value={settings.aLaCarteStartingPrice}
                                min={0}
                                onChange={(e) => update("aLaCarteStartingPrice", Number(e.target.value))}
                            />
                            <div className="hint">Displayed on the pricing grid as the "starting at" price.</div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Tax</div>
                        <div className="tax-row">
                            <div className="tx-ic">%</div>
                            <div className="tx-info">
                                <div className="tx-lbl">Default tax rate</div>
                                <div className="tx-val">{taxPct}%</div>
                                <div className="tx-note">Applied to all taxable line items at checkout.</div>
                            </div>
                            <div className="field" style={{ flexShrink: 0, width: 130 }}>
                                <label>Rate (decimal)</label>
                                <input type="number" value={settings.taxRate} min={0} max={1} step="0.001" onChange={(e) => update("taxRate", Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="hint">Enter as a decimal — e.g. 0.08 for 8%.</div>
                    </div>
                </>
            )}

            {section === "email" && (
                <>
                    <div className="form-section">
                        <div className="form-section-title">Email (SMTP)</div>
                        <div className="field-row">
                            <div className="field">
                                <label>SMTP host</label>
                                <input type="text" value={settings.smtpHost} onChange={(e) => update("smtpHost", e.target.value)} placeholder="smtp.gmail.com" />
                            </div>
                            <div className="field">
                                <label>SMTP port</label>
                                <input type="number" value={settings.smtpPort} onChange={(e) => update("smtpPort", Number(e.target.value))} placeholder="587" />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>SMTP username</label>
                                <input type="text" value={settings.smtpUser} onChange={(e) => update("smtpUser", e.target.value)} placeholder="you@gmail.com" />
                            </div>
                            <div className="field">
                                <label>SMTP password</label>
                                <input type="password" value={settings.smtpPass} onChange={(e) => update("smtpPass", e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>From email</label>
                                <input type="email" value={settings.smtpFromEmail} onChange={(e) => update("smtpFromEmail", e.target.value)} placeholder="noreply@celebrease.com" />
                            </div>
                            <div className="field">
                                <label>From name</label>
                                <input type="text" value={settings.smtpFromName} onChange={(e) => update("smtpFromName", e.target.value)} placeholder="CeleBrease" />
                            </div>
                        </div>
                        {settings.smtpHost ? (
                            <div className="smtp-status ok">SMTP host configured — save settings to apply.</div>
                        ) : (
                            <div className="smtp-status warn">Email not configured — set SMTP host to enable notifications and reminders.</div>
                        )}
                    </div>
                </>
            )}

            {section === "branding" && (
                <>
                    <div className="form-section">
                        <div className="form-section-title">Brand colors</div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                            <div className="field" style={{ flex: 1, minWidth: 160 }}>
                                <label>Primary</label>
                                <div className="color-row">
                                    <div className="color-swatch" style={{ background: "#9B2FC9" }} />
                                    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "var(--ink-muted)" }}>#9B2FC9</span>
                                </div>
                            </div>
                            <div className="field" style={{ flex: 1, minWidth: 160 }}>
                                <label>Accent / Magenta</label>
                                <div className="color-row">
                                    <div className="color-swatch" style={{ background: "#DC0075" }} />
                                    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "var(--ink-muted)" }}>#DC0075</span>
                                </div>
                            </div>
                            <div className="field" style={{ flex: 1, minWidth: 160 }}>
                                <label>Background</label>
                                <div className="color-row">
                                    <div className="color-swatch" style={{ background: "#F7F5FB", border: "1px solid var(--line-strong)" }} />
                                    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "var(--ink-muted)" }}>#F7F5FB</span>
                                </div>
                            </div>
                            <div className="field" style={{ flex: 1, minWidth: 160 }}>
                                <label>Ink / Text</label>
                                <div className="color-row">
                                    <div className="color-swatch" style={{ background: "#1A0B2E" }} />
                                    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "var(--ink-muted)" }}>#1A0B2E</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Homepage content</div>
                        <div className="field-row full">
                            <div className="field">
                                <label>Hero badge text</label>
                                <input type="text" value={settings.heroBadgeText} onChange={(e) => update("heroBadgeText", e.target.value)} placeholder="New: 2026 Holiday Kits Available" />
                            </div>
                        </div>
                        <div className="field-row full">
                            <div className="field">
                                <label>Hero title</label>
                                <input type="text" value={settings.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} placeholder="Celebrate Beautifully…" />
                            </div>
                        </div>
                        <div className="field-row full">
                            <div className="field">
                                <label>Hero subtitle</label>
                                <input type="text" value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} placeholder="Rent professionally curated…" />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>Primary CTA button</label>
                                <input type="text" value={settings.heroCtaPrimary} onChange={(e) => update("heroCtaPrimary", e.target.value)} placeholder="Browse Holiday Kits" />
                            </div>
                            <div className="field">
                                <label>Secondary CTA button</label>
                                <input type="text" value={settings.heroCtaSecondary} onChange={(e) => update("heroCtaSecondary", e.target.value)} placeholder="See How It Works" />
                            </div>
                        </div>
                        <div className="field-row full">
                            <div className="field">
                                <label>Footer tagline</label>
                                <input type="text" value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Celebrate beautifully, without the storage." />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Announcement banner</div>
                        <div className="toggle-row">
                            <div className="tr-info">
                                <div className="tr-name">Show banner</div>
                                <div className="tr-desc">Display the banner on the customer-facing site.</div>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" checked={settings.announcementBannerActive} onChange={(e) => update("announcementBannerActive", e.target.checked)} />
                                <span className="toggle-track" />
                                <span className="toggle-thumb" />
                            </label>
                        </div>
                        <div className="field-row full">
                            <div className="field">
                                <label>Banner text</label>
                                <input type="text" value={settings.announcementBanner} onChange={(e) => update("announcementBanner", e.target.value)} placeholder="Free shipping on all orders this week!" />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="form-actions">
                <div className="last-saved">
                    {settings.updatedAt
                        ? `Settings saved · ${new Date(settings.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Company settings"}
                </div>
                <div className="btn-actions">
                    <button className="btn-grad" onClick={handleSave} disabled={saving}>
                        💾 {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </>
    );
}
