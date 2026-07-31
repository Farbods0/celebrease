const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://admin.celebrease.com/login');
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', 'test_edd18b33@celebrease.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('https://admin.celebrease.com/', { timeout: 30000 });
  
  await page.goto('https://admin.celebrease.com/plans');
  await page.waitForSelector('.plan-card');
  
  await page.screenshot({ path: 'plans_fixed.png', fullPage: true });
  await browser.close();
})();
