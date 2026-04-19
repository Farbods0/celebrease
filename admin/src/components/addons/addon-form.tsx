import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

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

export function AddonForm() {
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

    const form = useAppForm({
        defaultValues: {
            name: "",
            price: 0,
            deposit: 0,
            inventory: 0,
            holidaysMapped: [],
            image: "",
        },
        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

    const toggleHoliday = (h: string) => setSelectedHolidays((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Add New Add-On</DialogTitle>
            </DialogHeader>

            <form className="grid gap-6">
                {/* Image upload */}
                <div>
                    <form.AppField name="image">{(field) => <field.FormImage label="Item Images" />}</form.AppField>
                </div>

                {/* Basic Information */}
                <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Add-on Info</p>

                    <form.AppField name="name">
                        {(field) => <field.FormInput label="Add-On Name" placeholder="Enter add-on name" />}
                    </form.AppField>

                    <div className="grid grid-cols-2 gap-3">
                        <form.AppField name="price">
                            {(field) => <field.FormInput label="Price" placeholder="e.g., $150" type="number" />}
                        </form.AppField>

                        <form.AppField name="deposit">
                            {(field) => <field.FormInput label="Deposit" placeholder="e.g., $100" type="number" />}
                        </form.AppField>
                    </div>

                    <form.AppField name="inventory">
                        {(field) => <field.FormInput label="Inventory Count" placeholder="e.g., 50" type="number" />}
                    </form.AppField>
                </div>

                <div className="grid gap-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Holiday Mapping</p>
                    <div className="px-3.5 py-3 rounded-lg bg-muted grid grid-cols-3 gap-2">
                        {HOLIDAYS.map((holiday) => {
                            const checked = selectedHolidays.includes(holiday);
                            return (
                                <div key={holiday} className="flex items-center gap-2 text-sm">
                                    <Checkbox id={holiday} checked={checked} onCheckedChange={() => toggleHoliday(holiday)} />
                                    <label htmlFor={holiday}>{holiday}</label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-sm">
                        7 Active <span className="text-muted-foreground">(visible to customers)</span>
                    </p>
                    <Switch />
                </div>

                {/* Footer */}
                <div className="flex justify-between gap-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label="Save Add-On" />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
