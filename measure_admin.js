const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // We can test the Admin site which is at https://admin.celebrease.com
  console.log("Navigating to admin site...");
  await page.goto('https://admin.celebrease.com', { waitUntil: 'networkidle' });
  
  // wait for it to load
  await page.waitForTimeout(1000);
  
  // click a tab if visible, but we might be redirected to login.
  console.log("Current URL:", page.url());
  
  await browser.close();
})();
