import { Suspense } from "react";
import Link from "next/link";
import { ResetPasswordForm } from "./form";

const baseURL = "";

export default async function ResetPassword() {
    return (
        <div className="cb">
            <style>{`
                .cb-auth-wrap {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 60% 40%;
                }
                .cb-auth-form-panel {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 64px 48px;
                    position: relative;
                    background: #fff;
                }
                .cb-auth-back {
                    position: absolute;
                    top: 28px;
                    left: 28px;
                    font-size: 14px;
                    color: var(--cb-ink-muted);
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    transition: color .2s;
                    text-decoration: none;
                }
                .cb-auth-back:hover { color: var(--cb-purple); }
                .cb-auth-form-inner {
                    width: 100%;
                    max-width: 440px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .cb-auth-logo-link {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: var(--cb-gradient-h);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 4px;
                    text-decoration: none;
                }
                .cb-auth-form-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    background: var(--cb-gradient-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin: 0 auto;
                    box-shadow: var(--cb-shadow-xs);
                }
                .cb-auth-title {
                    font-size: clamp(1.45rem, 3vw, 1.95rem);
                    text-align: center;
                    line-height: 1.2;
                    color: var(--cb-ink);
                }
                .cb-auth-sub {
                    color: var(--cb-ink-muted);
                    font-size: 16px;
                    text-align: center;
                    line-height: 1.55;
                }
                .cb-auth-bottom-link {
                    text-align: center;
                    font-size: 14px;
                    color: var(--cb-ink-muted);
                }
                .cb-auth-bottom-link a {
                    color: var(--cb-purple);
                    font-weight: 600;
                    text-decoration: none;
                }
                .cb-auth-bottom-link a:hover { text-decoration: underline; }
                /* Brand panel */
                .cb-auth-brand-panel {
                    background: var(--cb-gradient-h);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                    color: #fff;
                }
                .cb-auth-brand-bg {
                    position: absolute;
                    inset: 0;
                }
                .cb-auth-brand-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.3;
                }
                .cb-auth-brand-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(155deg, rgba(155,47,201,0.5), rgba(220,0,117,0.5));
                }
                .cb-auth-brand-content {
                    position: relative;
                    z-index: 2;
                    max-width: 360px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    align-items: center;
                }
                .cb-auth-brand-quote {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 21px;
                    font-style: italic;
                    line-height: 1.45;
                }
                .cb-auth-brand-attr {
                    font-size: 14px;
                    color: rgba(255,255,255,0.75);
                }
                .cb-auth-brand-monogram {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 88px;
                    font-weight: 700;
                    opacity: 0.92;
                    line-height: 1;
                    margin-top: 8px;
                }
                .cb-auth-feature-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    text-align: left;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
                .cb-auth-feature-list li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: rgba(255,255,255,0.92);
                    font-weight: 500;
                }
                .cb-auth-feature-list .check {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    flex-shrink: 0;
                }
                @media (max-width: 980px) {
                    .cb-auth-wrap { grid-template-columns: 1fr; min-height: auto; }
                    .cb-auth-brand-panel { display: none; }
                    .cb-auth-form-panel { padding: 72px 24px 56px; }
                    .cb-auth-back { top: 20px; left: 20px; }
                }
                @media (max-width: 480px) {
                    .cb-auth-form-panel { padding: 72px 20px 48px; }
                }
            `}</style>

            <div className="cb-auth-wrap">
                {/* FORM PANEL */}
                <div className="cb-auth-form-panel">
                    <Link href="/forgot-password" className="cb-auth-back">
                        &#8592; Back
                    </Link>

                    <div className="cb-auth-form-inner">
                        <Link href="/" className="cb-auth-logo-link">
                            <img src="/celebrease-logo.svg" alt="" aria-hidden="true" height={52} />
                            CeleBrease
                        </Link>

                        <div className="cb-auth-form-icon" aria-hidden="true">&#128272;</div>

                        <h1 className="cb-auth-title">Set a new password</h1>
                        <p className="cb-auth-sub">Choose a strong password to protect your CeleBrease account.</p>

                        <Suspense>
                            <ResetPasswordForm />
                        </Suspense>

                        <p className="cb-auth-bottom-link">
                            Remember your password?{" "}
                            <Link href="/signin">&#8592; Back to sign in</Link>
                        </p>
                    </div>
                </div>

                {/* BRAND PANEL */}
                <div className="cb-auth-brand-panel" aria-hidden="true">
                    <div className="cb-auth-brand-bg">
                        <img src={`${baseURL}/uploads/holidays/christmas.png`} alt="" />
                    </div>
                    <div className="cb-auth-brand-content">
                        <p className="cb-auth-brand-quote">
                            &ldquo;Every Christmas morning, our living room looks like it came straight off a magazine cover &mdash; without lifting a storage box.&rdquo;
                        </p>
                        <p className="cb-auth-brand-attr">&mdash; Melissa T., Ultimate member</p>
                        <ul className="cb-auth-feature-list">
                            <li><span className="check">&#10003;</span> Designer kits for every holiday</li>
                            <li><span className="check">&#10003;</span> Free two-way shipping, always</li>
                            <li><span className="check">&#10003;</span> Full deposit refunded on return</li>
                            <li><span className="check">&#10003;</span> Skip or cancel anytime</li>
                        </ul>
                        <div className="cb-auth-brand-monogram">CB</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
