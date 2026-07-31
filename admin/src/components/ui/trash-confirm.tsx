import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TrashConfirmProps = {
    /** The name shown in the confirmation message */
    name: ReactNode;
    /** Title of the confirmation dialog */
    title?: string;
    /** Description shown before the item name, defaults to "Are you sure you want to remove" */
    description?: string;
    /** Called when the user confirms the action */
    onConfirm: () => void;
    /** Disables the trigger button */
    disabled?: boolean;
};

export function TrashConfirm({
    name,
    title = "Are you sure?",
    description = "Are you sure you want to remove",
    onConfirm,
    disabled,
}: TrashConfirmProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="inline-flex items-center gap-1.5 rounded-md text-destructive bg-destructive/10 px-2.5 py-1.5 text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 className="size-3" />
                    Remove
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description} <strong className="text-foreground">{name}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
