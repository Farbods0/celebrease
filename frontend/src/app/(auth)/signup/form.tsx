"use client";

import { useAppForm } from "@/components/form/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
    .object({
        name: z.string().min(2, "Enter your full name"),
        email: z.email("Enter your email address"),
        password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        terms: z.boolean().refine((val) => val === true, {
            message: "You must agree to the terms and privacy policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function SignupForm() {
    const router = useRouter();

    const form = useAppForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        validators: {
            onChange: signupSchema,
        },
        onSubmit: async ({ value }) => {
            await auth.signUp.email(
                {
                    name: value.name,
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
        <form
            className="grid gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppField name="name">
                {(field) => <field.FormInput type="text" label="Name" placeholder="Enter your name" />}
            </form.AppField>

            <form.AppField name="email">
                {(field) => <field.FormInput type="email" label="Email" placeholder="Enter your email" />}
            </form.AppField>

            <form.AppField name="password">
                {(field) => <field.FormInput type="password" label="Password" placeholder="Enter your password" />}
            </form.AppField>

            <form.AppField name="confirmPassword">
                {(field) => <field.FormInput type="password" label="Confirm Password" placeholder="Re-enter your password" />}
            </form.AppField>

            <form.AppField name="terms">
                {(field) => (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="terms"
                            checked={field.state.value}
                            onCheckedChange={(checked) => field.handleChange(checked === true)}
                            aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <label htmlFor="terms" className="text-muted-foreground">
                            I agree to the <span className="text-foreground font-medium">terms of service</span> and{" "}
                            <span className="text-foreground font-medium">privacy policy</span>.
                        </label>
                    </div>
                )}
            </form.AppField>

            <form.AppForm>
                <form.FormSubmit label="Sign Up" />
            </form.AppForm>
        </form>
    );
}
