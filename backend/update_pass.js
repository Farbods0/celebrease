const { Client } = require('pg');
const { hashPassword } = require('better-auth/crypto');

(async () => {
  const hash = await hashPassword('Password123!');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // Get user IDs
  const res = await client.query('SELECT id, email FROM "user"');
  for (const user of res.rows) {
      await client.query('UPDATE "account" SET password = $1 WHERE "userId" = $2', [hash, user.id]);
  }
  
  await client.end();
  console.log('Password updated to Password123! for all users');
})();
