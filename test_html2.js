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
  await page.waitForSelector('.acct-nav-link');
  
  const tabs = await page.$$('.acct-nav-link');
  await tabs[3].click();
  
  await page.waitForTimeout(1000);
  
  const htmlList = await page.$$eval('.acct-nav-link', els => els.map(el => el.outerHTML));
  console.log(htmlList.join('\n'));
  
  await browser.close();
})();
