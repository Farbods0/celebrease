"use client";

import { useAppForm } from "@/components/form/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

const signinSchema = z.object({
    email: z.email("Enter your email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
    remember: z.boolean(),
});

export function SigninForm() {
    const router = useRouter();

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
                    onSuccess: () => {
                        router.push("/account");
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

            <form.AppField name="password">
                {(field) => <field.FormInput type="password" label="Password" placeholder="Enter your password" />}
            </form.AppField>

            <div className="flex items-center justify-between">
                <form.AppField name="remember">
                    {(field) => (
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" checked={field.state.value} onCheckedChange={(c) => field.handleChange(c === true)} />
                            <label htmlFor="remember" className="text-sm text-muted-foreground">
                                Remember me
                            </label>
                        </div>
                    )}
                </form.AppField>

                <Link href="/forgot-password" className="text-primary font-medium hover:underline">
                    Forgot password?
                </Link>
            </div>

            <form.AppForm>
                <form.FormSubmit label="Sign In" />
            </form.AppForm>
        </form>
    );
}
