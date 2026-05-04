import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { holidaysApi, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

type HolidayFormProps = {
    holiday?: ApiHoliday;
    onClose: () => void;
};

const CATEGORIES: { value: HolidayCategory; label: string }[] = [
    { value: "TRADITIONAL", label: "Traditional" },
    { value: "CULTURAL", label: "Cultural" },
    { value: "EVENT_BASED", label: "Event Based" },
];

const formSchema = z.object({
    name: z.string().min(2, "Name is required").max(64),
    image: z.string().min(2, "Image is required"),
    category: z.enum(["TRADITIONAL", "CULTURAL", "EVENT_BASED"]),
    description: z.string().max(500),
    sortOrder: z.string().refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0), "Must be 0 or greater"),
    isActive: z.boolean(),
});

export function HolidayForm({ holiday, onClose }: HolidayFormProps) {
    const router = useRouter();
    const isEdit = !!holiday;

    const form = useAppForm({
        defaultValues: {
            name: holiday?.name ?? "",
            image: holiday?.image ?? "",
            category: holiday?.category ?? "TRADITIONAL",
            description: holiday?.description ?? "",
            sortOrder: String(holiday?.sortOrder ?? 0),
            isActive: holiday?.isActive ?? true,
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            try {
                if (isEdit && holiday) {
                    await holidaysApi.update(holiday.id, {
                        name: value.name,
                        image: value.image,
                        category: value.category as HolidayCategory,
                        description: value.description || undefined,
                        sortOrder: value.sortOrder ? Number(value.sortOrder) : 0,
                        isActive: value.isActive,
                    });
                    toast.success("Holiday updated");
                } else {
                    await holidaysApi.create({
                        name: value.name,
                        image: value.image,
                        category: value.category as HolidayCategory,
                        description: value.description || undefined,
                        sortOrder: value.sortOrder ? Number(value.sortOrder) : 0,
                        isActive: value.isActive,
                    });
                    toast.success("Holiday created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="image">{(field) => <field.FormImage label="Holiday Image" folder="holidays" />}</form.AppField>

                <form.AppField name="name">
                    {(field) => <field.FormInput label="Holiday Name" placeholder="e.g. Christmas" />}
                </form.AppField>

                <form.AppField name="category">{(field) => <field.FormSelect label="Category" options={CATEGORIES} />}</form.AppField>

                <form.AppField name="description">
                    {(field) => <field.FormTextarea label="Description" placeholder="Optional" />}
                </form.AppField>

                <form.AppField name="sortOrder">
                    {(field) => <field.FormInput type="number" label="Sort Order" placeholder="0" />}
                </form.AppField>

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

                <div className="flex justify-between gap-4 pt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Create holiday"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
