import { Button } from "@/components/ui/button";
import { kitsApi, type ApiKitPreviewItem } from "@/lib/api";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "@tanstack/react-router";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type KitsPreviewItemsProps = {
    kitId: string;
    previewItems: ApiKitPreviewItem[];
    onAdd: () => void;
};

type SortableRowProps = {
    item: ApiKitPreviewItem;
    onRemove: (id: string, name: string) => void;
    removing: boolean;
};

function SortableRow({ item, onRemove, removing }: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex h-11.5 items-center justify-between rounded-lg border bg-muted/40 pl-2 pr-4 py-2.5"
        >
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={`Reorder ${item.item.name}`}
                >
                    <GripVertical className="size-4" />
                </button>
                <span className="text-sm capitalize">{item.item.name}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{item.item.sku}</span>
                <button
                    type="button"
                    disabled={removing}
                    onClick={() => onRemove(item.item.id, item.item.name)}
                    className="rounded-md text-destructive bg-destructive/10 px-2 py-0.5 text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Trash
                </button>
            </div>
        </div>
    );
}

export function KitsPreviewItems({ kitId, previewItems, onAdd }: KitsPreviewItemsProps) {
    const router = useRouter();
    const [items, setItems] = useState(previewItems);
    const [removing, setRemoving] = useState(false);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        setItems(previewItems);
    }, [previewItems]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id || reordering) return;

        const oldIndex = items.findIndex((i) => i.item.id === active.id);
        const newIndex = items.findIndex((i) => i.item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const previous = items;
        const next = arrayMove(items, oldIndex, newIndex);
        setItems(next);
        setReordering(true);
        try {
            await kitsApi.reorderPreviewItems(kitId, { itemIds: next.map((i) => i.item.id) });
            await router.invalidate();
        } catch (e) {
            setItems(previous);
            toast.error(e instanceof Error ? e.message : "Failed to reorder preview items");
        } finally {
            setReordering(false);
        }
    };

    const handleRemove = async (itemId: string, name: string) => {
        if (removing) return;
        setRemoving(true);
        try {
            await kitsApi.removePreviewItem(kitId, itemId);
            toast.success(`Removed "${name}" from preview`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to remove preview item");
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="rounded-xl border bg-white overflow-hidden">
            <div className="h-14 px-5 bg-black/4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">PDP Preview Items</h3>
                <Button variant="black" size="sm" onClick={onAdd}>
                    <Plus className="size-4" />
                    Add item
                </Button>
            </div>
            <div className="p-5 flex flex-col gap-2.5">
                <p className="text-xs text-muted-foreground capitalize">
                    Items shown on customer-facing PDP preview. Drag to reorder.
                </p>
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No preview items yet.</p>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map((i) => i.item.id)} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-3">
                                {items.map((pi) => (
                                    <SortableRow key={pi.item.id} item={pi} onRemove={handleRemove} removing={removing} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
