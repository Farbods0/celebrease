"use client";

import { useAppForm } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const resetSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function ResetPasswordForm() {
    const router = useRouter();

    const form = useAppForm({
        defaultValues: { password: "", confirmPassword: "" },
        validators: { onChange: resetSchema },
        onSubmit: async ({ value }) => {
            await auth.resetPassword(
                { token: "", newPassword: value.password },
                {
                    onSuccess: () => {
                        toast.success("Password reset successfully!");
                        router.push("/signin");
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
            <form.AppField name="password">
                {(field) => <field.FormInput type="password" label="New Password" placeholder="Enter your password" />}
            </form.AppField>

            <form.AppField name="confirmPassword">
                {(field) => <field.FormInput type="password" label="Confirm Password" placeholder="Enter your password" />}
            </form.AppField>

            <form.AppForm>
                <form.FormSubmit label="Submit" />
            </form.AppForm>
        </form>
    );
}
