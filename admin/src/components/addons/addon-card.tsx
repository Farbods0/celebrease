import { TrashConfirm } from "@/components/ui/trash-confirm";
import { addOnsApi, baseURL, type ApiAddOn } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

const fmtMoney = (raw: string | number) => {
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? `$${n.toFixed(0)}` : ", ";
};

type AddOnCardProps = {
    item: ApiAddOn;
    onEdit: (item: ApiAddOn) => void;
};

export function AddOnCard({ item, onEdit }: AddOnCardProps) {
    const router = useRouter();
    const [toggling, setToggling] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handleToggleActive = async () => {
        setToggling(true);
        try {
            await addOnsApi.update(item.id, { isActive: !item.isActive });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to toggle status");
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        setRemoving(true);
        try {
            await addOnsApi.remove(item.id);
            toast.success(`${item.name} deleted`);
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete");
        } finally {
            setRemoving(false);
        }
    };

    const holiday = item.holidays[0]?.holiday;

    return (
        <div className={`addon-card${item.isActive ? "" : " inactive"}`}>
            <div className="addon-img-wrap">
                <img loading="lazy" decoding="async" src={`${baseURL}${item.image}`} alt={item.name} />
                {holiday && <span className="holiday-tag">{holiday.name}</span>}
            </div>
            <div className="addon-body">
                <div className="addon-name">{item.name}</div>
                {item.description && <div className="addon-desc">{item.description}</div>}
                <div className="addon-meta">
                    <span className="addon-price">
                        {fmtMoney(item.price)}
                        <span className="per">/rental</span>
                    </span>
                    {item.holidays.length > 0 && (
                        <span className="kit-count">
                            🎀 {item.holidays.length} {item.holidays.length === 1 ? "holiday" : "holidays"}
                        </span>
                    )}
                </div>
            </div>
            <div className="addon-foot">
                <label className="toggle-wrap">
                    <span className="toggle">
                        <input
                            type="checkbox"
                            checked={item.isActive}
                            disabled={toggling}
                            onChange={handleToggleActive}
                        />
                        <span className="toggle-slider" />
                    </span>
                    <span className={`toggle-label ${item.isActive ? "on" : "off"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                    </span>
                </label>
                <div className="addon-actions">
                    <button type="button" className="btn-sm btn-outline" onClick={() => onEdit(item)}>
                        ✏ Edit
                    </button>
                    {!item.isActive && (
                        <TrashConfirm name={item.name} onConfirm={handleDelete} disabled={removing} />
                    )}
                </div>
            </div>
        </div>
    );
}
