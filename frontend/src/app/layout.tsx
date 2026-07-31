import Provider from "@/app/provider";
import Navbar from "@/components/main/navbar";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from "next";

// Vendored fonts (self-hosted via @fontsource), replaces next/font/google,
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
    title: "CeleBrease | Holiday Décor, Delivered",
    description: "Designer curated holiday decoration kits delivered to your door. Decorate beautifully. Store nothing. Get your deposit back, every time.",
    keywords: ["holiday decor", "decor subscription", "christmas decor rental", "halloween decor rental", "event decor", "diwali decor", "home styling"],
    openGraph: {
        title: "CeleBrease | Holiday Décor, Delivered",
        description: "Designer curated holiday decoration kits delivered to your door. Decorate beautifully. Store nothing.",
        url: "https://celebrease.com",
        siteName: "CeleBrease",
        images: [
            {
                url: "https://celebrease.com/uploads/og-image.png",
                width: 1200,
                height: 630,
                alt: "CeleBrease Holiday Décor",
            }
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CeleBrease | Holiday Décor, Delivered",
        description: "Designer curated holiday decoration kits delivered to your door. Decorate beautifully. Store nothing.",
        images: ["https://celebrease.com/uploads/og-image.png"],
    },
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
            </head>
            <body className="min-h-screen flex flex-col">
                <NextTopLoader color="#9B2FC9" showSpinner={false} speed={300} shadow="0 0 10px #9B2FC9,0 0 5px #9B2FC9" />
                <Provider>
                    <Navbar />
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    );
}
