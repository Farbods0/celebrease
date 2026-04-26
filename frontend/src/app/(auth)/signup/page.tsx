import Link from "next/link";
import { SignupForm } from "./form";

export default function Signup() {
    return (
        <div className="my-16 mx-auto flex w-full max-w-150 flex-col gap-6 rounded-lg border p-6 bg-white">
            <h2 className="text-center text-2xl font-bold">Sign Up</h2>

            <SignupForm />

            <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="text-foreground font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
