import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Order } from "../../data";

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" | "status" }) {
    let valueColor: string | undefined;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium" style={valueColor ? { color: valueColor } : undefined}>
                {value}
            </span>
        </div>
    );
}

export default function OrderView({ item }: { item : Order }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {/* Item Details */}
            <section>
                <h3 className="uppercase text-sm font-medium mb-3">Item Details</h3>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Order #" value={item.orderId} />
                    <Field label="Customer" value={item.customer} />
                    <Field label="Phone" value="(555) 123-4567" />
                    <Field label="Email address" value="(555) 123-4567" tone="available" />
                    <Field label="Holiday" value={item.holiday} tone="reserved" />
                    <Field label="Kit Type" value={item.kitType} />
                    <Field label="Duration" value={item.duration} />
                    <Field label="Price" value={item.total} />
                    <Field label="Deposit" value={item.deposit} />
                </div>
            </section>
            {/* Items */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-3">Items</h3>
                <div className="space-y-2">
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className=" border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                </div>
            </section>
            {/* Add-on */}
            <section>
                <h3 className="text-sm uppercase font-medium mb-3">Add-on</h3>
                <div className="space-y-2">
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className=" border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <p>Christmas Starter Kit</p>
                    </div>
                </div>
            </section>
        </DialogContent>
    );
}
