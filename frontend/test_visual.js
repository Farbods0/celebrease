const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const start = Date.now();
  await page.goto('https://celebrease.com/', { waitUntil: 'domcontentloaded' });
  const domLoad = Date.now() - start;
  await page.screenshot({ path: 'live_production_screenshot.png' });
  const fullLoad = Date.now() - start;
  console.log(`DOM Load: ${domLoad}ms`);
  console.log(`Full visual Load (with screenshot): ${fullLoad}ms`);
  await browser.close();
})();
