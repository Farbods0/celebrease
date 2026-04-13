import { cn } from "@/lib/utils";

type SectionHeaderProps = React.ComponentProps<"div"> & {
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
};

export default function SectionHeader({ title, subtitle, className, children, ...props }: SectionHeaderProps) {
    return (
        <div className={cn("flex flex-col items-center text-center", className)} {...props}>
            <p className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-medium mb-3">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold">{title}</h2>
            {children}
        </div>
    );
}
