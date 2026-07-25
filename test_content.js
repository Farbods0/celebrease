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
  
  const els = await page.$$eval('div[id^="tab-"]', els => els.map(el => el.outerHTML));
  console.log(els.map(h => h.substring(0, 80)).join('\n'));
  
  await browser.close();
})();
