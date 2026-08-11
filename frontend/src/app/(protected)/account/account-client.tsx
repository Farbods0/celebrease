"use client";


import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { getMySubscription, type ApiSubscription } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ActiveRentals from "@/components/account/active-rentals";
import AddressCard from "@/components/account/address-card";
import PaymentCard from "@/components/account/payment-card";
import RecentRentals from "@/components/account/recent-rentals";
import SubscriptionCard from "@/components/account/subscription-card";

function getInitials(name?: string | null) {
    if (!name) return "?";
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("") || "?"
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function holidaysUsed(sub: ApiSubscription) {
    return sub.holidaySlots.filter((s) => s.status !== "PENDING").length;
}

function formatRenewDate(value: string | null) {
    if (!value) return null;
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

type ActiveTab = "overview" | "subscription" | "slots" | "orders" | "addresses" | "settings";

export default function AccountClient() {
    const { data: session } = auth.useSession();
    const router = useRouter();
    const user = session?.user;
    const displayName = user?.name ?? "there";
    const firstName = displayName.split(" ")[0] ?? displayName;
    const initials = getInitials(user?.name);

    // Use vanilla JS for 0ms tab switching
    const changeTab = (id: ActiveTab) => {
        document.querySelectorAll('.tab-content').forEach((el: any) => el.style.display = 'none');
        const target = document.getElementById('tab-' + id);
        if (target) target.style.display = 'block';
        
        document.querySelectorAll('.acct-nav-link').forEach((el: any) => el.classList.remove('active'));
        const navTarget = document.getElementById('nav-' + id);
        if (navTarget) navTarget.classList.add('active');
    };
    
    const [sub, setSub] = useState<ApiSubscription | null>(null);

    useEffect(() => {
        let cancelled = false;
        getMySubscription()
            .then((s) => {
                if (!cancelled) setSub(s);
            })
            .catch(() => {
                if (!cancelled) setSub(null);
            });
        return () => {
            cancelled = true;
        };
    }, []);

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

    const slotsUsed = sub ? holidaysUsed(sub) : 0;
    const slotsTotal = sub?.plan?.holidaysPerYear ?? 0;
    const slotsPct = slotsTotal > 0 ? (slotsUsed / slotsTotal) * 100 : 0;
    const openSlots = Math.max(0, slotsTotal - slotsUsed);

    const navItems: { id: ActiveTab; icon: string; label: string }[] = [
        { id: "overview", icon: "◆", label: "Overview" },
        { id: "subscription", icon: "💳", label: "My Subscription" },
        { id: "slots", icon: "🏡", label: "Holiday Slots" },
        { id: "orders", icon: "📦", label: "Orders" },
        { id: "addresses", icon: "🏠", label: "Addresses" },
        { id: "settings", icon: "⚙️", label: "Settings" },
    ];

    return (
        <div className="cb">
            <style>{`
                .acct-page { background: var(--cb-lavender); min-height: calc(100vh - 110px); }
                .acct-wrap {
                    max-width: var(--cb-max);
                    margin: 0 auto;
                    padding: 40px 24px 64px;
                    display: grid;
                    grid-template-columns: 240px 1fr;
                    gap: 32px;
                    align-items: start;
                }
                /* Sidebar */
                .acct-sidebar {
                    background: #fff;
                    border-radius: var(--cb-r-card);
                    border: 1px solid var(--cb-line);
                    box-shadow: var(--cb-shadow-sm);
                    overflow: hidden;
                    position: sticky;
                    top: 90px;
                }
                .sidebar-profile {
                    padding: 24px 20px 20px;
                    text-align: center;
                    border-bottom: 1px solid var(--cb-line);
                    background: var(--cb-gradient-soft);
                }
                .sidebar-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--cb-gradient-h);
                    color: #fff;
                    font-weight: 700;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                    box-shadow: 0 6px 18px rgba(155,47,201,0.3);
                }
                .sidebar-name {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 17px;
                    font-weight: 700;
                    color: var(--cb-ink);
                }
                .sidebar-email { font-size: 12.5px; color: var(--cb-ink-muted); margin-top: 2px; }
                .sidebar-plan-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 10px;
                    background: var(--cb-gradient-h);
                    color: #fff;
                    font-size: 11.5px;
                    font-weight: 700;
                    padding: 5px 12px;
                    border-radius: var(--cb-r-pill);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }
                .acct-nav { padding: 10px 0; }
                .acct-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 12px 20px;
                    font-size: 14.5px;
                    font-weight: 500;
                    color: var(--cb-ink-muted);
                    transition: all 0.18s;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    background: none;
                    border-right: none;
                    border-top: none;
                    border-bottom: none;
                    width: 100%;
                    text-align: left;
                    font-family: inherit;
                }
                .acct-nav-link:hover { background: var(--cb-lavender); color: var(--cb-purple); }
                .acct-nav-link.active {
                    background: var(--cb-lavender);
                    color: var(--cb-purple);
                    border-left-color: var(--cb-purple);
                    font-weight: 600;
                }
                .acct-nav-link .nav-ic { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
                .sidebar-signout { padding: 14px 20px; border-top: 1px solid var(--cb-line); }
                .sidebar-signout-btn {
                    font-size: 13.5px;
                    color: var(--cb-ink-soft);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: color 0.18s;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                    padding: 0;
                }
                .sidebar-signout-btn:hover { color: var(--cb-magenta); }

                /* Main content */
                .acct-content { display: flex; flex-direction: column; gap: 28px; min-width: 0; }
                .acct-greeting { padding: 0 0 4px; }
                .greeting-eyebrow {
                    font-size: 12.5px;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--cb-magenta);
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                .acct-greeting h1 { font-size: clamp(1.7rem, 2.8vw, 2.3rem); font-weight: 800; line-height: 1.1; }
                .greeting-sub { font-size: 15px; color: var(--cb-ink-muted); margin-top: 6px; }
                .acct-section-label {
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.13em;
                    color: var(--cb-ink-soft);
                    font-weight: 700;
                    margin-bottom: 14px;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* Stats row */
                .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
                .stat-card {
                    background: #fff;
                    border-radius: var(--cb-r-card);
                    border: 1px solid var(--cb-line);
                    padding: 20px 20px 18px;
                    box-shadow: var(--cb-shadow-xs);
                }
                .stat-num {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 2rem;
                    font-weight: 800;
                    background: var(--cb-gradient-h);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .stat-label { font-size: 13px; color: var(--cb-ink-muted); font-weight: 500; }

                /* Plan summary card */
                .plan-summary-card {
                    background: var(--cb-gradient);
                    border-radius: var(--cb-r-card);
                    padding: 28px 30px;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--cb-shadow-glow);
                }
                .plan-summary-card::before {
                    content: '';
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    right: -80px;
                    bottom: -120px;
                    background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 65%);
                    pointer-events: none;
                }
                .plan-summary-card::after {
                    content: '';
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    left: -60px;
                    top: -80px;
                    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 65%);
                    pointer-events: none;
                }
                .psc-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; position: relative; }
                .psc-tier { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 4px; }
                .psc-name { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 800; line-height: 1; }
                .psc-renew { font-size: 13.5px; color: rgba(255,255,255,0.82); margin-top: 6px; }
                .psc-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
                .btn-psc-white {
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                    font-size: 13.5px;
                    font-weight: 600;
                    padding: 0 18px;
                    height: 38px;
                    border-radius: var(--cb-r-pill);
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: background 0.2s;
                    border: 1px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    cursor: pointer;
                    font-family: inherit;
                }
                .btn-psc-white:hover { background: rgba(255,255,255,0.32); }
                .btn-psc-solid {
                    background: #fff;
                    color: var(--cb-purple);
                    font-size: 13.5px;
                    font-weight: 700;
                    padding: 0 18px;
                    height: 38px;
                    border-radius: var(--cb-r-pill);
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                }
                .btn-psc-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(26,11,46,0.18); }
                .slot-progress-wrap { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); position: relative; }
                .slot-labels { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .slot-labels span { font-size: 13.5px; color: rgba(255,255,255,0.9); font-weight: 500; }
                .slot-labels strong { font-size: 15px; font-weight: 700; color: #fff; }
                .progress-bar-track {
                    width: 100%;
                    height: 10px;
                    background: rgba(255,255,255,0.22);
                    border-radius: var(--cb-r-pill);
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #fff;
                    border-radius: var(--cb-r-pill);
                    transition: width 0.6s ease;
                    box-shadow: 0 0 12px rgba(255,255,255,0.5);
                }
                .slot-dots { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
                .slot-dot {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: 2.5px solid rgba(255,255,255,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    position: relative;
                }
                .slot-dot.used { background: rgba(255,255,255,0.25); border-color: #fff; }
                .slot-dot.empty { background: rgba(255,255,255,0.08); }
                .slot-dot.empty span { color: rgba(255,255,255,0.5); font-size: 16px; }

                /* Quick actions */
                .quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
                .qa-card {
                    background: #fff;
                    border-radius: var(--cb-r-card);
                    border: 1px solid var(--cb-line);
                    padding: 22px 18px;
                    text-align: center;
                    box-shadow: var(--cb-shadow-xs);
                    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    color: inherit;
                    text-decoration: none;
                }
                .qa-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--cb-shadow-md);
                    border-color: rgba(155,47,201,0.25);
                }
                .qa-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: var(--cb-gradient-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                }
                .qa-label { font-size: 13.5px; font-weight: 600; color: var(--cb-ink); line-height: 1.3; }
                .qa-desc { font-size: 12px; color: var(--cb-ink-muted); }

                /* Orders card */
                .orders-card {
                    background: #fff;
                    border-radius: var(--cb-r-card);
                    border: 1px solid var(--cb-line);
                    box-shadow: var(--cb-shadow-xs);
                    overflow: hidden;
                }
                .orders-card-header {
                    padding: 20px 24px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--cb-line);
                }
                .orders-card-header h3 { font-size: 18px; font-weight: 700; }
                .orders-card-header a { font-size: 13.5px; color: var(--cb-purple); font-weight: 600; transition: color 0.2s; }
                .orders-card-header a:hover { color: var(--cb-magenta); }

                /* Settings panel */
                .settings-panel {
                    background: #fff;
                    border-radius: var(--cb-r-card);
                    border: 1px solid var(--cb-line);
                    padding: clamp(20px,3vw,32px);
                    box-shadow: var(--cb-shadow-xs);
                    max-width: 640px;
                }
                .settings-panel h2 { font-size: clamp(1.2rem, 2vw, 1.5rem); font-weight: 700; margin-bottom: 4px; }
                .settings-panel .settings-sub { font-size: 14px; color: var(--cb-ink-muted); margin-bottom: 28px; }
                .settings-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
                .settings-field label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cb-ink-muted); }
                .settings-field-row { display: flex; gap: 8px; }
                .settings-divider { border: none; border-top: 1px solid var(--cb-line); margin: 24px 0; }
                .settings-notif-label { font-size: 13.5px; font-weight: 700; color: var(--cb-ink); margin-bottom: 12px; }
                .settings-notif-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; cursor: pointer; }
                .settings-notif-item span { font-size: 14px; color: var(--cb-ink); }
                .settings-danger-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
                .btn-settings-outline {
                    height: 40px;
                    padding: 0 20px;
                    border-radius: var(--cb-r-pill);
                    border: 1.5px solid var(--cb-line);
                    background: #fff;
                    font-size: 13.5px;
                    font-weight: 600;
                    color: var(--cb-ink);
                    cursor: pointer;
                    font-family: inherit;
                    transition: border-color 0.2s, background 0.2s;
                }
                .btn-settings-outline:hover { border-color: var(--cb-purple); background: var(--cb-lavender); }
                .btn-settings-danger {
                    height: 40px;
                    padding: 0 20px;
                    border-radius: var(--cb-r-pill);
                    border: 1.5px solid #fecaca;
                    background: #fef2f2;
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #dc2626;
                    cursor: pointer;
                    font-family: inherit;
                    transition: background 0.2s;
                }
                .btn-settings-danger:hover { background: #fee2e2; }
                .btn-settings-save {
                    height: 38px;
                    padding: 0 18px;
                    border-radius: var(--cb-r-pill);
                    background: var(--cb-gradient-h);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                    transition: opacity 0.2s;
                    flex-shrink: 0;
                }
                .btn-settings-save:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Addresses / payments section */
                .addr-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

                /* Responsive */
                @media (max-width: 980px) {
                    .acct-wrap { grid-template-columns: 1fr; gap: 24px; padding: 24px 16px 48px; }
                    .acct-sidebar { position: static; }
                    .sidebar-profile { display: flex; flex-direction: row; align-items: center; gap: 14px; text-align: left; }
                    .sidebar-avatar { margin: 0; width: 52px; height: 52px; font-size: 18px; flex-shrink: 0; }
                    .sidebar-plan-badge { margin-top: 6px; }
                    .acct-nav { display: flex; flex-wrap: nowrap; overflow-x: auto; padding: 8px 12px; scrollbar-width: none; }
                    .acct-nav::-webkit-scrollbar { display: none; }
                    .acct-nav-link { flex-shrink: 0; white-space: nowrap; border-left: none !important; border-bottom: 3px solid transparent; padding: 10px 14px; font-size: 13.5px; }
                    .acct-nav-link.active { border-bottom-color: var(--cb-purple) !important; border-left: none !important; background: transparent; }
                    .sidebar-signout { display: none; }
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                    .quick-actions { grid-template-columns: repeat(2, 1fr); }
                    .addr-pay-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                    .quick-actions { grid-template-columns: repeat(2, 1fr); }
                    .plan-summary-card { padding: 22px 20px; }
                    .psc-name { font-size: 1.6rem; }
                }
            `}</style>

            <div className="acct-page">
                <div className="acct-wrap">

                    {/* SIDEBAR */}
                    <aside className="acct-sidebar" aria-label="Account navigation">
                        <div className="sidebar-profile">
                            <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
                            <div>
                                <div className="sidebar-name">{user?.name ?? "My Account"}</div>
                                <div className="sidebar-email">{user?.email ?? ""}</div>
                                {sub && (
                                    <span className="sidebar-plan-badge">
                                        <span aria-hidden="true">★</span>
                                        {sub.plan?.name ?? "Active"}
                                    </span>
                                )}
                            </div>
                        </div>
                        <nav className="acct-nav" aria-label="Account sections">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`acct-nav-link${item.id === "overview" ? " active" : ""}`}
                                    id={`nav-${item.id}`}
                                    onClick={() => changeTab(item.id)}
                                    aria-current={item.id === "overview" ? "page" : undefined}
                                >
                                    <span className="nav-ic" aria-hidden="true">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                        <div className="sidebar-signout">
                            <button className="sidebar-signout-btn" onClick={handleSignOut}>
                                <span aria-hidden="true">&#x2192;</span> Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="acct-content">

                        {/* ===== OVERVIEW TAB ===== */}
                        <div className="tab-content" id="tab-overview" style={{ display: "block" }}>
                                {/* Greeting */}
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>{getGreeting()}, {firstName} &#128075;</h1>
                                    {sub && (
                                        <p className="greeting-sub">
                                            {openSlots > 0
                                                ? `You have ${openSlots} open slot${openSlots !== 1 ? "s" : ""} remaining this season.`
                                                : "All your holiday slots are reserved, you're all set!"}
                                        </p>
                                    )}
                                    {!sub && (
                                        <p className="greeting-sub">
                                            Subscribe to a plan to start reserving holiday decorations.
                                        </p>
                                    )}
                                </div>

                                {/* Stats row */}
                                <div className="stats-row" aria-label="Account summary statistics">
                                    <div className="stat-card">
                                        <div className="stat-num">{slotsUsed}</div>
                                        <div className="stat-label">Holidays decorated this cycle</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-num">{openSlots}</div>
                                        <div className="stat-label">Open slots remaining</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-num">{sub ? sub.plan?.name ?? ", " : "None"}</div>
                                        <div className="stat-label">Current plan</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-num">{slotsTotal}</div>
                                        <div className="stat-label">Total slots per year</div>
                                    </div>
                                </div>

                                {/* Plan summary card */}
                                <div>
                                    <div className="acct-section-label">Current Plan</div>
                                    {sub ? (
                                        <div
                                            className="plan-summary-card"
                                            role="region"
                                            aria-label="Current subscription plan"
                                        >
                                            <div className="psc-row">
                                                <div>
                                                    <div className="psc-tier">Active Subscription</div>
                                                    <div className="psc-name">{sub.plan?.name ?? "Plan"}</div>
                                                    {sub.nextBillingAt && (
                                                        <div className="psc-renew">
                                                            Renews {formatRenewDate(sub.nextBillingAt)}
                                                            {sub.billingCycle === "MONTHLY" ? " • Monthly" : " • Yearly"}
                                                        </div>
                                                    )}
                                                    <div className="psc-actions">
                                                        <Link href="/subscription" className="btn-psc-white">
                                                            Change Plan
                                                        </Link>
                                                        <Link href="/account/subscription" className="btn-psc-solid">
                                                            Manage &#8594;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slot-progress-wrap">
                                                <div className="slot-labels">
                                                    <span>Holiday slots used</span>
                                                    <strong>{slotsUsed} of {slotsTotal}</strong>
                                                </div>
                                                <div
                                                    className="progress-bar-track"
                                                    role="progressbar"
                                                    aria-valuenow={slotsUsed}
                                                    aria-valuemin={0}
                                                    aria-valuemax={slotsTotal}
                                                    aria-label={`${slotsUsed} of ${slotsTotal} holiday slots used`}
                                                >
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${slotsPct}%` }}
                                                    />
                                                </div>
                                                <div className="slot-dots" aria-label="Slot detail">
                                                    {(sub.holidaySlots ?? []).map((slot, idx) => (
                                                        <div
                                                            key={slot.id ?? idx}
                                                            className={`slot-dot${slot.status !== "PENDING" ? " used" : " empty"}`}
                                                            title={slot.status !== "PENDING" ? "Used slot" : "Open slot"}
                                                        >
                                                            {slot.status === "PENDING" && (
                                                                <span aria-hidden="true">+</span>
                                                            )}
                                                            {slot.status !== "PENDING" && (
                                                                <span
                                                                    style={{
                                                                        fontSize: 10,
                                                                        fontWeight: 700,
                                                                        color: "rgba(255,255,255,0.9)",
                                                                        textAlign: "center",
                                                                        lineHeight: 1.1,
                                                                        padding: "0 2px",
                                                                    }}
                                                                >
                                                                    &#10003;
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                background: "var(--cb-lavender)",
                                                border: "2px dashed rgba(155,47,201,0.22)",
                                                borderRadius: "var(--cb-r-card)",
                                                padding: "32px 28px",
                                                textAlign: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 14,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: "50%",
                                                    background: "var(--cb-gradient-soft)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 26,
                                                }}
                                            >&#9733;</div>
                                            <div>
                                                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                                                    No active subscription
                                                </div>
                                                <div style={{ fontSize: 14, color: "var(--cb-ink-muted)" }}>
                                                    Pick a plan to start your first holiday cycle.
                                                </div>
                                            </div>
                                            <Link href="/subscription" className="cb-pill-grad" style={{ marginTop: 4 }}>
                                                Browse plans &#8594;
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Active rentals */}
                                <ActiveRentals />

                                {/* Recent orders */}
                                <div className="orders-card" role="region" aria-label="Recent orders">
                                    <div className="orders-card-header">
                                        <h3>Recent Orders</h3>
                                        <button
                                            className="sidebar-signout-btn"
                                            style={{ color: "var(--cb-purple)", fontSize: 13.5, fontWeight: 600 }}
                                            onClick={() => changeTab("orders")}
                                        >
                                            View all orders &#8594;
                                        </button>
                                    </div>
                                    <div style={{ padding: "8px 0" }}>
                                        <RecentRentals />
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div>
                                    <div className="acct-section-label">Quick Actions</div>
                                    <div className="quick-actions">
                                        <Link href="/catalog" className="qa-card" aria-label="Browse kits and add a holiday">
                                            <div className="qa-icon" aria-hidden="true">🏡</div>
                                            <div className="qa-label">Add a Holiday</div>
                                            <div className="qa-desc">
                                                {openSlots > 0 ? `${openSlots} open slot${openSlots !== 1 ? "s" : ""} remaining` : "Browse kits"}
                                            </div>
                                        </Link>
                                        <button
                                            className="qa-card"
                                            aria-label="View your orders"
                                            onClick={() => changeTab("orders")}
                                        >
                                            <div className="qa-icon" aria-hidden="true">📦</div>
                                            <div className="qa-label">My Orders</div>
                                            <div className="qa-desc">Track &amp; manage rentals</div>
                                        </button>
                                        <button
                                            className="qa-card"
                                            aria-label="Manage your delivery addresses"
                                            onClick={() => changeTab("addresses")}
                                        >
                                            <div className="qa-icon" aria-hidden="true">🏠</div>
                                            <div className="qa-label">Manage Addresses</div>
                                            <div className="qa-desc">Update delivery info</div>
                                        </button>
                                        <button
                                            className="qa-card"
                                            aria-label="Account settings and preferences"
                                            onClick={() => changeTab("settings")}
                                        >
                                            <div className="qa-icon" aria-hidden="true">⚙️</div>
                                            <div className="qa-label">Account Settings</div>
                                            <div className="qa-desc">Password &amp; notifications</div>
                                        </button>
                                    </div>
                                </div>
                        </div>

                        {/* ===== SUBSCRIPTION TAB ===== */}
                        <div className="tab-content" id="tab-subscription" style={{ display: "none" }}>
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>My Subscription</h1>
                                    <p className="greeting-sub">Manage your plan, billing, and holiday slots.</p>
                                </div>
                                <SubscriptionCard />
                        </div>

                        {/* ===== SLOTS TAB ===== */}
                        <div className="tab-content" id="tab-slots" style={{ display: "none" }}>
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>Holiday Slots</h1>
                                    <p className="greeting-sub">Your reserved holiday rentals for this cycle.</p>
                                </div>
                                {sub ? (
                                    <div>
                                        <div className="acct-section-label">Slot Usage</div>
                                        <div
                                            className="plan-summary-card"
                                            role="region"
                                            aria-label="Slot usage for current plan"
                                        >
                                            <div className="psc-row">
                                                <div>
                                                    <div className="psc-tier">
                                                        {sub.plan?.name ?? "Plan"} Plan
                                                    </div>
                                                    <div className="psc-name">
                                                        {slotsUsed} of {slotsTotal} slots used
                                                    </div>
                                                    <div className="psc-renew">
                                                        {openSlots} slot{openSlots !== 1 ? "s" : ""} available for reservation
                                                    </div>
                                                    <div className="psc-actions">
                                                        <Link href="/catalog" className="btn-psc-solid">
                                                            Browse holidays &#8594;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slot-progress-wrap">
                                                <div className="slot-labels">
                                                    <span>Holiday slots used</span>
                                                    <strong>{slotsUsed} of {slotsTotal}</strong>
                                                </div>
                                                <div
                                                    className="progress-bar-track"
                                                    role="progressbar"
                                                    aria-valuenow={slotsUsed}
                                                    aria-valuemin={0}
                                                    aria-valuemax={slotsTotal}
                                                >
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${slotsPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 28 }}>
                                            <div className="acct-section-label">Your Slots</div>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                                    gap: 16,
                                                }}
                                            >
                                                {(sub.holidaySlots ?? []).map((slot, idx) => (
                                                    <div
                                                        key={slot.id ?? idx}
                                                        style={{
                                                            background: "#fff",
                                                            borderRadius: "var(--cb-r-card)",
                                                            border: "1px solid var(--cb-line)",
                                                            padding: "20px 18px",
                                                            boxShadow: "var(--cb-shadow-xs)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: 5,
                                                                padding: "4px 12px",
                                                                borderRadius: "var(--cb-r-pill)",
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.07em",
                                                                marginBottom: 10,
                                                                background:
                                                                    slot.status === "PENDING"
                                                                        ? "rgba(155,47,201,0.08)"
                                                                        : "#dcfce7",
                                                                color:
                                                                    slot.status === "PENDING"
                                                                        ? "var(--cb-purple)"
                                                                        : "#16a34a",
                                                            }}
                                                        >
                                                            {slot.status === "PENDING" ? "Open" : "Reserved"}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontFamily:
                                                                    "'Playfair Display', Georgia, serif",
                                                                fontSize: 17,
                                                                fontWeight: 700,
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            {`Slot ${slot.slotNumber ?? idx + 1}`}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12.5,
                                                                color: "var(--cb-ink-muted)",
                                                            }}
                                                        >
                                                            {slot.status === "PENDING"
                                                                ? "Choose a holiday from the shop"
                                                                : "Holiday reserved"}
                                                        </div>
                                                        {slot.status === "PENDING" && (
                                                            <Link
                                                                href="/catalog"
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: 4,
                                                                    marginTop: 12,
                                                                    fontSize: 12.5,
                                                                    fontWeight: 600,
                                                                    color: "var(--cb-magenta)",
                                                                }}
                                                            >
                                                                Select &#8594;
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            background: "var(--cb-lavender)",
                                            borderRadius: "var(--cb-r-card)",
                                            padding: "40px 28px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <p style={{ color: "var(--cb-ink-muted)", marginBottom: 16 }}>
                                            No active subscription. Subscribe to get holiday slots.
                                        </p>
                                        <Link href="/subscription" className="cb-pill-grad">
                                            Browse plans
                                        </Link>
                                    </div>
                                )}
                        </div>

                        {/* ===== ORDERS TAB ===== */}
                        <div className="tab-content" id="tab-orders" style={{ display: "none" }}>
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>Orders</h1>
                                    <p className="greeting-sub">View and manage your rental orders.</p>
                                </div>
                                <ActiveRentals />
                                <div className="orders-card">
                                    <div className="orders-card-header">
                                        <h3>Recent Orders</h3>
                                    </div>
                                    <div style={{ padding: "8px 0" }}>
                                        <RecentRentals />
                                    </div>
                                </div>
                        </div>

                        {/* ===== ADDRESSES TAB ===== */}
                        <div className="tab-content" id="tab-addresses" style={{ display: "none" }}>
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>Addresses &amp; Payment</h1>
                                    <p className="greeting-sub">Manage your delivery address and payment method.</p>
                                </div>
                                <div className="addr-pay-grid">
                                    <AddressCard />
                                    <PaymentCard />
                                </div>
                        </div>

                        {/* ===== SETTINGS TAB ===== */}
                        <div className="tab-content" id="tab-settings" style={{ display: "none" }}>
                                <div className="acct-greeting">
                                    <div className="greeting-eyebrow">My Account</div>
                                    <h1>Account Settings</h1>
                                    <p className="greeting-sub">Manage your profile info and preferences.</p>
                                </div>
                                <SettingsPanel
                                    name={user?.name ?? ""}
                                    email={user?.email ?? ""}
                                    onSignOut={handleSignOut}
                                />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function SettingsPanel({
    name,
    email,
    onSignOut,
}: {
    name: string;
    email: string;
    onSignOut: () => void;
}) {
    const handleChangePassword = () => {
        toast.info("We've sent a password reset link to your email.");
    };
    const handleDelete = () => {
        toast.warning("Please contact support to delete your account.");
    };

    return (
        <div className="settings-panel">
            <h2>Account Settings</h2>
            <p className="settings-sub">Manage your account info and notification preferences.</p>

            <div className="settings-field">
                <label htmlFor="settings-name">Full Name</label>
                <div className="settings-field-row">
                    <EditableField
                        id="settings-name"
                        label="Full Name"
                        initialValue={name}
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div className="settings-field">
                <label htmlFor="settings-email">Email</label>
                <div className="settings-field-row">
                    <EditableField
                        id="settings-email"
                        label="Email"
                        initialValue={email}
                        placeholder="you@email.com"
                        type="email"
                    />
                </div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-notif-label">Notification Preferences</div>
            {[
                { id: "kits", label: "Email me about new holiday kits", checked: true },
                { id: "returns", label: "Send return reminders", checked: true },
                { id: "promo", label: "Promotional offers and discounts", checked: false },
                { id: "renewal", label: "Subscription renewal reminders", checked: true },
            ].map((pref) => (
                <label key={pref.id} className="settings-notif-item">
                    <Checkbox id={`notif-${pref.id}`} defaultChecked={pref.checked} />
                    <span>{pref.label}</span>
                </label>
            ))}

            <hr className="settings-divider" />

            <div className="settings-danger-row">
                <button className="btn-settings-outline" onClick={handleChangePassword}>
                    Change Password
                </button>
                <button className="btn-settings-danger" onClick={handleDelete}>
                    Delete Account
                </button>
                <button className="btn-settings-outline" onClick={onSignOut}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

function EditableField({
    id,
    label,
    initialValue,
    placeholder,
    type = "text",
}: {
    id?: string;
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
        setSaving(true);
        setTimeout(() => {
            setSavedValue(value);
            setSaving(false);
            toast.success(`${label} updated`);
        }, 200);
    };

    return (
        <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "center" }}>
            <Input
                id={id}
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
                style={{ flex: 1 }}
            />
            <button
                type="button"
                className="btn-settings-save"
                onClick={handleSave}
                disabled={!dirty || saving}
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
