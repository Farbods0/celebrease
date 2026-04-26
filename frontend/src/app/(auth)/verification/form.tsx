"use client";

import { Button } from "@/components/ui/button";
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

    return (
        <>
            <div className="text-center grid gap-2">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h2>Check your email</h2>
                <p>We&apos;ve sent a {type === "reset" ? "password reset" : "verification"} link to</p>
                {user && <p className="font-medium text-foreground">{user}</p>}
            </div>

            <div className="grid gap-4">
                <p className="text-center mb-2">
                    Didn&apos;t receive the email?
                    <br /> Check your spam folder or
                </p>
                <Button variant="outline" onClick={handleResendEmail} disabled={resendDisabled || loading}>
                    {loading ? "Sending..." : resendDisabled && countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
                </Button>
                <Button variant="black" render={<Link href="/signin">Back to Sign In</Link>} />
            </div>
        </>
    );
}
