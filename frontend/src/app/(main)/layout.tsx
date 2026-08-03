import CallToAction from "@/components/main/call-to-action";
import Footer from "@/components/main/footer";
import { NavigationProgressBar } from "@/components/main/navigation-progress-bar";
import React, { Suspense } from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Suspense fallback={null}>
                <NavigationProgressBar />
            </Suspense>
            {children}
            <CallToAction />
            <Footer />
        </>
    );
}
