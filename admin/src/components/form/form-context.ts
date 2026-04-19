import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInput } from "./form-input";
import { FormRadio } from "./form-radio";
import { FormSubmit } from "./form-submit";
import { FormTextarea } from "./form-textarea";
import { FormImage } from "./form-image";

export const { fieldContext, formContext, useFormContext, useFieldContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FormInput,
        FormImage,
        FormRadio,
        FormTextarea,
    },
    formComponents: {
        FormSubmit,
    },
});
