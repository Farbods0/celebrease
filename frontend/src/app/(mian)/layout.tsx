import CallToAction from "@/components/main/call-to-action";
import Footer from "@/components/main/footer";
import React from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <CallToAction />
            <Footer />
        </>
    );
}
