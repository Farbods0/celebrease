import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
};

export function StatCard({ label, value, icon: Icon, iconBg = "bg-muted", iconColor = "text-muted-foreground" }: StatCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-none">
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-muted-foreground">{label}</span>
                <span className={cn("inline-flex size-7 items-center justify-center rounded-md", iconBg)}>
                    <Icon className={cn("size-3.5", iconColor)} />
                </span>
            </div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
}
