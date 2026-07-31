const { Pool } = require('pg');

const urlMap = {
  'BDAY-STARTER-2026': '/uploads/holidays/1785459411369-760988871.jpg',
  'BDAY-PREMIUM-2026': '/uploads/holidays/1785459411681-207521787.jpg',
  'HAL-STARTER-2026': '/uploads/holidays/1785459411991-48813699.jpg',
  'HAL-PREMIUM-2026': '/uploads/holidays/1785459412305-581602058.jpg',
  'NY-STARTER-2026': '/uploads/holidays/1785459412607-724541084.jpg',
  'NY-PREMIUM-2026': '/uploads/holidays/1785459412914-268775155.jpg',
  'RAM-STARTER-2026': '/uploads/holidays/1785459413247-472968521.jpg',
  'VAL-STARTER-2026': '/uploads/holidays/1785459413556-938085533.jpg',
  'VAL-PREMIUM-2026': '/uploads/holidays/1785459413870-420228229.jpg',
  'XMAS-STARTER-2026': '/uploads/holidays/1785459414171-389440533.jpg',
  'XMAS-PREMIUM-2026': '/uploads/holidays/1785459414479-965605616.jpg',
  'XMAS-ULTIMATE-2026': '/uploads/holidays/1785459414779-903886968.jpg'
};

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
    for (const [sku, url] of Object.entries(urlMap)) {
        const res = await pool.query('UPDATE kit SET images = $1 WHERE sku = $2 RETURNING id', [[url], sku]);
        console.log(`Updated sku ${sku}: ${res.rowCount} rows affected.`);
    }
    await pool.end();
}
run().catch(console.error);
