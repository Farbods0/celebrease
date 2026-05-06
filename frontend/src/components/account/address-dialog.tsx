"use client";

import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ApiAddress, upsertMyAddress } from "@/lib/api";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function AddressDialog({ address }: { address: ApiAddress | null }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useAppForm({
        defaultValues: {
            name: address?.name ?? "",
            phone: address?.phone ?? "",
            address: address?.streetLine1 ?? "",
            apartment: address?.streetLine2 ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            zip: address?.postalCode ?? "",
            country: address?.country ?? "",
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    await upsertMyAddress({
                        name: value.name,
                        phone: value.phone,
                        streetLine1: value.address,
                        streetLine2: value.apartment || undefined,
                        city: value.city,
                        state: value.state,
                        postalCode: value.zip,
                        country: value.country,
                    });
                    toast.success("Address saved successfully!");
                    setOpen(false);
                    router.refresh();
                } catch (error: any) {
                    toast.error(error.message || "Failed to save address.");
                }
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <button className="text-sm text-blue-600 mr-auto flex items-center gap-1.5 hover:underline">
                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                        {address ? "Edit Address" : "Add Address"}
                    </button>
                }
            />
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{address ? "Edit Shipping Address" : "Add Shipping Address"}</DialogTitle>
                    <DialogDescription>Update your shipping address for future orders.</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="grid gap-4"
                >
                    <form.AppField name="name">{(field) => <field.FormInput label="Full Name" placeholder="John Doe" />}</form.AppField>

                    <form.AppField name="phone">
                        {(field) => <field.FormInput label="Phone Number" placeholder="+1234567890" />}
                    </form.AppField>

                    <form.AppField name="address">
                        {(field) => <field.FormInput label="Street Address" placeholder="123 Main Street" />}
                    </form.AppField>
                    <form.AppField name="apartment">{(field) => <field.FormInput label="Apartment / Suite (optional)" />}</form.AppField>

                    <form.AppField name="city">{(field) => <field.FormInput label="City" />}</form.AppField>

                    <form.AppField name="state">{(field) => <field.FormInput label="State / Province" />}</form.AppField>

                    <form.AppField name="zip">{(field) => <field.FormInput label="ZIP / Postal Code" />}</form.AppField>

                    <form.AppField name="country">
                        {(field) => <field.FormInput label="Country" placeholder="United States" />}
                    </form.AppField>

                    <div className="flex justify-end pt-4">
                        <Button variant="black" type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
