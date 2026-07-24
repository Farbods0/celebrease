import Provider from "@/app/provider";
import Navbar from "@/components/main/navbar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

// Vendored fonts (self-hosted via @fontsource) — replaces next/font/google,
// which fails to build behind networks that block fonts.gstatic.com.
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";

import "./globals.css";
import "./celebrease.css";

export const metadata: Metadata = {
    title: "CeleBrease",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preload" as="image" href="/gradient/hero.png" fetchPriority="high" />
                <link rel="preload" as="image" href="/gradient/section.png" fetchPriority="high" />
                <link rel="preload" as="image" href="/gradient/footer.png" fetchPriority="high" />
            </head>
            <body className="min-h-screen flex flex-col">
                <Provider>
                    <Navbar />
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    );
}
