import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useFieldContext } from "./form-context";

type FormSwitchProps = {
    label: string;
    disabled?: boolean;
};

export function FormSwitch({ label, disabled }: FormSwitchProps) {
    const field = useFieldContext<boolean>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <div className="flex justify-between items-center">
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Switch checked={field.state.value} onCheckedChange={field.handleChange} disabled={disabled} />
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
