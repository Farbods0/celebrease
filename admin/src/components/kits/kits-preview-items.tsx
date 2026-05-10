import { TrashConfirm } from "@/components/ui/trash-confirm";
import { kitsApi, type ApiKit, type ApiKitPreviewItem } from "@/lib/api";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "@tanstack/react-router";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type KitsPreviewItemsProps = {
    kitId: string;
    items: ApiKit["previewItems"];
    onRemove: (item: ApiKit["previewItems"][number]["item"]) => void;
    removing?: boolean;
};

type SortableRowProps = {
    item: ApiKitPreviewItem;
    onRemove: (item: ApiKit["previewItems"][number]["item"]) => void;
    removing?: boolean;
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
                <TrashConfirm
                    name={item.item.name}
                    title="Remove preview item?"
                    description="Are you sure you want to remove"
                    onConfirm={() => onRemove(item.item)}
                    disabled={removing}
                />
            </div>
        </div>
    );
}

export function KitsPreviewItems({ kitId, items: previewItems, onRemove, removing }: KitsPreviewItemsProps) {
    const router = useRouter();
    const [items, setItems] = useState(previewItems);
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

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.item.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                    {items.map((pi) => (
                        <SortableRow key={pi.item.id} item={pi} onRemove={onRemove} removing={removing} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
