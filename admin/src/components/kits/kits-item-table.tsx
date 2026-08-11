import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, type ApiKit } from "@/lib/api";

const STATUS_LABEL: Record<ApiKit["items"][number]["item"]["status"], string> = {
    ACTIVE: "Active",
    LOW_STOCK: "Low Stock",
    RETIRED: "Retired",
};

const STATUS_DOT: Record<ApiKit["items"][number]["item"]["status"], string> = {
    ACTIVE: "status-dot sd-active",
    LOW_STOCK: "status-dot sd-amber",
    RETIRED: "status-dot sd-muted",
};

type KitsItemTableProps = {
    items: ApiKit["items"];
    onRemove: (item: ApiKit["items"][number]["item"]) => void;
    removing?: boolean;
};

export function KitsItemTable({ items, onRemove, removing }: KitsItemTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Item SKU</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {items.map((item) => (
                    <tr key={item.item.id}>
                        <td>
                            <div className="it-cell">
                                <img loading="lazy" decoding="async" className="th" src={resolveImageUrl(item.item.image)} alt="" />
                                <span className="nm">{item.item.name}</span>
                            </div>
                        </td>
                        <td>{item.qty}</td>
                        <td className="it-sku">{item.item.sku}</td>
                        <td style={{ fontWeight: 600, textTransform: "capitalize" }}>{item.item.category}</td>
                        <td>
                            <span className={STATUS_DOT[item.item.status]}>{STATUS_LABEL[item.item.status]}</span>
                        </td>
                        <td>
                            <TrashConfirm
                                name={item.item.name}
                                title="Remove item from kit?"
                                description="Are you sure you want to remove"
                                onConfirm={() => onRemove(item.item)}
                                disabled={removing}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
