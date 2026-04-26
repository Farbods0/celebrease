import { Navbar } from "@/components/main/navbar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__main")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
