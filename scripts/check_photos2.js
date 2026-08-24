const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkPhotos() {
  const kits = await pool.query('SELECT h.name as holiday_name, k.tier, k.images FROM kit k JOIN holiday h ON k."holidayId" = h.id');
  
  const results = {};
  
  kits.rows.forEach(kit => {
    if (!results[kit.holiday_name]) {
      results[kit.holiday_name] = {};
    }
    const imageCount = Array.isArray(kit.images) ? kit.images.length : 0;
    results[kit.holiday_name][kit.tier] = { count: imageCount, images: kit.images };
  });
  
  console.log(JSON.stringify(results, null, 2));
}

checkPhotos().catch(console.error).finally(() => pool.end());
