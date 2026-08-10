const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const kits = await sql`
    SELECT k.id as "kitId", k.tier, k.images, h.id as "holidayId", h.name as "holidayName"
    FROM "kit" k
    JOIN "holiday" h ON k."holidayId" = h.id
    WHERE h.name ILIKE '%muertos%' OR h.name ILIKE '%gradua%' OR h.name ILIKE '%independence%' OR h.name ILIKE '%july%' OR h.name ILIKE '%holi%'
    ORDER BY h.name, k.tier;
  `;
  console.log(JSON.stringify(kits, null, 2));
}

main().catch(console.error);
