import { StockAdjustForm } from "@/components/inventory/stock-adjust-form";
import { TrashConfirm } from "@/components/ui/trash-confirm";
import { addOnsApi, baseURL, type ApiAddOn } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { Pencil, SlidersHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : ", ";
};

type AddOnTableProps = {
    items: ApiAddOn[];
    onEdit: (item: ApiAddOn) => void;
};

export function AddOnTable({ items, onEdit }: AddOnTableProps) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [adjustingId, setAdjustingId] = useState<string | null>(null);

    const handleToggleActive = async (item: ApiAddOn) => {
        setTogglingId(item.id);
        try {
            await addOnsApi.update(item.id, { isActive: !item.isActive });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (item: ApiAddOn) => {
        setRemovingId(item.id);
        try {
            await addOnsApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="panel">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Deposit</th>
                        <th>In stock</th>
                        <th>Holidays</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <Fragment key={item.id}>
                            <tr>
                                <td>
                                    <div className="cust">
                                        <img loading="lazy" decoding="async"
className="th"
                                            src={resolveImageUrl(item.image)}
                                            alt={item.name}
                                            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
                                        />
                                        <div className="nm">{item.name}</div>
                                    </div>
                                </td>
                                <td className="amt">{fmtMoney(item.price)}</td>
                                <td style={{ color: "var(--ink-muted)" }}>{fmtMoney(item.deposit)}</td>
                                <td className="oid">{item?.inventory?.availableQty ?? ", "}</td>
                                <td>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {item.holidays.length === 0 ? (
                                            <span style={{ color: "var(--ink-soft)" }}>, </span>
                                        ) : (
                                            item.holidays.map(({ holiday }) => (
                                                <span key={holiday.id} className="kit-count">{holiday.name}</span>
                                            ))
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <label className="toggle-wrap">
                                        <span className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={item.isActive}
                                                disabled={togglingId === item.id}
                                                onChange={() => handleToggleActive(item)}
                                            />
                                            <span className="toggle-slider" />
                                        </span>
                                        <span className={`toggle-label ${item.isActive ? "on" : "off"}`}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </label>
                                </td>
                                <td>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <button
                                            type="button"
                                            className="btn-sm btn-outline"
                                            onClick={() => setAdjustingId(adjustingId === item.id ? null : item.id)}
                                        >
                                            <SlidersHorizontal className="size-3.5" />
                                            Stock
                                        </button>
                                        <button type="button" className="btn-sm btn-outline" onClick={() => onEdit(item)} title="Edit">
                                            <Pencil className="size-3.5" />
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
                                    <td colSpan={7} style={{ background: "var(--bg)", padding: 12 }}>
                                        <StockAdjustForm
                                            scope="addon"
                                            id={item.id}
                                            inventory={item.inventory ?? { totalQty: 0, availableQty: 0, reservedQty: 0, shippedQty: 0, cleaningQty: 0, repairQty: 0, lostQty: 0 }}
                                            onClose={() => setAdjustingId(null)}
                                        />
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
