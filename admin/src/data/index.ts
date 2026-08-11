// ============ TYPES ============

export type Holiday =
    | "Christmas"
    | "Diwali"
    | "Easter"
    | "Birthday"
    | "Independence Day"
    | "Halloween"
    | "Thanksgiving"
    | "Nowruz"
    | "Valentine's"
    | "Hanukkah"
    | "New Year"
    | "Baby Shower"
    | "Ramadan";

export type KitType = "Starter" | "Premium" | "Add-On";

export type SubscriptionPlan = "Monthly ($29/Mo)" | "Prepaid (3 Holidays)";
export type SubscriptionStage = "Holiday 0" | "Holiday 1" | "Holiday 2" | "Holiday 3";
export type SubscriptionStatus = "Active" | "Cancelled" | "In Transit";
export type NextAction =
    | "Awaiting Return"
    | "Pick Next Holiday"
    | "Choose First Holiday"
    | "Renewal Pending"
    | "In Transit"
    | "Kit Delivered"
    | "Renewal Decision";

export type OrderStatus = "Shipped" | "Delivered" | "Reserved" | "Return in Transit" | "Completed";
export type AddOnStatus = "Active" | "Hidden";

export type Region = "CA" | "TX" | "NY" | "WA" | "FL" | "NV" | "IL" | "OH" | "PA" | "OR" | "MA" | "CO" | "MI" | "AZ";

// ============ INVENTORY ============

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
        name: "LED String Lights, Warm White",
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
        name: "Lantern Set, Gold",
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

// ============ CUSTOMERS ============

export type Customer = {
    name: string;
    email: string;
    orders: number;
    subscription: boolean;
    onTimeReturns: string;
    depositsHeld: string;
    region: Region;
};

export const CUSTOMERS: Customer[] = [
    // Page 2 (visible in screenshot)
    {
        name: "Terry Calzoni",
        email: "jaylon.saris@example.com",
        orders: 12,
        subscription: true,
        onTimeReturns: "85%",
        depositsHeld: "$0",
        region: "CA",
    },
    {
        name: "Randy Madsen",
        email: "lincoln.workman@example.com",
        orders: 7,
        subscription: false,
        onTimeReturns: "90%",
        depositsHeld: "$50",
        region: "TX",
    },
    {
        name: "Ann Donin",
        email: "randy.carders@example.com",
        orders: 19,
        subscription: true,
        onTimeReturns: "95%",
        depositsHeld: "$75",
        region: "NY",
    },
    {
        name: "Adison Kenter",
        email: "jaxson.workman@example.com",
        orders: 4,
        subscription: false,
        onTimeReturns: "82%",
        depositsHeld: "$100",
        region: "WA",
    },
    {
        name: "Angel Septimus",
        email: "ahmad.bergson@example.com",
        orders: 15,
        subscription: false,
        onTimeReturns: "88%",
        depositsHeld: "$250",
        region: "FL",
    },
    {
        name: "Martin Culhane",
        email: "aspen.baptista@example.com",
        orders: 1,
        subscription: true,
        onTimeReturns: "80%",
        depositsHeld: "$0",
        region: "NV",
    },
    {
        name: "Lindsey Rosser",
        email: "gustavo.curtis@example.com",
        orders: 20,
        subscription: true,
        onTimeReturns: "100%",
        depositsHeld: "$100",
        region: "IL",
    },
    {
        name: "Livia Arcand",
        email: "lincoln.lipshutz@example.com",
        orders: 9,
        subscription: true,
        onTimeReturns: "92%",
        depositsHeld: "$50",
        region: "OH",
    },
    {
        name: "Cooper Botosh",
        email: "corey.workman@example.com",
        orders: 16,
        subscription: true,
        onTimeReturns: "97%",
        depositsHeld: "$75",
        region: "PA",
    },
    {
        name: "Erin Vetrovs",
        email: "corey.workman2@example.com",
        orders: 3,
        subscription: false,
        onTimeReturns: "81%",
        depositsHeld: "$0",
        region: "OR",
    },
    {
        name: "Jordyn Rosser",
        email: "corey.workman3@example.com",
        orders: 10,
        subscription: true,
        onTimeReturns: "89%",
        depositsHeld: "$50",
        region: "MA",
    },
    {
        name: "Craig Culhane",
        email: "corey.workman4@example.com",
        orders: 5,
        subscription: true,
        onTimeReturns: "86%",
        depositsHeld: "$75",
        region: "CO",
    },
    {
        name: "Skylar Press",
        email: "corey.workman5@example.com",
        orders: 14,
        subscription: false,
        onTimeReturns: "94%",
        depositsHeld: "$100",
        region: "MI",
    },
    {
        name: "Kaiya Donin",
        email: "corey.workman6@example.com",
        orders: 8,
        subscription: false,
        onTimeReturns: "91%",
        depositsHeld: "$250",
        region: "AZ",
    },
];

// ============ USERS ============

export type UserRole = "Admin" | "Manager" | "Staff";
export type UserStatus = "Active" | "Inactive";

export type User = {
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
    createdAt: string;
};

export const USERS: User[] = [
    {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@example.com",
        role: "Admin",
        status: "Active",
        lastLogin: "Apr 27, 2026",
        createdAt: "Jan 12, 2025",
    },
    {
        name: "James Carter",
        email: "james.carter@example.com",
        role: "Manager",
        status: "Active",
        lastLogin: "Apr 26, 2026",
        createdAt: "Mar 03, 2025",
    },
    {
        name: "Olivia Bennett",
        email: "olivia.bennett@example.com",
        role: "Staff",
        status: "Active",
        lastLogin: "Apr 25, 2026",
        createdAt: "May 18, 2025",
    },
    {
        name: "Ethan Reynolds",
        email: "ethan.reynolds@example.com",
        role: "Manager",
        status: "Inactive",
        lastLogin: "Mar 14, 2026",
        createdAt: "Jul 22, 2025",
    },
    {
        name: "Mia Thompson",
        email: "mia.thompson@example.com",
        role: "Staff",
        status: "Active",
        lastLogin: "Apr 27, 2026",
        createdAt: "Aug 09, 2025",
    },
    {
        name: "Liam Foster",
        email: "liam.foster@example.com",
        role: "Admin",
        status: "Active",
        lastLogin: "Apr 24, 2026",
        createdAt: "Sep 30, 2025",
    },
    {
        name: "Ava Sullivan",
        email: "ava.sullivan@example.com",
        role: "Staff",
        status: "Inactive",
        lastLogin: "Feb 02, 2026",
        createdAt: "Oct 15, 2025",
    },
    {
        name: "Noah Patterson",
        email: "noah.patterson@example.com",
        role: "Manager",
        status: "Active",
        lastLogin: "Apr 26, 2026",
        createdAt: "Nov 21, 2025",
    },
    {
        name: "Isabella Hayes",
        email: "isabella.hayes@example.com",
        role: "Staff",
        status: "Active",
        lastLogin: "Apr 23, 2026",
        createdAt: "Dec 05, 2025",
    },
    {
        name: "Lucas Brennan",
        email: "lucas.brennan@example.com",
        role: "Staff",
        status: "Active",
        lastLogin: "Apr 25, 2026",
        createdAt: "Jan 28, 2026",
    },
];

// ============ SUBSCRIPTIONS ============

export type Subscription = {
    subId: string;
    customer: string;
    plan: SubscriptionPlan;
    currentHoliday: Holiday;
    stage: SubscriptionStage;
    nextAction: NextAction;
    renewal: string;
    status: SubscriptionStatus;
};

export const SUBSCRIPTIONS: Subscription[] = [
    {
        subId: "S-3012",
        customer: "Jayton Saris",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Christmas",
        stage: "Holiday 2",
        nextAction: "Awaiting Return",
        renewal: "Sep 12, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Lincoln Workman",
        plan: "Prepaid (3 Holidays)",
        currentHoliday: "Diwali",
        stage: "Holiday 1",
        nextAction: "Pick Next Holiday",
        renewal: "Aug 19, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Randy Carder",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Diwali",
        stage: "Holiday 0",
        nextAction: "Choose First Holiday",
        renewal: "Mar 10, 2026",
        status: "In Transit",
    },
    {
        subId: "S-3012",
        customer: "Jaxson Workman",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Easter",
        stage: "Holiday 3",
        nextAction: "Renewal Pending",
        renewal: "Jun 15, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Ahmad Bergson",
        plan: "Prepaid (3 Holidays)",
        currentHoliday: "Valentine's",
        stage: "Holiday 2",
        nextAction: "Awaiting Return",
        renewal: "May 30, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Aspen Baptista",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Thanksgiving",
        stage: "Holiday 1",
        nextAction: "In Transit",
        renewal: "Apr 25, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Gustavo Curtis",
        plan: "Prepaid (3 Holidays)",
        currentHoliday: "Birthday",
        stage: "Holiday 2",
        nextAction: "Pick Next Holiday",
        renewal: "Feb 20, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Lincoln Lipehutz",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Ramadan",
        stage: "Holiday 1",
        nextAction: "Kit Delivered",
        renewal: "Jul 4, 2026",
        status: "Active",
    },
    {
        subId: "S-3012",
        customer: "Corey Workman",
        plan: "Monthly ($29/Mo)",
        currentHoliday: "Hanukkah",
        stage: "Holiday 3",
        nextAction: "Renewal Decision",
        renewal: "Jan 15, 2026",
        status: "Cancelled",
    },
];

// ============ ORDERS ============

export type Order = {
    orderId: string;
    customer: string;
    holiday: Holiday;
    kitType: KitType;
    duration: string;
    addOns: string;
    status: OrderStatus;
    shipDate: string;
    deposit: string;
    total: string;
};

export const ORDERS: Order[] = [
    {
        orderId: "8421",
        customer: "Ryan Gouse",
        holiday: "Christmas",
        kitType: "Premium",
        duration: "60 Days",
        addOns: "Tree, Lights",
        status: "Shipped",
        shipDate: "Nov 12",
        deposit: "$100",
        total: "$225",
    },
    {
        orderId: "8421",
        customer: "Paityn Vaccaro",
        holiday: "Diwali",
        kitType: "Starter",
        duration: "30 Days",
        addOns: "Lanterns",
        status: "Delivered",
        shipDate: "Oct 28",
        deposit: "$50",
        total: "$120",
    },
    {
        orderId: "8421",
        customer: "Emery Siphron",
        holiday: "Halloween",
        kitType: "Starter",
        duration: "30 Days",
        addOns: "--",
        status: "Reserved",
        shipDate: "Nov 20",
        deposit: "$50",
        total: "$75",
    },
    {
        orderId: "8421",
        customer: "Skylar Siphron",
        holiday: "Birthday",
        kitType: "Premium",
        duration: "14 Days",
        addOns: "Balloon Arch",
        status: "Return in Transit",
        shipDate: "Nov 5",
        deposit: "$0",
        total: "$155",
    },
    {
        orderId: "8421",
        customer: "Angel Philips",
        holiday: "Easter",
        kitType: "Premium",
        duration: "60 Days",
        addOns: "Wreath",
        status: "Completed",
        shipDate: "Sep 10",
        deposit: "$0",
        total: "$225",
    },
];

// ============ ADD-ONS ============

export type AddOn = {
    name: string;
    price: string;
    deposit: string;
    inventory: number;
    holidaysMapped: Holiday[];
    status: AddOnStatus;
};

export const ADD_ONS: AddOn[] = [
    { name: "Christmas Tree (6ft)", price: "$59", deposit: "+$100", inventory: 42, holidaysMapped: ["Christmas"], status: "Active" },
    { name: "Extra Lights Kit", price: "$12", deposit: "$0", inventory: 110, holidaysMapped: ["Christmas", "Halloween"], status: "Active" },
    {
        name: "Metallic Table Runner",
        price: "$8",
        deposit: "$0",
        inventory: 34,
        holidaysMapped: ["New Year", "Valentine's"],
        status: "Active",
    },
    {
        name: "Balloon Arch Deluxe",
        price: "$29",
        deposit: "$0",
        inventory: 76,
        holidaysMapped: ["Birthday", "Baby Shower"],
        status: "Active",
    },
    {
        name: "Wreath (Premium Floral)",
        price: "$19",
        deposit: "+$25",
        inventory: 20,
        holidaysMapped: ["Easter", "Thanksgiving"],
        status: "Hidden",
    },
];

// ============ TYPES ============

export type ItemStatus = "Active" | "Low Stock";

export type Category = "Decor" | "Lighting" | "Ornaments" | "Tree" | "Accents";

export type KitItem = {
    name: string;
    qty: number;
    sku: string;
    category: Category;
    status: ItemStatus;
};

// ============ DATA ============

export const KIT_ITEMS: KitItem[] = [
    {
        name: "Premium Garland",
        qty: 1,
        sku: "SKU-XY-ZA-001",
        category: "Decor",
        status: "Active",
    },
    {
        name: "LED String Lights, Warm White",
        qty: 2,
        sku: "SKU-XY-ZA-002",
        category: "Lighting",
        status: "Active",
    },
    {
        name: "Full Ornament Set",
        qty: 1,
        sku: "SKU-XY-ZA-003",
        category: "Ornaments",
        status: "Active",
    },
    {
        name: "Gold Tree Skirt",
        qty: 1,
        sku: "SKU-XY-ZA-004",
        category: "Tree",
        status: "Active",
    },
    {
        name: 'Large Wreath (24")',
        qty: 1,
        sku: "SKU-XY-ZA-005",
        category: "Decor",
        status: "Active",
    },
    {
        name: "Mantle Accents",
        qty: 3,
        sku: "SKU-XY-ZA-006",
        category: "Accents",
        status: "Low Stock",
    },
    {
        name: "Accent Lighting Pods",
        qty: 2,
        sku: "SKU-XY-ZA-007",
        category: "Lighting",
        status: "Active",
    },
    {
        name: "Small Table Figurines",
        qty: 3,
        sku: "SKU-XY-ZA-008",
        category: "Accents",
        status: "Active",
    },
];
