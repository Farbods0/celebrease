const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://celebrease.com/account', { waitUntil: 'domcontentloaded' });
  
  if (page.url().includes('login') || page.url().includes('verification')) {
      console.log('Cannot test without login.');
      await browser.close();
      return;
  }
  
  console.log('Logged in. Measuring tab click latency...');
  const start = Date.now();
  const tabs = await page.$$('.acct-nav-link');
  if (tabs.length > 3) {
      await tabs[3].click();
      await page.waitForSelector('.acct-nav-link.active', { state: 'attached' });
      const end = Date.now();
      console.log(`Tab switch took ${end - start}ms`);
  } else {
      console.log('Tabs not found.');
  }
  
  await browser.close();
})();
