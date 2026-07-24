import { baseURL, type ApiHoliday, type HolidayCategory } from "@/lib/api";

const CATEGORY_META: Record<HolidayCategory, { label: string; cls: string }> = {
    TRADITIONAL: { label: "Traditional", cls: "cat-trad" },
    CULTURAL: { label: "Cultural", cls: "cat-cult" },
    EVENT_BASED: { label: "Event-Based", cls: "cat-event" },
};

type HolidayCardProps = {
    item: ApiHoliday;
    onEdit: (item: ApiHoliday) => void;
};

export function HolidayCard({ item, onEdit }: HolidayCardProps) {
    const meta = CATEGORY_META[item.category];
    const kitCount = item.kits?.length ?? 0;

    return (
        <div className="panel" style={{ padding: 16, opacity: item.isActive ? 1 : 0.65 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div className="hol-cell">
                    <img
                        className="hol-thumb"
                        src={`${baseURL}${item.image}`}
                        alt={item.name}
                        style={item.isActive ? undefined : { filter: "grayscale(.4)" }}
                    />
                    <div>
                        <div className="nm">{item.name}</div>
                        <span className={`cat-badge ${meta.cls}`} style={{ marginTop: 4, display: "inline-flex" }}>
                            {meta.label}
                        </span>
                    </div>
                </div>
                <div className="kit-count">
                    <span className="n">{kitCount}</span> kits
                </div>
            </div>

            <button
                type="button"
                className="btn-grad"
                style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
                onClick={() => onEdit(item)}
            >
                Edit
            </button>
        </div>
    );
}
