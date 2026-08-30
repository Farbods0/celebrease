const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_u4oIK1zMskJd@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  
  // Update Engagement Parties Starter (evt-010)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/engagement-parties-starter-angle1.jpg', '/uploads/holidays/engagement-parties-starter-angle2.jpg', '/uploads/holidays/engagement-parties-starter-angle3.jpg', '/uploads/holidays/engagement-parties-starter-angle4.jpg', 'evt-010', 'STARTER']);

  // Update Engagement Parties Premium (evt-010)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/engagement-parties-premium-angle1.jpg', '/uploads/holidays/engagement-parties-premium-angle2.jpg', '/uploads/holidays/engagement-parties-premium-angle3.jpg', '/uploads/holidays/engagement-parties-premium-angle4.jpg', 'evt-010', 'PREMIUM']);

  console.log('DB Updated');
  await client.end();
}
run();
