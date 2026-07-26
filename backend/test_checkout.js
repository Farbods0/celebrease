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

  console.log("Injected valid session into database.");

  // Fetch plans to get a planId
  const plansRes = await fetch('http://localhost:3000/api/v1/plans'); // wait, the plans are fetched via NEXT.JS? Or backend?
  // Let's just query the plan table
  const plans = await client.query(`SELECT id, name FROM "plan" LIMIT 1`);
  const planId = plans.rows[0].id;

  console.log("Using plan ID:", planId);

  // Now make the checkout request!
  const res = await fetch('http://localhost:3000/api/v1/subscription/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `better-auth.session_token=${token}`
    },
    body: JSON.stringify({
      planId,
      billingCycle: 'MONTHLY'
    })
  });

  const body = await res.text();
  console.log("Response Status:", res.status);
  console.log("Response Body:", body);

  await client.query(`DELETE FROM "session" WHERE "id" = $1`, [sessionId]);
  await client.end();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
