"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "bg-transparent border border-primary text-primary hover:bg-primary/10",
                outline: "bg-transparent border text-foreground hover:bg-muted",
                destructive: "bg-destructive text-white hover:bg-destructive/80",
                ghost: "bg-transparent hover:bg-muted",
            },
            size: {
                default: "h-12 gap-2 px-4 py-3",
                sm: "h-10 gap-1.5 px-3 py-2",
                icon: "size-12",
                "icon-sm": "size-10",
                "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-4",
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
