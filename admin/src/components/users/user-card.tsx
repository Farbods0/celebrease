import { baseURL, type ApiUser } from "@/lib/api";
import moment from "moment";

type UserCardProps = {
    item: ApiUser;
    onEdit: (item: ApiUser) => void;
};

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

export function UserCard({ item, onEdit }: UserCardProps) {
    const role = roleBadge(item.role);
    const status = statusPill(item);
    const isSuper = item.role === "superadmin";

    return (
        <article
            style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                padding: 16,
                boxShadow: "var(--shadow-xs)",
            }}
        >
            <div className="user-cell">
                <div className={`u-av ${isSuper ? "grad" : avatarTint(item.id)}`}>
                    {item.image ? <img src={`${baseURL}${item.image}`} alt="" /> : initials(item.name)}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div className="nm">{item.name}</div>
                    <div className="em">{item.email}</div>
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <span className={`role-badge ${role.cls}`}>{role.label}</span>
                <span className={`status ${status.cls}`}>{status.label}</span>
            </div>

            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>
                Member since {moment(item.createdAt).format("MMM DD, YYYY")}
            </div>

            <button
                type="button"
                className="act-btn"
                onClick={() => onEdit(item)}
                style={{ marginTop: 14, width: "100%", height: 34 }}
            >
                Edit
            </button>
        </article>
    );
}
