const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const updates = [
    { sku: 'BDAY-STARTER-2026', image: '/uploads/holidays/bday-starter-2026.jpg' },
    { sku: 'BDAY-PREMIUM-2026', image: '/uploads/holidays/bday-premium-2026.jpg' },
    { sku: 'HAL-STARTER-2026', image: '/uploads/holidays/hal-starter-2026.jpg' },
    { sku: 'HAL-PREMIUM-2026', image: '/uploads/holidays/hal-premium-2026.jpg' },
    { sku: 'NY-STARTER-2026', image: '/uploads/holidays/ny-starter-2026.jpg' },
    { sku: 'NY-PREMIUM-2026', image: '/uploads/holidays/ny-premium-2026.jpg' },
    { sku: 'RAM-STARTER-2026', image: '/uploads/holidays/ram-starter-2026.jpg' },
    { sku: 'VAL-STARTER-2026', image: '/uploads/holidays/val-starter-2026.jpg' },
    { sku: 'VAL-PREMIUM-2026', image: '/uploads/holidays/val-premium-2026.jpg' },
    { sku: 'XMAS-STARTER-2026', image: '/uploads/holidays/xmas-starter-2026.jpg' },
    { sku: 'XMAS-PREMIUM-2026', image: '/uploads/holidays/xmas-premium-2026.jpg' },
    { sku: 'XMAS-ULTIMATE-2026', image: '/uploads/holidays/xmas-ultimate-2026.jpg' }
];

async function main() {
    try {
        for (const update of updates) {
            const arr = [update.image];
            await pool.query('UPDATE kit SET images = $1 WHERE sku = $2', [arr, update.sku]);
            console.log(`Updated kit ${update.sku} with image ${update.image}`);
        }
        console.log("Database update complete.");
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await pool.end();
    }
}

main();
