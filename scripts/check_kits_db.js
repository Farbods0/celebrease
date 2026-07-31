const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
    const kits = await pool.query('SELECT k.id, k.sku, k.tier, k."holidayId", k.images, h.name as "holidayName" FROM kit k JOIN holiday h ON k."holidayId" = h.id ORDER BY k.id');
    console.log("=== KITS IN DB ===");
    console.log(JSON.stringify(kits.rows, null, 2));

    const items = await pool.query('SELECT id, sku, name, image FROM item ORDER BY id');
    console.log("=== ITEMS IN DB ===");
    console.log(JSON.stringify(items.rows.slice(0, 30), null, 2));
}

main().catch(console.error).finally(() => pool.end());
