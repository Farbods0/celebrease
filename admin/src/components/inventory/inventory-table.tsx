import { StockAdjustForm } from "@/components/inventory/stock-adjust-form";
import { Button } from "@/components/ui/button";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, formatKitTier, inventoryApi, type ApiItem, type KitTier } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Eye, Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

function holidayCell(item: ApiItem): { name: string; image: string } {
    const first = item.kitItems[0]?.kit;
    return { name: first?.holiday.name ?? "—", image: item.image };
}

function primaryTier(item: ApiItem): KitTier | null {
    return item.kitItems[0]?.kit.tier ?? null;
}

const TIER_CLASS: Record<KitTier, string> = {
    STARTER: "tier-starter",
    PREMIUM: "tier-premium",
    ULTIMATE: "tier-ultimate",
};

type StockState = {
    cls: string;
    label: string;
    rowClass: string;
    utilClass: string;
    utilColor: string;
    pct: number;
};

function stockState(item: ApiItem): StockState {
    const inv = item.inventory;
    const total = inv?.totalQty ?? 0;
    const avail = inv?.availableQty ?? 0;
    const threshold = item.lowStockThreshold || 0;
    const util = total > 0 ? Math.round(((total - avail) / total) * 100) : 0;

    if (total > 0 && avail === 0 && (inv?.reservedQty ?? 0) === 0 && (inv?.shippedQty ?? 0) === 0) {
        return { cls: "st-oos", label: "Off-season", rowClass: "", utilClass: "good", utilColor: "var(--ink-soft)", pct: util };
    }
    if (threshold > 0 && avail <= threshold) {
        return { cls: "st-critical", label: "Critical", rowClass: "row-crit", utilClass: "high", utilColor: "var(--red)", pct: util };
    }
    if (threshold > 0 && avail <= threshold * 2) {
        return { cls: "st-low", label: "Low stock", rowClass: "row-low", utilClass: "med", utilColor: "var(--amber)", pct: util };
    }
    return { cls: "st-good", label: "Good", rowClass: "", utilClass: "good", utilColor: "var(--green)", pct: util };
}

const img = (path?: string | null) => (path ? `${baseURL}${path}` : "");

type InventoryTableProps = {
    items: ApiItem[];
    onView: (item: ApiItem) => void;
    onEdit: (item: ApiItem) => void;
};

export function InventoryTable({ items, onView, onEdit }: InventoryTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [adjustingId, setAdjustingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const allSelected = items.length > 0 && selectedIds.size === items.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map((i) => i.id)));
        }
    };

    const toggleOne = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        setBulkDeleting(true);
        try {
            await Promise.all([...selectedIds].map((id) => inventoryApi.remove(id)));
            toast.success(`${selectedIds.size} item(s) deleted`);
            setSelectedIds(new Set());
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Bulk delete failed");
        } finally {
            setBulkDeleting(false);
        }
    };

    const handleDelete = async (item: ApiItem) => {
        setRemovingId(item.id);
        try {
            await inventoryApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="panel hidden md:block">
            <div className="panel-head">
                <h3>
                    All inventory items
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 6 }}>
                        {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                </h3>
                {selectedIds.size > 0 && (
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedIds.size} selected</span>
                        <Button variant="destructive" size="sm" className="gap-1.5 rounded-lg" onClick={handleBulkDelete} disabled={bulkDeleting}>
                            <Trash2 className="size-3.5" />
                            {bulkDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => setSelectedIds(new Set())}>
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            <div style={{ padding: "0 4px 4px" }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ paddingLeft: 20, width: 36 }}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className="size-4 rounded border-gray-300 accent-primary"
                                    aria-label="Select all"
                                />
                            </th>
                            <th>Item</th>
                            <th>Holiday</th>
                            <th>Quantities</th>
                            <th>Total</th>
                            <th>Utilization</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ padding: "56px 0", textAlign: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                        <div
                                            style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 14,
                                                background: "var(--bg)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 24,
                                            }}
                                        >
                                            🔍
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 16, fontWeight: 700 }}>No results found</p>
                                            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>Try adjusting your search or filters.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const inv = item.inventory;
                                const tier = primaryTier(item);
                                const hol = holidayCell(item);
                                const ss = stockState(item);
                                return (
                                    <Fragment key={item.id}>
                                        <tr className={ss.rowClass}>
                                            <td style={{ paddingLeft: 20 }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(item.id)}
                                                    onChange={() => toggleOne(item.id)}
                                                    className="size-4 rounded border-gray-300 accent-primary"
                                                    aria-label={`Select ${item.name}`}
                                                />
                                            </td>
                                            <td>
                                                <div className="item-cell">
                                                    <img loading="lazy" decoding="async" className="item-thumb" src={img(item.image)} alt="" />
                                                    <div>
                                                        <div className="item-name">{item.name}</div>
                                                        <div className="item-sku">{item.sku}</div>
                                                        {tier && (
                                                            <span className={`item-tier ${TIER_CLASS[tier]}`}>{formatKitTier(tier)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                    {hol.image && (
                                                        <img loading="lazy" decoding="async"
src={img(hol.image)}
                                                            alt=""
                                                            style={{ width: 22, height: 22, borderRadius: 5, objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <span style={{ fontWeight: 500 }}>{hol.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="qty-chips">
                                                    <div className="qchip qchip-avail">
                                                        <span>{inv?.availableQty ?? 0}</span>
                                                        <span className="qlbl">Avail</span>
                                                    </div>
                                                    <div className="qchip qchip-res">
                                                        <span>{inv?.reservedQty ?? 0}</span>
                                                        <span className="qlbl">Res.</span>
                                                    </div>
                                                    <div className="qchip qchip-ship">
                                                        <span>{inv?.shippedQty ?? 0}</span>
                                                        <span className="qlbl">Ship</span>
                                                    </div>
                                                    <div className="qchip qchip-clean">
                                                        <span>{inv?.cleaningQty ?? 0}</span>
                                                        <span className="qlbl">Clean</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700 }}>{inv?.totalQty ?? 0}</td>
                                            <td>
                                                <span style={{ fontSize: 12.5, fontWeight: 600, color: ss.utilColor }}>{ss.pct}%</span>
                                                <div className={`util-bar ${ss.utilClass}`}>
                                                    <i style={{ width: `${ss.pct}%` }} />
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status ${ss.cls}`}>{ss.label}</span>
                                            </td>
                                            <td>
                                                <div className="row-actions">
                                                    <button
                                                        type="button"
                                                        className="ra-btn"
                                                        title="Adjust stock"
                                                        onClick={() => setAdjustingId(adjustingId === item.id ? null : item.id)}
                                                    >
                                                        <SlidersHorizontal className="size-3.5" />
                                                    </button>
                                                    <button type="button" className="ra-btn" title="Edit" onClick={() => onEdit(item)}>
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button type="button" className="ra-btn" title="View" onClick={() => onView(item)}>
                                                        <Eye className="size-3.5" />
                                                    </button>
                                                    <TrashConfirm
                                                        name={item.name}
                                                        onConfirm={() => handleDelete(item)}
                                                        disabled={removingId === item.id}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        {adjustingId === item.id && (
                                            <tr>
                                                <td colSpan={8} style={{ padding: 12, background: "var(--bg)" }}>
                                                    <StockAdjustForm
                                                        scope="item"
                                                        id={item.id}
                                                        inventory={
                                                            item.inventory ?? {
                                                                totalQty: 0,
                                                                availableQty: 0,
                                                                reservedQty: 0,
                                                                shippedQty: 0,
                                                                cleaningQty: 0,
                                                                repairQty: 0,
                                                                lostQty: 0,
                                                            }
                                                        }
                                                        onClose={() => setAdjustingId(null)}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
