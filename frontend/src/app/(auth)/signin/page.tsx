import Link from "next/link";
import { SigninForm } from "./form";

const holidayImages = [
    { src: `/uploads/holidays/passover-premium-angle1.jpg`, name: "Passover", span: "tall" },
    { src: `/uploads/holidays/dia-de-los-muertos-premium-angle1.jpg`, name: "Dia de los Muertos", span: "" },
    { src: `/uploads/holidays/cinco-de-mayo-premium-angle1.jpg`, name: "Cinco de Mayo", span: "" },
    { src: `/uploads/holidays/holi-premium-angle1.jpg`, name: "Holi", span: "" },
    { src: `/uploads/holidays/independence-day-premium-angle1.jpg`, name: "Independence Day", span: "" },
    { src: `/uploads/holidays/st-patricks-day-premium-angle1.jpg`, name: "St. Patrick's Day", span: "wide" },
    { src: `/uploads/holidays/graduations-premium-angle1.jpg`, name: "Graduations", span: "" },
    { src: `/uploads/holidays/lunar-new-year-premium-angle1.jpg`, name: "Lunar New Year", span: "" },
];

const holidayPills = [
    { src: `/uploads/holidays/passover-premium-angle1.jpg`, name: "Passover" },
    { src: `/uploads/holidays/cinco-de-mayo-premium-angle1.jpg`, name: "Cinco de Mayo" },
    { src: `/uploads/holidays/dia-de-los-muertos-premium-angle1.jpg`, name: "Dia de los Muertos" },
    { src: `/uploads/holidays/independence-day-premium-angle1.jpg`, name: "Independence Day" },
    { src: `/uploads/holidays/holi-premium-angle1.jpg`, name: "Holi" },
    { src: `/uploads/holidays/graduations-premium-angle1.jpg`, name: "Graduations" },
];

const proofImages = [
    { src: `/uploads/holidays/passover-premium-angle1.jpg`, label: "" },
    { src: `/uploads/holidays/cinco-de-mayo-premium-angle1.jpg`, label: "" },
    { src: `/uploads/holidays/dia-de-los-muertos-premium-angle1.jpg`, label: "" },
    { src: `/uploads/holidays/lunar-new-year-premium-angle1.jpg`, label: "" },
];

export default function Signin() {
    return (
        <>
            <style>{`
                .cb-auth-body {
                    background: linear-gradient(160deg, #F6F1FB 0%, #FCE7F3 50%, #F0E8FF 100%);
                    min-height: 100vh;
                }
                .cb-auth-wrap {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: stretch;
                }
                .cb-brand-panel {
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
                .cb-brand-panel::before {
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
                .cb-brand-panel::after {
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
                .cb-brand-montage {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    gap: 3px;
                }
                .cb-brand-montage::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, rgba(155,47,201,0.72) 0%, rgba(220,0,117,0.60) 55%, rgba(74,18,89,0.82) 100%);
                    z-index: 1;
                }
                .cb-montage-cell {
                    overflow: hidden;
                    position: relative;
                }
                .cb-montage-cell img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .cb-montage-tall { grid-row: span 2; }
                .cb-montage-wide { grid-column: span 2; }
                .cb-brand-content {
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
                .cb-brand-tagline-pre {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.18em;
                    color: rgba(255,255,255,0.7);
                    font-weight: 700;
                }
                .cb-brand-headline {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.7rem, 2.8vw, 2.4rem);
                    font-weight: 700;
                    line-height: 1.18;
                    color: #fff;
                    letter-spacing: -0.01em;
                }
                .cb-brand-sub {
                    font-size: 15px;
                    color: rgba(255,255,255,0.82);
                    line-height: 1.6;
                    max-width: 320px;
                }
                .cb-brand-proof {
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
                .cb-proof-imgs {
                    display: flex;
                }
                .cb-proof-img {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.7);
                    margin-left: -10px;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: rgba(155,47,201,0.3);
                }
                .cb-proof-img:first-child { margin-left: 0; }
                .cb-proof-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cb-proof-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.9);
                    line-height: 1.4;
                }
                .cb-proof-stars { color: #F9E048; }
                .cb-holiday-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                }
                .cb-h-pill {
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
                .cb-h-pill img {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: inline-block;
                    flex-shrink: 0;
                }
                .cb-form-panel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(32px,5vw,64px) clamp(24px,5vw,64px);
                    background: rgba(255,255,255,0.72);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                }
                .cb-auth-card {
                    width: 100%;
                    max-width: 460px;
                    background: #fff;
                    border-radius: 28px;
                    box-shadow: 0 24px 56px rgba(155,47,201,0.22);
                    padding: clamp(32px,5vw,48px);
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .cb-card-logo {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .cb-card-logo-name {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.6rem;
                    font-weight: 800;
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.02em;
                }
                .cb-card-heading {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.4rem, 2.5vw, 1.85rem);
                    font-weight: 700;
                    text-align: center;
                    line-height: 1.2;
                    color: #1A0B2E;
                    margin-bottom: 6px;
                    letter-spacing: -0.01em;
                }
                .cb-card-sub {
                    font-size: 15px;
                    color: #5B4A6B;
                    text-align: center;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }
                @media (max-width: 980px) {
                    .cb-auth-wrap {
                        grid-template-columns: 1fr;
                        min-height: unset;
                    }
                    .cb-brand-panel {
                        min-height: 340px;
                        padding: 32px 24px 36px;
                    }
                    .cb-brand-montage {
                        grid-template-rows: 1fr 1fr;
                    }
                    .cb-brand-headline { font-size: 1.6rem; }
                    .cb-form-panel {
                        padding: 40px 20px 60px;
                        background: transparent;
                        backdrop-filter: none;
                        -webkit-backdrop-filter: none;
                    }
                }
                @media (max-width: 600px) {
                    .cb-brand-panel { min-height: 280px; padding: 24px 16px 28px; }
                    .cb-brand-montage { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
                    .cb-montage-tall { grid-row: auto; }
                    .cb-montage-wide { grid-column: auto; }
                    .cb-auth-card { padding: 28px 20px; border-radius: 22px; }
                    .cb-holiday-pills { gap: 6px; }
                    .cb-h-pill { font-size: 11px; padding: 5px 10px; }
                    .cb-brand-proof { flex-direction: column; text-align: center; }
                    .cb-proof-imgs { justify-content: center; }
                }
            `}</style>

            <div className="cb-auth-body">
                <div className="cb-auth-wrap">

                    {/* LEFT: BRAND PANEL */}
                    <div className="cb-brand-panel" aria-hidden="true">

                        {/* Holiday image montage */}
                        <div className="cb-brand-montage">
                            {holidayImages.map((img) => (
                                <div
                                    key={img.name}
                                    className={[
                                        "cb-montage-cell",
                                        img.span === "tall" ? "cb-montage-tall" : "",
                                        img.span === "wide" ? "cb-montage-wide" : "",
                                    ].filter(Boolean).join(" ")}
                                >
                                    <img src={img.src} alt="" />
                                </div>
                            ))}
                        </div>

                        {/* Floating content */}
                        <div className="cb-brand-content">

                            {/* Holiday pills */}
                            <div className="cb-holiday-pills">
                                {holidayPills.map((pill) => (
                                    <span key={pill.name} className="cb-h-pill">
                                        <img src={pill.src} alt="" />
                                        {pill.name}
                                    </span>
                                ))}
                            </div>

                            <p className="cb-brand-tagline-pre">CeleBrease · Holiday Decor by Subscription</p>

                            <h2 className="cb-brand-headline">
                                Your home, dressed<br />for every celebration.
                            </h2>

                            <p className="cb-brand-sub">
                                Designer curated kits delivered to your door. Decorate beautifully, store nothing, get your deposit back every time.
                            </p>

                            {/* Social proof */}
                            <div className="cb-brand-proof">
                                <div className="cb-proof-imgs">
                                    {proofImages.map((img, i) => (
                                        <div key={i} className="cb-proof-img" role="img" aria-label="">
                                            <img src={img.src} alt="" />
                                        </div>
                                    ))}
                                </div>
                                <div className="cb-proof-text">
                                    Loved by <strong>2,400+ families</strong><br />
                                    Free shipping both ways · Deposit always refundable
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT: FORM PANEL */}
                    <div className="cb-form-panel">
                        <div className="cb-auth-card">

                            {/* Logo */}
                            <div className="cb-card-logo">
                                <Link href="/" aria-label="CeleBrease home">
                                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <rect width="44" height="44" rx="12" fill="url(#cb-logo-grad)" />
                                        <text x="22" y="30" textAnchor="middle" fontSize="22" fontFamily="serif" fill="white" fontWeight="bold">C</text>
                                        <defs>
                                            <linearGradient id="cb-logo-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#9B2FC9" />
                                                <stop offset="1" stopColor="#DC0075" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </Link>
                                <span className="cb-card-logo-name">CeleBrease</span>
                            </div>

                            <h1 className="cb-card-heading">
                                Welcome back to<br />your celebration.
                            </h1>
                            <p className="cb-card-sub">Your saved kits and holiday slots are waiting.</p>

                            <SigninForm />

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
