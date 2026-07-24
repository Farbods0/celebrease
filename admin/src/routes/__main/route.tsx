import { Sidebar, Topbar } from "@/components/main/sidebar";
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
        <div className="cbadmin app">
            <Sidebar user={user} />
            <div className="main">
                <Topbar />
                <Outlet />
            </div>
        </div>
    );
}
