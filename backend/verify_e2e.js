require('dotenv').config({ path: '.env' });
const { chromium } = require('playwright');
const { Client } = require('pg');
const crypto = require('crypto');

(async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("Missing DATABASE_URL");

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  const email = `auto_test_${crypto.randomBytes(4).toString('hex')}@example.com`;
  const password = "Password123!";

  console.log(`Starting E2E test with email: ${email}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  console.log("Navigating to http://localhost:4000/signup...");
  await page.goto('http://localhost:4000/signup', { waitUntil: 'networkidle' });

  console.log("Filling signup form...");
  await page.fill('#cb-firstName', 'Auto');
  await page.fill('#cb-lastName', 'Test');
  await page.fill('#cb-email', email);
  await page.fill('#cb-password', password);
  await page.fill('#cb-confirmPassword', password);
  await page.click('button[role="checkbox"]');
  
  console.log("Submitting signup form...");
  await page.click('button[type="submit"]');

  console.log("Waiting for redirect to verification...");
  await page.waitForURL('**/verification**', { timeout: 15000 });

  console.log("Signup successful. Verifying email in database...");
  await client.query(`UPDATE "user" SET "emailVerified" = true WHERE email = $1`, [email]);

  console.log("Navigating to signin...");
  await page.goto('http://localhost:4000/signin', { waitUntil: 'networkidle' });

  console.log("Filling signin form...");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  console.log("Waiting for redirect to account/dashboard...");
  await page.waitForURL('**/account**', { timeout: 15000 }).catch(() => console.log("Did not redirect to /account"));

  console.log("Navigating to subscription page...");
  await page.goto('http://localhost:4000/subscription', { waitUntil: 'networkidle' });

  console.log("Waiting for plan buttons...");
  const planCardBtn = page.locator('text=Start with Starter').first();
  await planCardBtn.waitFor({ state: 'visible', timeout: 10000 });

  console.log("Clicking Start with Starter...");
  await planCardBtn.click();

  console.log("Waiting for navigation to checkout.stripe.com...");
  await page.waitForURL('**/checkout.stripe.com/**', { timeout: 15000 });

  const currentUrl = page.url();
  console.log("Success! Reached Stripe Checkout URL:", currentUrl);

  // Cleanup
  console.log("Cleaning up test user...");
  await client.query(`DELETE FROM "user" WHERE email = $1`, [email]);
  
  await client.end();
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
