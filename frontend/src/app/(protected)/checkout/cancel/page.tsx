import type { Metadata } from "next";
import CheckoutCancelClient from "./cancel-client";

export const metadata: Metadata = { title: "Checkout Cancelled" };

export default function CheckoutCancelPage() {
    return <CheckoutCancelClient />;
}
