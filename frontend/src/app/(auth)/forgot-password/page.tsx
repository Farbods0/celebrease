import Link from "next/link";
import { ForgotPasswordForm } from "./form";

export default function ForgotPassword() {
    return (
        <div className="my-16 mx-auto flex w-full max-w-150 flex-col gap-6 rounded-lg border p-6 bg-white">
            <div>
                <h2 className="text-center text-2xl font-bold">Forgot Password</h2>
                <p className="mt-2 text-center text-muted-foreground">
                    Enter your registered email address and we’ll send you a <br />
                    verification code to reset your password.
                </p>
            </div>

            <ForgotPasswordForm />

            <p className="text-center text-muted-foreground">
                Remember your password?{" "}
                <Link href="/signin" className="text-foreground font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
