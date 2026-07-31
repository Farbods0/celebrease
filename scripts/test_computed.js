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
  
  const tabs = await page.$$('.acct-nav-link');
  await tabs[3].click();
  await page.waitForTimeout(1000);
  
  const computed = await page.$$eval('.acct-nav-link', els => {
      return els.map(el => {
          const style = window.getComputedStyle(el);
          return {
              id: el.id,
              className: el.className,
              color: style.color,
              fontWeight: style.fontWeight,
              borderLeftColor: style.borderLeftColor,
              ariaCurrent: el.getAttribute('aria-current')
          };
      });
  });
  console.log(JSON.stringify(computed, null, 2));
  
  await browser.close();
})();
