"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add, Cancel } from "@hugeicons/core-free-icons";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
    return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex w-full flex-col gap-4", className)} {...props} />;
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn("rounded-full bg-white border data-open:border-primary data-open:rounded-2xl ", className)}
            {...props}
        />
    );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    "group/accordion-trigger relative flex flex-1 items-start justify-between px-5 py-4 text-base lg:text-lg text-left font-medium transition-all outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:my-auto **:data-[slot=accordion-trigger-icon]:size-5.5",
                    className,
                )}
                {...props}
            >
                {children}
                <div
                    data-slot="accordion-trigger-icon"
                    className="p-px bg-linear-to-r from-primary to-secondary rounded-full pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
                >
                    <HugeiconsIcon className="size-5 text-white" icon={Add} />
                </div>
                <div
                    data-slot="accordion-trigger-icon"
                    className="p-px bg-linear-to-r from-primary to-secondary rounded-full pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
                >
                    <HugeiconsIcon className="size-5 text-white" icon={Cancel} />
                </div>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
    return (
        <AccordionPrimitive.Panel
            data-slot="accordion-content"
            className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
            {...props}
        >
            <div
                className={cn(
                    "px-5 h-(--accordion-panel-height) pt-0 pb-4 text-sm lg:text-base text-muted-foreground data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                    className,
                )}
            >
                {children}
            </div>
        </AccordionPrimitive.Panel>
    );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
