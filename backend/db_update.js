const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_u4oIK1zMskJd@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  
  // Update Eid Starter (evt-009)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/eid-starter-angle1.jpg', '/uploads/holidays/eid-starter-angle2.jpg', '/uploads/holidays/eid-starter-angle3.jpg', '/uploads/holidays/eid-starter-angle4.jpg', 'evt-009', 'STARTER']);

  // Update Eid Premium (evt-009)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/eid-premium-angle1.jpg', '/uploads/holidays/eid-premium-angle2.jpg', '/uploads/holidays/eid-premium-angle3.jpg', '/uploads/holidays/eid-premium-angle4.jpg', 'evt-009', 'PREMIUM']);

  // Update Ramadan Starter (evt-002)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/ramadan-starter-angle1.jpg', '/uploads/holidays/ramadan-starter-angle2.jpg', '/uploads/holidays/ramadan-starter-angle3.jpg', '/uploads/holidays/ramadan-starter-angle4.jpg', 'evt-002', 'STARTER']);

  // Update Ramadan Premium (evt-002)
  await client.query(`UPDATE kit SET images = ARRAY[$1, $2, $3, $4] WHERE "holidayId" = $5 AND tier = $6`, 
    ['/uploads/holidays/ramadan-premium-angle1.jpg', '/uploads/holidays/ramadan-premium-angle2.jpg', '/uploads/holidays/ramadan-premium-angle3.jpg', '/uploads/holidays/ramadan-premium-angle4.jpg', 'evt-002', 'PREMIUM']);

  console.log('DB Updated');
  await client.end();
}
run();
