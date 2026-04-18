export type Holiday =
    | "Christmas"
    | "Diwali"
    | "Easter"
    | "Birthday"
    | "Independence Day"
    | "Halloween"
    | "Thanksgiving"
    | "Nowruz"
    | "Valentine's";

export type KitType = "Starter" | "Premium" | "Add-On";

export type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    holiday: Holiday;
    kitType: KitType;
    totalQty: number;
    available: number;
    reserved: number;
    shipped: number;
    cleaning: number;
    repair: number;
    status: "Active" | "Retired";
    lowStock?: boolean;
};

export const INVENTORY: InventoryItem[] = [
    {
        id: "1",
        name: "LED String Lights – Warm White",
        sku: "LED-WW-001",
        holiday: "Christmas",
        kitType: "Starter",
        totalQty: 120,
        available: 64,
        reserved: 30,
        shipped: 19,
        cleaning: 16,
        repair: 3,
        status: "Active",
    },
    {
        id: "2",
        name: "Premium Ornament Set",
        sku: "ORN-PR-002",
        holiday: "Christmas",
        kitType: "Premium",
        totalQty: 90,
        available: 30,
        reserved: 25,
        shipped: 22,
        cleaning: 10,
        repair: 3,
        status: "Active",
    },
    {
        id: "3",
        name: "Rangoli Mat Set",
        sku: "RNG-MT-003",
        holiday: "Diwali",
        kitType: "Starter",
        totalQty: 60,
        available: 22,
        reserved: 14,
        shipped: 10,
        cleaning: 11,
        repair: 3,
        status: "Active",
        lowStock: true,
    },
    {
        id: "4",
        name: "Lantern Set – Gold",
        sku: "LNT-GD-004",
        holiday: "Diwali",
        kitType: "Premium",
        totalQty: 40,
        available: 10,
        reserved: 12,
        shipped: 8,
        cleaning: 6,
        repair: 4,
        status: "Active",
        lowStock: true,
    },
    {
        id: "5",
        name: "Pastel Egg Ornaments",
        sku: "PST-EG-005",
        holiday: "Easter",
        kitType: "Starter",
        totalQty: 100,
        available: 45,
        reserved: 18,
        shipped: 23,
        cleaning: 10,
        repair: 3,
        status: "Active",
    },
    {
        id: "6",
        name: "Balloon Garland Kit",
        sku: "BLN-GR-006",
        holiday: "Birthday",
        kitType: "Premium",
        totalQty: 80,
        available: 120,
        reserved: 35,
        shipped: 30,
        cleaning: 12,
        repair: 3,
        status: "Active",
    },
    {
        id: "7",
        name: "Lawn Flag Set",
        sku: "LWN-FG-007",
        holiday: "Independence Day",
        kitType: "Add-On",
        totalQty: 80,
        available: 32,
        reserved: 18,
        shipped: 20,
        cleaning: 7,
        repair: 3,
        status: "Active",
    },
    {
        id: "8",
        name: "Spider Web Kit",
        sku: "SPD-WB-008",
        holiday: "Halloween",
        kitType: "Starter",
        totalQty: 150,
        available: 50,
        reserved: 30,
        shipped: 40,
        cleaning: 20,
        repair: 10,
        status: "Active",
    },
    {
        id: "9",
        name: "Harvest Garland",
        sku: "HVT-GR-009",
        holiday: "Thanksgiving",
        kitType: "Premium",
        totalQty: 70,
        available: 20,
        reserved: 18,
        shipped: 20,
        cleaning: 10,
        repair: 2,
        status: "Active",
    },
    {
        id: "10",
        name: "Nowruz Table Runner",
        sku: "NWZ-TR-010",
        holiday: "Nowruz",
        kitType: "Premium",
        totalQty: 40,
        available: 10,
        reserved: 12,
        shipped: 6,
        cleaning: 5,
        repair: 3,
        status: "Active",
        lowStock: true,
    },
    {
        id: "11",
        name: "Christmas Tree 6ft",
        sku: "XMT-06-011",
        holiday: "Christmas",
        kitType: "Add-On",
        totalQty: 25,
        available: 10,
        reserved: 6,
        shipped: 5,
        cleaning: 3,
        repair: 1,
        status: "Active",
        lowStock: true,
    },
    {
        id: "12",
        name: "LED Candle Set",
        sku: "LED-CN-012",
        holiday: "Valentine's",
        kitType: "Starter",
        totalQty: 80,
        available: 40,
        reserved: 15,
        shipped: 12,
        cleaning: 9,
        repair: 4,
        status: "Active",
    },
];

export const TOTAL_ITEMS = 647;
