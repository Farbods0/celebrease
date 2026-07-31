"use client";

import { useAppForm, useFormContext } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const resetSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

function calcStrength(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%&*^()_+\-=[\]{}|;':",./<>?]/.test(pw)) score++;
    return score;
}

const strengthLabels = ["", "Too weak", "Weak", "Getting there", "Strong"];

function GradientSubmit() {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
                <button
                    type="submit"
                    className="cb-rp-submit"
                    disabled={!canSubmit || isSubmitting}
                >
                    {isSubmitting ? "Resetting..." : "Reset password →"}
                </button>
            )}
        </form.Subscribe>
    );
}

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const error = searchParams.get("error");

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwValue, setPwValue] = useState("");

    const strength = calcStrength(pwValue);

    const form = useAppForm({
        defaultValues: { password: "", confirmPassword: "" },
        validators: { onChange: resetSchema },
        onSubmit: async ({ value }) => {
            if (!token) {
                toast.error("Reset link is invalid or has expired. Please request a new one.");
                return;
            }
            await auth.resetPassword(
                { token, newPassword: value.password },
                {
                    onSuccess: () => {
                        toast.success("Password reset successfully!");
                        router.push("/signin");
                    },
                },
            );
        },
    });

    if (error || !token) {
        return (
            <p style={{ textAlign: "center", fontSize: "14px", color: "var(--cb-ink-muted)" }}>
                This reset link is invalid or has expired.{" "}
                <a href="/forgot-password" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>
                    Request a new one
                </a>
                .
            </p>
        );
    }

    const reqItems = [
        { label: "At least 8 characters", met: pwValue.length >= 8 },
        { label: "One uppercase letter (A, Z)", met: /[A-Z]/.test(pwValue) },
        { label: "One number (0, 9)", met: /[0-9]/.test(pwValue) },
        { label: "One special character (!@#$%&*)", met: /[!@#$%&*^()_+\-=[\]{}|;':",./<>?]/.test(pwValue) },
    ];

    return (
        <>
            <style>{`
                .cb-rp-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .cb-rp-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--cb-ink, #1A0B2E);
                }
                .cb-rp-field-wrap {
                    position: relative;
                }
                .cb-rp-input {
                    width: 100%;
                    height: 52px;
                    padding: 0 52px 0 16px;
                    border: 1.5px solid rgba(155,47,201,0.22);
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: inherit;
                    transition: border-color .2s, box-shadow .2s;
                    background: #fff;
                    color: #1A0B2E;
                    outline: none;
                    box-sizing: border-box;
                }
                .cb-rp-input::placeholder { color: #8979A0; }
                .cb-rp-input:focus {
                    border-color: #9B2FC9;
                    box-shadow: 0 0 0 3px rgba(155,47,201,0.14);
                }
                .cb-rp-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #8979A0;
                    font-size: 18px;
                    line-height: 1;
                    padding: 4px;
                    transition: color .2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cb-rp-toggle:hover { color: #9B2FC9; }
                .cb-rp-strength-bar {
                    display: flex;
                    gap: 5px;
                    margin-top: 8px;
                }
                .cb-rp-seg {
                    flex: 1;
                    height: 4px;
                    border-radius: 4px;
                    background: rgba(155,47,201,0.12);
                    transition: background .3s;
                }
                .cb-rp-strength-label {
                    font-size: 12px;
                    margin-top: 4px;
                    min-height: 18px;
                    transition: color .3s;
                }
                .cb-rp-req-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                    background: #F6F1FB;
                    border: 1px solid rgba(155,47,201,0.12);
                    border-radius: 14px;
                    padding: 14px 16px;
                    margin: 0;
                }
                .cb-rp-req-item {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 13px;
                    color: #5B4A6B;
                    transition: color .2s;
                }
                .cb-rp-req-item.met { color: #1A0B2E; }
                .cb-rp-req-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: rgba(155,47,201,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    flex-shrink: 0;
                    color: #8979A0;
                    transition: background .2s, color .2s;
                }
                .cb-rp-req-item.met .cb-rp-req-icon {
                    background: #D1FAE5;
                    color: #059669;
                }
                .cb-rp-submit {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    height: 54px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    box-shadow: 0 8px 24px rgba(155,47,201,0.28);
                    cursor: pointer;
                    border: none;
                    width: 100%;
                    font-family: inherit;
                    margin-top: 4px;
                }
                .cb-rp-submit:hover {
                    opacity: .93;
                    transform: translateY(-2px);
                    box-shadow: 0 14px 32px rgba(155,47,201,0.36);
                }
                .cb-rp-submit:focus-visible {
                    outline: 3px solid #9B2FC9;
                    outline-offset: 3px;
                }
                .cb-rp-submit:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                    transform: none;
                }
            `}</style>

            <form
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                noValidate
            >
                {/* New password */}
                <form.AppField name="password">
                    {(field) => (
                        <div className="cb-rp-field" style={{ gap: "6px" }}>
                            <label htmlFor="cb-rp-new">New password</label>
                            <div className="cb-rp-field-wrap">
                                <input
                                    id="cb-rp-new"
                                    type={showNew ? "text" : "password"}
                                    className="cb-rp-input"
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        setPwValue(e.target.value);
                                    }}
                                    onBlur={field.handleBlur}
                                    aria-describedby="cb-rp-strength-label"
                                />
                                <button
                                    type="button"
                                    className="cb-rp-toggle"
                                    onClick={() => setShowNew((v) => !v)}
                                    aria-label={showNew ? "Hide password" : "Show password"}
                                    aria-pressed={showNew}
                                >
                                    {showNew ? "🚫" : "👁"}
                                </button>
                            </div>

                            {/* Strength bar */}
                            <div
                                className="cb-rp-strength-bar"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={4}
                                aria-valuenow={pwValue.length ? strength : 0}
                                aria-label="Password strength"
                            >
                                {[1, 2, 3, 4].map((seg) => {
                                    let bg = "rgba(155,47,201,0.12)";
                                    if (pwValue.length && strength >= seg) {
                                        if (strength === 1) bg = "#DC2626";
                                        else if (strength <= 3) bg = "#F59E0B";
                                        else bg = "#10B981";
                                    }
                                    return <div key={seg} className="cb-rp-seg" style={{ background: bg }} />;
                                })}
                            </div>
                            <div
                                id="cb-rp-strength-label"
                                className="cb-rp-strength-label"
                                aria-live="polite"
                                style={{
                                    color: pwValue.length
                                        ? strength === 1
                                            ? "#DC2626"
                                            : strength <= 3
                                            ? "#D97706"
                                            : "#059669"
                                        : "#8979A0",
                                }}
                            >
                                {pwValue.length ? strengthLabels[strength] : ""}
                            </div>
                        </div>
                    )}
                </form.AppField>

                {/* Requirements checklist */}
                <ul className="cb-rp-req-list" aria-label="Password requirements">
                    {reqItems.map((req, idx) => (
                        <li key={idx} className={`cb-rp-req-item${req.met ? " met" : ""}`}>
                            <span className="cb-rp-req-icon" aria-hidden="true">&#10003;</span>
                            {req.label}
                        </li>
                    ))}
                </ul>

                {/* Confirm password */}
                <form.AppField name="confirmPassword">
                    {(field) => (
                        <div className="cb-rp-field">
                            <label htmlFor="cb-rp-confirm">Confirm new password</label>
                            <div className="cb-rp-field-wrap">
                                <input
                                    id="cb-rp-confirm"
                                    type={showConfirm ? "text" : "password"}
                                    className="cb-rp-input"
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                <button
                                    type="button"
                                    className="cb-rp-toggle"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                    aria-pressed={showConfirm}
                                >
                                    {showConfirm ? "🚫" : "👁"}
                                </button>
                            </div>
                        </div>
                    )}
                </form.AppField>

                <form.AppForm>
                    <GradientSubmit />
                </form.AppForm>
            </form>
        </>
    );
}
