import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV !== "production";

const config = defineConfig(async () => {
    const devPlugins = isDev
        ? [await import("@tanstack/devtools-vite").then((m) => m.devtools())]
        : [];

    return {
        base: "/",
        resolve: { tsconfigPaths: true },
        server: {
            host: true,
            port: 4003,
            strictPort: true,
        },
        preview: {
            host: true,
            port: 4003,
            allowedHosts: ["visualexstasy-celebrease-admin.kodevio.com"],
        },
        plugins: [
            ...devPlugins,
            tailwindcss(),
            tanstackRouter({ target: "react", autoCodeSplitting: true }),
            viteReact(),
        ],
    };
});

export default config;
