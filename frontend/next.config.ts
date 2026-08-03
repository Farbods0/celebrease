import type { NextConfig } from "next";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_APP_SERVER ||
    "https://celebrease-backend-production-4778.up.railway.app";

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "celebrease-backend-production-4778.up.railway.app",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "celebrease.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "www.celebrease.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
        ],
    },
    reactCompiler: true,
    async rewrites() {
        return [
            // Proxy all better-auth routes so cookies are same-site
            {
                source: "/api/auth/:path*",
                destination: `${BACKEND_URL}/api/auth/:path*`,
            },
            // Proxy all API routes
            {
                source: "/api/v1/:path*",
                destination: `${BACKEND_URL}/api/v1/:path*`,
            },
            // Proxy uploads so media loads correctly on the client domain
            {
                source: "/uploads/:path*",
                destination: `${BACKEND_URL}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
