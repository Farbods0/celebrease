import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, type ApiHolidayWithAddOns } from "@/lib/api";

type KitsAddonTableProps = {
    items: ApiHolidayWithAddOns["addOns"];
    onRemove: (addOn: ApiHolidayWithAddOns["addOns"][number]["addOn"]) => void;
    removing?: boolean;
};

export function KitsAddonTable({ items, onRemove, removing }: KitsAddonTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Add-On</th>
                    <th>Price</th>
                    <th>Deposit</th>
                    <th>Inv</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {items.map((addon) => (
                    <tr key={addon.addOn.id}>
                        <td>
                            <div className="it-cell">
                                <img className="th" src={`${baseURL}${addon.addOn.image}`} alt="" />
                                <span className="nm">{addon.addOn.name}</span>
                            </div>
                        </td>
                        <td className="amt">${addon.addOn.price}</td>
                        <td>${addon.addOn.deposit}</td>
                        <td>{addon.addOn.inventory?.availableQty ?? "N/A"}</td>
                        <td>
                            <span className={addon.addOn.isActive ? "status-dot sd-active" : "status-dot sd-muted"}>
                                {addon.addOn.isActive ? "Active" : "Hidden"}
                            </span>
                        </td>
                        <td>
                            <TrashConfirm
                                name={addon.addOn.name}
                                title="Remove add-on?"
                                description="Are you sure you want to remove"
                                onConfirm={() => onRemove(addon.addOn)}
                                disabled={removing}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
