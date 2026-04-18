import type { Holiday } from "@/data";
import type { CSSProperties } from "react";

const HOLIDAY_STYLES: Record<Holiday, { bg: string; fg: string }> = {
    Christmas: { bg: "oklch(0.94 0.07 150)", fg: "oklch(0.35 0.12 150)" },
    Diwali: { bg: "oklch(0.93 0.06 25)", fg: "oklch(0.4 0.15 25)" },
    Easter: { bg: "oklch(0.95 0.09 95)", fg: "oklch(0.42 0.1 95)" },
    Birthday: { bg: "oklch(0.93 0.05 340)", fg: "oklch(0.4 0.14 340)" },
    "Independence Day": {
        bg: "oklch(0.93 0.05 280)",
        fg: "oklch(0.4 0.15 280)",
    },
    Halloween: { bg: "oklch(0.94 0.08 60)", fg: "oklch(0.45 0.16 60)" },
    Thanksgiving: { bg: "oklch(0.94 0.07 50)", fg: "oklch(0.42 0.14 50)" },
    Nowruz: { bg: "oklch(0.93 0.06 200)", fg: "oklch(0.4 0.13 200)" },
    "Valentine's": { bg: "oklch(0.94 0.06 0)", fg: "oklch(0.42 0.15 0)" },
};

export function HolidayBadge({ holiday }: { holiday: Holiday }) {
    const tone = HOLIDAY_STYLES[holiday];
    const style: CSSProperties = {
        backgroundColor: tone.bg,
        color: tone.fg,
    };
    return (
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={style}>
            {holiday}
        </span>
    );
}
