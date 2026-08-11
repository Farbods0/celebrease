import { orderStatusPill } from "@/lib/admin-status";
import {  baseURL, formatDuration, formatMoney, formatTier, totalDeposit, type ApiOrder , resolveImageUrl } from "@/lib/api";
import moment from "moment";

type ReturnTableProps = {
    items: ApiOrder[];
    onView: (item: ApiOrder) => void;
};

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

function returnedCell(order: ApiOrder) {
    const value = order.returnReceivedAt ?? order.returnRequestedAt;
    if (!value) return null;
    const m = moment(value);
    return { date: m.format("MMM D"), ago: m.fromNow() };
}

const img = resolveImageUrl;

export function ReturnTable({ items, onView }: ReturnTableProps) {
    return (
        <div className="hidden md:block" style={{ padding: "0 4px 14px" }}>
            <table className="ret-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Kit</th>
                        <th>Returned</th>
                        <th>Status</th>
                        <th>Deposit</th>
                        <th style={{ minWidth: 150 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="ret-empty">
                                No returns in this stage
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const pill = orderStatusPill(item.status);
                            const ret = returnedCell(item);
                            return (
                                <tr key={item.id}>
                                    <td className="oid">{item.orderNumber}</td>
                                    <td>
                                        <div className="cust">
                                            <div className="av">{initials(item.user.name)}</div>
                                            <div>
                                                <div className="nm">{item.user.name}</div>
                                                <div className="em">{item.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="kit-cell">
                                            <img loading="lazy" decoding="async" src={img(item.holiday.image)} alt="" />
                                            <div>
                                                <div className="kn">{item.holiday.name} · {formatTier(item.kit.tier)}</div>
                                                <div className="ks">{formatDuration(item.duration)} rental · {item.kit.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="ret-date">
                                        {ret ? (
                                            <>
                                                <b>{ret.date}</b>
                                                <br />
                                                {ret.ago}
                                            </>
                                        ) : (
                                            ", "
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status ${pill.cls}`}>{pill.label}</span>
                                    </td>
                                    <td>
                                        <div className="dep-cell">
                                            <span className="dep-full">{formatMoney(totalDeposit(item))}</span>
                                            <span className="dep-sub">Deposit held</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="act-btns">
                                            <button type="button" className="btn-inspect" onClick={() => onView(item)}>
                                                ✓ Inspect &amp; resolve
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
