import CallToAction from "@/components/main/call-to-action";
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
        </>
    );
}
