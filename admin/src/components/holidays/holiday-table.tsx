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
import { baseURL, holidaysApi, type ApiHoliday, type HolidayCategory } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

type HolidayTableProps = {
    items: ApiHoliday[];
    onEdit: (item: ApiHoliday) => void;
};

const CATEGORY_META: Record<HolidayCategory, { label: string; cls: string }> = {
    TRADITIONAL: { label: "Traditional", cls: "cat-trad" },
    CULTURAL: { label: "Cultural", cls: "cat-cult" },
    EVENT_BASED: { label: "Event-Based", cls: "cat-event" },
};

const slugify = (name: string) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export function HolidayTable({ items, onEdit }: HolidayTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleActive = async (item: ApiHoliday) => {
        setTogglingId(item.id);
        try {
            await holidaysApi.update(item.id, { isActive: !item.isActive });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiHoliday) => {
        setRemovingId(item.id);
        try {
            await holidaysApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="panel hidden md:block" style={{ overflow: "visible" }}>
            <div style={{ padding: "0 4px 8px" }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: 36 }} />
                            <th>Holiday</th>
                            <th className="col-hide">Category</th>
                            <th>Kits</th>
                            <th>Active</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "var(--ink-soft)" }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-muted)" }}>No holidays found</div>
                                    <div style={{ fontSize: 12.5, marginTop: 4 }}>Add a holiday to get started</div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item, idx) => {
                                const meta = CATEGORY_META[item.category];
                                const kitCount = item.kits?.length ?? 0;
                                return (
                                    <tr key={item.id} style={item.isActive ? undefined : { opacity: 0.6 }}>
                                        <td className="row-num">{idx + 1}</td>
                                        <td>
                                            <div className="hol-cell">
                                                <img loading="lazy" decoding="async"
className="hol-thumb"
                                                    src={resolveImageUrl(item.image)}
                                                    alt={item.name}
                                                    style={item.isActive ? undefined : { filter: "grayscale(.4)" }}
                                                />
                                                <div>
                                                    <div className="nm">{item.name}</div>
                                                    <div className="slug">{slugify(item.name)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-hide">
                                            <span className={`cat-badge ${meta.cls}`}>{meta.label}</span>
                                        </td>
                                        <td>
                                            <div className="kit-count">
                                                <span className="n">{kitCount}</span> kits
                                            </div>
                                        </td>
                                        <td>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isActive}
                                                    disabled={togglingId === item.id}
                                                    onChange={() => handleToggleActive(item)}
                                                />
                                                <span className="toggle-track" />
                                                <span className="toggle-thumb" />
                                            </label>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button type="button" className="act-btn" title="Edit" onClick={() => onEdit(item)}>
                                                ✏️
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="act-btn"
                                                        title="Delete"
                                                        disabled={removingId === item.id}
                                                    >
                                                        🗑
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to remove{" "}
                                                            <strong className="text-foreground">{item.name}</strong>? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item)}>Remove</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderTop: "1px solid var(--line)",
                    fontSize: 12.5,
                    color: "var(--ink-soft)",
                }}
            >
                <span>
                    Showing <strong style={{ color: "var(--ink)" }}>{items.length}</strong> holiday{items.length === 1 ? "" : "s"}
                </span>
            </div>
        </div>
    );
}
