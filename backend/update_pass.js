const { Client } = require('pg');
const { hashPassword } = require('better-auth/crypto');

(async () => {
  const hash = await hashPassword('Password123!');
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require' });
  await client.connect();
  
  // Get user IDs
  const res = await client.query('SELECT id, email FROM "user"');
  for (const user of res.rows) {
      await client.query('UPDATE "account" SET password = $1 WHERE "userId" = $2', [hash, user.id]);
  }
  
  await client.end();
  console.log('Password updated to Password123! for all users');
})();
