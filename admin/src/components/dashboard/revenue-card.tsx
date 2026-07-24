import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "mint" | "blue" | "pink" | "peach";

type RevenueCardProps = {
    label: string;
    value: string;
    icon: LucideIcon;
    tone: Tone;
};

const toneStyles: Record<Tone, { bg: string; fg: string; border: string }> = {
    mint: {
        bg: "bg-card-mint",
        fg: "text-card-mint-foreground",
        border: "border-card-mint-foreground/10",
    },
    blue: {
        bg: "bg-card-blue",
        fg: "text-card-blue-foreground",
        border: "border-card-blue-foreground/10",
    },
    pink: {
        bg: "bg-card-pink",
        fg: "text-card-pink-foreground",
        border: "border-card-pink-foreground/10",
    },
    peach: {
        bg: "bg-card-peach",
        fg: "text-card-peach-foreground",
        border: "border-card-peach-foreground/10",
    },
};

export function RevenueCard({ label, value, icon: Icon, tone }: RevenueCardProps) {
    const t = toneStyles[tone];
    return (
        <div className={cn("flex flex-col gap-3 rounded-xl border p-5 shadow-sm", t.bg, t.fg, t.border)}>
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium opacity-80">{label}</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white/50">
                    <Icon className="size-4 opacity-80" />
                </span>
            </div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
        </div>
    );
}
