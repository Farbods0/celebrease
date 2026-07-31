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
  
  const hasChangeTab = await page.evaluate(() => {
    // Let's get the JS source code from the page scripts
    return Array.from(document.querySelectorAll('script')).map(s => s.src);
  });
  console.log(hasChangeTab);
  await browser.close();
})();
