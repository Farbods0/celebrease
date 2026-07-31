const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log("Navigating to /catalog...");
  await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
  
  // Test Catalog Tabs
  console.log("Measuring Catalog Filter Tabs...");
  const tab = page.getByRole('button', { name: 'Traditional' });
  
  let start = Date.now();
  await tab.click();
  // Wait for the UI to update to 'Traditional' state. Let's see how long the active state takes.
  // The active state has text '#fff' (from previous file). Let's just wait for the network to be idle or state change.
  await page.waitForTimeout(200); 
  console.log(`Time elapsed: ${Date.now() - start}ms`);

  // Let's also check the navigation tabs (Home, Catalog, How It Works)
  console.log("Measuring Top Navigation Tabs...");
  const howItWorks = page.getByRole('link', { name: 'How It Works' });
  start = Date.now();
  await howItWorks.click();
  await page.waitForNavigation({ waitUntil: 'commit' });
  console.log(`Top Nav time to commit: ${Date.now() - start}ms`);

  await browser.close();
})();
