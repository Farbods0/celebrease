"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    // Turn off loading bar when pathname or searchParams change
    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    // Intercept clicks on links to show progress bar instantly (<20ms)
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a");
            if (!target) return;

            const href = target.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
                return;
            }

            // Don't trigger loading if navigating to current page with same search params
            if (href === window.location.pathname + window.location.search) {
                return;
            }

            setLoading(true);
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
        };
    }, []);

    if (!loading) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                zIndex: 99999,
                background: "linear-gradient(90deg, #DC0075 0%, #7B00FF 50%, #DC0075 100%)",
                backgroundSize: "200% 100%",
                animation: "cb-nav-progress 1.2s infinite linear",
                boxShadow: "0 0 10px rgba(220,0,117,0.7), 0 0 5px rgba(123,0,255,0.5)",
            }}
        >
            <style jsx global>{`
                @keyframes cb-nav-progress {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
            `}</style>
        </div>
    );
}
