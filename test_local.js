const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Set fake login cookie if needed, but the user is logged into their browser, not playwright
  // For testing just click the tabs, even if it redirects to /login? No, if it redirects to /login, we can't test tabs.
  await page.goto('http://localhost:4000/account', { waitUntil: 'load' });
  
  if (page.url().includes('login')) {
      console.log('Redirected to login. Attempting to log in...');
      await page.fill('input[type="email"]', 'test_cc43e849@celebrease.com');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      await page.goto('http://localhost:4000/account');
  }
  
  await page.waitForSelector('.acct-nav-link');
  
  console.log('Clicking orders tab...');
  const start = Date.now();
  const tabs = await page.$$('.acct-nav-link');
  await tabs[3].click();
  
  await page.waitForSelector('.acct-nav-link.active', { state: 'attached' });
  const end = Date.now();
  
  console.log(`Tab switch took ${end - start}ms`);
  
  await browser.close();
})();
