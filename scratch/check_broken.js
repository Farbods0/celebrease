const { Client } = require('pg');
const connStr = "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function check() {
    const client = new Client({ connectionString: connStr });
    await client.connect();
    try {
        const result = await client.query(`
            SELECT h.name, k.tier, k.images 
            FROM kit k 
            JOIN holiday h ON k."holidayId" = h.id 
            WHERE h.name IN ('New Year''s', 'Ramadan')
        `);
        console.log(JSON.stringify(result.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
check();
