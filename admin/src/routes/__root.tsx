import { Toaster } from "@/components/ui/sonner";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../styles.css";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Outlet />
            </div>
            <Toaster />
            {import.meta.env.DEV && (
                <TanStackDevtools
                    config={{ position: "bottom-right" }}
                    plugins={[{ name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> }]}
                />
            )}
        </>
    );
}
