const fs = require('fs');

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
  sql += `UPDATE "Holiday" SET "image" = '/uploads/holidays/${data.slug}.jpg' WHERE "id" = '${holidayId}';\n`;
}
fs.writeFileSync('update.sql', sql);
