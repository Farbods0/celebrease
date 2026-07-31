import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMemo } from "react";
import { toast } from "sonner";
import * as z from "zod";

export type AddItemOption = {
    id: string;
    label: string;
    sublabel?: string | null;
};

type KitsAddItemDialogProps = {
    title: string;
    options: AddItemOption[];
    excludeIds?: string[];
    withQty?: boolean;
    submitLabel?: string;
    onSubmit: (selection: { id: string; qty: number }) => Promise<void>;
    onClose: () => void;
};

const buildSchema = (withQty: boolean) =>
    z.object({
        id: z.string().min(1, "Please select an item"),
        qty: withQty
            ? z.string().refine((v) => v !== "" && Number.isInteger(Number(v)) && Number(v) >= 1, "Quantity must be 1 or greater")
            : z.string(),
    });

export function KitsAddItemDialog({
    title,
    options,
    excludeIds = [],
    withQty = false,
    submitLabel = "Add",
    onSubmit,
    onClose,
}: KitsAddItemDialogProps) {
    const exclude = useMemo(() => new Set(excludeIds), [excludeIds]);
    const available = useMemo(() => options.filter((o) => !exclude.has(o.id)), [options, exclude]);

    const selectOptions = useMemo(
        () => available.map((o) => ({ value: o.id, label: o.sublabel ? `${o.label}, ${o.sublabel}` : o.label })),
        [available],
    );

    const form = useAppForm({
        defaultValues: { id: "", qty: "1" },
        validators: { onChange: buildSchema(withQty) },
        onSubmit: async ({ value }) => {
            try {
                await onSubmit({ id: value.id, qty: withQty ? Number(value.qty) : 1 });
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            {available.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No items available to add.</p>
            ) : (
                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <form.AppField name="id">
                        {(field) => <field.FormSelect label="Select item" options={selectOptions} placeholder="Choose an item" />}
                    </form.AppField>

                    {withQty && (
                        <form.AppField name="qty">
                            {(field) => <field.FormInput label="Quantity" type="number" placeholder="1" />}
                        </form.AppField>
                    )}

                    <div className="flex justify-between gap-4 pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <form.AppForm>
                            <form.FormSubmit label={submitLabel} />
                        </form.AppForm>
                    </div>
                </form>
            )}
        </DialogContent>
    );
}
