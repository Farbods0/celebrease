import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://celebrease.com";

    // Defining static pages based on routing structure
    const routes = [
        "",
        "/about",
        "/accessibility",
        "/catalog",
        "/contact",
        "/faqs",
        "/how-it-works",
        "/privacy",
        "/rental-agreement",
        "/return-policy",
        "/subscription",
        "/terms",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));
}
