import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { reviewsApi, type ApiReview } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

type ReviewFormProps = {
    review?: ApiReview;
    onClose: () => void;
};

const createSchema = z.object({
    name: z.string().min(2, "Name is required").max(64),
    image: z.string(),
    rating: z.number().min(1).max(5),
    content: z.string().min(10, "Review content must be at least 10 characters").max(1000),
    isActive: z.boolean(),
});

const updateSchema = z.object({
    name: z.string().min(2, "Name is required").max(64),
    image: z.string(),
    rating: z.number().min(1).max(5),
    content: z.string().min(10, "Review content must be at least 10 characters").max(1000),
    isActive: z.boolean(),
});

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => onChange(i + 1)} className="p-0.5 hover:scale-110 transition-transform">
                    <Star
                        className="size-5 text-muted-foreground hover:text-yellow-500 transition-colors"
                        fill={i < value ? "#eab308" : "none"}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
}

export function ReviewForm({ review, onClose }: ReviewFormProps) {
    const router = useRouter();
    const isEdit = !!review;

    const form = useAppForm({
        defaultValues: {
            name: review?.name ?? "",
            image: review?.image ?? "",
            rating: review?.rating ?? 5,
            content: review?.content ?? "",
            isActive: review?.isActive ?? true,
        },
        validators: { onChange: isEdit ? updateSchema : createSchema },
        onSubmit: async ({ value }) => {
            try {
                if (isEdit && review) {
                    await reviewsApi.update(review.id, {
                        name: value.name,
                        rating: value.rating,
                        content: value.content,
                        isActive: value.isActive,
                    });
                    toast.success("Review updated");
                } else {
                    await reviewsApi.create({
                        name: value.name,
                        rating: value.rating,
                        content: value.content,
                        isActive: value.isActive,
                    });
                    toast.success("Review created");
                }
                await router.invalidate();
                onClose();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Something went wrong");
            }
        },
    });

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Review" : "Add New Review"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="name">{(field) => <field.FormInput label="Reviewer Name" placeholder="Enter name" />}</form.AppField>

                <form.AppField name="rating">
                    {(field) => (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Rating</label>
                            <StarRating value={field.state.value} onChange={field.handleChange} />
                        </div>
                    )}
                </form.AppField>

                <form.AppField name="content">
                    {(field) => <field.FormTextarea label="Review Content" placeholder="Write your review here..." />}
                </form.AppField>

                <form.AppField name="isActive">
                    {(field) => (
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>Active</FieldLabel>
                            </FieldContent>
                            <Switch id={field.name} checked={field.state.value} onCheckedChange={field.handleChange} />
                        </Field>
                    )}
                </form.AppField>

                <div className="flex justify-between gap-4 pt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Create review"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
