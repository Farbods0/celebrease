import Link from "next/link";
import { SigninForm } from "./form";

export default function Signin() {
    return (
        <div className="my-16 mx-auto flex w-full max-w-150 flex-col gap-6 rounded-lg border p-6 bg-white">
            <h2 className="text-center text-2xl font-bold">Sign In</h2>

            <SigninForm />

            <p className="text-center text-muted-foreground">
                Do not have account?{" "}
                <Link href="/signup" className="text-foreground font-medium hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
