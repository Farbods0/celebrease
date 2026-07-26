import { baseURL, type ApiHoliday } from "@/lib/api";

type KitsHolidayListProps = {
    holidays: ApiHoliday[];
    isLoading: boolean;
    selectedHolidayId: string | null;
    onSelect: (id: string) => void;
    showHeading?: boolean;
};

export function KitsHolidayList({ holidays, isLoading, selectedHolidayId, onSelect, showHeading = true }: KitsHolidayListProps) {
    return (
        <div className="holiday-rail">
            {showHeading && <div className="holiday-rail-head">Holidays</div>}

            <div className="holiday-rail-body">
                {isLoading ? (
                    <>
                        <div className="holiday-rail-skel" />
                        <div className="holiday-rail-skel" />
                        <div className="holiday-rail-skel" />
                    </>
                ) : holidays.length === 0 ? (
                    <p className="holiday-rail-empty">No holidays yet. Add one from the Holidays page.</p>
                ) : (
                    holidays.map((holiday) => {
                        const active = holiday.id === selectedHolidayId;
                        return (
                            <button
                                type="button"
                                key={holiday.id}
                                onClick={() => onSelect(holiday.id)}
                                className={active ? "holiday-item on" : "holiday-item"}
                            >
                                {holiday.image && <img loading="lazy" decoding="async" className="th" src={`${baseURL}${holiday.image}`} alt="" />}
                                {holiday.name}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export function KitsSidebar(props: KitsHolidayListProps) {
    return (
        <aside className="hidden md:block">
            <KitsHolidayList {...props} />
        </aside>
    );
}
