const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_u4oIK1zMskJd@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  
  // Update Nowruz Starter (evt-006)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/nowruz-starter-angle1-v2.jpg', '/uploads/holidays/nowruz-starter-angle2-v2.jpg', '/uploads/holidays/nowruz-starter-angle3-v2.jpg', '/uploads/holidays/nowruz-starter-angle4-v2.jpg', 'evt-006', 'STARTER']);

  // Update Nowruz Premium (evt-006)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/nowruz-premium-angle1-v2.jpg', '/uploads/holidays/nowruz-premium-angle2-v2.jpg', '/uploads/holidays/nowruz-premium-angle3-v2.jpg', '/uploads/holidays/nowruz-premium-angle4-v2.jpg', 'evt-006', 'PREMIUM']);

  console.log('DB Updated');
  await client.end();
}
run();
