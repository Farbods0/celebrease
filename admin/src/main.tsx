import { ErrorComp } from "@/components/ui/error-comp";
import { NotFoundComp } from "@/components/ui/not-found-comp";
import { PendingComp } from "@/components/ui/pending-comp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultPreloadStaleTime: 1000 * 60 * 5,
    defaultStaleTime: 1000 * 60 * 5,
    defaultPendingMs: 50,
    defaultPendingMinMs: 0,
    defaultPendingComponent: PendingComp,
    defaultErrorComponent: ErrorComp,
    defaultNotFoundComponent: NotFoundComp,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>,
    );
}
