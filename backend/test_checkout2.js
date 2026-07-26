require('dotenv').config({ path: '.env' });
const { Client } = require('pg');
const crypto = require('crypto');

(async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("Missing DATABASE_URL");

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  const userId = 'ybLNA496XAdbD8mwszg4UyJ32O8N79ZE'; // Farbod's user ID
  const sessionId = crypto.randomBytes(16).toString('hex');
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

  await client.query(`
    INSERT INTO "session" ("id", "userId", "token", "expiresAt", "createdAt", "updatedAt", "ipAddress", "userAgent")
    VALUES ($1, $2, $3, $4, NOW(), NOW(), '', 'Test Script')
  `, [sessionId, userId, token, expiresAt]);

  console.log("Session token:", token);

  // Now curl the checkout endpoint with that session token
  const res = await fetch('http://localhost:3000/api/v1/subscription/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `better-auth.session_token=${token}`
    },
    body: JSON.stringify({ planId: 'plan_starter', billingCycle: 'MONTHLY' })
  });

  const body = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", body);

  await client.query(`DELETE FROM "session" WHERE "id" = $1`, [sessionId]);
  await client.end();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
