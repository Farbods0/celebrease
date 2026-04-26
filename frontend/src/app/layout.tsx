import CallToAction from "@/components/main/call-to-action";
import Footer from "@/components/main/footer";
import Navbar from "@/components/main/navbar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";

import "./globals.css";

const geist = Geist({
    variable: "--font-geist",
});

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
});

export const metadata: Metadata = {
    title: "CeleBrease",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geist.variable} ${playfairDisplay.variable}`}>
            <body className="min-h-full flex flex-col">
                <Navbar />
                {children}
                <CallToAction />
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
