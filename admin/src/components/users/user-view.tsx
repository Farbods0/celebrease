import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { User } from "@/data";

export function UserView({ item }: { item: User }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {/* TODO: Add user view */}
            <div className="text-sm text-muted-foreground">{item.email}</div>
        </DialogContent>
    );
}
