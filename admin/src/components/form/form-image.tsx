import { useFieldContext } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { baseURL, deleteImage, uploadImage } from "@/lib/api";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

type FormImageProps = {
    label: string;
    folder?: string;
    disabled?: boolean;
    accept?: string;
};

export function FormImage({ label, folder, disabled, accept = "image/png,image/jpeg,image/jpg,image/webp" }: FormImageProps) {
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
            const url = await uploadImage(file, folder);
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
                    className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 p-8 text-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-200"
                    disabled={disabled || isUploading}
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        {isUploading ? (
                            <Spinner className="size-5 text-primary" />
                        ) : (
                            <Upload className="size-5 text-primary" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        {isUploading ? "Uploading..." : (
                            <>Click to upload or drag &amp; drop</>
                        )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP — max 10MB</p>
                </button>
            ) : (
                <div className="relative h-40 rounded-xl border border-border overflow-hidden bg-muted group">
                    <img loading="lazy" decoding="async"
src={previewUrl}
                        alt={field.state.value || undefined}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white transition-colors"
                            disabled={disabled || isUploading || isDeleting}
                        >
                            <Upload className="size-3" />
                            Replace
                        </button>
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
                                    field.handleChange("");
                                } catch (error) {
                                    setUploadError(error instanceof Error ? error.message : "Delete failed");
                                } finally {
                                    setIsDeleting(false);
                                }
                            }}
                            className="bg-white/90 hover:bg-red-50 hover:text-destructive size-7"
                            disabled={disabled || isDeleting}
                        >
                            {isDeleting ? <Spinner className="size-3" /> : <X className="size-3" />}
                        </Button>
                    </div>
                    {/* Bottom label bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                        <p className="text-[11px] text-white/80 truncate">{field.state.value?.split("/").pop()}</p>
                    </div>
                </div>
            )}

            {uploadError && <FieldError errors={[{ message: uploadError }]} />}
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
