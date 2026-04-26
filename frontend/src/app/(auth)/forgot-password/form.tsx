"use client";

import { useAppForm } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const forgotSchema = z.object({
    email: z.email("Enter your email address"),
});

export function ForgotPasswordForm() {
    const router = useRouter();

    const form = useAppForm({
        defaultValues: { email: "" },
        validators: { onChange: forgotSchema },
        onSubmit: async ({ value }) => {
            await auth.requestPasswordReset(
                {
                    email: value.email,
                    redirectTo: `${process.env.NEXT_PUBLIC_APP_CLIENT}/reset-password`,
                },
                {
                    onSuccess: () => {
                        toast.success("Password reset link sent to your email!");
                        router.push(`/verification?user=${value.email}&type=reset`);
                    },
                },
            );
        },
    });

    return (
        <form
            className="grid gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppField name="email">
                {(field) => <field.FormInput type="email" label="Email" placeholder="Enter your email" />}
            </form.AppField>

            <form.AppForm>
                <form.FormSubmit label="Reset Password" />
            </form.AppForm>
        </form>
    );
}
