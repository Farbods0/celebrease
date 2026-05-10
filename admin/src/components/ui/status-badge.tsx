const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    Yes: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    No: { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    Active: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Hidden: { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    Pending: { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    Reserved: { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    Shipped: { bg: "rgba(75, 50, 245, 0.12)", color: "rgb(75, 50, 245)" },
    Delivered: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Completed: { bg: "rgba(0, 113, 181, 0.12)", color: "rgb(0, 113, 181)" },
    Cancelled: { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    "Return Requested": { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
    "Return In Transit": { bg: "rgba(75, 50, 245, 0.12)", color: "rgb(75, 50, 245)" },
    "Return Received": { bg: "rgba(0, 113, 181, 0.12)", color: "rgb(0, 113, 181)" },
    Inspected: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Paid: { bg: "rgba(0, 196, 88, 0.12)", color: "rgb(0, 139, 63)" },
    Failed: { bg: "rgba(211, 0, 4, 0.12)", color: "rgb(211, 0, 4)" },
    "In Transit": { bg: "rgba(212, 108, 10, 0.12)", color: "rgb(212, 108, 10)" },
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
