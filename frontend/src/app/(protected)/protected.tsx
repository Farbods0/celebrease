"use client";

import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function Protected({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data, isPending } = auth.useSession();

    useEffect(() => {
        if (isPending) return;

        if (!data?.user) {
            router.replace("/signin");
        } else if (!data.user.emailVerified) {
            const params = new URLSearchParams({ user: data.user.email, type: "signup" });
            router.replace(`/verification?${params.toString()}`);
        } else if (data.user.role === "admin") {
            void auth.signOut();
            toast.error("Admins must use the admin portal.");
            router.replace("/signin");
        }
    }, [data, isPending, router]);

    if (isPending || !data?.user || !data.user.emailVerified || data.user.role === "admin") {
        return (
            <section className="flex-1 flex flex-col bg-linear-to-b from-primary/10 to-transparent">
                <div className="h-20" />
                <div className="my-16 mx-auto flex-1 flex justify-center items-center">
                    <Spinner className="size-12 stroke-primary" />
                </div>
            </section>
        );
    }

    return children;
}
