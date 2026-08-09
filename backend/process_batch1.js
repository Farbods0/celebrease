const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');

const brainDir = 'C:\\Users\\farbo\\.gemini\\antigravity-cli\\brain\\86980309-4154-41b6-a44a-573455a57343';
const uploadsDir = path.join(__dirname, '../frontend/public/uploads/holidays');

const mappings = [
  // Cinco de Mayo PREMIUM (kitId: 2ee85f1e-1cd1-41c6-afee-41d33cb16256)
  {
    kitId: '2ee85f1e-1cd1-41c6-afee-41d33cb16256',
    slug: 'cinco-de-mayo',
    tier: 'premium',
    sources: [
      'cinco_premium_angle1_1786308768846.jpg',
      'cinco_premium_angle2_1786308779879.jpg',
      'cinco_premium_angle3_1786308791811.jpg',
      'cinco_premium_angle4_1786308803336.jpg'
    ]
  },
  // Cinco de Mayo ULTIMATE (kitId: aae25697-dacd-49c7-95c9-da438c623f59)
  {
    kitId: 'aae25697-dacd-49c7-95c9-da438c623f59',
    slug: 'cinco-de-mayo',
    tier: 'ultimate',
    sources: [
      'cinco_ultimate_angle1_1786309086791.jpg',
      'cinco_ultimate_angle2_1786309099575.jpg',
      'cinco_ultimate_angle3_1786309112152.jpg',
      'cinco_ultimate_angle4_1786309123597.jpg'
    ]
  },
  // Dia de los Muertos PREMIUM (kitId: d36fa62f-ddfe-43c1-9f78-521dbb73c98f)
  {
    kitId: 'd36fa62f-ddfe-43c1-9f78-521dbb73c98f',
    slug: 'dia-de-los-muertos',
    tier: 'premium',
    sources: [
      'dia_muertos_premium_angle1_1786309136817.jpg',
      'dia_muertos_premium_angle2_1786309148269.jpg',
      'dia_muertos_premium_angle3_1786309440786.jpg',
      'dia_muertos_premium_angle4_1786309452990.jpg'
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

  console.log('Batch 1 processing completed successfully!');
}

run().catch(console.error);
