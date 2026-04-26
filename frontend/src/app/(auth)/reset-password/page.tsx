import { Suspense } from "react";
import { ResetPasswordForm } from "./form";

export default async function ResetPassword() {
    return (
        <div className="my-16 mx-auto flex w-full max-w-150 flex-col gap-6 rounded-lg border p-6 bg-white">
            <div>
                <h2 className="text-center text-2xl font-bold">Reset Password</h2>
                <p className="mt-2 text-center text-muted-foreground">Create a new password for your account.</p>
            </div>

            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
