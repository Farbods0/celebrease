const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const desktopDir = '/Users/farbodjahan/Desktop/Celebrease_Images_Review';
const backendDir = '/Users/farbodjahan/Documents/celebrease/backend/uploads/holidays';
const frontendDir = '/Users/farbodjahan/Documents/celebrease/frontend/public/events';

const mapping = {
  'evt-001': { file: "New_Year's_1.jpg", slug: 'new-years' },
  'evt-002': { file: "Ramadan_1.jpg", slug: 'ramadan' },
  'evt-003': { file: "Diwali_1.jpg", slug: 'diwali' },
  'evt-005': { file: "Valentine's_Day_2.jpg", slug: 'valentines-day' },
  'evt-006': { file: "Nowruz_1.jpg", slug: 'nowruz' },
  'evt-007': { file: "Baby_Showers_1.jpg", slug: 'baby-showers' },
  'evt-009': { file: "Eid_1.jpg", slug: 'eid' },
  'evt-010': { file: "Engagement_Parties_1.jpg", slug: 'engagement-parties' },
  'evt-011': { file: "Halloween_1.jpg", slug: 'halloween' },
  'evt-012': { file: "Hanukkah_1.jpg", slug: 'hanukkah' }
};

let sql = '';
for (const [holidayId, data] of Object.entries(mapping)) {
  const sourcePath = path.join(desktopDir, data.file);
  if (!fs.existsSync(sourcePath)) {
      console.log('Skipping ' + sourcePath + ' - not found');
      continue;
  }

  const backendCover = path.join(backendDir, data.slug + '.jpg');
  fs.copyFileSync(sourcePath, backendCover);
  sql += `UPDATE "holiday" SET "image" = '/uploads/holidays/${data.slug}.jpg' WHERE "id" = '${holidayId}';\n`;

  // We know the SKUs based on the acronyms, let's just do an update query based on the slug prefix
  // e.g. for NY-STARTER-2026 it starts with 'NY-'. But easier to just get from the JSON we saved earlier!
  
}
fs.writeFileSync('update.sql', sql);
console.log('SQL generated. Executing...');
execSync('npx prisma db execute --file update.sql', { stdio: 'inherit' });
