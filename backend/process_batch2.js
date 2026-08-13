const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const sql = neon(process.env.DATABASE_URL);

const brainDir = 'C:\\Users\\farbo\\.gemini\\antigravity-cli\\brain\\86980309-4154-41b6-a44a-573455a57343';
const uploadsDir = path.join(__dirname, '../frontend/public/uploads/holidays');

const mappings = [
  // Dia de los Muertos ULTIMATE (kitId: bfd65c01-e4db-4e99-a248-ff83e569a04c)
  {
    kitId: 'bfd65c01-e4db-4e99-a248-ff83e569a04c',
    slug: 'dia-de-los-muertos',
    tier: 'ultimate',
    sources: [
      'dia_muertos_ultimate_angle1_1786326303948.jpg',
      'dia_muertos_ultimate_angle2_1786326314923.jpg',
      'dia_muertos_ultimate_angle3_1786326351089.jpg',
      'dia_muertos_ultimate_angle4_1786326360656.jpg'
    ]
  },
  // Graduations PREMIUM (kitId: 126fffea-2215-4019-96e1-113d7c175a13)
  {
    kitId: '126fffea-2215-4019-96e1-113d7c175a13',
    slug: 'graduations',
    tier: 'premium',
    sources: [
      'graduations_premium_angle1_1786326369395.jpg',
      'graduations_premium_angle2_1786326376946.jpg',
      'graduations_premium_angle3_1786326385241.jpg',
      'graduations_premium_angle4_1786326393483.jpg'
    ]
  },
  // Graduations ULTIMATE (kitId: 76cac770-8a92-4a23-95dc-58ec57699360)
  {
    kitId: '76cac770-8a92-4a23-95dc-58ec57699360',
    slug: 'graduations',
    tier: 'ultimate',
    sources: [
      'graduations_ultimate_angle1_1786326402551.jpg',
      'graduations_ultimate_angle2_1786326418396.jpg',
      'graduations_ultimate_angle3_1786326426601.jpg',
      'graduations_ultimate_angle4_1786326657511.jpg'
    ]
  }
];

async function run() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (const m of mappings) {
    const dbImages = [];
    for (let i = 0; i < 4; i++) {
      const srcFile = path.join(brainDir, m.sources[i]);
      const destFilename = `${m.slug}-${m.tier}-angle${i + 1}.jpg`;
      const destFile = path.join(uploadsDir, destFilename);

      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${srcFile} -> ${destFile}`);
      } else {
        console.error(`Source file missing: ${srcFile}`);
      }

      dbImages.push(`/uploads/holidays/${destFilename}`);
    }

    await sql`
      UPDATE "kit"
      SET images = ${dbImages}
      WHERE id = ${m.kitId};
    `;
    console.log(`Updated Kit ${m.kitId} (${m.slug} ${m.tier.toUpperCase()}) in DB with images:`, dbImages);
  }

  // Also copy independence-day-premium-angle1.jpg so it's ready on disk when remaining angles are generated
  const indySrc = path.join(brainDir, 'independence_premium_angle1_1786326667162.jpg');
  const indyDest = path.join(uploadsDir, 'independence-day-premium-angle1.jpg');
  if (fs.existsSync(indySrc)) {
    fs.copyFileSync(indySrc, indyDest);
    console.log(`Saved preliminary image for independence-day-premium-angle1.jpg`);
  }

  console.log('Batch 2 processing completed successfully!');
}

run().catch(console.error);
