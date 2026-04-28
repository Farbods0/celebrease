import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldContext } from "./form-context";

type FormSelectProps = {
    label: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
};

export function FormSelect({ label, placeholder, options, disabled }: FormSelectProps) {
    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Select value={field.state.value} onValueChange={field.handleChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
