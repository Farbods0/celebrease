const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Hidden: { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    Delivered: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Completed: { bg: "rgba(0, 113, 181, 0.12)", color: "rgb(0, 113, 181)" },
    Shipped: { bg: "rgba(75, 50, 245, 0.12)", color: "rgb(75, 50, 245)" },
    "In Transit": { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    Reserved: { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    "In Cleaning": { bg: "rgba(75, 50, 245, 0.12)", color: "rgb(75, 50, 245)" },
    "Inspection Needed": { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    "Return in Transit": { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    Cancelled: { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    "Low Stock": { bg: "rgba(255, 170, 0, 0.12)", color: "rgb(212, 108, 10)" },
    Retired: { bg: "oklch(0.93 0 0)", color: "oklch(0.5 0 0)" },
};

export function StatusBadge({ status }: { status: any }) {
    const style = STATUS_STYLES[status] ?? { bg: "rgba(0, 113, 181, 0.12)", color: "rgb(0, 113, 181)" };
    return (
        <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: style.bg, color: style.color }}
        >
            {status}
        </span>
    );
}
