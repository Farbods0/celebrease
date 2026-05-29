"use client";

import { useEffect, useRef } from "react";

/**
 * Adds the `in-view` class to the returned ref's element the first time it
 * scrolls into the viewport (15% threshold). Pair with the `animate-on-scroll`
 * utility in `globals.css` for a fade-and-rise entrance.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("in-view");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}
