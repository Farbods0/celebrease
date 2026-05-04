import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    inventoryApi,
    type ApiHoliday,
    type ApiInventoryItem,
    type ApiKit,
    type InventoryStatus,
} from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

type InventoryFormProps = {
    item?: ApiInventoryItem;
    holidays: ApiHoliday[];
    kits: ApiKit[];
    onClose: () => void;
};

const STATUS_OPTIONS: { value: InventoryStatus; label: string }[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "LOW_STOCK", label: "Low Stock" },
    { value: "RETIRED", label: "Retired" },
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
    name: z.string().min(2, "Item name is required").max(120),
    sku: z.string().min(2, "SKU is required").max(64),
    category: z.string().max(64),
    description: z.string().max(1000),
    image: z.string().min(1, "Image is required"),
    totalQty: numericString("Total quantity", { allowZero: true, integer: true }),
    vendorName: z.string().min(2, "Vendor name is required").max(120),
    vendorEmail: z.email("Valid email required"),
    vendorPhone: z.string().min(4, "Vendor phone is required").max(32),
    costPerUnit: numericString("Cost per unit", { allowZero: true }),
    status: z.enum(["ACTIVE", "LOW_STOCK", "RETIRED"]),
    lowStockThreshold: z
        .string()
        .refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0), "Must be 0 or greater"),
});

function StepBar({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex gap-1.5 mb-2">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step === 2 ? "bg-primary" : "bg-muted"}`} />
        </div>
    );
}

export function InventoryForm({ item, holidays, kits, onClose }: InventoryFormProps) {
    const router = useRouter();
    const isEdit = !!item;
    const [step, setStep] = useState<1 | 2>(1);

    const initialKitsByHoliday = useMemo(() => {
        const set = new Set<string>();
        item?.kitItems.forEach((ki) => set.add(ki.kit.holidayId));
        return set;
    }, [item]);

    const initialKitQty = useMemo(() => {
        const map: Record<string, number> = {};
        item?.kitItems.forEach((ki) => {
            map[ki.kit.id] = ki.qty;
        });
        return map;
    }, [item]);

    const [selectedHolidayIds, setSelectedHolidayIds] = useState<Set<string>>(initialKitsByHoliday);
    const [kitQty, setKitQty] = useState<Record<string, number>>(initialKitQty);

    const kitsByHoliday = useMemo(() => {
        const map = new Map<string, ApiKit[]>();
        for (const kit of kits) {
            if (!map.has(kit.holidayId)) map.set(kit.holidayId, []);
            map.get(kit.holidayId)!.push(kit);
        }
        return map;
    }, [kits]);

    const form = useAppForm({
        defaultValues: {
            name: item?.name ?? "",
            sku: item?.sku ?? "",
            category: item?.category ?? "",
            description: item?.description ?? "",
            image: item?.image ?? "",
            totalQty: item ? String(item.totalQty) : "",
            vendorName: item?.vendorName ?? "",
            vendorEmail: item?.vendorEmail ?? "",
            vendorPhone: item?.vendorPhone ?? "",
            costPerUnit: item ? String(item.costPerUnit) : "",
            status: item?.status ?? "ACTIVE",
            lowStockThreshold: item ? String(item.lowStockThreshold) : "0",
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            try {
                const kitMappings = Object.entries(kitQty)
                    .filter(([, qty]) => qty > 0)
                    .map(([kitId, qty]) => ({ kitId, qty }));

                const payload = {
                    name: value.name,
                    sku: value.sku,
                    image: value.image,
                    description: value.description || undefined,
                    category: value.category || undefined,
                    vendorName: value.vendorName,
                    vendorEmail: value.vendorEmail,
                    vendorPhone: value.vendorPhone,
                    costPerUnit: Number(value.costPerUnit),
                    totalQty: Number(value.totalQty),
                    lowStockThreshold: value.lowStockThreshold ? Number(value.lowStockThreshold) : 0,
                    status: value.status as InventoryStatus,
                    kits: kitMappings,
                };

                if (isEdit && item) {
                    await inventoryApi.update(item.id, payload);
                    toast.success("Inventory item updated");
                } else {
                    await inventoryApi.create({ ...payload, initialStatus: value.status as InventoryStatus });
                    toast.success("Inventory item created");
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
            if (next.has(id)) {
                next.delete(id);
                // Clear kit qty for kits in this holiday
                const kitsInHoliday = kitsByHoliday.get(id) ?? [];
                setKitQty((q) => {
                    const updated = { ...q };
                    for (const k of kitsInHoliday) delete updated[k.id];
                    return updated;
                });
            } else {
                next.add(id);
            }
            return next;
        });

    const toggleKit = (kitId: string) =>
        setKitQty((prev) => {
            const updated = { ...prev };
            if (updated[kitId]) delete updated[kitId];
            else updated[kitId] = 1;
            return updated;
        });

    const setKitCount = (kitId: string, qty: number) =>
        setKitQty((prev) => ({ ...prev, [kitId]: Math.max(1, qty || 1) }));

    const renderStep1 = () => (
        <>
            <form.AppField name="image">{(field) => <field.FormImage label="Item Image" folder="inventory" />}</form.AppField>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <p className="col-span-2 text-xs text-muted-foreground uppercase tracking-wide">Basic Information</p>

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

                <div className="col-span-2">
                    <form.AppField name="description">
                        {(field) => <field.FormTextarea label="Item Description" placeholder="Add detailed description of the item..." />}
                    </form.AppField>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <p className="col-span-2 text-xs text-muted-foreground uppercase tracking-wide">Pricing &amp; Vendor Information</p>

                <div className="col-span-2">
                    <form.AppField name="vendorName">
                        {(field) => <field.FormInput label="Vendor Name" placeholder="e.g., Holiday Lighting Co." />}
                    </form.AppField>
                </div>

                <form.AppField name="vendorEmail">
                    {(field) => <field.FormInput label="Vendor Email" type="email" placeholder="vendor@example.com" />}
                </form.AppField>

                <form.AppField name="costPerUnit">
                    {(field) => <field.FormInput label="Cost per Unit" placeholder="e.g., 12.00" type="number" />}
                </form.AppField>

                <div className="col-span-2">
                    <form.AppField name="vendorPhone">
                        {(field) => <field.FormInput label="Vendor Phone" placeholder="+1 (555) 000-0000" />}
                    </form.AppField>
                </div>
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
            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Select Holidays Mapping</p>
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
                                    <Checkbox id={`hol-${holiday.id}`} checked={checked} onCheckedChange={() => toggleHoliday(holiday.id)} />
                                    <label htmlFor={`hol-${holiday.id}`} className="cursor-pointer">
                                        {holiday.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Kit Mapping – Assign to Kits</p>
                {selectedHolidayIds.size === 0 ? (
                    <p className="text-sm text-muted-foreground">Select one or more holidays above to map kits.</p>
                ) : (
                    <div className="bg-muted p-2 rounded-lg grid gap-2">
                        {[...selectedHolidayIds].flatMap((holidayId) => {
                            const holiday = holidays.find((h) => h.id === holidayId);
                            const holidayKits = kitsByHoliday.get(holidayId) ?? [];
                            if (holidayKits.length === 0) {
                                return [
                                    <div key={`empty-${holidayId}`} className="rounded-lg border bg-white p-2 px-3 text-xs text-muted-foreground">
                                        No kits yet for {holiday?.name}.
                                    </div>,
                                ];
                            }
                            return holidayKits.map((kit) => {
                                const isChecked = kit.id in kitQty;
                                return (
                                    <div key={kit.id} className="flex items-center justify-between rounded-lg border bg-white p-2 pl-3 gap-3">
                                        <div className="flex items-center gap-3">
                                            <Checkbox id={kit.id} checked={isChecked} onCheckedChange={() => toggleKit(kit.id)} />
                                            <label htmlFor={kit.id} className="capitalize">
                                                {holiday?.name} {kit.tier === "STARTER" ? "Starter" : "Premium"} Kit
                                            </label>
                                        </div>
                                        <input
                                            type="number"
                                            min={1}
                                            value={kitQty[kit.id] ?? 1}
                                            onChange={(e) => setKitCount(kit.id, Number(e.target.value))}
                                            disabled={!isChecked}
                                            className="px-2 w-14 h-7 rounded-md border text-sm text-center"
                                        />
                                    </div>
                                );
                            });
                        })}
                    </div>
                )}
                <p className="text-xs text-muted-foreground">Select which kits include this item and specify quantity per kit</p>
            </div>

            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Initial Status</p>

                <form.AppField name="status">
                    {(field) => (
                        <div className="grid gap-2">
                            <Label htmlFor={field.name}>Inventory Status</Label>
                            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as InventoryStatus)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.AppField>

                <form.AppField name="lowStockThreshold">
                    {(field) => (
                        <div className="grid gap-2">
                            <Label htmlFor={field.name}>Low Stock Threshold</Label>
                            <Input
                                id={field.name}
                                type="number"
                                min={0}
                                placeholder="e.g., 20"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Alert when available quantity falls below this number</p>
                        </div>
                    )}
                </form.AppField>
            </div>

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
                className="grid gap-6"
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
