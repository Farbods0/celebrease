import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The TanStack Devtools Vite plugin tries to connect to its companion desktop
// app on localhost:5555 and emits a 404 if it isn't running. We only want it
// active during local development; production builds should never include it.
const isDev = process.env.NODE_ENV !== "production";

const config = defineConfig({
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
        ...(isDev ? [devtools()] : []),
        tailwindcss(),
        tanstackRouter({ target: "react", autoCodeSplitting: true }),
        viteReact(),
    ],
});

export default config;
