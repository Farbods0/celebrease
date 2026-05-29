import type { Metadata } from "next";
import CheckoutSuccessClient from "./success-client";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function CheckoutSuccessPage() {
    return <CheckoutSuccessClient />;
}
