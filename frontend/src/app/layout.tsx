import Provider from "@/app/provider";
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
            <head>
                <link rel="preload" as="image" href="/gradient/hero.png" fetchPriority="high" />
                <link rel="preload" as="image" href="/gradient/section.png" fetchPriority="high" />
                <link rel="preload" as="image" href="/gradient/footer.png" fetchPriority="high" />
            </head>
            <body className="min-h-screen flex flex-col">
                <Provider>
                    <Navbar />
                    {children}
                    <Footer />
                    <Toaster />
                </Provider>
            </body>
        </html>
    );
}
