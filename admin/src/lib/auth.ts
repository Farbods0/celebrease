import { redirect } from "@tanstack/react-router";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const auth = createAuthClient({
    fetchOptions: {
        onError(e) {
            if (e.error.status === 429) {
                toast.error("Too many requests. Please try again later.");
            } else {
                toast.error(e.error.message ?? "Something went wrong.");
            }
        },
    },
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                },
            },
        }),
    ],
    baseURL: import.meta.env.VITE_APP_SERVER,
});

export const validateSession = async () => {
    const { data } = await auth.getSession();

    if (!data?.user) {
        throw redirect({ to: "/signin" });
    } else if (!data.user.emailVerified) {
        throw redirect({ to: "/verification", search: { user: data.user.email, type: "signup" } });
    } else if (data.user.role !== "admin") {
        await auth.signOut();
        toast.error("Only admins can access the admin portal.");
        throw redirect({ to: "/signin" });
    } else {
        return { user: data.user, session: data.session };
    }
};

export type Session = typeof auth.$Infer.Session;
