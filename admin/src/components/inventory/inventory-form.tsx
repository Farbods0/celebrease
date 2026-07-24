import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatKitTier, inventoryApi, type ApiHoliday, type ApiItem } from "@/lib/api";
import { getHolidays } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "HIDDEN", label: "Hidden" },
    { value: "LOW_STOCK", label: "Low Stock" },
];

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
    sku: z.string().min(2, "SKU is required").max(64),
    name: z.string().min(2, "Item name is required").max(120),
    image: z.string().min(1, "Image is required"),
    description: z.string().max(1000),
    category: z.string().max(64),
    vendorName: z.string().min(2, "Vendor name is required").max(120),
    vendorEmail: z.email("Valid email required"),
    vendorPhone: z.string().min(4, "Vendor phone is required").max(32),
    costPerUnit: numericString("Cost per unit", { allowZero: true }),
    totalQty: numericString("Total quantity", { allowZero: true, integer: true }),
    lowStockThreshold: z.string().refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0), "Must be 0 or greater"),
    status: z.enum(["ACTIVE", "HIDDEN", "LOW_STOCK"]),
});

function StepBar({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex gap-1.5 mb-2">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step === 2 ? "bg-primary" : "bg-muted"}`} />
        </div>
    );
}

export function InventoryForm({ item, onClose }: { item?: ApiItem; onClose: () => void }) {
    const router = useRouter();
    const isEdit = !!item;
    const [step, setStep] = useState<1 | 2>(1);

    const { data: holidays } = getHolidays();
    const [selectedHolidays, setSelectedHolidays] = useState<Map<string, ApiHoliday>>(new Map());
    const [selectedKits, setSelectedKits] = useState<Map<string, number>>(
        () => new Map(item?.kitItems?.map((ki) => [ki.kit.id, ki.qty]) ?? []),
    );

    useEffect(() => {
        if (!item?.kitItems?.length || holidays.length === 0) return;
        const holidayIds = new Set(item.kitItems.map((ki) => ki.kit.holidayId));
        const next = new Map<string, ApiHoliday>();
        for (const h of holidays) {
            if (holidayIds.has(h.id)) next.set(h.id, h);
        }
        setSelectedHolidays(next);
    }, [item, holidays]);

    const form = useAppForm({
        defaultValues: {
            sku: item?.sku ?? "",
            name: item?.name ?? "",
            image: item?.image ?? "",
            description: item?.description ?? "",
            category: item?.category ?? "",
            vendorName: item?.vendorName ?? "",
            vendorEmail: item?.vendorEmail ?? "",
            vendorPhone: item?.vendorPhone ?? "",
            costPerUnit: item ? String(item.costPerUnit) : "0",
            totalQty: item?.inventory ? String(item.inventory.totalQty) : "0",
            lowStockThreshold: item ? String(item.lowStockThreshold) : "0",
            status: item?.status ?? "ACTIVE",
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            try {
                const payload = {
                    sku: value.sku,
                    name: value.name,
                    image: value.image,
                    description: value.description || undefined,
                    category: value.category || undefined,
                    vendorName: value.vendorName,
                    vendorEmail: value.vendorEmail,
                    vendorPhone: value.vendorPhone,
                    costPerUnit: Number(value.costPerUnit),
                    totalQty: Number(value.totalQty),
                    lowStockThreshold: value.lowStockThreshold ? Number(value.lowStockThreshold) : 0,
                    status: value.status,
                    kits: Array.from(selectedKits.entries()).map(([kitId, qty]) => ({ kitId, qty })),
                };

                if (isEdit && item) {
                    await inventoryApi.update(item.id, payload);
                    toast.success("Inventory item updated");
                } else {
                    await inventoryApi.create(payload);
                    toast.success("Inventory item created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    const toggleHoliday = (holiday: ApiHoliday) =>
        setSelectedHolidays((prev) => {
            const next = new Map(prev);
            if (next.has(holiday.id)) {
                next.delete(holiday.id);
                setSelectedKits((prevKits) => {
                    const nextKits = new Map(prevKits);
                    for (const kit of holiday.kits ?? []) nextKits.delete(kit.id);
                    return nextKits;
                });
            } else {
                next.set(holiday.id, holiday);
            }
            return next;
        });

    const toggleKit = (kitId: string) =>
        setSelectedKits((prev) => {
            const next = new Map(prev);
            if (next.has(kitId)) {
                next.delete(kitId);
            } else {
                next.set(kitId, 1);
            }
            return next;
        });

    const setKitCount = (kitId: string, count: number) =>
        setSelectedKits((prev) => {
            const next = new Map(prev);
            if (count <= 0) {
                next.delete(kitId);
            } else {
                next.set(kitId, count);
            }
            return next;
        });

    const renderStep1 = () => (
        <>
            <form.AppField name="image">{(field) => <field.FormImage label="Item Image" folder="inventory" />}</form.AppField>

            {/* Basic Information */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Basic Information</p>

            <div className="grid grid-cols-2 gap-3">
                <form.AppField name="name">
                    {(field) => <field.FormInput label="Item Name" placeholder="e.g., LED String Lights" />}
                </form.AppField>

                <form.AppField name="sku">{(field) => <field.FormInput label="SKU" placeholder="e.g., CELE-LGT-01" />}</form.AppField>

                <form.AppField name="category">
                    {(field) => <field.FormInput label="Item Category" placeholder="e.g., Lighting" />}
                </form.AppField>

                <form.AppField name="totalQty">
                    {(field) => <field.FormInput label="Total Quantity" placeholder="e.g., 120" type="number" />}
                </form.AppField>
            </div>

            <form.AppField name="description">
                {(field) => <field.FormTextarea label="Item Description" placeholder="Add detailed description of the item..." />}
            </form.AppField>

            {/* Pricing & Vendor Information */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Pricing &amp; Vendor Information</p>

            <form.AppField name="vendorName">
                {(field) => <field.FormInput label="Vendor Name" placeholder="e.g., Holiday Lighting Co." />}
            </form.AppField>

            <form.AppField name="vendorEmail">
                {(field) => <field.FormInput label="Vendor Email" type="email" placeholder="vendor@example.com" />}
            </form.AppField>

            <div className="grid grid-cols-2 gap-3">
                <form.AppField name="vendorPhone">
                    {(field) => <field.FormInput label="Vendor Phone" placeholder="+1 (555) 000-0000" />}
                </form.AppField>

                <form.AppField name="costPerUnit">
                    {(field) => <field.FormInput label="Cost per Unit" placeholder="e.g., 12.00" type="number" />}
                </form.AppField>
            </div>

            <div className="flex justify-between gap-4">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={() => setStep(2)}>
                    Continue
                </Button>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Select Holidays Mapping</p>
            {holidays.length === 0 ? (
                <p className="text-sm text-muted-foreground">No holidays available. Add a holiday first.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {holidays.map((holiday) => {
                        const checked = selectedHolidays.has(holiday.id);
                        return (
                            <div
                                key={holiday.id}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-sm transition-colors ${
                                    checked ? "bg-primary/10 border-primary" : "bg-muted hover:bg-muted/80"
                                }`}
                            >
                                <Checkbox id={`hol-${holiday.id}`} checked={checked} onCheckedChange={() => toggleHoliday(holiday)} />
                                <label htmlFor={`hol-${holiday.id}`} className="cursor-pointer">
                                    {holiday.name}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="text-xs text-muted-foreground uppercase tracking-wide">Kit Mapping – Assign to Kits</p>
            {selectedHolidays.size === 0 ? (
                <p className="text-sm text-muted-foreground">Select one or more holidays above to map kits.</p>
            ) : (
                <div className="bg-muted p-2 rounded-lg grid gap-2">
                    {Array.from(selectedHolidays.values()).map((holiday) => {
                        if (!holiday.kits?.length) {
                            return (
                                <div
                                    key={`empty-${holiday.id}`}
                                    className="rounded-lg border bg-white p-2 px-3 text-xs text-muted-foreground"
                                >
                                    No kits yet for {holiday.name}.
                                </div>
                            );
                        }
                        return holiday.kits.map((kit) => {
                            const checked = selectedKits.has(kit.id);
                            const tierLabel = formatKitTier(kit.tier);
                            return (
                                <div key={kit.id} className="flex items-center justify-between rounded-lg border bg-white p-2 pl-3 gap-3">
                                    <div className="flex items-center gap-3">
                                        <Checkbox id={kit.id} checked={checked} onCheckedChange={() => toggleKit(kit.id)} />
                                        <label htmlFor={kit.id} className="capitalize">
                                            {holiday.name} {tierLabel} Kit
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        min={1}
                                        value={selectedKits.get(kit.id) ?? 1}
                                        onChange={(e) => setKitCount(kit.id, Number(e.target.value))}
                                        disabled={!checked}
                                        className="px-2 w-14 h-7 rounded-md border text-sm text-center"
                                    />
                                </div>
                            );
                        });
                    })}
                </div>
            )}
            <p className="-mt-2 text-xs text-muted-foreground">Select which kits include this item and specify quantity per kit</p>

            {/* Inventory Status */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Initial Status</p>

            <form.AppField name="status">
                {(field) => <field.FormSelect label="Inventory Status" placeholder="Select Status" options={STATUS_OPTIONS} />}
            </form.AppField>

            <form.AppField name="lowStockThreshold">
                {(field) => <field.FormInput type="number" label="Low Stock Threshold" placeholder="e.g., 20" />}
            </form.AppField>

            <p className="-mt-2 text-xs text-muted-foreground">Alert when available quantity falls below this number</p>

            <div className="flex justify-between gap-4">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                    </Button>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Add Item"} />
                    </form.AppForm>
                </div>
            </div>
        </>
    );

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
            </DialogHeader>

            <StepBar step={step} />

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (step === 1) {
                        setStep(2);
                        return;
                    }
                    form.handleSubmit();
                }}
            >
                {step === 1 ? renderStep1() : renderStep2()}
            </form>
        </DialogContent>
    );
}
