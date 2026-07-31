const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://celebrease.com/signin');
  
  await page.fill('input[type="email"]', 'test_edd18b33@celebrease.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/account', { timeout: 30000 });
  await page.waitForSelector('.acct-nav-link');
  
  console.log('Testing click...');
  const tabs = await page.$$('.acct-nav-link');
  const start = Date.now();
  await tabs[3].click();
  await page.waitForSelector('.acct-nav-link.active', { state: 'attached' });
  const end = Date.now();
  console.log(`Tab switch took ${end - start}ms`);
  
  // Wait to see it
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
