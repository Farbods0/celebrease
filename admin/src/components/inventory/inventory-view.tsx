import type { InventoryItem } from "@/data";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function InventoryView({ item }: { item: InventoryItem }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
        </DialogContent>
    );
}
