import { TrashConfirm } from "@/components/ui/trash-confirm";
import { baseURL, type ApiUser } from "@/lib/api";

type UserTableProps = {
    items: ApiUser[];
    onEdit: (item: ApiUser) => void;
    onDelete?: (item: ApiUser) => void;
    currentUserId?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" });

function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return ", ";
    return dateFormatter.format(d);
}

function initials(str?: string | null) {
    return (str?.match(/\b(\w)/g) ?? []).slice(0, 2).join("").toUpperCase() || "?";
}

const AV_TINTS = ["purple", "blue", "green", "amber"] as const;
function avatarTint(id: string) {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return AV_TINTS[sum % AV_TINTS.length];
}

function roleBadge(role: string) {
    switch (role) {
        case "superadmin":
            return { cls: "role-super", label: "Super Admin" };
        case "admin":
            return { cls: "role-admin", label: "Admin" };
        default:
            return { cls: "role-staff", label: "User" };
    }
}

function statusPill(user: ApiUser) {
    if (user.banned) return { cls: "st-suspended", label: "Suspended" };
    if (!user.emailVerified) return { cls: "st-pending", label: "Pending" };
    return { cls: "st-active", label: "Active" };
}

export function UserTable({ items, onEdit, onDelete, currentUserId }: UserTableProps) {
    return (
        <div className="hidden md:block" style={{ padding: "14px 4px 4px" }}>
            <table>
                <thead>
                    <tr>
                        <th style={{ paddingLeft: 20 }}>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Region</th>
                        <th>Member since</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ padding: "48px 0", textAlign: "center" }}>
                                <div style={{ fontSize: 13.5, fontWeight: 500 }}>No users found</div>
                                <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
                                    Admin and user accounts will appear here
                                </div>
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const role = roleBadge(item.role);
                            const status = statusPill(item);
                            const isSuper = item.role === "superadmin";
                            const canDelete = onDelete && item.id !== currentUserId && !isSuper;
                            return (
                                <tr
                                    key={item.id}
                                    style={item.banned ? { background: "rgba(210,59,90,.02)" } : undefined}
                                >
                                    <td style={{ paddingLeft: 20 }}>
                                        <div className="user-cell">
                                            <div className={`u-av ${isSuper ? "grad" : avatarTint(item.id)}`}>
                                                {item.image ? (
                                                    <img loading="lazy" decoding="async" src={`${baseURL}${item.image}`} alt="" />
                                                ) : (
                                                    initials(item.name)
                                                )}
                                            </div>
                                            <div>
                                                <div className="nm" style={item.banned ? { opacity: 0.6 } : undefined}>
                                                    {item.name}
                                                </div>
                                                <div className="em">{item.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${role.cls}`}>{role.label}</span>
                                    </td>
                                    <td>
                                        <span className={`status ${status.cls}`}>{status.label}</span>
                                    </td>
                                    <td>
                                        <span className="last-active">{item.region || ", "}</span>
                                    </td>
                                    <td>
                                        <span className="last-active">{formatDate(item.createdAt)}</span>
                                    </td>
                                    <td>
                                        <div className="act-row">
                                            <button type="button" className="act-btn" onClick={() => onEdit(item)}>
                                                Edit
                                            </button>
                                            {canDelete ? (
                                                <TrashConfirm
                                                    name={item.name}
                                                    title="Delete user?"
                                                    description="This will permanently delete user"
                                                    onConfirm={() => onDelete(item)}
                                                />
                                            ) : (
                                                <button type="button" className="act-btn" disabled>
                                                    Remove
                                                </button>
                                            )}
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
