"use client";

import { useAppForm } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

const signinSchema = z.object({
    email: z.email("Enter your email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
    remember: z.boolean(),
});

export function SigninForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useAppForm({
        defaultValues: { email: "", password: "", remember: false },
        validators: { onChange: signinSchema },
        onSubmit: async ({ value }) => {
            await auth.signIn.email(
                {
                    email: value.email,
                    password: value.password,
                    rememberMe: value.remember,
                },
                {
                    onSuccess: async ({ data }) => {
                        if (!data.user.emailVerified) {
                            const params = new URLSearchParams({ user: data.user.email, type: "signup" });
                            router.push(`/verification?${params.toString()}`);
                        } else if (data.user.role === "admin") {
                            await auth.signOut();
                            toast.error("Admins must use the admin portal.");
                            router.push("/signin");
                        } else {
                            router.push("/account");
                        }
                    },
                    onError: (ctx) => {
                        if (ctx.error.status === 403 && ctx.error.message?.toLowerCase().includes("verify")) {
                            toast.error("Please verify your email first.");
                            const params = new URLSearchParams({ user: value.email, type: "signup" });
                            router.push(`/verification?${params.toString()}`);
                        } else {
                            toast.error(ctx.error.message || "Failed to sign in");
                        }
                    },
                },
            );
        },
    });

    return (
        <>
            <style>{`
                .cb-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }
                .cb-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1A0B2E;
                    letter-spacing: 0.01em;
                }
                .cb-field-wrap {
                    position: relative;
                }
                .cb-field-input {
                    width: 100%;
                    height: 50px;
                    padding: 0 16px;
                    border: 1.5px solid rgba(155,47,201,0.12);
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: inherit;
                    color: #1A0B2E;
                    background: #fafafa;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                    outline: none;
                }
                .cb-field-input::placeholder { color: #8979A0; }
                .cb-field-input:focus {
                    border-color: #9B2FC9;
                    box-shadow: 0 0 0 3px rgba(155,47,201,0.13);
                    background: #fff;
                }
                .cb-field-input.cb-has-pw-btn {
                    padding-right: 46px;
                }
                .cb-field-error {
                    font-size: 12.5px;
                    color: #DC2626;
                    margin-top: 3px;
                    font-weight: 500;
                }
                .cb-pw-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #8979A0;
                    font-size: 16px;
                    padding: 4px;
                    line-height: 1;
                    transition: color .2s;
                    display: flex;
                    align-items: center;
                }
                .cb-pw-toggle:hover { color: #9B2FC9; }
                .cb-form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .cb-remember-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #5B4A6B;
                    cursor: pointer;
                    user-select: none;
                }
                .cb-remember-label input[type="checkbox"] {
                    width: 17px;
                    height: 17px;
                    accent-color: #9B2FC9;
                    cursor: pointer;
                    flex-shrink: 0;
                    border-radius: 4px;
                }
                .cb-forgot-link {
                    font-size: 14px;
                    color: #9B2FC9;
                    font-weight: 600;
                    transition: opacity .2s;
                    text-decoration: none;
                }
                .cb-forgot-link:hover { opacity: .78; text-decoration: underline; }
                /* Override FormSubmit button to prototype style */
                .cb-submit-wrap > button,
                .cb-submit-wrap [data-slot="button"] {
                    width: 100% !important;
                    height: 52px !important;
                    border-radius: 9999px !important;
                    background: linear-gradient(to right, #9B2FC9, #DC0075) !important;
                    color: #fff !important;
                    font-size: 16px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.01em !important;
                    box-shadow: 0 20px 60px rgba(220,0,117,0.18) !important;
                    transition: opacity .2s, transform .2s, box-shadow .2s !important;
                    margin-bottom: 20px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border: none !important;
                }
                .cb-submit-wrap > button:hover,
                .cb-submit-wrap [data-slot="button"]:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 24px 56px rgba(220,0,117,0.28) !important;
                    opacity: 1 !important;
                }
                .cb-or-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    color: #8979A0;
                    font-size: 13px;
                }
                .cb-or-divider::before,
                .cb-or-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(155,47,201,0.12);
                }
                .cb-oauth-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    height: 48px;
                    border-radius: 9999px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform .15s, box-shadow .15s, border-color .15s;
                    font-family: inherit;
                    width: 100%;
                    border: 1.5px solid #e0d4f0;
                    background: #fff;
                    color: #1A0B2E;
                    margin-bottom: 12px;
                }
                .cb-oauth-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(155,47,201,0.08);
                    border-color: rgba(155,47,201,0.3);
                }
                .cb-oauth-icon { width: 20px; height: 20px; flex-shrink: 0; }
                .cb-signup-row {
                    text-align: center;
                    font-size: 14px;
                    color: #5B4A6B;
                    margin-top: 4px;
                }
                .cb-signup-row a {
                    color: #9B2FC9;
                    font-weight: 600;
                    text-decoration: none;
                }
                .cb-signup-row a:hover { text-decoration: underline; }
                .cb-legal-note {
                    font-size: 12px;
                    color: #8979A0;
                    text-align: center;
                    margin-top: 16px;
                    line-height: 1.5;
                }
                .cb-legal-note a {
                    color: #5B4A6B;
                    text-decoration: underline;
                }
                .cb-legal-note a:hover { color: #9B2FC9; }
            `}</style>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {/* Email */}
                <form.AppField name="email">
                    {(field) => (
                        <div className="cb-field">
                            <label htmlFor="cb-email">Email address</label>
                            <div className="cb-field-wrap">
                                <input
                                    id="cb-email"
                                    type="email"
                                    className="cb-field-input"
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    aria-required="true"
                                />
                            </div>
                            {field.state.meta.errors.length > 0 && (
                                <span className="cb-field-error" role="alert">
                                    {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                </span>
                            )}
                        </div>
                    )}
                </form.AppField>

                {/* Password */}
                <form.AppField name="password">
                    {(field) => (
                        <div className="cb-field">
                            <label htmlFor="cb-password">Password</label>
                            <div className="cb-field-wrap">
                                <input
                                    id="cb-password"
                                    type={showPassword ? "text" : "password"}
                                    className="cb-field-input cb-has-pw-btn"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    aria-required="true"
                                />
                                <button
                                    type="button"
                                    className="cb-pw-toggle"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {field.state.meta.errors.length > 0 && (
                                <span className="cb-field-error" role="alert">
                                    {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                </span>
                            )}
                        </div>
                    )}
                </form.AppField>

                {/* Remember + Forgot */}
                <div className="cb-form-options">
                    <form.AppField name="remember">
                        {(field) => (
                            <label className="cb-remember-label">
                                <input
                                    type="checkbox"
                                    checked={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.checked)}
                                />
                                Remember me
                            </label>
                        )}
                    </form.AppField>

                    <Link href="/forgot-password" className="cb-forgot-link">
                        Forgot password?
                    </Link>
                </div>

                {/* Submit, wrapped to override button styles */}
                <div className="cb-submit-wrap">
                    <form.AppForm>
                        <form.FormSubmit label={<span className="flex items-center gap-2 justify-center">Sign In <ArrowRight className="w-4 h-4" /></span>} />
                    </form.AppForm>
                </div>

                {/* Divider */}
                <div className="cb-or-divider">or continue with</div>

                {/* Google OAuth */}
                <button
                    type="button"
                    className="cb-oauth-btn"
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
                    <svg className="cb-oauth-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Sign-up link */}
                <p className="cb-signup-row">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Create one free</Link>
                </p>

                {/* Legal */}
                <p className="cb-legal-note">
                    By signing in, you agree to our{" "}
                    <Link href="/terms">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy">Privacy Policy</Link>.
                </p>
            </form>
        </>
    );
}
