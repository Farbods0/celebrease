const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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
