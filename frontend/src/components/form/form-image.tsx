import { useFieldContext } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { baseURL, deleteImage, uploadImage } from "@/lib/api";
import { Cancel01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";

type FormImageProps = {
    label: string;
    disabled?: boolean;
    accept?: string;
};

export function FormImage({ label, disabled, accept = "image/png,image/jpeg,image/jpg,image/webp" }: FormImageProps) {
    const field = useFieldContext<string | null>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploadError(null);
        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            field.handleChange(url);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const previewUrl = field.state.value ? `${baseURL}${field.state.value}` : null;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <input
                ref={inputRef}
                id={field.name}
                name={field.name}
                type="file"
                accept={accept}
                onBlur={field.handleBlur}
                onChange={handleFileChange}
                aria-invalid={isInvalid}
                className="sr-only"
                disabled={disabled || isUploading}
            />

            {!previewUrl ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-md border border-dashed px-6 py-8 text-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled || isUploading}
                >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        {isUploading ? <Spinner /> : <HugeiconsIcon icon={Upload01Icon} />}
                    </div>

                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                </button>
            ) : (
                <div className="relative h-36 rounded-md border border-dashed overflow-hidden">
                    <img src={previewUrl} alt="Selected" className="h-full w-full object-cover" />
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={async () => {
                            const currentUrl = field.state.value;
                            if (!currentUrl) return;

                            setUploadError(null);
                            setIsDeleting(true);
                            try {
                                await deleteImage(currentUrl);
                                field.handleChange(null);
                            } catch (error) {
                                setUploadError(error instanceof Error ? error.message : "Delete failed");
                            } finally {
                                setIsDeleting(false);
                            }
                        }}
                        className="absolute top-4 right-4"
                        disabled={disabled || isDeleting}
                    >
                        {isDeleting ? <Spinner /> : <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />}
                    </Button>
                </div>
            )}

            {uploadError && <FieldError errors={[{ message: uploadError }]} />}
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
