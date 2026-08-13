const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    const rows = await sql`SELECT name, category FROM "holiday" ORDER BY name;`;
    console.log(`Current DB Holidays Count: ${rows.length}\n`);
    rows.forEach(r => console.log(`- ${r.name} (${r.category})`));
})();
