"use client";

import { useAppForm } from "@/components/form/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

function getPasswordStrength(password: string): { level: number; label: string; cssClass: string } {
    if (password.length === 0) return { level: 0, label: "", cssClass: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    score = Math.min(score, 3);
    if (score === 1) return { level: 1, label: "Weak", cssClass: "weak" };
    if (score === 2) return { level: 2, label: "Fair", cssClass: "fair" };
    return { level: 3, label: "Strong", cssClass: "strong" };
}

function PasswordStrengthBar({ password }: { password: string }) {
    const { level, label, cssClass } = getPasswordStrength(password);
    if (password.length === 0) return null;
    return (
        <div
            style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "6px" }}
            role="status"
            aria-live="polite"
            aria-label="Password strength indicator"
        >
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        flex: 1,
                        height: "4px",
                        borderRadius: "2px",
                        transition: "background .3s",
                        background:
                            i <= level
                                ? cssClass === "weak"
                                    ? "#DC2626"
                                    : cssClass === "fair"
                                    ? "#E8A317"
                                    : "#16A34A"
                                : "rgba(155,47,201,0.12)",
                    }}
                />
            ))}
            <span
                style={{
                    fontSize: "12px",
                    color: "#8979A0",
                    minWidth: "48px",
                }}
            >
                {label}
            </span>
        </div>
    );
}

function EyeIcon({ visible }: { visible: boolean }) {
    return visible ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );
}

const signupSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.email("Enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password must be at most 32 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        terms: z.boolean().refine((val) => val === true, {
            message: "You must agree to the terms and privacy policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function SignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useAppForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        validators: {
            onChange: signupSchema,
        },
        onSubmit: async ({ value }) => {
            const name = `${value.firstName.trim()} ${value.lastName.trim()}`.trim();
            await auth.signUp.email(
                {
                    name,
                    email: value.email,
                    password: value.password,
                    role: "user",
                    callbackURL: `${process.env.NEXT_PUBLIC_APP_CLIENT}/account`,
                },
                {
                    onSuccess: () => {
                        toast.success("Verification link sent to your email!");
                        router.push(`/verification?user=${value.email}&type=signup`);
                    },
                },
            );
        },
    });

    return (
        <>
            <style>{`
                .cb-auth-inner {
                    width: 100%;
                    max-width: 460px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .cb-auth-logo-link {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.75rem;
                    font-weight: 800;
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
                .cb-auth-logo-link img {
                    -webkit-text-fill-color: initial !important;
                    display: block;
                }
                .cb-auth-title {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.5rem, 2.8vw, 2rem);
                    text-align: center;
                    line-height: 1.2;
                    font-weight: 700;
                    color: #1A0B2E;
                    margin: 0;
                }
                .cb-auth-sub {
                    color: #5B4A6B;
                    font-size: 15px;
                    text-align: center;
                    line-height: 1.5;
                    margin: 0;
                }
                .cb-auth-field-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }
                @media (max-width: 480px) {
                    .cb-auth-field-row { grid-template-columns: 1fr; }
                    .cb-auth-inner { gap: 14px; }
                }
                .cb-auth-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .cb-auth-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1A0B2E;
                }
                .cb-auth-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px;
                    border: 1px solid rgba(155,47,201,0.22);
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: inherit;
                    transition: border-color .2s, box-shadow .2s;
                    background: #fff;
                    color: #1A0B2E;
                    outline: none;
                    box-sizing: border-box;
                }
                .cb-auth-input::placeholder { color: #8979A0; }
                .cb-auth-input:focus {
                    border-color: #9B2FC9;
                    box-shadow: 0 0 0 3px rgba(155,47,201,0.14);
                }
                .cb-auth-input.error { border-color: #DC2626; }
                .cb-auth-field-pw {
                    position: relative;
                }
                .cb-auth-field-pw .cb-auth-input {
                    padding-right: 44px;
                }
                .cb-auth-pw-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #8979A0;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    transition: color .2s;
                }
                .cb-auth-pw-toggle:hover { color: #9B2FC9; }
                .cb-auth-error-msg {
                    color: #DC2626;
                    font-size: 12px;
                    margin-top: 1px;
                    min-height: 16px;
                }
                .cb-auth-terms-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 13px;
                    color: #5B4A6B;
                    line-height: 1.5;
                }
                .cb-auth-terms-row a {
                    color: #9B2FC9;
                    font-weight: 600;
                    text-decoration: none;
                }
                .cb-auth-terms-row a:hover { text-decoration: underline; }
                .cb-auth-btn-create {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff;
                    font-size: 16px;
                    font-weight: 700;
                    height: 52px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform .2s, box-shadow .2s, opacity .2s;
                    box-shadow: 0 8px 24px rgba(155,47,201,0.28);
                    cursor: pointer;
                    border: none;
                    font-family: inherit;
                    width: 100%;
                    letter-spacing: 0.01em;
                }
                .cb-auth-btn-create:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 36px rgba(220,0,117,0.28);
                }
                .cb-auth-btn-create:active { transform: translateY(0); }
                .cb-auth-btn-create:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .cb-auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #8979A0;
                    font-size: 13px;
                }
                .cb-auth-divider::before,
                .cb-auth-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(155,47,201,0.14);
                }
                .cb-auth-oauth-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    height: 48px;
                    border-radius: 9999px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform .15s, box-shadow .15s;
                    font-family: inherit;
                    width: 100%;
                    background: #fff;
                    color: #1f1f1f;
                    border: 1px solid #dadce0;
                }
                .cb-auth-oauth-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(155,47,201,0.08);
                }
                .cb-auth-trust-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    background: rgba(155,47,201,0.04);
                    border: 1px solid rgba(155,47,201,0.11);
                    border-radius: 14px;
                    padding: 14px 16px;
                }
                @media (max-width: 480px) {
                    .cb-auth-trust-row { grid-template-columns: 1fr; gap: 8px; }
                }
                .cb-auth-trust-cell {
                    text-align: center;
                }
                .cb-auth-trust-cell .ico {
                    font-size: 20px;
                    margin-bottom: 3px;
                }
                .cb-auth-trust-cell strong {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #1A0B2E;
                    line-height: 1.3;
                }
                .cb-auth-trust-cell span {
                    font-size: 11px;
                    color: #5B4A6B;
                    line-height: 1.3;
                }
                .cb-auth-bottom-link {
                    text-align: center;
                    font-size: 14px;
                    color: #5B4A6B;
                }
                .cb-auth-bottom-link a {
                    color: #9B2FC9;
                    font-weight: 700;
                    text-decoration: none;
                }
                .cb-auth-bottom-link a:hover { text-decoration: underline; }
            `}</style>

            <form
                className="cb-auth-inner"
                noValidate
                aria-label="Create account"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {/* Logo */}
                <Link href="/" className="cb-auth-logo-link" tabIndex={-1} aria-hidden="true">
                    <Image src="/celebrease-logo.svg" alt="" width={56} height={56} />
                    CeleBrease
                </Link>

                <h1 className="cb-auth-title">Join CeleBrease — It&apos;s Free to Start</h1>
                <p className="cb-auth-sub">Thousands of families rent their holiday decor. Now it&apos;s your turn.</p>

                {/* Name row */}
                <div className="cb-auth-field-row">
                    <form.AppField name="firstName">
                        {(field) => {
                            const hasError =
                                field.state.meta.isTouched &&
                                field.state.meta.errors &&
                                field.state.meta.errors.length > 0;
                            return (
                                <div className="cb-auth-field">
                                    <label htmlFor="cb-firstName">First name</label>
                                    <input
                                        id="cb-firstName"
                                        type="text"
                                        className={`cb-auth-input${hasError ? " error" : ""}`}
                                        placeholder="Maria"
                                        autoComplete="given-name"
                                        required
                                        aria-required="true"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                    />
                                    {hasError && (
                                        <span className="cb-auth-error-msg" role="alert">
                                            {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                        </span>
                                    )}
                                </div>
                            );
                        }}
                    </form.AppField>

                    <form.AppField name="lastName">
                        {(field) => {
                            const hasError =
                                field.state.meta.isTouched &&
                                field.state.meta.errors &&
                                field.state.meta.errors.length > 0;
                            return (
                                <div className="cb-auth-field">
                                    <label htmlFor="cb-lastName">Last name</label>
                                    <input
                                        id="cb-lastName"
                                        type="text"
                                        className={`cb-auth-input${hasError ? " error" : ""}`}
                                        placeholder="Santos"
                                        autoComplete="family-name"
                                        required
                                        aria-required="true"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                    />
                                    {hasError && (
                                        <span className="cb-auth-error-msg" role="alert">
                                            {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                        </span>
                                    )}
                                </div>
                            );
                        }}
                    </form.AppField>
                </div>

                {/* Email */}
                <form.AppField name="email">
                    {(field) => {
                        const hasError =
                            field.state.meta.isTouched &&
                            field.state.meta.errors &&
                            field.state.meta.errors.length > 0;
                        return (
                            <div className="cb-auth-field">
                                <label htmlFor="cb-email">Email address</label>
                                <input
                                    id="cb-email"
                                    type="email"
                                    className={`cb-auth-input${hasError ? " error" : ""}`}
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                    required
                                    aria-required="true"
                                    inputMode="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                {hasError && (
                                    <span className="cb-auth-error-msg" role="alert">
                                        {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                </form.AppField>

                {/* Password */}
                <form.AppField name="password">
                    {(field) => {
                        const hasError =
                            field.state.meta.isTouched &&
                            field.state.meta.errors &&
                            field.state.meta.errors.length > 0;
                        return (
                            <div className="cb-auth-field">
                                <label htmlFor="cb-password">Password</label>
                                <div className="cb-auth-field-pw">
                                    <input
                                        id="cb-password"
                                        type={showPassword ? "text" : "password"}
                                        className={`cb-auth-input${hasError ? " error" : ""}`}
                                        placeholder="At least 8 characters"
                                        autoComplete="new-password"
                                        required
                                        aria-required="true"
                                        minLength={8}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="cb-auth-pw-toggle"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </div>
                                <PasswordStrengthBar password={field.state.value} />
                                {hasError && (
                                    <span className="cb-auth-error-msg" role="alert">
                                        {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                </form.AppField>

                {/* Confirm Password */}
                <form.AppField name="confirmPassword">
                    {(field) => {
                        const hasError =
                            field.state.meta.isTouched &&
                            field.state.meta.errors &&
                            field.state.meta.errors.length > 0;
                        return (
                            <div className="cb-auth-field">
                                <label htmlFor="cb-confirmPassword">Confirm password</label>
                                <div className="cb-auth-field-pw">
                                    <input
                                        id="cb-confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        className={`cb-auth-input${hasError ? " error" : ""}`}
                                        placeholder="Repeat your password"
                                        autoComplete="new-password"
                                        required
                                        aria-required="true"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="cb-auth-pw-toggle"
                                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                        onClick={() => setShowConfirm((v) => !v)}
                                    >
                                        <EyeIcon visible={showConfirm} />
                                    </button>
                                </div>
                                {hasError && (
                                    <span className="cb-auth-error-msg" role="alert">
                                        {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                </form.AppField>

                {/* Terms */}
                <form.AppField name="terms">
                    {(field) => {
                        const hasError =
                            field.state.meta.isTouched &&
                            field.state.meta.errors &&
                            field.state.meta.errors.length > 0;
                        return (
                            <div>
                                <label className="cb-auth-terms-row">
                                    <Checkbox
                                        id="cb-terms"
                                        checked={field.state.value}
                                        onCheckedChange={(checked) => field.handleChange(checked === true)}
                                        aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                                        style={{ marginTop: "2px", flexShrink: 0 }}
                                    />
                                    <span>
                                        I agree to the{" "}
                                        <Link href="/terms">Terms of Service</Link> and{" "}
                                        <Link href="/privacy">Privacy Policy</Link>, and consent to receiving holiday style updates via email.
                                    </span>
                                </label>
                                {hasError && (
                                    <span className="cb-auth-error-msg" role="alert">
                                        {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                </form.AppField>

                {/* Submit */}
                <form.AppForm>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <button
                                type="submit"
                                className="cb-auth-btn-create"
                                disabled={!canSubmit}
                            >
                                {isSubmitting ? "Creating your account..." : "Create account →"}
                            </button>
                        )}
                    </form.Subscribe>
                </form.AppForm>

                {/* Divider */}
                <div className="cb-auth-divider" role="separator">or continue with</div>

                {/* Google OAuth */}
                <button
                    type="button"
                    className="cb-auth-oauth-btn"
                    aria-label="Sign up with Google"
                    onClick={async () => {
                        try {
                            await auth.signIn.social({
                                provider: "google",
                                callbackURL: `${window.location.origin}/account`,
                            });
                        } catch (err: any) {
                            toast.error(err?.message || "Could not initiate Google sign in");
                        }
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        style={{ flexShrink: 0 }}
                    >
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Trust row */}
                <div className="cb-auth-trust-row" role="list" aria-label="Membership benefits">
                    <div className="cb-auth-trust-cell" role="listitem">
                        <div className="ico">🛡️</div>
                        <strong>Deposit Protected</strong>
                        <span>100% back on return</span>
                    </div>
                    <div className="cb-auth-trust-cell" role="listitem">
                        <div className="ico">🚚</div>
                        <strong>Free Returns</strong>
                        <span>Prepaid label included</span>
                    </div>
                    <div className="cb-auth-trust-cell" role="listitem">
                        <div className="ico">✕</div>
                        <strong>Cancel Anytime</strong>
                        <span>No contracts ever</span>
                    </div>
                </div>

                {/* Sign in link */}
                <p className="cb-auth-bottom-link">
                    Already have an account?{" "}
                    <Link href="/signin">Sign in</Link>
                </p>
            </form>
        </>
    );
}
