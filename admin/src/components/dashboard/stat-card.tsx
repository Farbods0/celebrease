import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";

type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
    trendPercent?: number; // e.g. +12.5 or -3.2
    trendLabel?: string;
};

export function StatCard({
    label,
    value,
    icon: Icon,
    iconBg = "bg-muted",
    iconColor = "text-muted-foreground",
    trendPercent,
    trendLabel = "vs last month",
}: StatCardProps) {
    const isPositive = (trendPercent ?? 0) >= 0;
    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground leading-tight">{label}</span>
                <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-lg", iconBg)}>
                    <Icon className={cn("size-4", iconColor)} />
                </span>
            </div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {typeof trendPercent === "number" && (
                <div className="flex items-center gap-1.5 text-xs">
                    <span
                        className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold",
                            isPositive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700",
                        )}
                    >
                        {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {Math.abs(trendPercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">{trendLabel}</span>
                </div>
            )}
        </div>
    );
}
