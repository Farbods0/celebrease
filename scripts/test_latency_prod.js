const { chromium } = require('playwright');
const { Client } = require('pg');

async function verifyUser(email) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  await client.query('UPDATE "user" SET "emailVerified" = true WHERE email = $1', [email]);
  await client.end();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const email = 'test_edd18b33@celebrease.com';
  console.log('Verifying user in database...');
  await verifyUser(email);
  
  console.log('Navigating to login...');
  await page.goto('https://celebrease.com/signin');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for navigation to account...');
  await page.waitForURL('**/account', { timeout: 30000 });
  await page.waitForSelector('.acct-nav-link');
  
  console.log('Logged in. Measuring tab click latency...');
  const tabs = await page.$$('.acct-nav-link');
  if (tabs.length > 3) {
      const start = Date.now();
      await tabs[3].click();
      await page.waitForSelector('.acct-nav-link.active', { state: 'attached' });
      const end = Date.now();
      console.log(`Tab switch took ${end - start}ms`);
  } else {
      console.log('Tabs not found.');
  }
  
  await browser.close();
})();
