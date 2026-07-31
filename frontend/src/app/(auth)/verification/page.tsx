import { redirect } from "next/navigation";
import { z } from "zod";
import { VerificationForm } from "./form";
import Link from "next/link";
import Image from "next/image";

const verifySchema = z.object({
    user: z.email("Enter your email address"),
    type: z.enum(["signup", "reset"]),
});

const baseURL = "";

const holidayImages = [
    { src: `${baseURL}/uploads/holidays/christmas.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/diwali.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/valentines-day.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/hanukkah.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/easter.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/halloween.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/ramadan.png`, alt: "" },
    { src: `${baseURL}/uploads/holidays/nowruz.png`, alt: "" },
];

const pills = [
    { name: "Christmas", img: `${baseURL}/uploads/holidays/christmas.png` },
    { name: "Diwali", img: `${baseURL}/uploads/holidays/diwali.png` },
    { name: "Halloween", img: `${baseURL}/uploads/holidays/halloween.png` },
    { name: "Nowruz", img: `${baseURL}/uploads/holidays/nowruz.png` },
    { name: "Eid", img: `${baseURL}/uploads/holidays/eid.png` },
    { name: "Easter", img: `${baseURL}/uploads/holidays/easter.png` },
];

export default async function Verify({ searchParams }: { searchParams: Promise<{ user?: string; type?: "signup" | "reset" }> }) {
    const { user, type } = await searchParams;
    if (!user || !type || !verifySchema.safeParse({ user, type }).success) {
        redirect("/signin");
    }

    return (
        <>
            <style>{`
                .cb-auth-verify-wrap {
                    position: fixed;
                    inset: 0;
                    z-index: 50;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: linear-gradient(160deg, #F6F1FB 0%, #FCE7F3 50%, #F0E8FF 100%);
                }
                .cb-auth-brand-panel {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 48px 40px;
                    background: linear-gradient(135deg, #9B2FC9 0%, #DC0075 100%);
                    min-height: 600px;
                }
                .cb-auth-brand-panel::before {
                    content: '';
                    position: absolute;
                    top: -80px;
                    right: -80px;
                    width: 420px;
                    height: 420px;
                    background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 65%);
                    pointer-events: none;
                    z-index: 2;
                }
                .cb-auth-brand-panel::after {
                    content: '';
                    position: absolute;
                    bottom: -60px;
                    left: -60px;
                    width: 320px;
                    height: 320px;
                    background: radial-gradient(circle, rgba(26,11,46,0.25), transparent 70%);
                    pointer-events: none;
                    z-index: 2;
                }
                .cb-auth-montage {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    gap: 3px;
                }
                .cb-auth-montage::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, rgba(155,47,201,0.72) 0%, rgba(220,0,117,0.60) 55%, rgba(74,18,89,0.82) 100%);
                    z-index: 1;
                }
                .cb-auth-montage-cell {
                    overflow: hidden;
                    position: relative;
                }
                .cb-auth-montage-cell img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .cb-auth-montage-cell.tall { grid-row: span 2; }
                .cb-auth-montage-cell.wide { grid-column: span 2; }
                .cb-auth-brand-content {
                    position: relative;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    text-align: center;
                    color: #fff;
                    width: 100%;
                    max-width: 380px;
                }
                .cb-auth-tagline-pre {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.18em;
                    color: rgba(255,255,255,0.7);
                    font-weight: 700;
                }
                .cb-auth-headline {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.7rem, 2.8vw, 2.4rem);
                    font-weight: 700;
                    line-height: 1.18;
                    color: #fff;
                    margin: 0;
                }
                .cb-auth-sub {
                    font-size: 15px;
                    color: rgba(255,255,255,0.82);
                    line-height: 1.6;
                    max-width: 320px;
                }
                .cb-auth-proof {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 14px;
                    padding: 14px 18px;
                    width: 100%;
                }
                .cb-auth-proof-imgs {
                    display: flex;
                }
                .cb-auth-proof-imgs span {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.7);
                    margin-left: -10px;
                    background-size: cover;
                    background-position: center;
                    flex-shrink: 0;
                }
                .cb-auth-proof-imgs span:first-child { margin-left: 0; }
                .cb-auth-proof-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.9);
                    line-height: 1.4;
                }
                .cb-auth-proof-text b { color: #fff; }
                .cb-auth-proof-stars { color: #F9E048; }
                .cb-auth-holiday-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                }
                .cb-auth-h-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.25);
                    border-radius: 9999px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: rgba(255,255,255,0.92);
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
                .cb-auth-h-pill img {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: inline-block;
                }
                .cb-auth-form-panel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(32px, 5vw, 64px) clamp(24px, 5vw, 64px);
                    background: rgba(255,255,255,0.72);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    overflow-y: auto;
                }
                .cb-auth-card {
                    width: 100%;
                    max-width: 460px;
                    background: #fff;
                    border-radius: 28px;
                    box-shadow: 0 24px 56px rgba(155,47,201,0.22);
                    padding: clamp(32px, 5vw, 48px);
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .cb-auth-card-logo {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .cb-auth-card-logo-name {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.6rem;
                    font-weight: 800;
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.02em;
                }
                .cb-auth-verify-icon-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }
                .cb-auth-verify-icon {
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%);
                    border: 1.5px solid rgba(155,47,201,0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 16px rgba(155,47,201,0.08);
                }
                .cb-auth-card-heading {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.4rem, 2.5vw, 1.85rem);
                    font-weight: 700;
                    text-align: center;
                    line-height: 1.2;
                    color: #1A0B2E;
                    margin-bottom: 6px;
                    margin-top: 0;
                }
                .cb-auth-card-sub {
                    font-size: 15px;
                    color: #5B4A6B;
                    text-align: center;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }
                .cb-auth-email-chip {
                    display: inline-block;
                    background: #F6F1FB;
                    color: #9B2FC9;
                    font-weight: 700;
                    font-size: 14px;
                    padding: 3px 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(155,47,201,0.12);
                    word-break: break-all;
                }
                .cb-auth-wrong-email {
                    text-align: center;
                    font-size: 14px;
                    color: #5B4A6B;
                    margin-top: 4px;
                }
                .cb-auth-wrong-email a {
                    color: #5B4A6B;
                    font-weight: 500;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                    transition: color .2s;
                }
                .cb-auth-wrong-email a:hover { color: #9B2FC9; }
                @media (max-width: 980px) {
                    .cb-auth-verify-wrap {
                        position: relative;
                        grid-template-columns: 1fr;
                    }
                    .cb-auth-brand-panel {
                        min-height: 340px;
                        padding: 32px 24px 36px;
                    }
                    .cb-auth-montage {
                        grid-template-rows: 1fr 1fr;
                    }
                    .cb-auth-headline { font-size: 1.6rem; }
                    .cb-auth-form-panel {
                        padding: 40px 20px 60px;
                        background: transparent;
                        backdrop-filter: none;
                        -webkit-backdrop-filter: none;
                    }
                }
                @media (max-width: 600px) {
                    .cb-auth-brand-panel { min-height: 280px; padding: 24px 16px 28px; }
                    .cb-auth-montage { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
                    .cb-auth-montage-cell.tall { grid-row: auto; }
                    .cb-auth-montage-cell.wide { grid-column: auto; }
                    .cb-auth-card { padding: 28px 20px; border-radius: 22px; }
                    .cb-auth-proof { flex-direction: column; text-align: center; }
                    .cb-auth-proof-imgs { justify-content: center; }
                }
            `}</style>

            <div className="cb-auth-verify-wrap">
                {/* LEFT: BRAND PANEL */}
                <div className="cb-auth-brand-panel" aria-hidden="true">
                    <div className="cb-auth-montage">
                        <div className="cb-auth-montage-cell tall">
                            <Image src={holidayImages[0].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" priority style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[1].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" priority style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[2].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" priority style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[3].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[4].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell wide">
                            <Image src={holidayImages[5].src} alt="" fill sizes="(max-width: 980px) 100vw, 66vw" style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[6].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                        </div>
                        <div className="cb-auth-montage-cell">
                            <Image src={holidayImages[7].src} alt="" fill sizes="(max-width: 980px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                        </div>
                    </div>

                    <div className="cb-auth-brand-content">
                        <div className="cb-auth-holiday-pills">
                            {pills.map((pill) => (
                                <span key={pill.name} className="cb-auth-h-pill">
                                    <Image src={pill.img} alt="" width={20} height={20} style={{ objectFit: "cover", borderRadius: "50%" }} />
                                    {pill.name}
                                </span>
                            ))}
                        </div>

                        <p className="cb-auth-tagline-pre">CeleBrease &middot; Holiday Decor by Subscription</p>

                        <h2 className="cb-auth-headline">Almost there &mdash; your<br />celebrations await.</h2>

                        <p className="cb-auth-sub">One quick step and you&apos;ll be choosing your holiday kits. Designer decor delivered, zero storage hassle.</p>

                        <div className="cb-auth-proof">
                            <div className="cb-auth-proof-imgs">
                                <span
                                    style={{ backgroundImage: `url(${baseURL}/uploads/holidays/christmas.png)` }}
                                    role="img"
                                    aria-label=""
                                />
                                <span
                                    style={{ backgroundImage: `url(${baseURL}/uploads/holidays/diwali.png)` }}
                                    role="img"
                                    aria-label=""
                                />
                                <span
                                    style={{ backgroundImage: `url(${baseURL}/uploads/holidays/easter.png)` }}
                                    role="img"
                                    aria-label=""
                                />
                                <span
                                    style={{ backgroundImage: `url(${baseURL}/uploads/holidays/halloween.png)` }}
                                    role="img"
                                    aria-label=""
                                />
                            </div>
                            <div className="cb-auth-proof-text">
                                <span className="cb-auth-proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>{" "}
                                <b>4.9</b> &middot; Loved by <b>2,400+ families</b>
                                <br />Free shipping both ways &middot; Deposit always refundable
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: FORM PANEL */}
                <div className="cb-auth-form-panel">
                    <div className="cb-auth-card">
                        {/* Logo */}
                        <div className="cb-auth-card-logo">
                            <Link href="/" aria-label="CeleBrease home">
                                <Image src="/logo.png" alt="CeleBrease logo" width={48} height={48} style={{ height: 48, width: "auto" }} />
                            </Link>
                            <span className="cb-auth-card-logo-name">CeleBrease</span>
                        </div>

                        {/* Envelope icon */}
                        <div className="cb-auth-verify-icon-wrap" aria-hidden="true">
                            <div className="cb-auth-verify-icon">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <rect x="3" y="7" width="26" height="18" rx="3" stroke="url(#ev-grad-v)" strokeWidth="2" fill="none" />
                                    <path d="M3 10l13 9 13-9" stroke="url(#ev-grad-v)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <defs>
                                        <linearGradient id="ev-grad-v" x1="3" y1="7" x2="29" y2="25" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#9B2FC9" />
                                            <stop offset="100%" stopColor="#DC0075" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        <h1 className="cb-auth-card-heading">Verify your email</h1>
                        <p className="cb-auth-card-sub">
                            We sent a {type === "reset" ? "password reset" : "verification"} link to
                            <br />
                            <span className="cb-auth-email-chip">{user}</span>
                        </p>

                        {/* All better-auth logic lives in VerificationForm, untouched */}
                        <VerificationForm user={user} type={type} />

                        <p className="cb-auth-wrong-email">
                            Wrong email?&nbsp;
                            <Link href="/signup">Go back and change it</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
