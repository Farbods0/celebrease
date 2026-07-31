const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://celebrease.com/signin');
  
  await page.fill('input[type="email"]', 'test_edd18b33@celebrease.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/account', { timeout: 30000 });
  await page.waitForSelector('.acct-nav-link');
  
  const tabs = await page.$$('.acct-nav-link');
  
  console.log("Clicking orders...");
  await tabs[3].click();
  await page.waitForTimeout(3000); // Wait for fetch to complete
  
  console.log("Clicking overview...");
  await tabs[0].click();
  await page.waitForTimeout(500); // Wait a bit
  
  console.log("Clicking orders AGAIN...");
  const start = Date.now();
  await tabs[3].click();
  
  await page.screenshot({ path: 'orders_tab2.png' });
  const end = Date.now();
  
  console.log(`Clicking back to orders and taking screenshot took ${end - start}ms`);
  
  await browser.close();
})();
