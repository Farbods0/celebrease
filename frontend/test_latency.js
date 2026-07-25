const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to login...');
  await page.goto('http://localhost:4000/signin');
  
  await page.fill('input[type="email"]', 'test_cc43e849@celebrease.com');
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
