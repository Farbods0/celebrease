const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'catalog_test.png', fullPage: true });
  
  await browser.close();
})();
