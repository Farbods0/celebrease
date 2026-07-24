import type { OrderStatus } from "@/lib/api";

/**
 * Maps an order's lifecycle status to the shared CeleBrease-admin status-pill
 * class (defined in celebrease-admin.css) + a human label.
 * Use with: <span className={`status ${pill.cls}`}>{pill.label}</span>
 */
export function orderStatusPill(status: OrderStatus): { cls: string; label: string } {
    switch (status) {
        case "PENDING":
            return { cls: "st-pend", label: "Pending" };
        case "RESERVED":
            return { cls: "st-pend", label: "Reserved" };
        case "SHIPPED":
            return { cls: "st-ship", label: "Shipped" };
        case "DELIVERED":
            return { cls: "st-deliv", label: "Delivered" };
        case "RETURN_REQUESTED":
            return { cls: "st-return-req", label: "Return req." };
        case "RETURN_IN_TRANSIT":
            return { cls: "st-return-in-transit", label: "In transit" };
        case "RETURN_RECEIVED":
            return { cls: "st-inspect", label: "Inspecting" };
        case "COMPLETED":
            return { cls: "st-completed", label: "Completed" };
        case "CANCELLED":
            return { cls: "st-cancelled", label: "Cancelled" };
        default:
            return { cls: "st-pend", label: String(status) };
    }
}
