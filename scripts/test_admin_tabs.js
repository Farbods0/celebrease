const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Make the user an admin

  console.log("Navigating to admin...");
  await page.goto('https://admin.celebrease.com/login');
  
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', 'test_edd18b33@celebrease.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Wait for login success
  await page.waitForURL('https://admin.celebrease.com/', { timeout: 30000 });
  
  console.log("Navigating to /orders...");
  await page.goto('https://admin.celebrease.com/orders');
  await page.waitForSelector('.filter-tabs');
  
  const tabs = await page.$$('.filter-tabs button');
  if(tabs.length < 3) {
      console.log("Failed to find tabs");
      process.exit(1);
  }

  // Initial fetch for "Active"
  console.log("Clicking Active (uncached)...");
  await tabs[1].click();
  // wait for table to update (usually there's a loader or class change, but we'll wait for network idle)
  await page.waitForLoadState('networkidle');

  // Initial fetch for "Returns"
  console.log("Clicking Returns (uncached)...");
  await tabs[2].click();
  await page.waitForLoadState('networkidle');

  // Now measure cached "Active"
  console.log("Measuring cached Active tab...");
  const start = Date.now();
  await tabs[1].click();
  // Instead of network idle (which might take long), let's just observe how fast the UI reacts.
  // Actually, TanStack router changes the active class on the button itself.
  await page.waitForFunction(() => {
     const btns = document.querySelectorAll('.filter-tabs button');
     return btns[1].classList.contains('on');
  });
  const end = Date.now();
  
  console.log(`Cached tab switch took ${end - start}ms`);
  
  await browser.close();
})();
