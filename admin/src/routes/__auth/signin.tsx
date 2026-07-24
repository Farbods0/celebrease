import { useAppForm } from "@/components/form/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/auth";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/__auth/signin")({
    component: RouteComponent,
});

const signinSchema = z.object({
    email: z.email("Enter your email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
    remember: z.boolean(),
});

function RouteComponent() {
    const navigate = useNavigate();

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
                    onSuccess: async ({ data }) => {
                        if (!data.user.emailVerified) {
                            navigate({ to: "/verification", search: { user: data.user.email, type: "signup" } });
                        } else if (data.user.role !== "admin" && data.user.role !== "superadmin") {
                            await auth.signOut();
                            toast.error("Only admins can access the admin portal.");
                            navigate({ to: "/signin" });
                        } else {
                            navigate({ to: "/" });
                        }
                    },
                    onError: ({ error }) => {
                        toast.error(error.message ?? "Invalid email or password. Please try again.");
                    },
                },
            );
        },
    });

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border/60 p-8 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col items-center gap-1.5">
                <div
                    className="text-2xl font-black tracking-tight"
                    style={{
                        background: "linear-gradient(135deg, #9B2FC9, #DC0075)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    CeleBrease
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border border-border/60 rounded-full px-3 py-0.5">
                    Admin Portal
                </span>
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-sm text-muted-foreground mt-1">Access the CeleBrease admin dashboard</p>
            </div>

            <form
                className="grid gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="email">
                    {(field) => <field.FormInput type="email" label="Email" placeholder="Enter your email" autoComplete="email" />}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => <field.FormInput type="password" label="Password" placeholder="Enter your password" autoComplete="current-password" />}
                </form.AppField>

                <div className="flex items-center justify-between">
                    <form.AppField name="remember">
                        {(field) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={field.state.value}
                                    onCheckedChange={(c) => field.handleChange(c === true)}
                                />
                                <label htmlFor="remember" className="text-sm text-muted-foreground">
                                    Remember me
                                </label>
                            </div>
                        )}
                    </form.AppField>

                    <Link to="/forgot-password" className="text-primary font-medium hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <form.AppForm>
                    <form.FormSubmit label="Sign In" />
                </form.AppForm>
            </form>
        </div>
    );
}
