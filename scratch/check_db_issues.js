const postgres = require('postgres');

async function main() {
  const sql = postgres('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');
  
  const holidays = await sql`SELECT name, "image" FROM holiday WHERE name IN ('Lunar New Year', 'New Year''s', 'Thanksgiving')`;
  console.log("Holidays:", holidays);

  const kits = await sql`
    SELECT h.name as holiday, k.tier, k.images 
    FROM kit k JOIN holiday h ON k."holidayId" = h.id 
    WHERE h.name IN ('Lunar New Year', 'New Year''s', 'Thanksgiving')
  `;
  console.log("Kits:", JSON.stringify(kits, null, 2));

  await sql.end();
}
main().catch(console.error);
