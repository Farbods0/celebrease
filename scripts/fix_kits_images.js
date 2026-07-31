const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
    try {
        const kits = await pool.query('SELECT k.id, h.image as "holidayImage" FROM kit k JOIN holiday h ON k."holidayId" = h.id');
        for (const row of kits.rows) {
            // Updating kit.images to be an array containing the single correct holiday image
            await pool.query('UPDATE kit SET images = $1 WHERE id = $2', [[row.holidayImage], row.id]);
            console.log(`Updated kit ${row.id} to use image [${row.holidayImage}]`);
        }
        console.log("All kits updated successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

main();
