import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { plansApi, type ApiPlan, type PlanCode } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

type PlanFormProps = {
    plan?: ApiPlan;
    existingCodes: PlanCode[];
    onClose: () => void;
};

const PLAN_CODES: PlanCode[] = ["STARTER", "PREMIUM", "ULTIMATE"];

const formSchema = z.object({
    code: z.enum(PLAN_CODES),
    name: z.string().min(2, "Name is required").max(64),
    description: z.string().max(500),
    monthlyPrice: z.string().refine((v) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0, "Enter a valid monthly price"),
    yearlyPrice: z.string().refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0), "Enter a valid yearly price"),
    holidaysPerYear: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 1, "Must be at least 1"),
    kitDiscount: z
        .string()
        .refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 100), "Must be between 0 and 100"),
    addOnDiscount: z
        .string()
        .refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 100), "Must be between 0 and 100"),
    sortOrder: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Must be 0 or greater"),
    isActive: z.boolean(),
});

export function PlanForm({ plan, existingCodes, onClose }: PlanFormProps) {
    const router = useRouter();
    const isEdit = !!plan;

    const [features, setFeatures] = useState<string[]>(plan?.features.map((f) => f.text) ?? [""]);
    const [featureError, setFeatureError] = useState<string | null>(null);

    const availableCodes = PLAN_CODES.filter((c) => !existingCodes.includes(c));
    const defaultCode = (plan?.code ?? availableCodes[0]) as PlanCode | undefined;

    const form = useAppForm({
        defaultValues: {
            code: defaultCode ?? ("STARTER" as PlanCode),
            name: plan?.name ?? "",
            description: plan?.description ?? "",
            monthlyPrice: plan?.monthlyPrice ?? "",
            yearlyPrice: plan?.yearlyPrice ?? "",
            holidaysPerYear: String(plan?.holidaysPerYear ?? 3),
            kitDiscount: String(plan?.kitDiscount ?? 0),
            addOnDiscount: String(plan?.addOnDiscount ?? 0),
            sortOrder: String(plan?.sortOrder ?? 0),
            isActive: plan?.isActive ?? true,
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            const cleaned = features.map((f) => f.trim()).filter(Boolean);
            if (cleaned.length === 0) {
                setFeatureError("Add at least one feature");
                return;
            }
            setFeatureError(null);

            try {
                if (isEdit && plan) {
                    await plansApi.update(plan.id, {
                        name: value.name,
                        description: value.description || undefined,
                        monthlyPrice: Number(value.monthlyPrice),
                        yearlyPrice: value.yearlyPrice ? Number(value.yearlyPrice) : undefined,
                        holidaysPerYear: Number(value.holidaysPerYear),
                        kitDiscount: Number(value.kitDiscount),
                        addOnDiscount: Number(value.addOnDiscount),
                        isActive: value.isActive,
                        sortOrder: Number(value.sortOrder),
                        features: cleaned,
                    });
                    toast.success("Plan updated");
                } else {
                    await plansApi.create({
                        code: value.code,
                        name: value.name,
                        description: value.description || undefined,
                        monthlyPrice: Number(value.monthlyPrice),
                        yearlyPrice: value.yearlyPrice ? Number(value.yearlyPrice) : undefined,
                        holidaysPerYear: Number(value.holidaysPerYear),
                        kitDiscount: Number(value.kitDiscount),
                        addOnDiscount: Number(value.addOnDiscount),
                        isActive: value.isActive,
                        sortOrder: Number(value.sortOrder),
                        features: cleaned,
                    });
                    toast.success("Plan created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    const addFeature = () => setFeatures((prev) => [...prev, ""]);
    const removeFeature = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index));
    const updateFeature = (index: number, text: string) => setFeatures((prev) => prev.map((f, i) => (i === index ? text : f)));

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Plan" : "Add New Plan"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {!isEdit ? (
                    <form.AppField name="code">
                        {(field) => (
                            <field.FormSelect
                                label="Plan Code"
                                options={availableCodes.map((c) => ({ value: c, label: c }))}
                                disabled={availableCodes.length === 0}
                            />
                        )}
                    </form.AppField>
                ) : null}

                <form.AppField name="name">{(field) => <field.FormInput label="Name" placeholder="e.g. Starter" />}</form.AppField>

                <form.AppField name="description">
                    {(field) => <field.FormTextarea label="Description" placeholder="Optional" />}
                </form.AppField>

                <div className="grid grid-cols-1 gap-3">
                    <form.AppField name="monthlyPrice">
                        {(field) => <field.FormInput type="number" label="Monthly Price ($)" placeholder="41.00" />}
                    </form.AppField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="holidaysPerYear">
                        {(field) => <field.FormInput type="number" label="Holidays / Year" placeholder="3" />}
                    </form.AppField>
                    <form.AppField name="kitDiscount">
                        {(field) => <field.FormInput type="number" label="Kit Discount (%)" placeholder="10" />}
                    </form.AppField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="addOnDiscount">
                        {(field) => <field.FormInput type="number" label="Add-On Discount (%)" placeholder="10" />}
                    </form.AppField>
                    <form.AppField name="sortOrder">
                        {(field) => <field.FormInput type="number" label="Sort Order" placeholder="0" />}
                    </form.AppField>
                </div>

                <Field data-invalid={!!featureError}>
                    <div className="flex items-center justify-between">
                        <FieldLabel>Features</FieldLabel>
                        <Button type="button" size="xs" variant="outline" onClick={addFeature}>
                            <Plus />
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {features.map((text, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Input value={text} onChange={(e) => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                                <Button
                                    type="button"
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => removeFeature(i)}
                                    disabled={features.length === 1}
                                    aria-label="Remove feature"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {featureError && <FieldError errors={[{ message: featureError }]} />}
                </Field>

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
                        <form.FormSubmit label={isEdit ? "Save changes" : "Create plan"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
