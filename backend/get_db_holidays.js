const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');

(async () => {
    const rows = await sql`SELECT name, category FROM "holiday" ORDER BY name;`;
    console.log(`Current DB Holidays Count: ${rows.length}\n`);
    rows.forEach(r => console.log(`- ${r.name} (${r.category})`));
})();
