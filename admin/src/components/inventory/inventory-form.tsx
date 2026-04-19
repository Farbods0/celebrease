import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const HOLIDAYS = [
    "Christmas",
    "Halloween",
    "Diwali",
    "Easter",
    "Thanksgiving",
    "Valentine's",
    "Nowruz",
    "Birthday",
    "Independence Day",
] as const;

const KITS = ["Christmas Starter Kit", "Christmas Premium Kit", "Diwali Starter Kit", "Halloween Premium Kit"] as const;

const INVENTORY_STATUSES = ["Available", "Unavailable", "On Order"] as const;

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex gap-1.5 mb-2">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step === 2 ? "bg-primary" : "bg-muted"}`} />
        </div>
    );
}

export function InventoryForm() {
    const [step, setStep] = useState<1 | 2>(1);

    // Holiday checkboxes (uncontrolled via local state since useAppForm
    // may not natively support arrays; adapt as needed for your form lib)
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
    const [kitQuantities, setKitQuantities] = useState<Record<string, boolean>>({});
    const [kitQty, setKitQty] = useState<Record<string, number>>(Object.fromEntries(KITS.map((k) => [k, 1])));
    const [inventoryStatus, setInventoryStatus] = useState("Available");
    const [lowStockThreshold, setLowStockThreshold] = useState("");

    const form = useAppForm({
        defaultValues: {
            // Basic Information
            name: "",
            sku: "",
            category: "",
            quantity: 0,
            description: "",
            // Image
            image: "",
            // Pricing & Vendor Info
            vendorName: "",
            vendorEmail: "",
            vendorPhone: "",
            costPerUnit: 0,
        },
        onSubmit: async ({ value }) => {
            const fullPayload = {
                ...value,
                holidays: selectedHolidays,
                kits: KITS.filter((k) => kitQuantities[k]).map((k) => ({
                    kit: k,
                    quantity: kitQty[k],
                })),
                inventoryStatus,
                lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
            };
            console.log(fullPayload);
        },
    });

    // ── Toggle helpers ──────────────────────────────────────────────────────────
    const toggleHoliday = (h: string) => setSelectedHolidays((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

    const toggleKit = (k: string) => setKitQuantities((prev) => ({ ...prev, [k]: !prev[k] }));

    // ── Step 1 ──────────────────────────────────────────────────────────────────
    const renderStep1 = () => (
        <>
            {/* Image upload */}
            <div>
                <form.AppField name="image">{(field) => <field.FormImage label="Item Images" />}</form.AppField>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <p className="col-span-2 text-xs text-muted-foreground uppercase tracking-wide">Basic Information</p>

                <form.AppField name="name">
                    {(field) => <field.FormInput label="Item Name" placeholder="e.g., LED String Lights" />}
                </form.AppField>

                <form.AppField name="sku">{(field) => <field.FormInput label="SKU" placeholder="e.g., CELE-LGT-01" />}</form.AppField>

                <form.AppField name="category">{(field) => <field.FormInput label="Item Category" />}</form.AppField>

                <form.AppField name="quantity">
                    {(field) => <field.FormInput label="Total Quantity" placeholder="e.g., 120" type="number" />}
                </form.AppField>

                <div className="col-span-2">
                    <form.AppField name="description">
                        {(field) => <field.FormTextarea label="Item Description" placeholder="Add detailed description of the item..." />}
                    </form.AppField>
                </div>
            </div>

            {/* Pricing & Vendor Information */}
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

            {/* Footer */}
            <div className="flex justify-between gap-4">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
        </>
    );

    // ── Step 2 ──────────────────────────────────────────────────────────────────
    const renderStep2 = () => (
        <>
            {/* Holiday Mapping */}
            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Select Holidays Mapping</p>

                <div className="flex flex-wrap gap-2">
                    {HOLIDAYS.map((holiday) => {
                        const checked = selectedHolidays.includes(holiday);
                        return (
                            <div
                                key={holiday}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-sm transition-colors ${
                                    checked ? "bg-primary/10 border-primary" : "bg-muted hover:bg-muted/80"
                                }`}
                            >
                                <Checkbox id={holiday} checked={checked} onCheckedChange={() => toggleHoliday(holiday)} />
                                <label htmlFor={holiday}>{holiday}</label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Kit Mapping */}
            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Kit Mapping – Assign to Kits</p>

                <div className="bg-muted p-2 rounded-lg grid gap-2">
                    {KITS.map((kit) => {
                        const isChecked = !!kitQuantities[kit];
                        return (
                            <div key={kit} className="flex items-center justify-between rounded-lg border bg-white p-2 pl-3 gap-3">
                                <div className="flex items-center gap-3">
                                    <Checkbox id={kit} checked={isChecked} onCheckedChange={() => toggleKit(kit)} />
                                    <label htmlFor={kit}>{kit}</label>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    value={kitQty[kit]}
                                    onChange={(e) =>
                                        setKitQty((prev) => ({
                                            ...prev,
                                            [kit]: Number(e.target.value),
                                        }))
                                    }
                                    disabled={!isChecked}
                                    className="px-2 w-14 h-7 rounded-md border text-sm text-center"
                                />
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-muted-foreground">Select which kits include this item and specify quantity per kit</p>
            </div>

            {/* Initial Status */}
            <div className="grid gap-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Initial Status</p>

                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Inventory Status</Label>
                    <Select value={inventoryStatus} onValueChange={setInventoryStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {INVENTORY_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Low Stock Threshold</Label>
                    <Input
                        type="number"
                        placeholder="e.g., 20"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Alert when available quantity falls below this number</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between gap-4">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                    </Button>
                    <form.AppForm>
                        <form.FormSubmit label="Add Item Now" />
                    </form.AppForm>
                </div>
            </div>
        </>
    );

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>

            <StepBar step={step} />

            <form className="grid gap-6">{step === 1 ? renderStep1() : renderStep2()}</form>
        </DialogContent>
    );
}
