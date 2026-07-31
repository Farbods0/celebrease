const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });
  await page.waitForSelector('.text-green-600', { state: 'visible', timeout: 10000 });
  
  const texts = await page.locator('.text-green-600').allTextContents();
  console.log('Green label text contents found:', texts);
  
  await browser.close();
})();
