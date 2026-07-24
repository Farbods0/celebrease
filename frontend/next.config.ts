import type { NextConfig } from "next";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_APP_SERVER ||
    "https://celebrease-backend-production-4778.up.railway.app";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [],
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
        ];
    },
};

export default nextConfig;
