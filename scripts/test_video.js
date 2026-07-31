const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
      recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.goto('https://celebrease.com/signin');
  await page.fill('input[type="email"]', 'test_edd18b33@celebrease.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/account', { timeout: 30000 });
  
  await page.waitForSelector('.acct-nav-link');
  await page.waitForTimeout(2000); // Wait for page to settle
  
  const tabs = await page.$$('.acct-nav-link');
  
  console.log("Clicking Orders...");
  await tabs[3].click();
  await page.waitForTimeout(3000); // Wait to observe if it takes 2 seconds
  
  console.log("Clicking Slots...");
  await tabs[2].click();
  await page.waitForTimeout(3000);
  
  console.log("Clicking Overview...");
  await tabs[0].click();
  await page.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  console.log("Video saved to ./videos/");
})();
