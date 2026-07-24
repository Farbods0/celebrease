import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { AlertCircle, RotateCw } from "lucide-react";

export function ErrorComp(props: ErrorComponentProps) {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-5 max-w-sm text-center">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-destructive/8 border border-destructive/15">
                    <AlertCircle className="size-8 text-destructive" strokeWidth={1.5} />
                </div>
                <div className="grid gap-1.5">
                    <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        An unexpected error occurred while loading this page. This is usually temporary — please try again.
                    </p>
                </div>
                {props.error?.message && (
                    <div className="w-full rounded-lg bg-muted px-4 py-3 text-left">
                        <p className="text-xs font-mono text-muted-foreground break-all">{props.error.message}</p>
                    </div>
                )}
                <Button variant="outline" onClick={props.reset} className="gap-2">
                    <RotateCw className="size-4" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
