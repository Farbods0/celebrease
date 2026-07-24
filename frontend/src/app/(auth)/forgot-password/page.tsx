import Link from "next/link";
import { ForgotPasswordForm } from "./form";

const baseURL = "";

export default function ForgotPassword() {
    return (
        <>
            <style>{`
                /* ---- Auth layout override: fill viewport, no outer nav/footer ---- */
                .cb-auth-forgot-wrap {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 60% 40%;
                    background: #fff;
                    /* pull out of the (auth) group layout padding */
                    margin-top: -80px;
                }

                /* ---- Form panel ---- */
                .cb-afp-panel {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 64px 48px;
                    position: relative;
                    background: #fff;
                }
                .cb-afp-back {
                    position: absolute;
                    top: 28px;
                    left: 28px;
                    font-size: 14px;
                    color: #5B4A6B;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    transition: color .2s;
                    text-decoration: none;
                }
                .cb-afp-back:hover { color: #9B2FC9; }

                .cb-afp-inner {
                    width: 100%;
                    max-width: 440px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .cb-afp-logo-link {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
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

                .cb-afp-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin: 0 auto;
                    box-shadow: 0 1px 3px rgba(26,11,46,0.06);
                }

                .cb-afp-title {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.45rem, 3vw, 1.95rem);
                    text-align: center;
                    line-height: 1.2;
                    color: #1A0B2E;
                    font-weight: 700;
                    margin: 0;
                }

                .cb-afp-sub {
                    color: #5B4A6B;
                    font-size: 16px;
                    text-align: center;
                    line-height: 1.55;
                    margin: 0;
                }

                .cb-afp-helper {
                    background: #F6F1FB;
                    border: 1px solid rgba(155,47,201,0.12);
                    border-radius: 14px;
                    padding: 16px 18px;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    font-size: 14px;
                    color: #5B4A6B;
                    line-height: 1.55;
                }
                .cb-afp-helper .note-icon { font-size: 17px; flex-shrink: 0; margin-top: 1px; }
                .cb-afp-helper strong { color: #1A0B2E; font-weight: 600; }

                .cb-afp-footer-link {
                    text-align: center;
                    font-size: 14px;
                    color: #5B4A6B;
                }
                .cb-afp-footer-link a {
                    color: #9B2FC9;
                    font-weight: 600;
                    text-decoration: none;
                }
                .cb-afp-footer-link a:hover { text-decoration: underline; }

                /* ---- Brand panel ---- */
                .cb-afp-brand {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                    color: #fff;
                }
                .cb-afp-brand-bg {
                    position: absolute;
                    inset: 0;
                }
                .cb-afp-brand-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.3;
                }
                .cb-afp-brand-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(155deg, rgba(155,47,201,0.5), rgba(220,0,117,0.5));
                }
                .cb-afp-brand-content {
                    position: relative;
                    z-index: 2;
                    max-width: 360px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    align-items: center;
                }
                .cb-afp-brand-quote {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 21px;
                    font-style: italic;
                    line-height: 1.45;
                }
                .cb-afp-brand-attr { font-size: 14px; color: rgba(255,255,255,0.75); }
                .cb-afp-brand-monogram {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 88px;
                    font-weight: 700;
                    opacity: 0.92;
                    line-height: 1;
                    margin-top: 8px;
                }
                .cb-afp-feat-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    text-align: left;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
                .cb-afp-feat-list li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: rgba(255,255,255,0.92);
                    font-weight: 500;
                }
                .cb-afp-feat-list .chk {
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
                    .cb-auth-forgot-wrap { grid-template-columns: 1fr; min-height: auto; }
                    .cb-afp-brand { display: none; }
                    .cb-afp-panel { padding: 72px 24px 56px; }
                    .cb-afp-back { top: 20px; left: 20px; }
                }
                @media (max-width: 480px) {
                    .cb-afp-panel { padding: 72px 20px 48px; }
                }
            `}</style>

            <div className="cb-auth-forgot-wrap">
                {/* Form panel */}
                <div className="cb-afp-panel">
                    <Link href="/" className="cb-afp-back">
                        &#8592; Back to home
                    </Link>

                    <div className="cb-afp-inner">
                        <Link href="/" className="cb-afp-logo-link">
                            CeleBrease
                        </Link>

                        <div className="cb-afp-icon" aria-hidden="true">&#128274;</div>

                        <h1 className="cb-afp-title">Forgot your password?</h1>
                        <p className="cb-afp-sub">
                            No worries &#8212; it happens. Enter the email on your account and we&#39;ll send you a link to reset your password.
                        </p>

                        <ForgotPasswordForm />

                        <div className="cb-afp-helper" role="note">
                            <span className="note-icon" aria-hidden="true">&#128204;</span>
                            <div>
                                <strong>Check your spam folder.</strong> The reset link usually arrives within a minute. If you don&#39;t see it, check your spam or promotions folder before trying again.
                            </div>
                        </div>

                        <p className="cb-afp-footer-link">
                            Remember your password? <Link href="/signin">&#8592; Back to sign in</Link>
                        </p>
                        <p className="cb-afp-footer-link" style={{ marginTop: "-8px" }}>
                            New to CeleBrease? <Link href="/signup">Create an account</Link>
                        </p>
                    </div>
                </div>

                {/* Brand panel */}
                <div className="cb-afp-brand" aria-hidden="true">
                    <div className="cb-afp-brand-bg">
                        <img src={`${baseURL}/uploads/holidays/diwali.png`} alt="" />
                    </div>
                    <div className="cb-afp-brand-content">
                        <p className="cb-afp-brand-quote">
                            &#8220;The kit arrived styled and ready. I just placed each piece and hosted the most beautiful Diwali we&#39;ve ever had.&#8221;
                        </p>
                        <p className="cb-afp-brand-attr">&#8212; Priya K., Premium member</p>
                        <ul className="cb-afp-feat-list">
                            <li><span className="chk">&#10003;</span> Designer kits for every holiday</li>
                            <li><span className="chk">&#10003;</span> Free two-way shipping, always</li>
                            <li><span className="chk">&#10003;</span> Full deposit refunded on return</li>
                            <li><span className="chk">&#10003;</span> Skip or cancel anytime</li>
                        </ul>
                        <div className="cb-afp-brand-monogram">CB</div>
                    </div>
                </div>
            </div>
        </>
    );
}
