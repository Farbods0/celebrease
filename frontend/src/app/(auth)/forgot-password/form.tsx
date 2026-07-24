"use client";

import { useAppForm, useFormContext } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const forgotSchema = z.object({
    email: z.email("Enter your email address"),
});

function GradientSubmit() {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
                <button
                    type="submit"
                    className="cb-afp-submit"
                    disabled={!canSubmit || isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Send reset link →"}
                </button>
            )}
        </form.Subscribe>
    );
}

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
        <>
            <style>{`
                .cb-afp-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .cb-afp-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1A0B2E;
                }
                .cb-afp-field input {
                    width: 100%;
                    height: 52px;
                    padding: 0 16px;
                    border: 1.5px solid rgba(155,47,201,0.22);
                    border-radius: 12px;
                    font-size: 15px;
                    font-family: inherit;
                    transition: border-color .2s, box-shadow .2s;
                    background: #fff;
                    color: #1A0B2E;
                    outline: none;
                }
                .cb-afp-field input::placeholder { color: #8979A0; }
                .cb-afp-field input:focus {
                    border-color: #9B2FC9;
                    box-shadow: 0 0 0 3px rgba(155,47,201,0.14);
                }
                .cb-afp-submit {
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
                }
                .cb-afp-submit:hover {
                    opacity: .93;
                    transform: translateY(-2px);
                    box-shadow: 0 14px 32px rgba(155,47,201,0.36);
                }
                .cb-afp-submit:focus-visible {
                    outline: 3px solid #9B2FC9;
                    outline-offset: 3px;
                }
                .cb-afp-submit:disabled {
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
            >
                <form.AppField name="email">
                    {(field) => (
                        <div className="cb-afp-field">
                            <label htmlFor="cb-reset-email">Email address</label>
                            <input
                                id="cb-reset-email"
                                type="email"
                                name="email"
                                placeholder="you@email.com"
                                autoComplete="email"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                required
                            />
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
