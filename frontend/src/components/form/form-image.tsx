import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";
import { useFieldContext } from "./form-context";

type FormImageProps = {
    label: string;
    disabled?: boolean;
    accept?: string;
};

export function FormImage({ label, disabled, accept = "image/png,image/jpeg,image/jpg,image/webp" }: FormImageProps) {
    const field = useFieldContext<File | null>();
    const inputRef = useRef<HTMLInputElement>(null);

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        field.handleChange(file);
    };

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <input
                ref={inputRef}
                id={field.name}
                name={field.name}
                type="file"
                accept={accept}
                disabled={disabled}
                onBlur={field.handleBlur}
                onChange={handleFileChange}
                aria-invalid={isInvalid}
                className="sr-only"
            />

            <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-md border border-dashed px-6 py-8 text-center disabled:cursor-not-allowed disabled:opacity-60"
            >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <HugeiconsIcon icon={Upload01Icon} />
                </div>

                <p className="text-sm font-medium">Click to upload image</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
            </button>

            {field.state.value && <p className="pt-1 text-sm text-muted-foreground">Selected: {field.state.value.name}</p>}

            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
