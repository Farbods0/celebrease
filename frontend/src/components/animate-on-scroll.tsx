"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type AnimateOnScrollProps = {
    children: ReactNode;
    /** Stagger delay in 100ms increments (1, 2, or 3). */
    delay?: 1 | 2 | 3;
    className?: string;
    style?: CSSProperties;
};

const delayClass: Record<1 | 2 | 3, string> = {
    1: "animate-on-scroll-delay-1",
    2: "animate-on-scroll-delay-2",
    3: "animate-on-scroll-delay-3",
};

/**
 * Wraps children in a div that fades + rises into place on first scroll-in.
 * Uses Intersection Observer (15% threshold). Use `delay` for staggered grids.
 */
export function AnimateOnScroll({
    children,
    delay,
    className,
    style,
}: AnimateOnScrollProps) {
    const ref = useScrollAnimation<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={cn(
                "animate-on-scroll",
                delay !== undefined && delayClass[delay],
                className,
            )}
            style={style}
        >
            {children}
        </div>
    );
}
