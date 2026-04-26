import { Navbar } from "@/components/main/navbar";
import { validateSession } from "@/lib/auth";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__main")({
    beforeLoad: async () => {
        return validateSession();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();

    return (
        <>
            <Navbar user={user} />
            <Outlet />
        </>
    );
}
