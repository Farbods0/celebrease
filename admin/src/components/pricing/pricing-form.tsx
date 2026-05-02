import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PricingFormProps = {
    onClose: () => void;
};

export function PricingForm({ onClose }: PricingFormProps) {
    const form = useAppForm({
        defaultValues: {
            sku: "",
            name: "",
            description: "",
            tier: "",
            holidayId: "",

            price30Day: 0,
            price60Day: 0,
            deposit: 0,

            seasonStart: "",
            seasonEnd: "",

            alwaysVisible: false,
            visibleOnPdp: true,
            addOnsEnabled: true,
        },
    });

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Add New Kit Tier</DialogTitle>
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
                    {(field) => <field.FormSelect label="Holiday" options={[]} placeholder="Select Holiday" />}
                </form.AppField>

                <form.AppField name="sku">{(field) => <field.FormInput label="Kit ID" placeholder="e.g., XMAS-PREM-2025" />}</form.AppField>

                <form.AppField name="tier">
                    {(field) => <field.FormSelect label="Kit Tier" options={[]} placeholder="Select Kit Tier" />}
                </form.AppField>

                <form.AppField name="name">
                    {(field) => <field.FormInput label="Kit Name" placeholder="e.g., Christmas Premium" />}
                </form.AppField>

                <form.AppField name="description">
                    {(field) => <field.FormTextarea label="Kit Description" placeholder="Add detailed description of the kit..." />}
                </form.AppField>

                {/* Pricing Information */}
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

                <form.AppField name="seasonStart">
                    {(field) => <field.FormInput label="Season Start Date" placeholder="e.g., 2025-11-01" type="date" />}
                </form.AppField>

                <form.AppField name="seasonEnd">
                    {(field) => <field.FormInput label="Season End Date" placeholder="e.g., 2026-01-01" type="date" />}
                </form.AppField>

                <form.AppField name="alwaysVisible">{(field) => <field.FormSwitch label="Always Visible" />}</form.AppField>

                <form.AppField name="visibleOnPdp">{(field) => <field.FormSwitch label="Visible on PDP" />}</form.AppField>

                <form.AppField name="addOnsEnabled">{(field) => <field.FormSwitch label="Add-ons Enabled" />}</form.AppField>

                <div className="flex justify-between gap-4 pt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label="Add Kit Tier" />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
