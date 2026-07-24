"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function VerificationForm({ user, type }: { user: string; type: "signup" | "reset" }) {
    const [loading, startTransition] = useTransition();
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendDisabled(false);
        }
    }, [countdown]);

    const handleResendEmail = () => {
        startTransition(async () => {
            try {
                if (type === "reset") {
                    await auth.requestPasswordReset({
                        email: user,
                        redirectTo: `${process.env.NEXT_PUBLIC_APP_CLIENT}/reset-password`,
                    });
                } else {
                    await auth.sendVerificationEmail({
                        email: user,
                        callbackURL: `${process.env.NEXT_PUBLIC_APP_CLIENT}/account`,
                    });
                }
                toast.success("Verification email sent successfully!");
                setResendDisabled(true);
                setCountdown(60);
            } catch (error) {
                toast.error("Failed to resend email. Please try again.");
            }
        });
    };

    const isCountingDown = resendDisabled && countdown > 0;

    return (
        <>
            <style>{`
                .cb-verify-resend-row {
                    text-align: center;
                    font-size: 14px;
                    color: #5B4A6B;
                    margin-bottom: 14px;
                    line-height: 1.5;
                }
                .cb-verify-resend-btn {
                    background: none;
                    border: none;
                    font-family: inherit;
                    font-size: 14px;
                    color: #9B2FC9;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity .2s;
                    padding: 0;
                    text-decoration: none;
                }
                .cb-verify-resend-btn:hover:not(:disabled) {
                    text-decoration: underline;
                    opacity: .82;
                }
                .cb-verify-resend-btn:disabled {
                    color: #8979A0;
                    cursor: not-allowed;
                    font-weight: 500;
                }
                .cb-verify-resend-timer {
                    font-weight: 600;
                    color: #5B4A6B;
                }
                .cb-verify-btn-primary {
                    width: 100%;
                    height: 52px;
                    border-radius: 9999px;
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff;
                    font-size: 16px;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 20px 60px rgba(220,0,117,0.18);
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    margin-bottom: 20px;
                    font-family: inherit;
                    text-decoration: none;
                }
                .cb-verify-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 24px 56px rgba(220,0,117,0.28);
                }
                .cb-verify-btn-primary:active { transform: translateY(0); }
                .cb-verify-btn-primary:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .cb-verify-btn-outline {
                    width: 100%;
                    height: 50px;
                    border-radius: 9999px;
                    border: 2px solid transparent;
                    background: linear-gradient(#fff, #fff) padding-box, linear-gradient(to right, #9B2FC9, #DC0075) border-box;
                    color: #9B2FC9;
                    font-size: 15px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all .2s;
                    font-family: inherit;
                    text-decoration: none;
                    margin-bottom: 0;
                }
                .cb-verify-btn-outline:hover:not(:disabled) {
                    background: linear-gradient(to right, #9B2FC9, #DC0075);
                    color: #fff;
                }
                .cb-verify-btn-outline:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }
            `}</style>

            <button
                type="button"
                className="cb-verify-btn-primary"
                onClick={handleResendEmail}
                disabled={resendDisabled || loading}
            >
                {loading
                    ? "Sending..."
                    : isCountingDown
                    ? `Resend in ${countdown}s`
                    : "Resend Email →"}
            </button>

            <p className="cb-verify-resend-row">
                {isCountingDown ? (
                    <>
                        Didn&apos;t receive it? You can resend in{" "}
                        <span className="cb-verify-resend-timer">{countdown}s</span>
                    </>
                ) : (
                    <>
                        Didn&apos;t receive it? Check spam or{" "}
                        <button
                            type="button"
                            className="cb-verify-resend-btn"
                            onClick={handleResendEmail}
                            disabled={resendDisabled || loading}
                        >
                            resend
                        </button>
                    </>
                )}
            </p>

            <Link href="/signin" className="cb-verify-btn-outline">
                Back to Sign In
            </Link>
        </>
    );
}
