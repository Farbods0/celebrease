const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const startTime = Date.now();
  await page.goto('https://celebrease.com/catalog');
  console.log(`Initial load: ${Date.now() - startTime}ms`);
  
  // click a filter tab
  const tab = page.getByRole('button', { name: 'Traditional' });
  const clickStart = Date.now();
  await tab.click();
  // wait for grid to update
  await page.waitForTimeout(1000); // see what happens
  console.log(`Click delay check finished`);
  
  await browser.close();
})();
