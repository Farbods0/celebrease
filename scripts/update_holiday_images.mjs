
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateHolidays() {
    try {
        const holidays = await pool.query("SELECT id, name, image FROM holiday");
        for (const h of holidays.rows) {
            let kit = await pool.query("SELECT images FROM kit WHERE \"holidayId\" = $1 AND tier = $2", [h.id, "PREMIUM"]);
            if (kit.rows.length === 0 || !kit.rows[0].images || kit.rows[0].images.length === 0) {
                kit = await pool.query("SELECT images FROM kit WHERE \"holidayId\" = $1 AND tier = $2", [h.id, "STARTER"]);
            }
            if (kit.rows.length > 0 && kit.rows[0].images && kit.rows[0].images.length > 0) {
                const newUrl = kit.rows[0].images[0];
                console.log("Updating holiday", h.name, "to", newUrl);
                await pool.query("UPDATE holiday SET image = $1 WHERE id = $2", [newUrl, h.id]);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
updateHolidays();

