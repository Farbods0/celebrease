import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormAvatar } from "./form-avatar";
import { FormImage } from "./form-image";
import { FormInput } from "./form-input";
import { FormRadio } from "./form-radio";
import { FormSelect } from "./form-select";
import { FormSubmit } from "./form-submit";
import { FormSwitch } from "./form-switch";
import { FormTextarea } from "./form-textarea";

export const { fieldContext, formContext, useFormContext, useFieldContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FormAvatar,
        FormInput,
        FormImage,
        FormRadio,
        FormSelect,
        FormSwitch,
        FormTextarea,
    },
    formComponents: {
        FormSubmit,
    },
});
