import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { kitsApi, type ApiHoliday, type ApiKit, type KitStatus, type KitTier } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

type KitsFormProps = {
    kit?: ApiKit;
    holidays: ApiHoliday[];
    defaultHolidayId?: string;
    defaultTier?: KitTier;
    onClose: () => void;
};

const TIERS: { value: KitTier; label: string }[] = [
    { value: "STARTER", label: "Starter Kit" },
    { value: "PREMIUM", label: "Premium Kit" },
];

const STATUSES: { value: KitStatus; label: string }[] = [
    { value: "DRAFT", label: "Draft" },
    { value: "ACTIVE", label: "Active" },
    { value: "HIDDEN", label: "Hidden" },
    { value: "LOW_STOCK", label: "Low Stock" },
];

const numericString = (label: string) =>
    z.string().refine((v) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0, `${label} must be 0 or greater`);

const formSchema = z
    .object({
        sku: z.string().min(2, "SKU is required").max(64),
        tier: z.enum(["STARTER", "PREMIUM"]),
        holidayId: z.string().min(1, "Holiday is required"),
        status: z.enum(["DRAFT", "ACTIVE", "HIDDEN", "LOW_STOCK"]),
        price30Day: numericString("30-Day price"),
        price60Day: numericString("60-Day price"),
        deposit: numericString("Deposit"),
        seasonStart: z.string(),
        seasonEnd: z.string(),
        alwaysVisible: z.boolean(),
        visibleOnPdp: z.boolean(),
        addOnsEnabled: z.boolean(),
        limitInventory: z.boolean(),
    })
    .refine((d) => !d.seasonStart || !d.seasonEnd || d.seasonStart <= d.seasonEnd, {
        message: "Season end must be on or after start",
        path: ["seasonEnd"],
    });

const toDateInput = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");

export function KitsForm({ kit, holidays, defaultHolidayId, defaultTier, onClose }: KitsFormProps) {
    const router = useRouter();
    const isEdit = !!kit;

    const form = useAppForm({
        defaultValues: {
            sku: kit?.sku ?? "",
            tier: kit?.tier ?? defaultTier ?? "STARTER",
            holidayId: kit?.holidayId ?? defaultHolidayId ?? holidays[0]?.id ?? "",
            status: kit?.status ?? "DRAFT",
            price30Day: kit ? String(kit.price30Day) : "",
            price60Day: kit ? String(kit.price60Day) : "",
            deposit: kit ? String(kit.deposit) : "",
            seasonStart: toDateInput(kit?.seasonStart),
            seasonEnd: toDateInput(kit?.seasonEnd),
            alwaysVisible: kit?.alwaysVisible ?? false,
            visibleOnPdp: kit?.visibleOnPdp ?? true,
            addOnsEnabled: kit?.addOnsEnabled ?? true,
            limitInventory: kit?.limitInventory ?? false,
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            try {
                const payload = {
                    sku: value.sku,
                    tier: value.tier as KitTier,
                    holidayId: value.holidayId,
                    status: value.status as KitStatus,
                    price30Day: Number(value.price30Day),
                    price60Day: Number(value.price60Day),
                    deposit: Number(value.deposit),
                    seasonStart: value.seasonStart || undefined,
                    seasonEnd: value.seasonEnd || undefined,
                    alwaysVisible: value.alwaysVisible,
                    visibleOnPdp: value.visibleOnPdp,
                    addOnsEnabled: value.addOnsEnabled,
                    limitInventory: value.limitInventory,
                };

                if (isEdit && kit) {
                    await kitsApi.update(kit.id, payload);
                    toast.success("Kit updated");
                } else {
                    await kitsApi.create(payload);
                    toast.success("Kit created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    const holidayOptions = holidays.map((h) => ({ value: h.id, label: h.name }));

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Kit" : "Add New Kit Tier"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {/* Basic Information */}
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Basic Information</p>

                <form.AppField name="holidayId">
                    {(field) => <field.FormSelect label="Holiday" options={holidayOptions} placeholder="Select Holiday" />}
                </form.AppField>

                <form.AppField name="sku">
                    {(field) => <field.FormInput label="Kit SKU" placeholder="e.g., XMAS-PREM-2025" />}
                </form.AppField>

                <form.AppField name="tier">
                    {(field) => <field.FormSelect label="Kit Tier" options={TIERS} placeholder="Select Kit Tier" />}
                </form.AppField>

                <form.AppField name="status">
                    {(field) => <field.FormSelect label="Status" options={STATUSES} placeholder="Select Status" />}
                </form.AppField>

                {/* Pricing */}
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pricing</p>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="price30Day">
                        {(field) => <field.FormInput label="30-Day Rental Price" placeholder="e.g., 500" type="number" />}
                    </form.AppField>

                    <form.AppField name="price60Day">
                        {(field) => <field.FormInput label="60-Day Rental Price" placeholder="e.g., 800" type="number" />}
                    </form.AppField>
                </div>

                <form.AppField name="deposit">
                    {(field) => <field.FormInput label="Deposit" placeholder="e.g., 200" type="number" />}
                </form.AppField>

                {/* Seasonal Availability */}
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Seasonal Availability</p>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="seasonStart">{(field) => <field.FormInput label="Season Start Date" type="date" />}</form.AppField>

                    <form.AppField name="seasonEnd">{(field) => <field.FormInput label="Season End Date" type="date" />}</form.AppField>
                </div>

                <form.AppField name="alwaysVisible">{(field) => <field.FormSwitch label="Always Visible" />}</form.AppField>

                <form.AppField name="visibleOnPdp">{(field) => <field.FormSwitch label="Visible on PDP" />}</form.AppField>

                <form.AppField name="addOnsEnabled">{(field) => <field.FormSwitch label="Add-ons Enabled" />}</form.AppField>

                <form.AppField name="limitInventory">{(field) => <field.FormSwitch label="Limit Inventory" />}</form.AppField>

                <div className="flex justify-between gap-4 pt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Create kit"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
