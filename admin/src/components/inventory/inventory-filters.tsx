import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";

const KIT_TYPES = ["All", "Starter", "Premium", "Add-On"] as const;
const STATUSES = ["Available", "Reserved", "Shipped", "In Cleaning", "In Repair", "Retired"] as const;

function FilterLegend({ children }: { children: React.ReactNode }) {
    return <span className="block text-xs uppercase tracking-wider text-muted-foreground">{children}</span>;
}

export function InventoryFilters() {
    return (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {/* Search */}
            <div className="space-y-1.5">
                <FilterLegend>Search</FilterLegend>
                <InputGroup>
                    <InputGroupAddon>
                        <Search className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search by item name or SKU..." />
                </InputGroup>
            </div>

            {/* Holiday */}
            <div className="space-y-1.5">
                <FilterLegend>Holiday</FilterLegend>
                <Select defaultValue="all">
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Holidays</SelectItem>
                        <SelectItem value="christmas">Christmas</SelectItem>
                        <SelectItem value="diwali">Diwali</SelectItem>
                        <SelectItem value="easter">Easter</SelectItem>
                        <SelectItem value="halloween">Halloween</SelectItem>
                        <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                        <SelectItem value="valentines">Valentine&apos;s</SelectItem>
                        <SelectItem value="nowruz">Nowruz</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="independence">Independence Day</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Kit Type */}
            <fieldset className="space-y-3">
                <FilterLegend>Kit Type</FilterLegend>
                <div className="space-y-2">
                    {KIT_TYPES.map((kt) => {
                        const id = `kit-${kt.toLowerCase()}`;
                        return (
                            <div key={kt} className="flex items-center gap-2.5">
                                <Checkbox id={id} defaultChecked={kt === "All"} />
                                <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                    {kt}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            {/* Inventory Status */}
            <fieldset className="space-y-3">
                <FilterLegend>Inventory Status</FilterLegend>
                <div className="space-y-2">
                    {STATUSES.map((s) => {
                        const id = `status-${s.toLowerCase().replace(/\s+/g, "-")}`;
                        return (
                            <div key={s} className="flex items-center gap-2.5">
                                <Checkbox id={id} />
                                <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                    {s}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            {/* Item Category */}
            <div className="space-y-1.5">
                <FilterLegend>Item Category</FilterLegend>
                <Select defaultValue="all">
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="lights">Lights</SelectItem>
                        <SelectItem value="ornaments">Ornaments</SelectItem>
                        <SelectItem value="garlands">Garlands</SelectItem>
                        <SelectItem value="trees">Trees</SelectItem>
                        <SelectItem value="candles">Candles</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Low Stock Alert */}
            <div className="flex items-center justify-between rounded-md">
                <Label htmlFor="low-stock" className="text-sm font-medium cursor-pointer">
                    Low Stock Alert
                </Label>
                <Switch id="low-stock" defaultChecked />
            </div>
        </div>
    );
}
