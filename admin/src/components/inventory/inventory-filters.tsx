import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { InventoryStatus, KitTier } from "@/lib/api";
import { getHolidays } from "@/lib/utils";
import { Search } from "lucide-react";

export type InventoryFilterState = {
    search: string;
    holidayId: string; // "all" or holiday id
    tiers: Set<"ALL" | KitTier>;
    statuses: Set<InventoryStatus>;
    category: string; // "all" or category name
    lowStockOnly: boolean;
};

export const initialFilterState: InventoryFilterState = {
    search: "",
    holidayId: "all",
    tiers: new Set(["ALL"]),
    statuses: new Set(),
    category: "all",
    lowStockOnly: false,
};

const TIERS: { value: "ALL" | KitTier; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "STARTER", label: "Starter" },
    { value: "PREMIUM", label: "Premium" },
];

const STATUSES: { value: InventoryStatus; label: string }[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "LOW_STOCK", label: "Low Stock" },
    { value: "RETIRED", label: "Retired" },
];

function FilterLegend({ children }: { children: React.ReactNode }) {
    return <span className="block text-xs uppercase tracking-wider text-muted-foreground">{children}</span>;
}

type InventoryFiltersProps = {
    categories: string[];
    state: InventoryFilterState;
    onChange: (next: InventoryFilterState) => void;
};

export function InventoryFilters({ categories, state, onChange }: InventoryFiltersProps) {
    const { data: holidays } = getHolidays();

    const toggleTier = (tier: "ALL" | KitTier) => {
        const next = new Set(state.tiers);
        if (tier === "ALL") {
            onChange({ ...state, tiers: new Set(["ALL"]) });
            return;
        }
        next.delete("ALL");
        if (next.has(tier)) next.delete(tier);
        else next.add(tier);
        if (next.size === 0) next.add("ALL");
        onChange({ ...state, tiers: next });
    };

    const toggleStatus = (s: InventoryStatus) => {
        const next = new Set(state.statuses);
        if (next.has(s)) next.delete(s);
        else next.add(s);
        onChange({ ...state, statuses: next });
    };

    return (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="space-y-1.5">
                <FilterLegend>Search</FilterLegend>
                <InputGroup>
                    <InputGroupAddon>
                        <Search className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder="Search by item name or SKU..."
                        value={state.search}
                        onChange={(e) => onChange({ ...state, search: e.target.value })}
                    />
                </InputGroup>
            </div>

            <div className="space-y-1.5">
                <FilterLegend>Holiday</FilterLegend>
                <Select value={state.holidayId} onValueChange={(v) => onChange({ ...state, holidayId: v })}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Holidays</SelectItem>
                        {holidays.map((h) => (
                            <SelectItem key={h.id} value={h.id}>
                                {h.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <fieldset className="space-y-3">
                <FilterLegend>Kit Type</FilterLegend>
                <div className="space-y-2">
                    {TIERS.map((kt) => {
                        const id = `kit-${kt.value.toLowerCase()}`;
                        const checked = state.tiers.has(kt.value);
                        return (
                            <div key={kt.value} className="flex items-center gap-2.5">
                                <Checkbox id={id} checked={checked} onCheckedChange={() => toggleTier(kt.value)} />
                                <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                    {kt.label}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            <fieldset className="space-y-3">
                <FilterLegend>Inventory Status</FilterLegend>
                <div className="space-y-2">
                    {STATUSES.map((s) => {
                        const id = `status-${s.value.toLowerCase()}`;
                        const checked = state.statuses.has(s.value);
                        return (
                            <div key={s.value} className="flex items-center gap-2.5">
                                <Checkbox id={id} checked={checked} onCheckedChange={() => toggleStatus(s.value)} />
                                <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                    {s.label}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            <div className="space-y-1.5">
                <FilterLegend>Item Category</FilterLegend>
                <Select value={state.category} onValueChange={(v) => onChange({ ...state, category: v })}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between rounded-md">
                <Label htmlFor="low-stock" className="text-sm font-medium cursor-pointer">
                    Low Stock Only
                </Label>
                <Switch id="low-stock" checked={state.lowStockOnly} onCheckedChange={(v) => onChange({ ...state, lowStockOnly: v })} />
            </div>
        </div>
    );
}
