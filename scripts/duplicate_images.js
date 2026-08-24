const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function duplicateImages() {
  // We only want to duplicate images for the holidays/tiers that currently have less than 4 images
  const kits = await pool.query('SELECT k.id, h.name as holiday_name, k.tier, k.images FROM kit k JOIN holiday h ON k."holidayId" = h.id');
  
  for (const kit of kits.rows) {
    let images = kit.images;
    if (!Array.isArray(images)) {
        images = [];
    }
    
    if (images.length > 0 && images.length < 4) {
      // The first image is the one we want to duplicate
      const heroImage = images[0];
      const needed = 4 - images.length;
      
      const newImages = [...images];
      for (let i = 0; i < needed; i++) {
        newImages.push(heroImage);
      }
      
      console.log(`Updating ${kit.holiday_name} ${kit.tier} from ${images.length} to ${newImages.length} images...`);
      await pool.query('UPDATE kit SET images = $1 WHERE id = $2', [newImages, kit.id]);
    }
  }
  
  console.log("Done updating placeholders!");
}

duplicateImages().catch(console.error).finally(() => pool.end());
