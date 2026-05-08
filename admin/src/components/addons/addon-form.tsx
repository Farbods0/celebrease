import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { addOnsApi, type ApiAddOn } from "@/lib/api";
import { getHolidays } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const numericString = (label: string, opts: { allowZero?: boolean; integer?: boolean } = {}) =>
    z.string().refine(
        (v) => {
            if (v === "") return false;
            const n = Number(v);
            if (Number.isNaN(n)) return false;
            if (opts.integer && !Number.isInteger(n)) return false;
            return opts.allowZero ? n >= 0 : n > 0;
        },
        opts.allowZero ? `${label} must be 0 or greater` : `${label} must be greater than 0`,
    );

const formSchema = z.object({
    sku: z.string().max(64),
    name: z.string().min(2, "Add-on name is required").max(120),
    image: z.string().min(1, "Image is required"),
    description: z.string().max(1000),
    price: numericString("Price", { allowZero: true }),
    deposit: numericString("Deposit", { allowZero: true }),
    inventory: numericString("Inventory", { allowZero: true, integer: true }),
    isActive: z.boolean(),
});

export function AddonForm({ item, onClose }: { item?: ApiAddOn; onClose: () => void }) {
    const router = useRouter();
    const isEdit = !!item;

    const { data: holidays } = getHolidays();
    const [selectedHolidayIds, setSelectedHolidayIds] = useState<Set<string>>(
        () => new Set(item?.holidays?.map((h) => h.holiday.id) ?? []),
    );

    const form = useAppForm({
        defaultValues: {
            sku: item?.sku ?? "",
            name: item?.name ?? "",
            image: item?.image ?? "",
            description: item?.description ?? "",
            price: item ? String(item.price) : "",
            deposit: item ? String(item.deposit) : "0",
            inventory: item ? String(item.inventory) : "0",
            isActive: item?.isActive ?? true,
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            try {
                const payload = {
                    sku: value.sku || undefined,
                    name: value.name,
                    image: value.image,
                    description: value.description || undefined,
                    price: Number(value.price),
                    deposit: Number(value.deposit),
                    inventory: Number(value.inventory),
                    isActive: value.isActive,
                    holidayIds: Array.from(selectedHolidayIds),
                };

                if (isEdit && item) {
                    await addOnsApi.update(item.id, payload);
                    toast.success("Add-on updated");
                } else {
                    await addOnsApi.create(payload);
                    toast.success("Add-on created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    const toggleHoliday = (id: string) =>
        setSelectedHolidayIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Add-On" : "Add New Add-On"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="image">{(field) => <field.FormImage label="Add-On Image" folder="addons" />}</form.AppField>

                <p className="text-xs text-muted-foreground uppercase tracking-wide">Add-on Info</p>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="name">
                        {(field) => <field.FormInput label="Add-On Name" placeholder="e.g., Tree Topper" />}
                    </form.AppField>
                    <form.AppField name="sku">
                        {(field) => <field.FormInput label="SKU (optional)" placeholder="e.g., CELE-ADDON-01" />}
                    </form.AppField>
                </div>

                <form.AppField name="description">
                    {(field) => <field.FormTextarea label="Description" placeholder="Add a short description..." />}
                </form.AppField>

                <div className="grid grid-cols-3 gap-3">
                    <form.AppField name="price">
                        {(field) => <field.FormInput label="Price" placeholder="e.g., 150" type="number" />}
                    </form.AppField>
                    <form.AppField name="deposit">
                        {(field) => <field.FormInput label="Deposit" placeholder="e.g., 100" type="number" />}
                    </form.AppField>
                    <form.AppField name="inventory">
                        {(field) => <field.FormInput label="Inventory" placeholder="e.g., 50" type="number" />}
                    </form.AppField>
                </div>

                <p className="text-xs text-muted-foreground uppercase tracking-wide">Holiday Mapping</p>
                {holidays.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No holidays available. Add a holiday first.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {holidays.map((holiday) => {
                            const checked = selectedHolidayIds.has(holiday.id);
                            return (
                                <div
                                    key={holiday.id}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-sm transition-colors ${
                                        checked ? "bg-primary/10 border-primary" : "bg-muted hover:bg-muted/80"
                                    }`}
                                >
                                    <Checkbox
                                        id={`addon-hol-${holiday.id}`}
                                        checked={checked}
                                        onCheckedChange={() => toggleHoliday(holiday.id)}
                                    />
                                    <label htmlFor={`addon-hol-${holiday.id}`} className="cursor-pointer">
                                        {holiday.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}

                <form.AppField name="isActive">
                    {(field) => (
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>Visible to customers</FieldLabel>
                            </FieldContent>
                            <Switch id={field.name} checked={field.state.value} onCheckedChange={field.handleChange} />
                        </Field>
                    )}
                </form.AppField>

                <div className="flex justify-between gap-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Save Add-On"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
