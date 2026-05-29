import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__auth")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main className="min-h-screen h-screen flex">
            {/* Left brand panel */}
            <div
                className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col items-center justify-center gap-8 p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #9B2FC9 0%, #DC0075 100%)" }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 size-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center gap-6 text-white text-center">
                    <div className="size-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm ring-1 ring-white/30">
                        <span className="text-3xl font-black tracking-tighter">CB</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">CeleBrease</h1>
                        <p className="text-sm text-white/70 mt-1 font-medium uppercase tracking-widest">Admin Portal</p>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                        Manage holidays, kits, inventory, subscriptions, and rental operations from one place.
                    </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
                    {["Holidays & Kits", "Orders & Returns", "Subscriptions", "Inventory & Add-Ons"].map((item) => (
                        <div key={item} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                            <div className="size-1.5 rounded-full bg-white/70 shrink-0" />
                            <span className="text-sm text-white/80 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center bg-[#FAF5FF] p-6">
                <Outlet />
            </div>
        </main>
    );
}
