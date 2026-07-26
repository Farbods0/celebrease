import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

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

async function run() {
  for (const [holidayId, data] of Object.entries(mapping)) {
     const sourcePath = path.join(desktopDir, data.file);
     if (!fs.existsSync(sourcePath)) {
         console.log('Skipping ' + sourcePath + ' - not found');
         continue;
     }
     
     const backendCover = path.join(backendDir, data.slug + '.jpg');
     fs.copyFileSync(sourcePath, backendCover);
     await prisma.holiday.update({ where: { id: holidayId }, data: { image: '/uploads/holidays/' + data.slug + '.jpg' } });
     console.log('Updated cover for ' + data.slug);
     
     const holiday = await prisma.holiday.findUnique({ where: { id: holidayId }, include: { kits: true } });
     if (!holiday) continue;
     for (const kit of holiday.kits) {
         const kitImages = [];
         for (let i = 1; i <= 4; i++) {
             const angleName = `${kit.sku.toLowerCase()}_angle${i}.jpg`;
             const backendPath = path.join(backendDir, angleName);
             const frontendPath = path.join(frontendDir, angleName);
             
             fs.copyFileSync(sourcePath, backendPath);
             fs.copyFileSync(sourcePath, frontendPath);
             kitImages.push(`/events/${angleName}`);
         }
         await prisma.kit.update({ where: { sku: kit.sku }, data: { images: kitImages } });
         console.log('Updated kit ' + kit.sku);
     }
  }
  await prisma.$disconnect();
  console.log('All DB updates complete!');
}

run().catch(console.error);
