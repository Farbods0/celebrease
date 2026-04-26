import { redirect } from "next/navigation";
import { z } from "zod";
import { VerificationForm } from "./form";

const verifySchema = z.object({
    user: z.email("Enter your email address"),
    type: z.enum(["signup", "reset"]),
});

export default async function Verify({ searchParams }: { searchParams: Promise<{ user?: string; type?: "signup" | "reset" }> }) {
    const { user, type } = await searchParams;
    if (!user || !type || !verifySchema.safeParse({ user, type }).success) {
        redirect("/signin");
    }

    return (
        <div className="my-16 mx-auto flex w-full max-w-114 flex-col gap-6 rounded-lg border p-6 bg-white">
            <h2 className="text-center text-2xl font-bold">Verification</h2>

            <VerificationForm user={user} type={type} />
        </div>
    );
}
