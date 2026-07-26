require('dotenv').config({ path: '.env' });
const { chromium } = require('playwright');
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
    VALUES ($1, $2, $3, $4, NOW(), NOW(), '', 'Playwright Test')
  `, [sessionId, userId, token, expiresAt]);

  console.log("Injected valid session into production database.");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.addCookies([{
    name: 'better-auth.session_token',
    value: token,
    domain: 'celebrease.com',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  }]);

  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log("Navigating to https://celebrease.com/subscription...");
  await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });

  console.log("Waiting for plans grid to load...");
  const planCardBtn = page.locator('text=Start with Starter').first();
  await planCardBtn.waitFor({ state: 'visible', timeout: 10000 });
  
  console.log("Clicking the first plan button...");
  await planCardBtn.click();
  
  console.log("Waiting for navigation to checkout.stripe.com...");
  await page.waitForURL('**/checkout.stripe.com/**', { timeout: 15000 });
  
  const currentUrl = page.url();
  console.log("Success! Reached Stripe Checkout URL on LIVE PRODUCTION:", currentUrl);
  
  // Cleanup
  await client.query(`DELETE FROM "session" WHERE "id" = $1`, [sessionId]);
  await client.end();
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
