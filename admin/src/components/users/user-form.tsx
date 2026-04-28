import { useAppForm } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { usersApi, type ApiUser } from "@/lib/api";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

type UserFormProps = {
    user?: ApiUser;
    onClose: () => void;
};

const createSchema = z.object({
    name: z.string().min(2, "Name is required").max(64),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(64),
    role: z.enum(["admin", "user"]),
    isBan: z.boolean(),
    phone: z.string().max(32),
    region: z.string().max(64),
});

const updateSchema = z.object({
    name: z.string().min(2, "Name is required").max(64),
    email: z.email("Enter a valid email address"),
    password: z.string(),
    role: z.enum(["admin", "user"]),
    isBan: z.boolean(),
    phone: z.string().max(32),
    region: z.string().max(64),
});

export function UserForm({ user, onClose }: UserFormProps) {
    const router = useRouter();
    const isEdit = !!user;
    const { user: authUser } = useRouteContext({ from: "/__main/users" });

    const form = useAppForm({
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
            role: (user?.role ?? "user") as "admin" | "user",
            isBan: user?.isBan ?? false,
            phone: user?.phone ?? "",
            region: user?.region ?? "",
        },
        validators: { onChange: isEdit ? updateSchema : createSchema },
        onSubmit: async ({ value }) => {
            try {
                if (isEdit && user) {
                    await usersApi.update(user.id, {
                        name: value.name,
                        role: value.role,
                        isBan: value.isBan,
                        phone: value.phone || undefined,
                        region: value.region || undefined,
                    });
                    toast.success("User updated");
                } else {
                    await usersApi.create({
                        name: value.name,
                        email: value.email,
                        password: value.password,
                        role: value.role,
                        phone: value.phone || undefined,
                        region: value.region || undefined,
                    });
                    toast.success("User created");
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
                <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
            </DialogHeader>

            <form
                className="grid gap-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="name">{(field) => <field.FormInput label="Name" placeholder="Enter full name" />}</form.AppField>

                {!isEdit ? (
                    <form.AppField name="email">
                        {(field) => <field.FormInput type="email" label="Email" placeholder="user@example.com" />}
                    </form.AppField>
                ) : null}

                {!isEdit ? (
                    <form.AppField name="password">
                        {(field) => <field.FormInput type="password" label="Password" placeholder="At least 8 characters" />}
                    </form.AppField>
                ) : null}

                <form.AppField name="role">
                    {(field) => (
                        <field.FormSelect
                            label="Role"
                            options={[
                                { value: "user", label: "User" },
                                { value: "admin", label: "Admin" },
                            ]}
                            disabled={authUser.role !== "superadmin"}
                        />
                    )}
                </form.AppField>

                <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="phone">{(field) => <field.FormInput label="Phone" placeholder="Optional" />}</form.AppField>
                    <form.AppField name="region">{(field) => <field.FormInput label="Region" placeholder="Optional" />}</form.AppField>
                </div>

                {isEdit ? (
                    <form.AppField name="isBan">
                        {(field) => (
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldLabel htmlFor={field.name}>Suspend account</FieldLabel>
                                </FieldContent>
                                <Switch id={field.name} checked={field.state.value} onCheckedChange={field.handleChange} />
                            </Field>
                        )}
                    </form.AppField>
                ) : null}

                <div className="flex justify-between gap-4 pt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.FormSubmit label={isEdit ? "Save changes" : "Create user"} />
                    </form.AppForm>
                </div>
            </form>
        </DialogContent>
    );
}
