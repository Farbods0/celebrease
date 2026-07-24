"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap cursor-pointer outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default: "bg-muted text-foreground hover:bg-muted/80",
                outline: "bg-transparent border text-foreground hover:bg-muted",
                destructive: "bg-destructive text-white hover:bg-destructive/80",
                black: "bg-black text-white hover:bg-black/80",
                gradient: "bg-linear-to-r from-[#9B2FC9] to-[#DC0075] text-white hover:opacity-90",
                ghost: "bg-transparent text-foreground hover:bg-muted",
            },
            size: {
                default: "h-10 gap-1.5 px-4 py-2 lg:h-12 lg:gap-2 lg:px-5 lg:py-3",
                sm: "h-10 gap-1.5 px-4 py-2",
                icon: "size-10 lg:size-12",
                "icon-sm": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
