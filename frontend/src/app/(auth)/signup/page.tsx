import Link from "next/link";
import { SignupForm } from "./form";

const baseURL = "";

export default function Signup() {
    return (
        <>
            <style>{`
                .cb-auth-split {
                    min-height: 100svh;
                    display: grid;
                    grid-template-columns: 60% 40%;
                    font-family: 'Geist Sans', 'Inter', system-ui, sans-serif;
                    color: #1A0B2E;
                    line-height: 1.55;
                    -webkit-font-smoothing: antialiased;
                }
                /* Brand panel — right */
                .cb-auth-brand {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    color: #fff;
                    background: linear-gradient(135deg, #9B2FC9 0%, #DC0075 100%);
                    order: 2;
                }
                .cb-auth-brand-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .cb-auth-brand-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.32;
                    display: block;
                }
                .cb-auth-brand-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, rgba(155,47,201,0.55) 0%, rgba(220,0,117,0.52) 100%);
                }
                .cb-auth-brand-content {
                    position: relative;
                    z-index: 2;
                    max-width: 360px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                    align-items: center;
                }
                .cb-auth-monogram {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 88px;
                    font-weight: 800;
                    line-height: 1;
                    opacity: 0.92;
                    color: #fff;
                }
                .cb-auth-quote {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 21px;
                    font-style: italic;
                    line-height: 1.45;
                    color: #fff;
                }
                .cb-auth-attr {
                    font-size: 14px;
                    color: rgba(255,255,255,0.78);
                }
                .cb-auth-perks {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                    margin-top: 4px;
                }
                .cb-auth-perk {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255,255,255,0.13);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 14px;
                    padding: 12px 16px;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    text-align: left;
                }
                .cb-auth-perk .perk-ico {
                    font-size: 20px;
                    flex-shrink: 0;
                }
                .cb-auth-perk .perk-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.92);
                    line-height: 1.4;
                }
                .cb-auth-perk .perk-text strong {
                    display: block;
                    font-weight: 700;
                    color: #fff;
                    font-size: 14px;
                }
                /* Form panel — left */
                .cb-auth-form-panel {
                    order: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 40px 56px;
                    min-height: 100svh;
                    justify-content: center;
                    align-items: center;
                    background: #fff;
                    position: relative;
                }
                .cb-auth-back {
                    display: none;
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    font-size: 14px;
                    color: #5B4A6B;
                    align-items: center;
                    gap: 6px;
                    z-index: 10;
                    text-decoration: none;
                    transition: color .2s;
                }
                .cb-auth-back:hover { color: #9B2FC9; }
                @media (max-width: 980px) {
                    .cb-auth-split { grid-template-columns: 1fr; }
                    .cb-auth-brand { display: none; }
                    .cb-auth-form-panel { padding: 72px 28px 56px; min-height: 100vh; }
                    .cb-auth-back { display: inline-flex; }
                }
                @media (max-width: 1100px) {
                    .cb-auth-form-panel { padding: 40px 40px; }
                }
            `}</style>
            <div className="cb-auth-split">
                {/* Brand panel (right side) */}
                <div className="cb-auth-brand" aria-hidden="true">
                    <div className="cb-auth-brand-bg">
                        <img
                            src={`${baseURL}/uploads/holidays/diwali.png`}
                            alt=""
                        />
                    </div>
                    <div className="cb-auth-brand-content">
                        <div className="cb-auth-monogram">CB</div>
                        <p className="cb-auth-quote">
                            "I haven't bought a single decoration in two years. CeleBrease handles everything — beautifully."
                        </p>
                        <p className="cb-auth-attr">— Priya K., New York, Premium member</p>
                        <div className="cb-auth-perks">
                            <div className="cb-auth-perk">
                                <span className="perk-ico">🛡️</span>
                                <div className="perk-text">
                                    <strong>Deposit always refunded</strong>
                                    Return your kit and get 100% back, every time.
                                </div>
                            </div>
                            <div className="cb-auth-perk">
                                <span className="perk-ico">🚚</span>
                                <div className="perk-text">
                                    <strong>Free shipping both ways</strong>
                                    We handle delivery and pickup — no fees ever.
                                </div>
                            </div>
                            <div className="cb-auth-perk">
                                <span className="perk-ico">✕</span>
                                <div className="perk-text">
                                    <strong>Cancel anytime</strong>
                                    No contracts, no hidden fees, no stress.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form panel (left side) */}
                <div className="cb-auth-form-panel">
                    <Link href="/" className="cb-auth-back" aria-label="Back to home">
                        &larr; Back to home
                    </Link>
                    <SignupForm />
                </div>
            </div>
        </>
    );
}
