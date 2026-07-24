import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

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
    baseURL: process.env.NEXT_PUBLIC_APP_SERVER || "https://celebrease-backend-production-4778.up.railway.app",
});

export type Session = typeof auth.$Infer.Session;
