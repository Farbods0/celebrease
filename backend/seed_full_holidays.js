const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');
const crypto = require('crypto');

function uuid() {
    return crypto.randomUUID();
}

const newHolidays = [
    {
        name: "Thanksgiving",
        category: "TRADITIONAL",
        image: "/uploads/holidays/thanksgiving.jpg",
        description: "Warm autumn harvest mantel and dining table styling featuring eucalyptus garlands, velvet pumpkins, and golden tableware.",
        starterPrice: "65.00", starterDeposit: "35.00", starterPieces: 10,
        premiumPrice: "95.00", premiumDeposit: "50.00", premiumPieces: 20,
        ultimatePrice: "125.00", ultimateDeposit: "75.00", ultimatePieces: 32,
    },
    {
        name: "Fourth of July",
        category: "TRADITIONAL",
        image: "/uploads/holidays/independence-day.jpg",
        description: "Patriotic summer porch and patio celebration kit with red, white & blue linen table runners, vintage brass lanterns, and starry fairy lights.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 8,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 18,
        ultimatePrice: "119.00", ultimateDeposit: "70.00", ultimatePieces: 28,
    },
    {
        name: "Lunar New Year",
        category: "CULTURAL",
        image: "/uploads/holidays/lunar-new-year.jpg",
        description: "Luxurious Spring Festival kit with deep red and gold silk lanterns, cherry blossom branches, brass ingot bowls, and lucky tassel accents.",
        starterPrice: "65.00", starterDeposit: "35.00", starterPieces: 12,
        premiumPrice: "95.00", premiumDeposit: "55.00", premiumPieces: 22,
        ultimatePrice: "129.00", ultimateDeposit: "75.00", ultimatePieces: 35,
    },
    {
        name: "Día de los Muertos",
        category: "CULTURAL",
        image: "/uploads/holidays/dia-de-los-muertos.jpg",
        description: "Vibrant Day of the Dead altar and mantel decor featuring marigold flower garlands, sugar skull centerpieces, and purple papel picado.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 10,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 20,
        ultimatePrice: "119.00", ultimateDeposit: "65.00", ultimatePieces: 30,
    },
    {
        name: "St. Patrick's Day",
        category: "TRADITIONAL",
        image: "/uploads/holidays/st-patricks-day.jpg",
        description: "Emerald green table runner, shamrock eucalyptus garlands, polished brass candleholders, and lucky gold coin accents.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 8,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 16,
        ultimatePrice: "115.00", ultimateDeposit: "60.00", ultimatePieces: 26,
    },
    {
        name: "Passover",
        category: "CULTURAL",
        image: "/uploads/holidays/passover.jpg",
        description: "Elegant Seder table setting with silver and navy blue linens, ornate silver Kiddush cups, Seder plate accents, and Matzah covers.",
        starterPrice: "65.00", starterDeposit: "35.00", starterPieces: 10,
        premiumPrice: "95.00", premiumDeposit: "50.00", premiumPieces: 20,
        ultimatePrice: "129.00", ultimateDeposit: "75.00", ultimatePieces: 30,
    },
    {
        name: "Holi",
        category: "CULTURAL",
        image: "/uploads/holidays/holi.jpg",
        description: "Vibrant spring festival decor with colorful silk banners, polished brass bowls filled with bright gulal powder, and marigold flower garlands.",
        starterPrice: "65.00", starterDeposit: "35.00", starterPieces: 10,
        premiumPrice: "95.00", premiumDeposit: "50.00", premiumPieces: 22,
        ultimatePrice: "125.00", ultimateDeposit: "70.00", ultimatePieces: 32,
    },
    {
        name: "Cinco de Mayo",
        category: "TRADITIONAL",
        image: "/uploads/holidays/cinco-de-mayo.jpg",
        description: "Festive fiesta table styling with woven Serape table runners, terracotta pottery centerpieces, and colorful papel picado banners.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 8,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 18,
        ultimatePrice: "115.00", ultimateDeposit: "60.00", ultimatePieces: 28,
    },
    {
        name: "Graduations",
        category: "EVENT_BASED",
        image: "/uploads/holidays/graduations.jpg",
        description: "Stylish graduation party decor with black and gold backdrop, diploma tassel garlands, fairy lights, and marquee celebration accents.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 10,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 20,
        ultimatePrice: "119.00", ultimateDeposit: "65.00", ultimatePieces: 30,
    },
    {
        name: "Weddings & Rehearsal Dinners",
        category: "EVENT_BASED",
        image: "/uploads/holidays/weddings.jpg",
        description: "Sophisticated head table and rehearsal dinner decor with white chiffon table runners, brass taper candleholders, and crystal glassware.",
        starterPrice: "69.00", starterDeposit: "40.00", starterPieces: 12,
        premiumPrice: "99.00", premiumDeposit: "60.00", premiumPieces: 24,
        ultimatePrice: "139.00", ultimateDeposit: "85.00", ultimatePieces: 36,
    },
    {
        name: "Gender Reveals",
        category: "EVENT_BASED",
        image: "/uploads/holidays/gender-reveals.jpg",
        description: "Charming gender reveal decor with soft blush pink and baby blue balloon arch backdrop, white linen dessert table, and mystery decor accents.",
        starterPrice: "59.00", starterDeposit: "30.00", starterPieces: 10,
        premiumPrice: "89.00", premiumDeposit: "45.00", premiumPieces: 20,
        ultimatePrice: "119.00", ultimateDeposit: "65.00", ultimatePieces: 30,
    },
];

(async () => {
    console.log(`Starting Database Seeding for ${newHolidays.length} New Holidays...`);

    for (const h of newHolidays) {
        // Check if already exists
        const existing = await sql`SELECT id FROM "holiday" WHERE name = ${h.name} LIMIT 1;`;
        let holidayId;

        if (existing.length > 0) {
            holidayId = existing[0].id;
            console.log(`Updating existing holiday: ${h.name}`);
            await sql`
                UPDATE "holiday"
                SET category = ${h.category}, image = ${h.image}, description = ${h.description}, "updatedAt" = NOW()
                WHERE id = ${holidayId};
            `;
        } else {
            holidayId = uuid();
            console.log(`Creating new holiday: ${h.name}`);
            await sql`
                INSERT INTO "holiday" (id, name, category, image, description, "createdAt", "updatedAt")
                VALUES (${holidayId}, ${h.name}, ${h.category}, ${h.image}, ${h.description}, NOW(), NOW());
            `;
        }

        // Add 3 Kits for this Holiday (STARTER, PREMIUM, ULTIMATE)
        const kitTiers = [
            { tier: 'STARTER', price: h.starterPrice, deposit: h.starterDeposit, pieces: h.starterPieces, desc: `Essential core styling items for ${h.name}.` },
            { tier: 'PREMIUM', price: h.premiumPrice, deposit: h.premiumDeposit, pieces: h.premiumPieces, desc: `Full-service curated décor kit for ${h.name}.` },
            { tier: 'ULTIMATE', price: h.ultimatePrice, deposit: h.ultimateDeposit, pieces: h.ultimatePieces, desc: `Deluxe complete luxury transformation for ${h.name}.` },
        ];

        for (const k of kitTiers) {
            const existingKit = await sql`SELECT id FROM "kit" WHERE "holidayId" = ${holidayId} AND tier = ${k.tier}::"KitTier" LIMIT 1;`;
            if (existingKit.length === 0) {
                const kitId = uuid();
                const sku = `${h.name.substring(0, 4).toUpperCase()}-${k.tier}-${Date.now().toString().slice(-4)}`;
                const price30Day = k.price;
                const price60Day = (parseFloat(k.price) * 1.5).toFixed(2);
                await sql`
                    INSERT INTO "kit" (id, sku, tier, "holidayId", status, "price30Day", "price60Day", deposit, "createdAt", "updatedAt")
                    VALUES (${kitId}, ${sku}, ${k.tier}::"KitTier", ${holidayId}, 'ACTIVE'::"KitStatus", ${price30Day}::numeric, ${price60Day}::numeric, ${k.deposit}::numeric, NOW(), NOW());
                `;
            }
        }
    }

    console.log('\n✅ Seeding complete! All 11 new holidays inserted with 3 kit tiers each.');
})();
