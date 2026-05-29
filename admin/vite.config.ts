import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
    base: "/",
    resolve: { tsconfigPaths: true },
    server: {
        host: true,
        port: 4001,
    },
    preview: {
        host: true,
        port: 4001,
        allowedHosts: ["visualexstasy-celebrease-admin.kodevio.com"],
    },
    plugins: [devtools(), tailwindcss(), tanstackRouter({ target: "react", autoCodeSplitting: true }), viteReact()],
});

export default config;
