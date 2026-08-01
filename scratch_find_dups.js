const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function checkDuplicates() {
  const kits = await pool.query('SELECT k.id, h.name as holiday_name, k.tier, k.images FROM kit k JOIN holiday h ON k."holidayId" = h.id ORDER BY h.name, k.tier');
  
  let results = [];
  
  for (const kit of kits.rows) {
    let images = kit.images;
    if (!Array.isArray(images)) {
        images = [];
    }
    
    const uniqueImages = new Set(images);
    const numDuplicates = images.length - uniqueImages.size;
    
    if (numDuplicates > 0) {
      results.push({
        holiday: kit.holiday_name,
        tier: kit.tier,
        totalImages: images.length,
        uniqueImages: uniqueImages.size,
        duplicates: numDuplicates
      });
    }
  }
  
  console.log("Holidays with duplicative photos per tier:");
  console.table(results);
  
  const totalDuplicates = results.reduce((sum, r) => sum + r.duplicates, 0);
  console.log(`\nTotal duplicate photos across all tiers: ${totalDuplicates}`);
  
  const byHoliday = {};
  for (const r of results) {
    if (!byHoliday[r.holiday]) byHoliday[r.holiday] = 0;
    byHoliday[r.holiday] += r.duplicates;
  }
  
  console.log("\nTotal duplicates per holiday:");
  for (const [holiday, dupes] of Object.entries(byHoliday)) {
    console.log(`- ${holiday}: ${dupes}`);
  }
}

checkDuplicates().catch(console.error).finally(() => pool.end());
