import { redirect } from "@tanstack/react-router";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

const API_URL = import.meta.env.DEV
    ? (import.meta.env.VITE_APP_SERVER || "https://api.celebrease.com")
    : "https://api.celebrease.com";

export const auth = createAuthClient({
    fetchOptions: {
        onError(e) {
            if (e.error?.status === 429) {
                toast.error("Too many requests. Please try again later.");
            } else if (e.error?.message) {
                toast.error(e.error.message);
            } else {
                toast.error("Network error: Could not reach the backend server.");
            }
        },
    },
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                },
                banned: {
                    type: "boolean",
                    defaultValue: false,
                },
                phone: {
                    type: "string",
                    required: false,
                },
                region: {
                    type: "string",
                    required: false,
                },
            },
        }),
    ],
    baseURL: API_URL,
});

export const validateSession = async () => {
    try {
        const { data } = await auth.getSession();

        if (!data?.user) {
            throw redirect({ to: "/signin" });
        } else if (!data.user.emailVerified) {
            throw redirect({ to: "/verification", search: { user: data.user.email, type: "signup" } });
        } else if (data.user.role !== "admin" && data.user.role !== "superadmin") {
            await auth.signOut();
            toast.error("Only admins can access the admin portal.");
            throw redirect({ to: "/signin" });
        } else {
            return { user: data.user, session: data.session };
        }
    } catch (error) {
        // Re-throw TanStack Router redirects
        if (error && typeof error === "object" && "to" in error) {
            throw error;
        }
        // Network errors, CORS failures, etc. — redirect to signin
        console.error("Session validation failed:", error);
        throw redirect({ to: "/signin" });
    }
};

export type Session = typeof auth.$Infer.Session;
